import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';
import { BNB_TESTNET_CHAIN_ID, NETWORK_CONFIG } from '../utils/constants';

interface WalletContextType {
  wallet: WalletState;
  connecting: boolean;
  provider: ethers.BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    isCorrectNetwork: false
  });

  const [connecting, setConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize wallet state on app startup
  useEffect(() => {
    initializeWallet();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (window.ethereum && initialized) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [initialized]);

  const initializeWallet = async () => {
    if (!window.ethereum) {
      setInitialized(true);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();

      if (accounts.length > 0) {
        setWallet({
          isConnected: true,
          account: accounts[0].address,
          chainId: Number(network.chainId),
          isCorrectNetwork: Number(network.chainId) === BNB_TESTNET_CHAIN_ID
        });
        setProvider(provider);
      }
    } catch (error) {
      console.error('Error initializing wallet:', error);
    } finally {
      setInitialized(true);
    }
  };

  const connectWallet = async () => {
    if (connecting) return;
    
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install it to use this app.');
      return;
    }

    try {
      setConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();

      setWallet({
        isConnected: true,
        account,
        chainId: Number(network.chainId),
        isCorrectNetwork: Number(network.chainId) === BNB_TESTNET_CHAIN_ID
      });
      setProvider(provider);

      // Switch to BNB Testnet if not already connected
      if (Number(network.chainId) !== BNB_TESTNET_CHAIN_ID) {
        await switchNetwork();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORK_CONFIG.chainId }]
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORK_CONFIG]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      account: null,
      chainId: null,
      isCorrectNetwork: false
    });
    setProvider(null);
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWallet(prev => ({
        ...prev,
        account: accounts[0]
      }));
    }
  };

  const handleChainChanged = (chainId: string) => {
    const newChainId = parseInt(chainId, 16);
    setWallet(prev => ({
      ...prev,
      chainId: newChainId,
      isCorrectNetwork: newChainId === BNB_TESTNET_CHAIN_ID
    }));
  };

  // Don't render children until wallet is initialized
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center" style={{ backgroundColor: '#0f0f0f' }}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="text-orange-200">Initializing wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <WalletContext.Provider value={{
      wallet,
      connecting,
      provider,
      connectWallet,
      disconnectWallet,
      switchNetwork
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};