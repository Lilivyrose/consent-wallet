import { ethers } from 'ethers';

/**
 * Validates and normalizes Ethereum addresses to prevent checksum errors
 */
export const normalizeAddress = (address: string): string => {
  try {
    // Use ethers.getAddress to get the proper checksummed address
    return ethers.getAddress(address.toLowerCase());
  } catch (error) {
    console.warn('Invalid address format:', address);
    // Return lowercase version as fallback
    return address.toLowerCase();
  }
};

/**
 * Checks if an address is valid
 */
export const isValidAddress = (address: string): boolean => {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formats address for display (shortened version)
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  const normalized = normalizeAddress(address);
  return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
};