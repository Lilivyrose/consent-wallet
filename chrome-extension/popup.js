// Popup script for Consent Wallet extension
class ConsentWalletPopup {
  constructor() {
    this.init();
  }
  
  async init() {
    await this.loadStats();
    await this.loadRecentActivity();
    await this.loadSettings();
    this.setupEventListeners();
  }
  
  async loadStats() {
    try {
      const { consentTokens = [] } = await chrome.storage.local.get(['consentTokens']);
      const activeConsents = consentTokens.filter(token => 
        token.status === 'active' && new Date(token.expiryDate) > new Date()
      ).length;
      
      document.getElementById('activeConsents').textContent = activeConsents;
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }
  
  async loadRecentActivity() {
    try {
      const { consentTokens = [], detections = [] } = await chrome.storage.local.get(['consentTokens', 'detections']);
      
      // Combine and sort recent activity
      const recentActivity = [
        ...consentTokens.map(token => ({
          type: 'consent',
          timestamp: token.issuedAt || token.timestamp,
          siteName: token.siteName,
          status: token.status
        })),
        ...detections.slice(-5).map(detection => ({
          type: 'detection',
          timestamp: detection.timestamp,
          siteName: detection.consentData.siteName,
          status: 'detected'
        }))
      ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
      
      const container = document.getElementById('recentActivity');
      
      if (recentActivity.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; color: #cccccc; font-size: 12px; padding: 20px;">
            No recent activity
          </div>
        `;
        return;
      }
      
      container.innerHTML = recentActivity.map(activity => `
        <div class="recent-consent">
          <div class="recent-consent-site">
            <span class="status-indicator status-${activity.status}"></span>
            ${activity.siteName}
          </div>
          <div class="recent-consent-time">
            ${this.formatTime(activity.timestamp)} • ${activity.type}
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  }
  
  async loadSettings() {
    try {
      const { settings } = await chrome.storage.local.get(['settings']);
      if (settings) {
        document.getElementById('autoDetection').checked = settings.autoDetection;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  setupEventListeners() {
    // Open dashboard button
    document.getElementById('openDashboard').addEventListener('click', () => {
      chrome.tabs.create({ url: 'http://localhost:5173' });
      window.close();
    });
    
    // Scan current page button
    document.getElementById('scanCurrentPage').addEventListener('click', async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, { action: 'scanForConsent' });
        window.close();
      } catch (error) {
        console.error('Error scanning page:', error);
      }
    });
    
    // Auto-detection toggle
    document.getElementById('autoDetection').addEventListener('change', async (e) => {
      try {
        const { settings = {} } = await chrome.storage.local.get(['settings']);
        settings.autoDetection = e.target.checked;
        await chrome.storage.local.set({ settings });
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    });
  }
  
  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  }
}

// Initialize popup
new ConsentWalletPopup();