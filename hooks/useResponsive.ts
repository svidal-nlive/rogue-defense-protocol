import { useState, useEffect, useCallback } from 'react';

export interface ResponsiveState {
  // Device detection
  isMobile: boolean;           // Width < 768px
  isTablet: boolean;           // Width >= 768px && < 1024px
  isDesktop: boolean;          // Width >= 1024px
  
  // Orientation
  isPortrait: boolean;
  isLandscape: boolean;
  
  // Touch capability
  isTouchDevice: boolean;
  
  // Dimensions
  width: number;
  height: number;
  
  // Safe area insets (for notched devices)
  safeAreaTop: number;
  safeAreaBottom: number;
  safeAreaLeft: number;
  safeAreaRight: number;
  
  // Computed layout helpers
  canvasHeight: number;        // Recommended canvas height based on orientation
  controlsHeight: number;      // Recommended controls area height
  showSidebars: boolean;       // Whether to show side panels
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Get CSS variable value or fallback
const getCSSVar = (name: string, fallback: number): number => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => getInitialState());

  function getInitialState(): ResponsiveState {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isPortrait: false,
        isLandscape: true,
        isTouchDevice: false,
        width: 1920,
        height: 1080,
        safeAreaTop: 0,
        safeAreaBottom: 0,
        safeAreaLeft: 0,
        safeAreaRight: 0,
        canvasHeight: 1080,
        controlsHeight: 0,
        showSidebars: true,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    const isMobile = width < MOBILE_BREAKPOINT;
    const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
    const isDesktop = width >= TABLET_BREAKPOINT;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Get safe area insets
    const safeAreaTop = getCSSVar('--sat', 0);
    const safeAreaBottom = getCSSVar('--sab', 0);
    const safeAreaLeft = getCSSVar('--sal', 0);
    const safeAreaRight = getCSSVar('--sar', 0);

    // Calculate layout dimensions
    let canvasHeight: number;
    let controlsHeight: number;
    let showSidebars: boolean;

    if (isMobile && isPortrait) {
      // Portrait mobile: canvas 65%, controls 35%
      controlsHeight = Math.min(200, height * 0.35);
      canvasHeight = height - controlsHeight - safeAreaTop - safeAreaBottom;
      showSidebars = false;
    } else if (isMobile && !isPortrait) {
      // Landscape mobile: controls on side, minimal
      controlsHeight = 0;
      canvasHeight = height - safeAreaTop - safeAreaBottom;
      showSidebars = false;
    } else if (isTablet) {
      // Tablet: hybrid approach
      if (isPortrait) {
        controlsHeight = Math.min(180, height * 0.25);
        canvasHeight = height - controlsHeight;
        showSidebars = false;
      } else {
        controlsHeight = 0;
        canvasHeight = height;
        showSidebars = true;
      }
    } else {
      // Desktop: full sidebars
      controlsHeight = 0;
      canvasHeight = height;
      showSidebars = true;
    }

    return {
      isMobile,
      isTablet,
      isDesktop,
      isPortrait,
      isLandscape: !isPortrait,
      isTouchDevice,
      width,
      height,
      safeAreaTop,
      safeAreaBottom,
      safeAreaLeft,
      safeAreaRight,
      canvasHeight,
      controlsHeight,
      showSidebars,
    };
  }

  const updateState = useCallback(() => {
    setState(getInitialState());
  }, []);

  useEffect(() => {
    // Update on resize
    window.addEventListener('resize', updateState);
    
    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      // Delay to allow orientation to settle
      setTimeout(updateState, 100);
    });

    // Initial update
    updateState();

    return () => {
      window.removeEventListener('resize', updateState);
      window.removeEventListener('orientationchange', updateState);
    };
  }, [updateState]);

  return state;
};

// Touch gesture utilities
export interface SwipeGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  direction: 'up' | 'down' | 'left' | 'right' | null;
  distance: number;
}

export const useSwipeGesture = (
  elementRef: React.RefObject<HTMLElement | null>,
  onSwipe: (gesture: SwipeGesture) => void,
  threshold: number = 50
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < threshold) return;

      let direction: SwipeGesture['direction'] = null;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      onSwipe({
        startX,
        startY,
        endX,
        endY,
        direction,
        distance,
      });
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onSwipe, threshold]);
};

// Tap detection with coordinate
export interface TapEvent {
  x: number;
  y: number;
  clientX: number;
  clientY: number;
}

export const useTapGesture = (
  elementRef: React.RefObject<HTMLElement | null>,
  onTap: (tap: TapEvent) => void,
  maxDuration: number = 300
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let startTime = 0;
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startTime = Date.now();
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const duration = Date.now() - startTime;
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      // Check if it's a tap (short duration, minimal movement)
      const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      
      if (duration < maxDuration && distance < 10) {
        const rect = element.getBoundingClientRect();
        onTap({
          x: endX - rect.left,
          y: endY - rect.top,
          clientX: endX,
          clientY: endY,
        });
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, onTap, maxDuration]);
};

export default useResponsive;
