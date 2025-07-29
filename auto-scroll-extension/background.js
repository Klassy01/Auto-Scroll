// Background script for Auto Scroll Extension
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.sync.set({
    autoScrollEnabled: true,
    scrollDelay: 500,
    scrollSpeed: 'medium',
    instagramSettings: {
      enabled: true,
      delay: 500,
      scrollType: 'smooth'
    },
    youtubeSettings: {
      enabled: true,
      delay: 500,
      scrollType: 'smooth'
    },
    statistics: {
      totalScrolls: 0,
      instagramScrolls: 0,
      youtubeScrolls: 0,
      sessionsCount: 0
    },
    keyboardShortcuts: true,
    soundDetection: false
  });
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-auto-scroll') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleAutoScroll' });
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateStatistics') {
    chrome.storage.sync.get(['statistics'], (result) => {
      const stats = result.statistics || {
        totalScrolls: 0,
        instagramScrolls: 0,
        youtubeScrolls: 0,
        sessionsCount: 0
      };
      
      stats.totalScrolls++;
      if (message.platform === 'instagram') {
        stats.instagramScrolls++;
      } else if (message.platform === 'youtube') {
        stats.youtubeScrolls++;
      }
      
      chrome.storage.sync.set({ statistics: stats });
    });
  }
  
  if (message.action === 'incrementSession') {
    chrome.storage.sync.get(['statistics'], (result) => {
      const stats = result.statistics || {
        totalScrolls: 0,
        instagramScrolls: 0,
        youtubeScrolls: 0,
        sessionsCount: 0
      };
      
      stats.sessionsCount++;
      chrome.storage.sync.set({ statistics: stats });
    });
  }
});
