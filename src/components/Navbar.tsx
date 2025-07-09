import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, FileText, Plus } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="backdrop-blur-md bg-white bg-opacity-10 border-b border-white border-opacity-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-cyan-400" />
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Consent Wallet
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-cyan-400 bg-opacity-20 text-cyan-400' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/issue"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/issue') 
                  ? 'bg-cyan-400 bg-opacity-20 text-cyan-400' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Issue Consent</span>
            </Link>

            <Link
              to="/my-consents"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/my-consents') 
                  ? 'bg-cyan-400 bg-opacity-20 text-cyan-400' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>My Consents</span>
            </Link>
          </div>

          <WalletConnect />
        </div>
      </div>
    </nav>
  );
};