// Chrome-specific service worker implementation for Manifest V3
// This file is only used by Chrome via the service_worker property

// Initialize default settings if not set
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.get(['allSites', 'backorderru', 'expiredru'], function(result) {
    if (result.allSites === undefined) {
      chrome.storage.sync.set({
        'allSites': false,
        'backorderru': false,
        'expiredru': false
      });
    }
  });
});

// Listen for tab updates to apply theme when page loads
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const url = new URL(tab.url);
      
      // Check if the current URL matches our sites
      if (url.hostname.includes('backorder.ru') || url.hostname.includes('expired.ru')) {
        // Get saved preferences
        chrome.storage.sync.get(['allSites', 'backorderru', 'expiredru'], function(result) {
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
            chrome.tabs.sendMessage(tabId, {
              action: 'applyTheme',
              site: url.hostname.includes('backorder.ru') ? 'backorderru' : 'expiredru'
            }, function(response) {
              // Optional callback - can be empty for Chrome
            });
          }
        });
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'toggleTheme') {
    // Get all tabs matching our domains
    chrome.tabs.query({
      url: ['*://*.backorder.ru/*', '*://*.expired.ru/*']
    }, function(tabs) {
      // Process each tab
      let processed = 0;
      const totalTabs = tabs.length;
      
      // If no matching tabs found, respond immediately
      if (totalTabs === 0) {
        sendResponse({status: 'no_tabs_found'});
        return;
      }
      
      // Send message to each tab
      tabs.forEach(function(tab) {
        try {
          const url = new URL(tab.url);
          const site = url.hostname.includes('backorder.ru') ? 'backorderru' : 'expiredru';
          
          // Only send if it's the site we're toggling or "all sites"
          if (message.site === 'all' || message.site === site) {
            chrome.tabs.sendMessage(
              tab.id, 
              {
                action: message.enabled ? 'applyTheme' : 'removeTheme',
                site: site
              }, 
              function() {
                processed++;
                
                // Once all tabs are processed, send the response
                if (processed === totalTabs) {
                  sendResponse({status: 'complete', tabs: totalTabs});
                }
              }
            );
          } else {
            processed++;
            // If all tabs processed, send response
            if (processed === totalTabs) {
              sendResponse({status: 'complete', tabs: totalTabs});
            }
          }
        } catch (err) {
          processed++;
          // If all tabs processed, send response
          if (processed === totalTabs) {
            sendResponse({status: 'error', message: err.message});
          }
        }
      });
    });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

// These event listeners are needed for Chrome service workers
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});