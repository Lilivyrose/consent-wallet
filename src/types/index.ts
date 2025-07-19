export interface ConsentToken {
  tokenId: number;
  recipient: string;
  purpose: string;
  expiryDate: number;
  isRevoked: boolean;
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
}