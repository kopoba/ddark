/**
 * Simple browser API compatibility layer for Chrome and Firefox
 */
(function() {
  'use strict';

  // Don't do anything if browser is already defined
  if (typeof window !== 'undefined' && typeof window.browser !== 'undefined') {
    return;
  }

  // Define browser object at global scope (self is used for service workers)
  const scope = typeof window !== 'undefined' ? window : self;

  // If we don't have chrome API, we're probably in Firefox already
  if (typeof chrome === 'undefined') {
    return;
  }

  // Create a browser object if it doesn't exist
  scope.browser = scope.browser || {};

  // Runtime API
  scope.browser.runtime = {
    // Basic sendMessage with promise wrapping
    sendMessage: function(message) {
      return new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage(message, response => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve(response);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    
    // Basic event listener handling
    onMessage: {
      addListener: function(callback) {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
          const result = callback(message, sender, sendResponse);
          // Return true to keep the message channel open for async
          return result === true;
        });
      }
    },
    
    // URL getter
    getURL: function(path) {
      return chrome.runtime.getURL(path);
    },
    
    // onInstalled event
    onInstalled: {
      addListener: function(callback) {
        if (chrome.runtime.onInstalled) {
          chrome.runtime.onInstalled.addListener(callback);
        }
      }
    }
  };

  // Storage API
  scope.browser.storage = {
    sync: {
      get: function(keys) {
        return new Promise((resolve, reject) => {
          try {
            chrome.storage.sync.get(keys, result => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve(result);
              }
            });
          } catch (e) {
            reject(e);
          }
        });
      },
      set: function(items) {
        return new Promise((resolve, reject) => {
          try {
            chrome.storage.sync.set(items, () => {
              if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
              } else {
                resolve();
              }
            });
          } catch (e) {
            reject(e);
          }
        });
      }
    }
  };

  // Tabs API
  scope.browser.tabs = {
    // Query tabs
    query: function(queryInfo) {
      return new Promise((resolve, reject) => {
        try {
          chrome.tabs.query(queryInfo, tabs => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(tabs);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    
    // Send message to tab
    sendMessage: function(tabId, message) {
      return new Promise((resolve, reject) => {
        try {
          chrome.tabs.sendMessage(tabId, message, response => {
            if (chrome.runtime.lastError) {
              // Don't reject for "recipient not found" errors which are normal
              // if the content script isn't loaded yet
              if (chrome.runtime.lastError.message.includes("Could not establish connection") ||
                  chrome.runtime.lastError.message.includes("Receiving end does not exist")) {
                resolve();
              } else {
                reject(chrome.runtime.lastError);
              }
            } else {
              resolve(response);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    },
    
    // Tab update event
    onUpdated: {
      addListener: function(callback) {
        chrome.tabs.onUpdated.addListener(callback);
      }
    }
  };

})();