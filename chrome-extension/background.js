// Background service worker for Consent Wallet extension
class ConsentWalletBackground {
  constructor() {
    this.init();
  }
  
  init() {
    // Set up event listeners
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
    chrome.alarms.onAlarm.addListener(this.handleAlarm.bind(this));
    chrome.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
    
    // Initialize storage
    this.initializeStorage();
    
    console.log('🚀 Consent Wallet background service initialized');
  }
  
  async initializeStorage() {
    const result = await chrome.storage.local.get(['consentTokens', 'settings']);
    
    if (!result.consentTokens) {
      await chrome.storage.local.set({ consentTokens: [] });
    }
    
    if (!result.settings) {
      await chrome.storage.local.set({
        settings: {
          autoDetection: true,
          notifications: true,
          expiryReminders: true
        }
      });
    }
  }
  
  async handleMessage(request, sender, sendResponse) {
    switch (request.action) {
      case 'consentDetected':
        await this.handleConsentDetected(request.data, sender.tab);
        break;
        
      case 'consentIssued':
        await this.handleConsentIssued(request.data);
        break;
        
      case 'consentRevoked':
        await this.handleConsentRevoked(request.data);
        break;
        
      case 'getConsentTokens':
        const tokens = await this.getConsentTokens();
        sendResponse(tokens);
        break;
        
      case 'scheduleExpiryReminder':
        await this.scheduleExpiryReminder(request.data);
        break;
    }
  }
  
  async handleConsentDetected(consentData, tab) {
    console.log('🔍 Consent detected on:', tab.url, consentData);
    
    // Store detection event
    const detection = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      url: tab.url,
      tabId: tab.id,
      consentData,
      status: 'detected'
    };
    
    const { detections = [] } = await chrome.storage.local.get(['detections']);
    detections.push(detection);
    await chrome.storage.local.set({ detections });
    
    // Show notification if enabled
    const { settings } = await chrome.storage.local.get(['settings']);
    if (settings.notifications) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Consent Detected',
        message: `Privacy consent detected on ${consentData.siteName}`
      });
    }
  }
  
  async handleConsentIssued(consentData) {
    console.log('✅ Consent issued:', consentData);
    
    // Store consent token
    const { consentTokens = [] } = await chrome.storage.local.get(['consentTokens']);
    consentTokens.push({
      ...consentData,
      status: 'active',
      issuedAt: Date.now()
    });
    await chrome.storage.local.set({ consentTokens });
    
    // Schedule expiry reminder
    if (consentData.expiryDate) {
      await this.scheduleExpiryReminder(consentData);
    }
    
    // Show success notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Consent Token Issued',
      message: `Blockchain consent token created for ${consentData.siteName}`
    });
  }
  
  async handleConsentRevoked(consentData) {
    console.log('❌ Consent revoked:', consentData);
    
    // Update consent token status
    const { consentTokens = [] } = await chrome.storage.local.get(['consentTokens']);
    const updatedTokens = consentTokens.map(token => 
      token.tokenId === consentData.tokenId 
        ? { ...token, status: 'revoked', revokedAt: Date.now() }
        : token
    );
    await chrome.storage.local.set({ consentTokens: updatedTokens });
    
    // Clear expiry alarm
    chrome.alarms.clear(`expiry_${consentData.tokenId}`);
    
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Consent Revoked',
      message: `Consent token revoked for ${consentData.siteName}`
    });
  }
  
  async scheduleExpiryReminder(consentData) {
    const expiryTime = new Date(consentData.expiryDate).getTime();
    const reminderTime = expiryTime - (24 * 60 * 60 * 1000); // 24 hours before expiry
    
    if (reminderTime > Date.now()) {
      chrome.alarms.create(`expiry_${consentData.tokenId}`, {
        when: reminderTime
      });
      
      console.log(`⏰ Expiry reminder scheduled for token ${consentData.tokenId}`);
    }
  }
  
  async handleAlarm(alarm) {
    if (alarm.name.startsWith('expiry_')) {
      const tokenId = alarm.name.replace('expiry_', '');
      await this.handleExpiryReminder(tokenId);
    }
  }
  
  async handleExpiryReminder(tokenId) {
    const { consentTokens = [] } = await chrome.storage.local.get(['consentTokens']);
    const token = consentTokens.find(t => t.tokenId === tokenId);
    
    if (token && token.status === 'active') {
      // Show expiry notification with action buttons
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Consent Expiring Soon',
        message: `Your consent for ${token.siteName} expires in 24 hours. Renew or revoke?`,
        buttons: [
          { title: 'Renew' },
          { title: 'Revoke' }
        ]
      });
      
      console.log(`⚠️ Expiry reminder for token ${tokenId}`);
    }
  }
  
  async handleTabUpdate(tabId, changeInfo, tab) {
    // Trigger consent scan when page is loaded (content script already injected via manifest)
    if (changeInfo.status === 'complete' && tab.url) {
      const { settings } = await chrome.storage.local.get(['settings']);
      
      if (settings.autoDetection && this.shouldScanUrl(tab.url)) {
          // Trigger consent scan after a delay
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, { action: 'scanForConsent' });
          }, 3000);
      }
    }
  }
  
  shouldScanUrl(url) {
    // Skip certain URLs
    const skipPatterns = [
      'chrome://',
      'chrome-extension://',
      'moz-extension://',
      'about:',
      'localhost:5173' // Skip our own app
    ];
    
    return !skipPatterns.some(pattern => url.startsWith(pattern));
  }
  
  async getConsentTokens() {
    const { consentTokens = [] } = await chrome.storage.local.get(['consentTokens']);
    return consentTokens;
  }
}

// Initialize background service
new ConsentWalletBackground();