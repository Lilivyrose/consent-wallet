export interface ConsentToken {
  tokenId: number;
  recipient: string;
  purpose: string;
  expiryDate: number;
  isRevoked: boolean;
  website?: string;
  dataFields?: string;
}

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  isCorrectNetwork: boolean;
}

export interface ConsentFormData {
  recipient: string;
  purpose: string;
  expiryDate: string;
  website?: string;
  dataFields?: string;
}