import React, { useState, useEffect, FormEvent } from 'react';
import TelegramLoginButton from './TelegramLoginButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const LoginModal = ({
  isOpen,
  onClose
}: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  
  const { signIn, signUp, signInWithTelegram } = useAuth();
  const { toast } = useToast();
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
          });
          onClose();
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          onClose();
        }
      }
      
      if (result.error) {
        let errorMessage = 'An error occurred. Please try again.';
        
        if (result.error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (result.error.message?.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (result.error.message?.includes('Password should be at least 6 characters')) {
          errorMessage = 'Password must be at least 6 characters long.';
        }
        
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="login-modal-content max-w-xs p-4 bg-transparent px-[16px] py-[16px] mx-0 my-0 rounded-3xl">
        <button onClick={onClose} className="login-close-button absolute right-4 top-4 z-10">
          <X className="h-5 w-5" />
        </button>

        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </DialogTitle>
          <p className="text-gray-light/80">
            {isSignUp ? <>
                Already have an account?{' '}
                <button type="button" onClick={() => {setIsSignUp(false); setErrors({});}} className="login-link">
                  Sign in
                </button>
              </> : <>
                New here?{' '}
                <button type="button" onClick={() => {setIsSignUp(true); setErrors({});}} className="login-link">
                  Sign up
                </button>
              </>}
          </p>
          
          {errors.general && (
            <div className="text-red-400 text-sm mt-2 bg-red-400/10 border border-red-400/20 rounded p-2">
              {errors.general}
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white font-medium mb-2 block">
                Enter email address:
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="login-input" 
                placeholder="your@email.com" 
                required 
              />
              {errors.email && (
                <div className="text-red-400 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-white font-medium mb-2 block">
                Enter password:
              </Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="login-input" 
                placeholder="••••••••" 
                required 
              />
              {errors.password && (
                <div className="text-red-400 text-sm mt-1">{errors.password}</div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} className="login-checkbox" />
              <Label htmlFor="remember" className="text-gray-light text-sm cursor-pointer">
                Remember me
              </Label>
            </div>
          </div>

          <div className="space-y-4">
            <Button type="submit" className="login-button w-full" disabled={loading}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>

            <div className="login-divider">
              <div className="login-divider-text">Or</div>
            </div>

            <TelegramLoginButton onSuccess={onClose} />
          </div>

          {!isSignUp && <div className="text-center">
              <button type="button" className="login-link text-sm">
                Forgot password?
              </button>
            </div>}
        </form>
      </DialogContent>
    </Dialog>;
};
export default LoginModal;