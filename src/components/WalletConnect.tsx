import React from 'react';
import { Wallet, AlertTriangle, CheckCircle } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

export const WalletConnect: React.FC = () => {
  const { wallet, connecting, connectWallet, disconnectWallet, switchNetwork } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    await connectWallet();
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.preventDefault();
    disconnectWallet();
  };

  const handleSwitchNetwork = async (e: React.MouseEvent) => {
    e.preventDefault();
    await switchNetwork();
  };
  if (!wallet.isConnected) {
    return (
      <button
        type="button"
        onClick={handleConnect}
        disabled={connecting}
        className={`flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg font-semibold text-black transition-all duration-200 transform shadow-lg shadow-orange-500/30 ${
          connecting 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:from-orange-400 hover:to-yellow-400 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/40'
        }`}
      >
        <Wallet className="h-5 w-5" />
        <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {!wallet.isCorrectNetwork && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-500 bg-opacity-20 rounded-lg border border-red-500 border-opacity-30">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <span className="text-red-400 text-sm">Wrong Network</span>
          <button
            type="button"
            onClick={handleSwitchNetwork}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Switch
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3 px-4 py-2 backdrop-blur-md bg-white bg-opacity-5 rounded-lg border border-orange-500 border-opacity-20 shadow-lg shadow-orange-500/10">
        <div className="flex items-center space-x-2">
          {wallet.isCorrectNetwork ? (
            <CheckCircle className="h-5 w-5 text-orange-400" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400" />
          )}
          <span className="text-sm font-medium">
            {wallet.account ? formatAddress(wallet.account) : 'Not Connected'}
          </span>
        </div>
        
        <button
          type="button"
          onClick={handleDisconnect}
          className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-400 rounded text-sm hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};