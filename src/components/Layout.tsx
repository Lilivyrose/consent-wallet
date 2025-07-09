import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white" style={{ backgroundColor: '#0f0f0f' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-transparent to-yellow-900/5"></div>
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};