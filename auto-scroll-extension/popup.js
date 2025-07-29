// Enhanced Popup script for Auto Scroll Extension
document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const delaySlider = document.getElementById('delaySlider');
  const delayValue = document.getElementById('delayValue');
  const speedSelect = document.getElementById('speedSelect');
  const currentPlatform = document.getElementById('currentPlatform');
  const extensionStatus = document.getElementById('extensionStatus');
  
  // New controls
  const keyboardToggle = document.getElementById('keyboardToggle');
  const soundToggle = document.getElementById('soundToggle');
  const pauseButton = document.getElementById('pauseButton');
  const testScrollButton = document.getElementById('testScrollButton');
  const resetStatsButton = document.getElementById('resetStats');
  
  // Platform-specific controls
  const instagramEnabled = document.getElementById('instagramEnabled');
  const instagramDelay = document.getElementById('instagramDelay');
  const instagramDelayValue = document.getElementById('instagramDelayValue');
  const instagramScrollType = document.getElementById('instagramScrollType');
  
  const youtubeEnabled = document.getElementById('youtubeEnabled');
  const youtubeDelay = document.getElementById('youtubeDelay');
  const youtubeDelayValue = document.getElementById('youtubeDelayValue');
  const youtubeScrollType = document.getElementById('youtubeScrollType');

  // Load current settings
  const settings = await chrome.storage.sync.get([
    'autoScrollEnabled', 'scrollDelay', 'scrollSpeed',
    'instagramSettings', 'youtubeSettings', 
    'keyboardShortcuts', 'soundDetection', 'statistics'
  ]);
  
  // Set initial values
  enableToggle.checked = settings.autoScrollEnabled !== false;
  delaySlider.value = settings.scrollDelay || 500;
  delayValue.textContent = `${delaySlider.value}ms`;
  speedSelect.value = settings.scrollSpeed || 'medium';
  keyboardToggle.checked = settings.keyboardShortcuts !== false;
  soundToggle.checked = settings.soundDetection || false;
  
  // Platform-specific settings
  const instagramSettings = settings.instagramSettings || { enabled: true, delay: 500, scrollType: 'smooth' };
  const youtubeSettings = settings.youtubeSettings || { enabled: true, delay: 500, scrollType: 'smooth' };
  
  instagramEnabled.checked = instagramSettings.enabled;
  instagramDelay.value = instagramSettings.delay;
  instagramDelayValue.textContent = `${instagramSettings.delay}ms`;
  instagramScrollType.value = instagramSettings.scrollType;
  
  youtubeEnabled.checked = youtubeSettings.enabled;
  youtubeDelay.value = youtubeSettings.delay;
  youtubeDelayValue.textContent = `${youtubeSettings.delay}ms`;
  youtubeScrollType.value = youtubeSettings.scrollType;

  // Setup tabs
  setupTabs();
  
  // Load statistics
  loadStatistics(settings.statistics);

  // Update status
  updateStatus();

  // Event listeners
  enableToggle.addEventListener('change', async () => {
    const isEnabled = enableToggle.checked;
    await chrome.storage.sync.set({ autoScrollEnabled: isEnabled });
    updateStatus();
    
    // Send message to content script
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'toggleAutoScroll',
          enabled: isEnabled
        });
      }
    } catch (error) {
      console.log('Could not send message to content script');
    }
  });

  delaySlider.addEventListener('input', async () => {
    const delay = parseInt(delaySlider.value);
    delayValue.textContent = `${delay}ms`;
    await chrome.storage.sync.set({ scrollDelay: delay });
    sendMessageToTab({ action: 'setDelay', delay: delay });
  });

  speedSelect.addEventListener('change', async () => {
    await chrome.storage.sync.set({ scrollSpeed: speedSelect.value });
  });

  keyboardToggle.addEventListener('change', async () => {
    await chrome.storage.sync.set({ keyboardShortcuts: keyboardToggle.checked });
  });

  soundToggle.addEventListener('change', async () => {
    await chrome.storage.sync.set({ soundDetection: soundToggle.checked });
  });

  // Platform-specific event listeners
  instagramEnabled.addEventListener('change', async () => {
    const settings = { ...instagramSettings, enabled: instagramEnabled.checked };
    await chrome.storage.sync.set({ instagramSettings: settings });
  });

  instagramDelay.addEventListener('input', async () => {
    const delay = parseInt(instagramDelay.value);
    instagramDelayValue.textContent = `${delay}ms`;
    const settings = { ...instagramSettings, delay: delay };
    await chrome.storage.sync.set({ instagramSettings: settings });
  });

  instagramScrollType.addEventListener('change', async () => {
    const settings = { ...instagramSettings, scrollType: instagramScrollType.value };
    await chrome.storage.sync.set({ instagramSettings: settings });
  });

  youtubeEnabled.addEventListener('change', async () => {
    const settings = { ...youtubeSettings, enabled: youtubeEnabled.checked };
    await chrome.storage.sync.set({ youtubeSettings: settings });
  });

  youtubeDelay.addEventListener('input', async () => {
    const delay = parseInt(youtubeDelay.value);
    youtubeDelayValue.textContent = `${delay}ms`;
    const settings = { ...youtubeSettings, delay: delay };
    await chrome.storage.sync.set({ youtubeSettings: settings });
  });

  youtubeScrollType.addEventListener('change', async () => {
    const settings = { ...youtubeSettings, scrollType: youtubeScrollType.value };
    await chrome.storage.sync.set({ youtubeSettings: settings });
  });

  // Action buttons
  pauseButton.addEventListener('click', async () => {
    sendMessageToTab({ action: 'togglePause' });
  });

  testScrollButton.addEventListener('click', async () => {
    sendMessageToTab({ action: 'testScroll' });
  });

  resetStatsButton.addEventListener('click', async () => {
    await chrome.storage.sync.set({
      statistics: {
        totalScrolls: 0,
        instagramScrolls: 0,
        youtubeScrolls: 0,
        sessionsCount: 0
      }
    });
    loadStatistics({ totalScrolls: 0, instagramScrolls: 0, youtubeScrolls: 0 });
  });

  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.dataset.tab;
        
        // Update button states
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update content visibility
        tabContents.forEach(content => {
          if (content.id === `${targetTab}-tab`) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
        });
      });
    });
  }

  function loadStatistics(stats = {}) {
    document.getElementById('totalScrolls').textContent = stats.totalScrolls || 0;
    document.getElementById('instagramScrolls').textContent = stats.instagramScrolls || 0;
    document.getElementById('youtubeScrolls').textContent = stats.youtubeScrolls || 0;
    
    // Get session stats
    sendMessageToTab({ action: 'getStats' }, (response) => {
      if (response) {
        document.getElementById('sessionScrolls').textContent = response.sessionScrolls || 0;
      }
    });
  }

  async function sendMessageToTab(message, callback) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        if (callback) {
          chrome.tabs.sendMessage(tab.id, message, callback);
        } else {
          chrome.tabs.sendMessage(tab.id, message);
        }
      }
    } catch (error) {
      console.log('Could not send message to content script');
    }
  }

  async function updateStatus() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) return;

      const url = new URL(tab.url);
      const hostname = url.hostname;

      // Update platform status
      if (hostname.includes('instagram.com')) {
        currentPlatform.textContent = 'Instagram';
        currentPlatform.className = 'status-value instagram';
      } else if (hostname.includes('youtube.com')) {
        currentPlatform.textContent = 'YouTube';
        currentPlatform.className = 'status-value youtube';
      } else {
        currentPlatform.textContent = 'Unsupported';
        currentPlatform.className = 'status-value unsupported';
      }

      // Update extension status
      if (enableToggle.checked) {
        extensionStatus.textContent = 'Active';
        extensionStatus.className = 'status-value active';
      } else {
        extensionStatus.textContent = 'Disabled';
        extensionStatus.className = 'status-value disabled';
      }

      // Show different info based on platform
      updatePlatformInfo(hostname);

    } catch (error) {
      currentPlatform.textContent = 'Unknown';
      currentPlatform.className = 'status-value';
    }
  }

  function updatePlatformInfo(hostname) {
    const infoElement = document.querySelector('.info');
    
    if (hostname.includes('instagram.com')) {
      if (window.location.pathname && window.location.pathname.includes('/reels/')) {
        infoElement.innerHTML = `
          <h3>Instagram Reels Mode:</h3>
          <ul>
            <li>✅ Auto-scroll is active on this page</li>
            <li>🎬 Watching for reel completions</li>
            <li>📱 Will scroll to next reel automatically</li>
          </ul>
        `;
      } else {
        infoElement.innerHTML = `
          <h3>Instagram Mode:</h3>
          <ul>
            <li>📍 Navigate to Reels to activate auto-scroll</li>
            <li>🎬 Extension will detect reel endings</li>
            <li>📱 Automatic scrolling will begin</li>
          </ul>
        `;
      }
    } else if (hostname.includes('youtube.com')) {
      if (window.location.pathname && window.location.pathname.includes('/shorts/')) {
        infoElement.innerHTML = `
          <h3>YouTube Shorts Mode:</h3>
          <ul>
            <li>✅ Auto-scroll is active on this page</li>
            <li>🎬 Watching for Short completions</li>
            <li>📱 Will navigate to next Short automatically</li>
          </ul>
        `;
      } else {
        infoElement.innerHTML = `
          <h3>YouTube Mode:</h3>
          <ul>
            <li>📍 Navigate to Shorts to activate auto-scroll</li>
            <li>🎬 Extension will detect Short endings</li>
            <li>📱 Automatic navigation will begin</li>
          </ul>
        `;
      }
    } else {
      infoElement.innerHTML = `
        <h3>How it works:</h3>
        <ul>
          <li>🎬 Detects when Instagram Reels finish playing</li>
          <li>📱 Automatically scrolls to the next YouTube Short</li>
          <li>⏱️ Customizable delay between scrolls</li>
          <li>🔄 Works on both mobile and desktop</li>
        </ul>
      `;
    }
  }

  // Listen for tab updates
  if (chrome.tabs && chrome.tabs.onUpdated) {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        setTimeout(updateStatus, 500);
      }
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStatus') {
    // Update popup status if needed
    console.log('Status update from content script:', message);
  }
});
