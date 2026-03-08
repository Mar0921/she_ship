import React from 'react';
import Navigation from '@/client/components/Navigation';
import Footer from '@/client/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  showNavigation?: boolean;
}

export default function Layout({ children, showFooter = true, showNavigation = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-whatsapp-50">
      {showNavigation && <Navigation />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
