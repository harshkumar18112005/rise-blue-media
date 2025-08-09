import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  phoneNumber: string;
  action: 'send_code' | 'verify_code';
  verificationCode?: string;
}

// In-memory store for verification codes (in production, use Redis or database)
const verificationStore = new Map<string, { code: string; expires: number; userData?: any }>();

const generateCode = () => Math.random().toString().slice(2, 8);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, action, verificationCode } = await req.json() as VerificationRequest;
    
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      throw new Error('Telegram bot token not configured');
    }

    if (action === 'send_code') {
      // Generate and store verification code
      const code = generateCode();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      verificationStore.set(phoneNumber, { code, expires });
      
      console.log(`Generated code for ${phoneNumber}: ${code}`);
      
      // Try to send message via Telegram Bot API
      try {
        // Method 1: Try to send via phone number contact (if bot has access)
        const message = `🔐 Your verification code is: ${code}\n\nThis code expires in 5 minutes.\nDo not share this code with anyone.`;
        
        // For now, we'll use a simple approach - send to a known chat ID
        // In production, you'd need to implement phone number to chat ID mapping
        
        // Log the code for testing purposes
        console.log(`Verification code for ${phoneNumber}: ${code}`);
        
        // Send to telegram bot API - you'll need to implement your own logic here
        // based on how you want to map phone numbers to telegram users
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Verification code generated',
            // In development, return the code for testing
            ...(Deno.env.get('ENVIRONMENT') === 'development' && { code })
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
        
      } catch (telegramError) {
        console.error('Telegram sending error:', telegramError);
        
        // For testing, still return success but log the error
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Code generated (Telegram delivery pending)',
            // In development, return the code for testing
            ...(Deno.env.get('ENVIRONMENT') === 'development' && { code })
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
    } else if (action === 'verify_code') {
      const stored = verificationStore.get(phoneNumber);
      
      if (!stored) {
        return new Response(
          JSON.stringify({ success: false, error: 'No verification code found' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (Date.now() > stored.expires) {
        verificationStore.delete(phoneNumber);
        return new Response(
          JSON.stringify({ success: false, error: 'Verification code expired' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (stored.code !== verificationCode) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid verification code' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Code is valid, clean up and create auth data
      verificationStore.delete(phoneNumber);
      
      // Create auth data for Telegram authentication
      const authData = {
        id: Math.abs(phoneNumber.hashCode ? phoneNumber.hashCode() : phoneNumber.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0)),
        first_name: 'Telegram User',
        last_name: phoneNumber.slice(-4), // Last 4 digits as identifier
        username: `user_${phoneNumber.slice(-4)}`,
        phone_number: phoneNumber,
        auth_date: Math.floor(Date.now() / 1000),
        hash: `phone_verified_${phoneNumber}_${Date.now()}`
      };
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          authData,
          message: 'Phone number verified successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Phone auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});