// Replace these placeholders with your actual deployed contract details
export const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e".toLowerCase(); // Fixed checksum - use lowercase for compatibility

// Replace this with your actual contract ABI from the deployment
export const CONTRACT_ABI = [
  // Complete ABI for ConsentToken contract
  {
    "inputs": [
      {"internalType": "address", "name": "recipient", "type": "address"},
      {"internalType": "string", "name": "purpose", "type": "string"},
      {"internalType": "uint256", "name": "expiryDate", "type": "uint256"},
      {"internalType": "string", "name": "website", "type": "string"},
      {"internalType": "string", "name": "dataFields", "type": "string"}
    ],
    "name": "mintConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "revokeConsent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
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
  // Events for real-time updates
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "issuer", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "purpose", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "expiryDate", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "website", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "dataFields", "type": "string"}
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
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
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

// Contract validation helper
export const validateContractConfig = () => {
  if (CONTRACT_ADDRESS === "PASTE_YOUR_CONTRACT_ADDRESS_HERE" || !CONTRACT_ADDRESS) {
    console.warn("Using example contract address. Please update with your deployed contract address for production use.");
    return false;
  }
  
  if (!CONTRACT_ADDRESS.startsWith("0x") || CONTRACT_ADDRESS.length !== 42) {
    throw new Error("Invalid contract address format");
  }
  
  if (CONTRACT_ABI.length === 0) {
    throw new Error("Please update CONTRACT_ABI with your contract's ABI");
  }
  
  return true;
};