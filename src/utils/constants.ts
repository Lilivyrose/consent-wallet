export const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";

export const CONTRACT_ABI = [
  // Mint consent function
  {
    "inputs": [
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "string", "name": "purpose", "type": "string"},
      {"internalType": "uint256", "name": "expiryDate", "type": "uint256"}
    ],
    "name": "mintConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Revoke consent function
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "revokeConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Get user's consents function
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "getMyConsents",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
          {"internalType": "address", "name": "recipient", "type": "address"},
          {"internalType": "string", "name": "purpose", "type": "string"},
          {"internalType": "uint256", "name": "expiryDate", "type": "uint256"},
          {"internalType": "bool", "name": "isRevoked", "type": "bool"}
        ],
        "internalType": "struct ConsentToken[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Events for listening to contract changes
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "issuer", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "purpose", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "expiryDate", "type": "uint256"}
    ],
    "name": "ConsentMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "issuer", "type": "address"}
    ],
    "name": "ConsentRevoked",
    "type": "event"
  }
];

export const BNB_TESTNET_CHAIN_ID = 97;
export const BNB_TESTNET_RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545/";

export const NETWORK_CONFIG = {
  chainId: `0x${BNB_TESTNET_CHAIN_ID.toString(16)}`,
  chainName: "BNB Smart Chain Testnet",
  rpcUrls: [BNB_TESTNET_RPC_URL],
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18
  },
  blockExplorerUrls: ["https://testnet.bscscan.com/"]
};