
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, User, ChevronDown, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session, signOut, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // Already on home page, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home page first, then scroll to section
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Handle scrolling when coming from another page
  useEffect(() => {
    if (location.state?.scrollTo && location.pathname === '/') {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
        // Clear the state after scrolling
        window.history.replaceState({}, document.title, location.pathname);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <header 
      className={`sticky top-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? 'header-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img 
                src="https://iili.io/FGwvLb9.md.png" 
                alt="Rise Blue Media Logo" 
                className="h-10 transition-transform duration-300 group-hover:scale-105"
              />
              <span className="ml-3 text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                Rise Blue Media
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link text-white hover:text-accent">Home</Link>
            <Link to="/products" className="nav-link text-white hover:text-accent">Products</Link>
            <Link to="/services" className="nav-link text-white hover:text-accent">Services</Link>
            <button 
              className="nav-link text-white hover:text-accent cursor-pointer"
              onClick={() => handleSectionNavigation('how-it-works')}
            >
              How it works
            </button>
            <button 
              className="nav-link text-white hover:text-accent cursor-pointer"
              onClick={() => handleSectionNavigation('about')}
            >
              About
            </button>
            
            {!loading && (
              user ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                        <User size={16} />
                        <span className="text-sm">
                          {user.user_metadata?.display_name || user.email}
                        </span>
                        <ChevronDown size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/my-purchases" className="flex items-center">
                          <ShoppingBag size={16} className="mr-2" />
                          My Purchases
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button 
                  className="outline-button"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Sign In
                </Button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link text-white hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="nav-link text-white hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/services" className="nav-link text-white hover:text-accent" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
              <button 
                className="nav-link text-white hover:text-accent cursor-pointer text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSectionNavigation('how-it-works');
                }}
              >
                How it works
              </button>
              <button 
                className="nav-link text-white hover:text-accent cursor-pointer text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSectionNavigation('about');
                }}
              >
                About
              </button>
              
                <div className="flex flex-col space-y-2 pt-4">
                {!loading && (
                  user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-white px-2">
                        <User size={16} />
                        <span className="text-sm">
                          {user.user_metadata?.display_name || user.email}
                        </span>
                      </div>
                      <Link to="/my-purchases">
                        <Button 
                          variant="outline"
                          className="w-full text-white border-white hover:bg-white hover:text-primary mb-2"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingBag size={16} className="mr-2" />
                          My Purchases
                        </Button>
                      </Link>
                      <Button 
                        variant="outline"
                        className="w-full text-white border-white hover:bg-white hover:text-primary"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="outline-button w-full"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
