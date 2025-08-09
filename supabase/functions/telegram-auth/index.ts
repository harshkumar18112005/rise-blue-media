import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Telegram auth request received');
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { authData } = requestBody as { authData: TelegramAuthData };
    
    if (!authData) {
      console.error('No authData provided');
      return new Response(
        JSON.stringify({ error: 'No authentication data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('Auth data received:', JSON.stringify(authData, null, 2));
    
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      console.error('Telegram bot token not configured');
      throw new Error('Telegram bot token not configured');
    }

    // For manual login, skip verification if hash starts with 'manual_login_' or 'phone_verified_'
    if (!authData.hash.startsWith('manual_login_') && !authData.hash.startsWith('phone_verified_')) {
      console.log('Verifying Telegram auth data...');
      // Verify Telegram auth data only for widget logins
      const { hash, ...dataToCheck } = authData;
      
      // Create check string
      const checkString = Object.keys(dataToCheck)
        .sort()
        .map(key => `${key}=${dataToCheck[key as keyof typeof dataToCheck]}`)
        .join('\n');

      console.log('Check string:', checkString);

      // Create secret key using SHA256 hash of bot token
      const encoder = new TextEncoder();
      const tokenHash = await crypto.subtle.digest('SHA-256', encoder.encode(botToken));
      const secretKey = await crypto.subtle.importKey(
        'raw',
        tokenHash,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      // Calculate hash
      const signature = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(checkString));
      const calculatedHash = Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      console.log('Calculated hash:', calculatedHash);
      console.log('Provided hash:', hash);

      if (calculatedHash !== hash) {
        console.error('Hash verification failed');
        return new Response(
          JSON.stringify({ error: 'Invalid authentication data' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if auth data is not too old (5 minutes) - only for widget logins
      const now = Math.floor(Date.now() / 1000);
      console.log('Current time:', now, 'Auth time:', authData.auth_date, 'Difference:', now - authData.auth_date);
      
      if (now - authData.auth_date > 300) {
        console.error('Authentication data is too old');
        return new Response(
          JSON.stringify({ error: 'Authentication data is too old' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log('Telegram auth data verified successfully');
    } else {
      console.log('Skipping verification for manual/phone login');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create or get user
    const telegramEmail = `telegram_${authData.id}@telegram.user`;
    const displayName = `${authData.first_name}${authData.last_name ? ' ' + authData.last_name : ''}`;

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers.users.find(u => u.email === telegramEmail);
    
    let user;
    
    if (existingUser) {
      // Update existing user metadata
      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          telegram_id: authData.id,
          telegram_username: authData.username,
          display_name: displayName,
          avatar_url: authData.photo_url,
          provider: 'telegram',
        }
      });

      if (updateError) {
        console.error('Update user error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      user = updatedUser.user;
    } else {
      // Create new user
      const { data: authResult, error: authError } = await supabase.auth.admin.createUser({
        email: telegramEmail,
        email_confirm: true,
        user_metadata: {
          telegram_id: authData.id,
          telegram_username: authData.username,
          display_name: displayName,
          avatar_url: authData.photo_url,
          provider: 'telegram',
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        return new Response(
          JSON.stringify({ error: 'Failed to create user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      user = authResult.user;
    }

    // Generate a sign-in link for the user
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: telegramEmail,
    });

    if (linkError) {
      console.error('Generate link error:', linkError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate sign-in link' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Sign-in link generated successfully for user:', user.id);

    // Return success with the magic link for client-side authentication
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Authentication successful',
        action_link: linkData.properties.action_link
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Telegram auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});