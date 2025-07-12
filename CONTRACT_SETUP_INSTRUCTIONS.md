# Smart Contract Integration Setup

## 🚀 Quick Setup Instructions

To connect your dApp to your deployed smart contract on BNB Smart Chain Testnet:

### 1. Update Contract Address
In `src/utils/constants.ts`, replace:
```javascript
export const CONTRACT_ADDRESS = "PASTE_YOUR_CONTRACT_ADDRESS_HERE";
```
With your actual deployed contract address:
```javascript
export const CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";
```

### 2. Update Contract ABI
In `src/utils/constants.ts`, replace the entire `CONTRACT_ABI` array with your contract's ABI.

You can get your ABI from:
- **Remix IDE**: After compilation, copy from the "Compilation Details" → "ABI" section
- **Hardhat**: From `artifacts/contracts/YourContract.sol/YourContract.json`
- **Truffle**: From `build/contracts/YourContract.json`
- **BSCScan**: If verified, from the "Contract" tab → "Code" section

### 3. Required Contract Functions
Your smart contract must implement these functions for the dApp to work:

```solidity
// Mint a new consent token
function mintConsent(address recipient, string memory purpose, uint256 expiryDate) external;

// Revoke an existing consent token
function revokeConsent(uint256 tokenId) external;

// Get all consent tokens for a specific owner
function getMyConsents(address owner) external view returns (ConsentToken[] memory);
```

### 4. Expected Data Structure
Your contract should return consent data in this format:
```solidity
struct ConsentToken {
    uint256 tokenId;
    address recipient;
    string purpose;
    uint256 expiryDate;
    bool isRevoked;
}
```

### 5. Events (Optional but Recommended)
For real-time updates, implement these events:
```solidity
event ConsentMinted(uint256 indexed tokenId, address indexed issuer, address indexed recipient, string purpose, uint256 expiryDate);
event ConsentRevoked(uint256 indexed tokenId, address indexed issuer);
```

## 🔧 Testing Your Integration

1. **Connect Wallet**: Ensure MetaMask is connected to BNB Smart Chain Testnet
2. **Check Console**: Open browser dev tools to see connection logs
3. **Test Functions**: Try issuing a consent token to verify the integration
4. **Verify on BSCScan**: Check your transactions on https://testnet.bscscan.com/

## 🐛 Troubleshooting

### Common Issues:
- **"Contract not initialized"**: Check your contract address format (must start with 0x and be 42 characters)
- **"Function not found"**: Verify your ABI matches your deployed contract
- **"Transaction failed"**: Ensure you have enough BNB for gas fees
- **"Wrong network"**: Switch MetaMask to BNB Smart Chain Testnet (Chain ID: 97)

### Debug Steps:
1. Verify contract address on BSCScan
2. Check if contract is verified and ABI is correct
3. Test contract functions directly on BSCScan
4. Ensure wallet has sufficient BNB for gas

## 📝 Example Contract Address Format
```
Correct: 0x1234567890123456789012345678901234567890
Wrong: 1234567890123456789012345678901234567890
Wrong: 0x123...890 (too short)
```

Once you've updated both the CONTRACT_ADDRESS and CONTRACT_ABI, your dApp will be fully connected to your deployed smart contract!