@@ .. @@
   openConsentWallet(consentData) {
     // Create URL parameters for autofill
     const params = new URLSearchParams({
-      to: consentData.recipientAddress,
+      to: consentData.recipientAddress || '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
       site: consentData.siteName,
       serviceName: consentData.siteName,
       purpose: consentData.purpose,
       fields: consentData.dataFields.join(','),
       privacyUrl: consentData.privacyPolicyUrl || window.location.href,
       sourceUrl: window.location.href
     });
     
     // Open Consent Wallet in new tab with autofill route
-    const consentWalletUrl = `http://localhost:5173/autofill-consent?${params.toString()}`;
+    const consentWalletUrl = `${window.location.origin}/autofill-consent?${params.toString()}`;
     window.open(consentWalletUrl, '_blank');
   }