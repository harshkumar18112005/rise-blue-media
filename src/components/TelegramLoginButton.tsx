import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface TelegramLoginButtonProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { signInWithTelegram } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for Telegram auth callback in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get('hash');
    const id = urlParams.get('id');
    const first_name = urlParams.get('first_name');
    const auth_date = urlParams.get('auth_date');

    if (hash && id && first_name && auth_date) {
      // Build auth data from URL parameters
      const authData = {
        id: parseInt(id),
        first_name,
        last_name: urlParams.get('last_name') || '',
        username: urlParams.get('username') || '',
        photo_url: urlParams.get('photo_url') || '',
        auth_date: parseInt(auth_date),
        hash
      };

      // Process the authentication
      signInWithTelegram(authData).then((result) => {
        if (result.error) {
          toast({
            title: "Authentication Failed",
            description: result.error.message || "Failed to authenticate with Telegram",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Successfully authenticated with Telegram",
          });
          // Clean URL and close modal
          window.history.replaceState({}, document.title, window.location.pathname);
          onSuccess();
        }
      }).catch((error) => {
        toast({
          title: "Error",
          description: "Authentication failed. Please try again.",
          variant: "destructive"
        });
      });

      return; // Don't load widget if we're processing URL params
    }

    // Create the callback function for Telegram widget
    window.onTelegramAuth = async (user: any) => {
      try {
        const result = await signInWithTelegram(user);
        
        if (result.error) {
          toast({
            title: "Authentication Failed",
            description: result.error.message || "Failed to authenticate with Telegram",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Success!",
            description: "Successfully authenticated with Telegram",
          });
          onSuccess();
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Authentication failed. Please try again.",
          variant: "destructive"
        });
      }
    };

    // Clean up any existing scripts
    const existingScripts = document.querySelectorAll('script[src*="telegram-widget"]');
    existingScripts.forEach(script => script.remove());

    // Load Telegram Widget script and append to container
    if (containerRef.current) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'riseblue_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      
      containerRef.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll('script[src*="telegram-widget"]');
      scripts.forEach(script => script.remove());
    };
  }, [signInWithTelegram, toast, onSuccess]);

  return (
    <div className="w-full">
      <div ref={containerRef} className="telegram-widget-container w-full flex justify-center" />
    </div>
  );
};

export default TelegramLoginButton;