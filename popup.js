document.addEventListener('DOMContentLoaded', function() {
  // Get toggle elements
  const allSitesToggle = document.getElementById('allSites');
  const backorderToggle = document.getElementById('backorderru');
  const expiredToggle = document.getElementById('expiredru');
  const themeToggleBtn = document.getElementById('togglePopupTheme');

  // Load saved preferences
  browser.storage.sync.get(['allSites', 'backorderru', 'expiredru']).then(result => {
    // Set toggle states
    allSitesToggle.checked = result.allSites || false;
    backorderToggle.checked = result.backorderru || false;
    expiredToggle.checked = result.expiredru || false;
    
    
    // Disable individual toggles if "All Sites" is enabled
    if (allSitesToggle.checked) {
      backorderToggle.checked = true;
      expiredToggle.checked = true;
      backorderToggle.disabled = true;
      expiredToggle.disabled = true;
    }
  }).catch(error => {
    // Handle errors retrieving preferences
    console.error('Error loading preferences:', error);
  });

  // Handle All Sites toggle
  allSitesToggle.addEventListener('change', function() {
    const isChecked = this.checked;
    
    // Update individual site toggles
    backorderToggle.checked = isChecked;
    expiredToggle.checked = isChecked;
    backorderToggle.disabled = isChecked;
    expiredToggle.disabled = isChecked;
    
    // Save preferences
    browser.storage.sync.set({
      'allSites': isChecked,
      'backorderru': isChecked,
      'expiredru': isChecked
    });
    
    // Send message to background script
    browser.runtime.sendMessage({
      action: 'toggleTheme',
      site: 'all',
      enabled: isChecked
    }).catch(error => {
      // Handle error sending message
      console.error('Error sending message:', error);
    });
  });

  // Handle backorder.ru toggle
  backorderToggle.addEventListener('change', function() {
    const isChecked = this.checked;
    
    // Save preference
    browser.storage.sync.set({
      'backorderru': isChecked
    }).then(() => {
      // Preference saved
    }).catch(error => {
      console.error('Error saving backorder.ru preference:', error);
    });
    
    // Send message to background script
    browser.runtime.sendMessage({
      action: 'toggleTheme',
      site: 'backorderru',
      enabled: isChecked
    }).then(response => {
      // Message sent successfully
    }).catch(error => {
      console.error('Error sending message to background:', error);
    });
  });

  // Handle expired.ru toggle
  expiredToggle.addEventListener('change', function() {
    const isChecked = this.checked;
    
    // Save preference
    browser.storage.sync.set({
      'expiredru': isChecked
    }).then(() => {
      // Preference saved
    }).catch(error => {
      console.error('Error saving expired.ru preference:', error);
    });
    
    // Send message to background script
    browser.runtime.sendMessage({
      action: 'toggleTheme',
      site: 'expiredru',
      enabled: isChecked
    }).then(response => {
      // Message sent successfully
    }).catch(error => {
      console.error('Error sending message to background:', error);
    });
  });
});