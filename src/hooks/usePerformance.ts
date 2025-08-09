import { useCallback } from 'react';

export const usePerformance = () => {
  // Debounce function for search inputs and API calls
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Throttle function for scroll events
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  // Image lazy loading observer
  const createImageObserver = useCallback((callback: IntersectionObserverCallback) => {
    return new IntersectionObserver(callback, {
      root: null,
      rootMargin: '10px',
      threshold: 0.1,
    });
  }, []);

  return {
    debounce,
    throttle,
    createImageObserver,
  };
};