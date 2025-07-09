import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletState } from '../types';
import { BNB_TESTNET_CHAIN_ID, NETWORK_CONFIG } from '../utils/constants';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    isCorrectNetwork: false
  });

  const [connecting, setConnecting] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

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
      console.error('Error checking connection:', error);
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

  return {
    wallet,
    connecting,
    provider,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
};