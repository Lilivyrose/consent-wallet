# Consent Wallet - Web3 Privacy Manager

A proactive, browser-based Web3 consent management dApp that automatically detects privacy prompts and issues blockchain-based consent tokens on BNB Smart Chain Testnet.

## 🚀 Overview

Consent Wallet transforms how users manage digital privacy by acting as a "Web3 Grammarly for Consent" - automatically detecting consent prompts across the web and enabling users to issue tamper-proof consent tokens on the blockchain with complete transparency and control.

## ✨ Key Features

### 🔍 **Proactive Consent Detection**
- **Browser Extension**: Automatically scans webpages for consent prompts
- **Pattern Recognition**: Detects "Accept Terms", "I Agree", cookie banners, and privacy policies
- **Real-time Monitoring**: Monitors DOM changes for dynamically loaded consent forms
- **Smart Extraction**: Auto-extracts website names, privacy policy URLs, and data types

### 🛡️ **Blockchain-Based Consent Management**
- **Immutable Records**: Consent tokens stored on BNB Smart Chain Testnet
- **Complete Transparency**: All consent actions are publicly verifiable
- **User Control**: Full ownership and control over consent data
- **Revocable Permissions**: Instant revocation with blockchain verification

### 🎯 **Intelligent Autofill**
- **Pre-filled Forms**: Automatically populates recipient addresses and purposes
- **Data Type Detection**: Suggests relevant data fields based on website content
- **One-Click Issuance**: Users only need to select expiry dates
- **Website Tracking**: Stores original URLs for future reference

### ⏰ **Expiry Management**
- **Automated Reminders**: 24-hour notifications before consent expires
- **Renewal Options**: Easy renewal with updated expiry dates
- **Auto-Revocation**: Redirects to original websites for manual revocation
- **Status Tracking**: Real-time updates of consent token status

## 🏗️ Architecture

### **Frontend (React + TypeScript)**
- **Modern Stack**: Vite, React 18, TypeScript, Tailwind CSS
- **Web3 Integration**: Ethers.js for blockchain interactions
- **Responsive Design**: Mobile-first with Cyber Ember theme
- **Real-time Updates**: Live consent status monitoring

### **Chrome Extension**
- **Content Scripts**: Webpage scanning and consent detection
- **Background Service**: Notifications and data management
- **Popup Interface**: Quick access to consent statistics
- **Local Storage**: Extension settings and detection history

### **Smart Contract (Solidity)**
- **BNB Smart Chain Testnet**: Fast and cost-effective transactions
- **ERC-721 Compatible**: NFT-based consent tokens
- **Structured Data**: Website URLs and data field tracking
- **Event Logging**: Complete audit trail of consent actions

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- MetaMask browser extension
- BNB Smart Chain Testnet configuration
- Chrome browser (for extension)

### **1. Clone & Install**
```bash
git clone <repository-url>
cd consent-wallet
npm install
```

### **2. Configure Smart Contract**
1. Deploy your consent token contract to BNB Smart Chain Testnet
2. Update `src/utils/constants.ts`:
   ```typescript
   export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
   export const CONTRACT_ABI = [...]; // Your contract ABI
   ```
3. See `CONTRACT_SETUP_INSTRUCTIONS.md` for detailed guidance

### **3. Start Development Server**
```bash
npm run dev
```
Access the app at `http://localhost:5173`

### **4. Install Chrome Extension**
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → Select `chrome-extension` folder
4. Pin the extension to your toolbar

### **5. Configure MetaMask**
- Network: BNB Smart Chain Testnet
- Chain ID: 97
- RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- Get testnet BNB from [BNB Testnet Faucet](https://testnet.binance.org/faucet-smart)

## 📱 Usage

### **For End Users**

1. **Install Extension**: Load the Chrome extension in developer mode
2. **Connect Wallet**: Connect MetaMask to BNB Smart Chain Testnet
3. **Browse Normally**: Visit websites with privacy policies or cookie banners
4. **Automatic Detection**: Extension detects consent prompts and shows modal
5. **Review & Approve**: Click to open Consent Wallet with pre-filled data
6. **Set Expiry**: Select expiration date and issue blockchain consent token
7. **Manage Dashboard**: View, track, and revoke all consent tokens

### **For Developers**

#### **Manual Consent Issuance**
```typescript
// Navigate to /issue or /autofill-consent
// Fill form with:
{
  recipient: "0x...", // Wallet address
  purpose: "Data processing consent",
  expiryDate: "2024-12-31T23:59",
  website: "example.com", // Optional
  dataFields: ["email", "name"] // Optional
}
```

#### **Programmatic Integration**
```typescript
// Autofill via URL parameters
const consentUrl = `/autofill-consent?` + new URLSearchParams({
  to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e",
  site: "example.com",
  purpose: "General usage consent",
  fields: "email,name,location"
});
```

## 🎨 Design System

### **Cyber Ember Theme**
- **Primary Colors**: Orange (#ff6b00) to Yellow (#ffb347) gradients
- **Background**: Dark (#0f0f0f) with subtle orange accents
- **Typography**: Space Grotesk font family
- **Components**: Glass-morphism effects with orange borders

### **Status Indicators**
- 🟢 **Active**: Orange (#ff6b00) - Valid and unexpired
- 🟡 **Expiring**: Yellow (#ffb347) - Expires within 24 hours
- 🔴 **Revoked**: Red (#ff4444) - Manually revoked
- ⚫ **Expired**: Gray (#666666) - Past expiration date

## 📊 Dashboard Features

### **Statistics Overview**
- Total consent tokens issued
- Active consents count
- Expired and revoked counts
- Recent activity timeline

### **Consent Management**
- **Website Links**: Click to visit original consent source
- **Data Fields**: Visual tags showing shared information types
- **Expiry Tracking**: Clear indication of time remaining
- **Bulk Actions**: Select multiple consents for batch operations

### **Advanced Filtering**
- Filter by status (active, expired, revoked)
- Search by website or purpose
- Sort by date, expiry, or website
- Export consent history

## 🔒 Privacy & Security

### **Data Protection**
- **Local Storage**: Extension data stored locally in browser
- **Blockchain Storage**: Consent tokens on public, immutable ledger
- **No Tracking**: Zero external analytics or data collection
- **User Controlled**: Complete ownership of all consent data

### **Security Features**
- **Address Validation**: Checksum verification for all wallet addresses
- **Input Sanitization**: XSS protection and data validation
- **Secure Communication**: HTTPS-only for all external requests
- **Permission Management**: Minimal browser permissions requested

## 🚀 Deployment

### **Production Build**
```bash
npm run build
npm run preview
```

### **Chrome Web Store**
1. Package extension: `zip -r consent-wallet-extension.zip chrome-extension/`
2. Submit to Chrome Web Store Developer Dashboard
3. Complete store listing with screenshots and descriptions

### **Smart Contract Deployment**
```solidity
// Deploy to BNB Smart Chain Mainnet
// Update CONTRACT_ADDRESS in constants.ts
// Verify contract on BSCScan
```

## 🛣️ Roadmap

### **Phase 1: Core Features** ✅
- [x] Basic consent token issuance
- [x] Chrome extension with detection
- [x] Dashboard with management features
- [x] BNB Testnet integration

### **Phase 2: Enhanced Detection** 🚧
- [ ] Machine learning-based pattern recognition
- [ ] Multi-language consent detection
- [ ] Advanced privacy policy parsing
- [ ] Bulk consent management

### **Phase 3: Multi-Chain Support** 📋
- [ ] Ethereum mainnet integration
- [ ] Polygon network support
- [ ] Cross-chain consent verification
- [ ] Layer 2 scaling solutions

### **Phase 4: Enterprise Features** 📋
- [ ] Organization consent management
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Compliance reporting tools

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### **Code Standards**
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- Component-based architecture
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### **Common Issues**
- **Contract not found**: Verify CONTRACT_ADDRESS in constants.ts
- **Wrong network**: Switch MetaMask to BNB Smart Chain Testnet
- **Extension not detecting**: Check permissions and reload pages
- **Transaction failed**: Ensure sufficient BNB for gas fees

### **Getting Help**
- Check browser console for detailed error messages
- Review `CONTRACT_SETUP_INSTRUCTIONS.md` for contract configuration
- Verify MetaMask connection and network settings
- Ensure extension permissions are granted

### **Resources**
- [BNB Smart Chain Testnet Faucet](https://testnet.binance.org/faucet-smart)
- [MetaMask Setup Guide](https://docs.binance.org/smart-chain/wallet/metamask.html)
- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/)

## 🌟 Acknowledgments

- **BNB Smart Chain**: For fast and affordable blockchain infrastructure
- **MetaMask**: For seamless Web3 wallet integration
- **React & Vite**: For modern frontend development experience
- **Tailwind CSS**: For beautiful and responsive design system

---

**Built with ❤️ for a more transparent and user-controlled web**

*Consent Wallet - Empowering users to take control of their digital privacy through blockchain technology.*



















**Built with ❤️ for a more transparent and user-controlled web**

*Consent Wallet - Empowering users to take control of their digital privacy through blockchain technology  swdefrgthyjukilo;pedfrgthyjul.*
