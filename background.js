// Background script for Firefox compatibility
// This will be loaded by Firefox via the "scripts" array in manifest.json
// Chrome will use background-worker.js via the "service_worker" property

// Initialize default settings if not set
browser.runtime.onInstalled.addListener(function() {
  browser.storage.sync.get(['allSites', 'backorderru', 'expiredru']).then(result => {
    if (result.allSites === undefined) {
      browser.storage.sync.set({
        'allSites': false,
        'backorderru': false,
        'expiredru': false
      });
    }
  }).catch(error => {
    console.error('Error initializing settings:', error);
  });
});

// Listen for tab updates to apply theme when page loads
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url);
      
      // Check if the current URL matches our sites
      if (url.hostname.includes('backorder.ru') || url.hostname.includes('expired.ru')) {
        // Get saved preferences
        browser.storage.sync.get(['allSites', 'backorderru', 'expiredru']).then(result => {
          let shouldApplyTheme = result.allSites;
          
          if (!shouldApplyTheme) {
            if (url.hostname.includes('backorder.ru')) {
              shouldApplyTheme = result.backorderru;
            } else if (url.hostname.includes('expired.ru')) {
              shouldApplyTheme = result.expiredru;
            }
          }
          
          // Send message to content script
          if (shouldApplyTheme) {
            browser.tabs.sendMessage(tabId, {
              action: 'applyTheme',
              site: url.hostname.includes('backorder.ru') ? 'backorderru' : 'expiredru'
            }).catch(() => {
              // Ignore errors - content script might not be ready yet
            });
          }
        }).catch(() => {
          // Ignore storage errors
        });
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }
});

// Listen for messages from popup
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggleTheme') {
    // Get all tabs matching our domains
    browser.tabs.query({
      url: ['*://*.backorder.ru/*', '*://*.expired.ru/*']
    }).then(tabs => {
      // Send message to each tab
      tabs.forEach(function(tab) {
        try {
          const url = new URL(tab.url);
          const site = url.hostname.includes('backorder.ru') ? 'backorderru' : 'expiredru';
          
          // Only send if it's the site we're toggling or "all sites"
          if (message.site === 'all' || message.site === site) {
            browser.tabs.sendMessage(tab.id, {
              action: message.enabled ? 'applyTheme' : 'removeTheme',
              site: site
            }).catch(() => {
              // Ignore messaging errors
            });
          }
        } catch (err) {
          // Ignore URL parsing errors
        }
      });
      
      if (sendResponse) {
        sendResponse({ status: 'processed' });
      }
    }).catch(() => {
      if (sendResponse) {
        sendResponse({ status: 'error' });
      }
    });
    
    // Keep the message channel open for async response
    return true;
  }
});