# Consent Wallet Chrome Extension

## 🚀 Installation & Setup

### 1. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The Consent Wallet extension should now appear in your extensions

### 2. Pin the Extension
1. Click the puzzle piece icon in Chrome toolbar
2. Find "Consent Wallet - Web3 Privacy Manager"
3. Click the pin icon to keep it visible

### 3. Configure Permissions
The extension will request permissions for:
- **Active Tab**: To scan current page for consent prompts
- **Storage**: To save consent tokens and settings
- **Notifications**: To alert about consent detection and expiry
- **Alarms**: To schedule expiry reminders

## 🔧 How It Works

### Automatic Detection
- **Content Script**: Runs on every webpage to detect consent patterns
- **Pattern Matching**: Looks for common consent button text and modal containers
- **Real-time Scanning**: Monitors DOM changes for dynamically loaded consent prompts

### Consent Processing
1. **Detection**: Finds consent prompts using pattern matching
2. **Extraction**: Pulls website name, privacy policy URL, data types, and purpose
3. **Modal Display**: Shows overlay with consent details
4. **Wallet Integration**: Opens Consent Wallet app with pre-filled data

### Data Storage
- **Local Storage**: Consent tokens and settings stored locally
- **Blockchain**: Actual consent tokens stored on BNB Smart Chain Testnet
- **Privacy**: No data sent to external servers

## 🎯 Features

### Passive Detection
- Automatically scans webpages for consent prompts
- Detects privacy policy and terms of service links
- Extracts data types and purposes from page content
- Shows non-intrusive overlay when consent is detected

### Smart Autofill
- Pre-fills recipient wallet address (if found on page)
- Generates purpose based on detected consent type
- Suggests data types based on page content
- Stores privacy policy URL for future reference

### Expiry Management
- Schedules notifications 24 hours before consent expires
- Provides renewal and revocation options
- Automatically updates token status on blockchain
- Redirects to original website for manual revocation

### Dashboard Integration
- Syncs with web app dashboard
- Shows all consent tokens with website links
- Enables one-click revocation and renewal
- Tracks consent history and analytics

## 🛠️ Development

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for background tasks
├── content.js            # Content script for webpage scanning
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md             # This file
```

### Testing
1. Load extension in Chrome
2. Visit websites with cookie banners or privacy prompts
3. Check console logs for detection events
4. Test modal display and wallet integration
5. Verify data storage and notifications

### Debugging
- **Background Script**: Check `chrome://extensions/` → Consent Wallet → "service worker"
- **Content Script**: Use browser dev tools on any webpage
- **Popup**: Right-click extension icon → "Inspect popup"
- **Storage**: Check `chrome://extensions/` → Consent Wallet → "Storage"

## 🔒 Privacy & Security

### Data Handling
- **Local Only**: All data stored locally in browser
- **No Tracking**: Extension doesn't track user behavior
- **Minimal Permissions**: Only requests necessary permissions
- **Open Source**: All code is transparent and auditable

### Blockchain Integration
- **Decentralized**: Consent tokens stored on public blockchain
- **User Controlled**: Users maintain full control over their data
- **Transparent**: All consent actions are publicly verifiable
- **Revocable**: Consents can be revoked at any time

## 📱 Usage Instructions

### For Users
1. **Install**: Load extension in Chrome
2. **Browse**: Visit websites normally
3. **Detect**: Extension automatically detects consent prompts
4. **Review**: Check pre-filled consent details in modal
5. **Approve**: Click "Review & Approve" to open Consent Wallet
6. **Issue**: Select expiry date and issue blockchain consent token
7. **Manage**: View and manage all consents in dashboard

### For Developers
1. **Clone**: Copy extension files to your project
2. **Customize**: Modify detection patterns and UI
3. **Test**: Load in Chrome developer mode
4. **Deploy**: Package for Chrome Web Store submission

## 🚀 Future Enhancements

### Planned Features
- **Multi-chain Support**: Support for Ethereum, Polygon, etc.
- **Advanced Detection**: ML-based consent pattern recognition
- **Bulk Management**: Batch operations for multiple consents
- **Analytics**: Detailed consent usage analytics
- **Export/Import**: Backup and restore consent data

### Integration Options
- **Website Integration**: SDK for websites to integrate directly
- **Mobile Apps**: React Native version for mobile browsers
- **Enterprise**: Corporate consent management features
- **API**: RESTful API for third-party integrations

## 📞 Support

For issues, feature requests, or questions:
1. Check browser console for error messages
2. Verify extension permissions are granted
3. Ensure Consent Wallet web app is running on localhost:5173
4. Check that MetaMask is connected to BNB Smart Chain Testnet

## 📄 License

This extension is part of the Consent Wallet project and follows the same licensing terms.