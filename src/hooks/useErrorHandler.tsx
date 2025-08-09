import { useToast } from '@/hooks/use-toast';
import { ERROR_MESSAGES } from '@/lib/constants';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = (error: any, customMessage?: string) => {
    let message = customMessage || ERROR_MESSAGES.generic;
    
    // Parse different error types
    if (error?.message) {
      message = error.message;
    } else if (error?.status === 401) {
      message = ERROR_MESSAGES.auth.sessionExpired;
    } else if (error?.status >= 500) {
      message = ERROR_MESSAGES.network;
    }

    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', error);
    }
  };

  return { handleError };
};