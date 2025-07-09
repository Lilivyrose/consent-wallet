import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/constants';
import { ConsentToken, ConsentFormData } from '../types';

export const useContract = (provider: ethers.BrowserProvider | null, account: string | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [consents, setConsents] = useState<ConsentToken[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider && account) {
      const initializeContract = async () => {
        try {
          const signer = await provider.getSigner();
          const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(contractInstance);
        } catch (error) {
          console.error('Error initializing contract:', error);
          setContract(null);
        }
      };
      
      initializeContract();
    }
  }, [provider, account]);

  const mintConsent = async (data: ConsentFormData) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const expiryTimestamp = Math.floor(new Date(data.expiryDate).getTime() / 1000);
      const tx = await contract.mintConsent(data.recipient, data.purpose, expiryTimestamp);
      await tx.wait();
      await fetchConsents(); // Refresh consents after minting
    } catch (error) {
      console.error('Error minting consent:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const revokeConsent = async (tokenId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setLoading(true);
    try {
      const tx = await contract.revokeConsent(tokenId);
      await tx.wait();
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
    
    setLoading(true);
    try {
      const result = await contract.getMyConsents(account);
      const formattedConsents: ConsentToken[] = result.map((consent: any) => ({
        tokenId: Number(consent.tokenId),
        recipient: consent.recipient,
        purpose: consent.purpose,
        expiryDate: Number(consent.expiryDate),
        isRevoked: consent.isRevoked
      }));
      setConsents(formattedConsents);
    } catch (error) {
      console.error('Error fetching consents:', error);
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
    loading
  };
};