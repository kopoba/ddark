// Function to determine which site we're on
function getCurrentSite() {
  const hostname = window.location.hostname;
  if (hostname.includes('backorder.ru')) {
    return 'backorderru';
  } else if (hostname.includes('expired.ru')) {
    return 'expiredru';
  }
  return null;
}

// Function to get CSS file path for a site
function getCssPath(site) {
  // Convert site identifier to CSS filename
  const cssFile = site === 'backorderru' ? 'backorder.css' : 'expired.css';
  return browser.runtime.getURL(`css/${cssFile}`);
}

// Function to apply dark theme
function applyDarkTheme(site) {
  if (!site) {
    site = getCurrentSite();
  }

  // Check if theme is already applied
  if (document.getElementById('dark-theme-style')) {
    return;
  }

  // Get the CSS path for the site
  const cssPath = getCssPath(site);
  
  try {
    // Create link element to load external CSS
    const linkElement = document.createElement('link');
    linkElement.id = 'dark-theme-style';
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = cssPath;
    document.head.appendChild(linkElement);
  } catch (error) {
    console.error('Error applying dark theme:', error);
  }
}

// Function to remove dark theme
function removeDarkTheme() {
  const themeElement = document.getElementById('dark-theme-style');
  if (themeElement) {
    themeElement.remove();
  }
}

// Listen for messages from background script
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  try {
    if (message.action === 'applyTheme') {
      applyDarkTheme(message.site);
    } else if (message.action === 'removeTheme') {
      removeDarkTheme();
    }
    
    // Send a response back confirming receipt
    if (sendResponse) {
      sendResponse({ status: 'ok', site: message.site });
    }
  } catch (error) {
    // Handle errors and send back error status
    if (sendResponse) {
      sendResponse({ status: 'error', message: error.message });
    }
  }
  return true; // Keep the messaging channel open for async response
});

// Check if theme should be applied on page load
const currentSite = getCurrentSite();
if (currentSite) {
  browser.storage.sync.get([currentSite, 'allSites']).then(result => {
    if (result.allSites || result[currentSite]) {
      applyDarkTheme(currentSite);
    }
  }).catch(error => {
    console.error('Error checking theme preferences:', error);
  });
}