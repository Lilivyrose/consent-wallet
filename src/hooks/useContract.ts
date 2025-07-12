import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, validateContractConfig } from '../utils/constants';
import { normalizeAddress } from '../utils/addressUtils';
import { ConsentToken, ConsentFormData } from '../types';

export const useContract = (provider: ethers.BrowserProvider | null, account: string | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [consents, setConsents] = useState<ConsentToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);

  useEffect(() => {
    if (provider && account) {
      const initializeContract = async () => {
        try {
          // Validate contract configuration
          validateContractConfig();
          
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          
          // Test contract connection by calling a view function
          try {
            await contractInstance.getMyConsents(account);
            console.log('✅ Successfully connected to contract at:', CONTRACT_ADDRESS);
          } catch (testError) {
            console.warn('⚠️ Contract connection test failed:', testError);
            // Don't throw here as the contract might still work for other functions
          }
          
          setContract(contractInstance);
          setContractError(null);
        } catch (error) {
          console.error('Error initializing contract:', error);
          setContractError(error instanceof Error ? error.message : 'Failed to initialize contract');
          setContract(null);
        }
      };
      
      initializeContract();
    }
  }, [provider, account]);

  const mintConsent = async (data: ConsentFormData) => {
    if (!contract) throw new Error('Contract not initialized. Please check your contract configuration.');
    if (contractError) throw new Error(`Contract error: ${contractError}`);
    
    setLoading(true);
    try {
      const expiryTimestamp = Math.floor(new Date(data.expiryDate).getTime() / 1000);
      
      console.log('🚀 Minting consent with params:', {
        recipient: data.recipient,
        purpose: data.purpose,
        expiryTimestamp
      });
      
      const tx = await contract.mintConsent(data.recipient, data.purpose, expiryTimestamp);
      console.log('📝 Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('✅ Transaction confirmed');
      
      await fetchConsents(); // Refresh consents after minting
    } catch (error) {
      console.error('Error minting consent:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const revokeConsent = async (tokenId: number) => {
    if (!contract) throw new Error('Contract not initialized. Please check your contract configuration.');
    if (contractError) throw new Error(`Contract error: ${contractError}`);
    
    setLoading(true);
    try {
      console.log('🔄 Revoking consent token:', tokenId);
      
      const tx = await contract.revokeConsent(tokenId);
      console.log('📝 Transaction sent:', tx.hash);
      
      await tx.wait();
      console.log('✅ Transaction confirmed');
      
      await fetchConsents(); // Refresh consents after revoking
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchConsents = async () => {
    if (!contract || !account) return;
    if (contractError) {
      console.error('Cannot fetch consents due to contract error:', contractError);
      return;
    }
    
    setLoading(true);
    try {
      console.log('📊 Fetching consents for account:', account);
      
      const normalizedAccount = normalizeAddress(account);
      const result = await contract.getMyConsents(normalizedAccount);
      console.log('📋 Raw contract response:', result);
      
      const formattedConsents: ConsentToken[] = result.map((consent: any) => ({
        tokenId: Number(consent.tokenId),
        recipient: consent.recipient,
        purpose: consent.purpose,
        expiryDate: Number(consent.expiryDate),
        isRevoked: consent.isRevoked
      }));
      
      console.log('✨ Formatted consents:', formattedConsents);
      setConsents(formattedConsents);
    } catch (error) {
      console.error('Error fetching consents:', error);
      // Don't throw here to avoid breaking the UI
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract && account) {
      fetchConsents();
    }
  }, [contract, account]);

  return {
    mintConsent,
    revokeConsent,
    fetchConsents,
    consents,
    loading,
    contractError
  };
};