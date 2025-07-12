import React, { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isCollapsed: boolean;
  setIsOpen: (open: boolean) => void;
  setIsCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
  toggleCollapse: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpenState] = useState(() => {
    // Always start closed on mobile, open on desktop by default
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768;
      if (isMobile) return false;
      
      // On desktop, always start open
      return true;
    }
    return false;
  });

  const [isCollapsed, setIsCollapsedState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('b-tasting-sidebar-collapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const setIsOpen = (open: boolean) => {
    setIsOpenState(open);
    // Don't persist open/close state, only collapsed state
  };

  const setIsCollapsed = (collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('b-tasting-sidebar-collapsed', JSON.stringify(collapsed));
    }
  };

  const toggle = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      // On desktop, toggle collapse instead of open/close
      setIsCollapsed(!isCollapsed);
    }
  };
  
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Handle window resize - close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && isOpen) {
        setIsOpenState(false);
      } else if (!isMobile) {
        // On desktop, always keep sidebar open
        setIsOpenState(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeof window !== 'undefined' && window.innerWidth < 768 && isOpen) {
        const sidebar = document.querySelector('[data-sidebar]');
        const target = event.target as Node;
        if (sidebar && !sidebar.contains(target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  return (
    <SidebarContext.Provider value={{ 
      isOpen, 
      isCollapsed, 
      setIsOpen, 
      setIsCollapsed, 
      toggle, 
      toggleCollapse 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}