import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import supportAgentImage from '@/assets/support-agent.jpg';

const SupportWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Get current time when component mounts
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    setCurrentTime(timeString);

    // Auto-open widget on first scroll
    const hasVisited = localStorage.getItem('supportWidgetSeen');
    if (!hasVisited) {
      const handleFirstScroll = () => {
        setIsOpen(true);
        localStorage.setItem('supportWidgetSeen', 'true');
        window.removeEventListener('scroll', handleFirstScroll);
      };

      window.addEventListener('scroll', handleFirstScroll, { passive: true });
      
      // Cleanup function
      return () => {
        window.removeEventListener('scroll', handleFirstScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Show message immediately when widget opens
      setShowMessage(true);
    } else {
      setShowMessage(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Close widget when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.support-widget')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="support-widget fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
      {/* Support Popup */}
      {isOpen && (
        <div className="absolute bottom-12 md:bottom-16 right-0 w-72 md:w-80 max-w-[calc(100vw-2rem)] bg-black/90 backdrop-blur-md border border-border/30 rounded-2xl shadow-2xl transform transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in-0">
          {/* Header */}
          <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 border-b border-gray-800/50">
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              <AvatarImage src={supportAgentImage} alt="Support Agent" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs md:text-sm">
                RB
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-sm md:text-base">Rise Blue | Customer Support</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Message */}
          <div className="p-3 md:p-4 space-y-3 md:space-y-4">
            {showMessage && (
              <div className="flex gap-2 md:gap-3 animate-in slide-in-from-left-2 fade-in-0 duration-500">
                <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                  <AvatarImage src={supportAgentImage} alt="Support Agent" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    RB
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-800/80 rounded-2xl rounded-tl-md p-2.5 md:p-3 text-xs md:text-sm text-gray-100 border border-gray-700/50">
                    Hey there! Please feel free to write us anytime when you need any sort of support or assistance.
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">{currentTime}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {showMessage && (
              <div className="space-y-2 md:space-y-3 animate-in slide-in-from-bottom-2 fade-in-0 duration-700">
                <Button
                  asChild
                  className="w-full bg-green-600 hover:bg-green-500 text-white rounded-xl h-10 md:h-12 text-xs md:text-sm font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg"
                >
                  <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                
                <Button
                  asChild
                  className="w-full bg-cyan-bright hover:bg-cyan-bright/80 text-white rounded-xl h-10 md:h-12 text-xs md:text-sm font-medium transition-all duration-200 hover:scale-[1.02] shadow-lg"
                >
                  <a href="https://t.me/your_channel" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Telegram
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Support Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all duration-300 hover:scale-110 hover:shadow-glow-hover group"
        size="icon"
      >
        {isOpen ? (
          <X className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200" />
        ) : (
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6 transition-transform duration-200 group-hover:scale-110" />
        )}
      </Button>
    </div>
  );
};

export default SupportWidget;