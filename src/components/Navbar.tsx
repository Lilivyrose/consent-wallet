import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, FileText, Plus } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="backdrop-blur-md bg-white bg-opacity-5 border-b border-orange-500 border-opacity-20 shadow-lg shadow-orange-500/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <Shield className="h-8 w-8 text-orange-400" />
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Consent Wallet
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/') 
                  ? 'bg-orange-400 bg-opacity-20 text-orange-400 shadow-lg shadow-orange-500/20' 
                  : 'hover:bg-white hover:bg-opacity-10 hover:shadow-lg hover:shadow-orange-500/10'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/issue"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/issue') 
                  ? 'bg-orange-400 bg-opacity-20 text-orange-400 shadow-lg shadow-orange-500/20' 
                  : 'hover:bg-white hover:bg-opacity-10 hover:shadow-lg hover:shadow-orange-500/10'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Issue Consent</span>
            </Link>

            <Link
              to="/my-consents"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive('/my-consents') 
                  ? 'bg-orange-400 bg-opacity-20 text-orange-400 shadow-lg shadow-orange-500/20' 
                  : 'hover:bg-white hover:bg-opacity-10 hover:shadow-lg hover:shadow-orange-500/10'
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