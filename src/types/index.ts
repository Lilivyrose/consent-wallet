export type ConsentStatus = "Pending" | "Active" | "Abandoned";

export interface ConsentToken {
  tokenId: number;
  recipient: string;
  purpose: string;
  expiryDate: number;
  isRevoked: boolean;
  website?: string;
  dataFields?: string;
  status?: ConsentStatus;
  issuedAt?: number;
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