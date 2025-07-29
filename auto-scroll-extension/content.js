// Enhanced Auto Scroll Extension for Instagram Reels and YouTube Shorts
class AutoScrollAgent {
  constructor() {
    this.isEnabled = true;
    this.isPaused = false;
    this.scrollDelay = 500;
    this.scrollSpeed = 'medium';
    this.observers = new Map();
    this.currentPlatform = this.detectPlatform();
    this.statistics = {
      sessionScrolls: 0,
      sessionStartTime: Date.now()
    };
    this.platformSettings = {};
    this.keyboardShortcuts = true;
    this.soundDetection = false;
    this.lastScrollTime = 0;
    this.scrollCooldown = 1000; // Minimum time between scrolls
    this.init();
  }

  detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('instagram.com')) {
      return 'instagram';
    } else if (hostname.includes('youtube.com')) {
      return 'youtube';
    }
    return null;
  }

  async init() {
    // Load settings from storage
    await this.loadSettings();
    
    if (!this.currentPlatform || !this.isEnabled) return;

    console.log(`Auto Scroll Agent initialized for ${this.currentPlatform}`);
    
    // Initialize session tracking
    this.initSessionTracking();
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Start monitoring based on platform
    if (this.currentPlatform === 'instagram') {
      this.initInstagramMonitoring();
    } else if (this.currentPlatform === 'youtube') {
      this.initYouTubeMonitoring();
    }

    // Listen for settings changes
    this.listenForSettingsChanges();
    
    // Listen for messages from popup/background
    this.listenForMessages();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'autoScrollEnabled', 
        'scrollDelay', 
        'scrollSpeed',
        'instagramSettings',
        'youtubeSettings',
        'keyboardShortcuts',
        'soundDetection'
      ]);
      
      this.isEnabled = result.autoScrollEnabled !== false;
      this.scrollDelay = result.scrollDelay || 500;
      this.scrollSpeed = result.scrollSpeed || 'medium';
      this.keyboardShortcuts = result.keyboardShortcuts !== false;
      this.soundDetection = result.soundDetection || false;
      
      // Platform-specific settings
      this.platformSettings = {
        instagram: result.instagramSettings || {
          enabled: true,
          delay: 500,
          scrollType: 'smooth'
        },
        youtube: result.youtubeSettings || {
          enabled: true,
          delay: 500,
          scrollType: 'smooth'
        }
      };
    } catch (error) {
      console.log('Using default settings');
    }
  }

  listenForSettingsChanges() {
    try {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.autoScrollEnabled) {
          this.isEnabled = changes.autoScrollEnabled.newValue;
        }
        if (changes.scrollDelay) {
          this.scrollDelay = changes.scrollDelay.newValue;
        }
        if (changes.scrollSpeed) {
          this.scrollSpeed = changes.scrollSpeed.newValue;
        }
        if (changes.instagramSettings) {
          this.platformSettings.instagram = changes.instagramSettings.newValue;
        }
        if (changes.youtubeSettings) {
          this.platformSettings.youtube = changes.youtubeSettings.newValue;
        }
        if (changes.keyboardShortcuts) {
          this.keyboardShortcuts = changes.keyboardShortcuts.newValue;
        }
        if (changes.soundDetection) {
          this.soundDetection = changes.soundDetection.newValue;
        }
      });
    } catch (error) {
      console.log('Storage API not available');
    }
  }

  initSessionTracking() {
    // Increment session count
    try {
      chrome.runtime.sendMessage({ action: 'incrementSession' });
    } catch (error) {
      console.log('Could not send session tracking message');
    }
  }

  setupKeyboardShortcuts() {
    if (!this.keyboardShortcuts) return;
    
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+A or Cmd+Shift+A to toggle
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        this.toggleWithNotification();
      }
      
      // Spacebar to pause/resume (only on video pages)
      if (event.code === 'Space' && this.isOnVideoPage()) {
        event.preventDefault();
        this.togglePause();
      }
    });
  }

  isOnVideoPage() {
    return (this.currentPlatform === 'instagram' && window.location.pathname.includes('/reels/')) ||
           (this.currentPlatform === 'youtube' && window.location.pathname.includes('/shorts/'));
  }

  toggleWithNotification() {
    this.toggle();
    this.showNotification(
      this.isEnabled ? 'Auto Scroll Enabled' : 'Auto Scroll Disabled',
      this.isEnabled ? '#4CAF50' : '#f44336'
    );
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    this.showNotification(
      this.isPaused ? 'Auto Scroll Paused' : 'Auto Scroll Resumed',
      this.isPaused ? '#FF9800' : '#4CAF50'
    );
  }

  showNotification(message, color = '#333') {
    // Remove existing notification
    const existing = document.querySelector('.auto-scroll-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'auto-scroll-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${color};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }

  listenForMessages() {
    try {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'toggleAutoScroll') {
          this.toggleWithNotification();
        }
        if (message.action === 'setDelay') {
          this.scrollDelay = message.delay;
        }
        if (message.action === 'getStats') {
          sendResponse({
            sessionScrolls: this.statistics.sessionScrolls,
            sessionTime: Date.now() - this.statistics.sessionStartTime
          });
        }
      });
    } catch (error) {
      console.log('Message listener not available');
    }
  }

  initInstagramMonitoring() {
    // Wait for Instagram to load
    const checkForReels = () => {
      // Check if we're on the reels page
      if (window.location.pathname.includes('/reels/') || 
          document.querySelector('[role="main"] video')) {
        this.startInstagramVideoMonitoring();
      } else {
        setTimeout(checkForReels, 1000);
      }
    };

    checkForReels();

    // Monitor for navigation changes (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(checkForReels, 1000);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  startInstagramVideoMonitoring() {
    // Find video elements
    const findVideos = () => {
      return document.querySelectorAll('video');
    };

    const monitorVideo = (video) => {
      if (this.observers.has(video)) return;

      const observer = {
        video: video,
        hasEnded: false
      };

      const handleVideoEnd = () => {
        if (!this.isEnabled || !this.platformSettings.instagram.enabled || 
            this.isPaused || observer.hasEnded) return;
        
        // Check scroll cooldown
        const now = Date.now();
        if (now - this.lastScrollTime < this.scrollCooldown) return;
        
        observer.hasEnded = true;
        console.log('Instagram reel ended, scrolling to next...');
        
        // Use platform-specific delay
        const delay = this.platformSettings.instagram.delay || this.scrollDelay;
        
        setTimeout(() => {
          this.scrollToNextInstagramReel();
          this.updateStatistics('instagram');
          observer.hasEnded = false;
          this.lastScrollTime = Date.now();
        }, delay);
      };

      video.addEventListener('ended', handleVideoEnd);
      
      // Also monitor for videos that loop (Instagram reels often loop)
      let playCount = 0;
      video.addEventListener('play', () => {
        playCount++;
        if (playCount > 1 && !observer.hasEnded) {
          // Video has looped, treat as "ended"
          handleVideoEnd();
        }
      });

      this.observers.set(video, observer);
    };

    // Monitor existing and new videos
    const checkForNewVideos = () => {
      const videos = findVideos();
      videos.forEach(video => {
        if (video.duration && video.duration > 0) {
          monitorVideo(video);
        }
      });
    };

    checkForNewVideos();
    setInterval(checkForNewVideos, 2000);
  }

  scrollToNextInstagramReel() {
    const scrollType = this.platformSettings.instagram.scrollType || 'smooth';
    const speed = this.getScrollSpeed();
    
    // Try different methods to scroll to next reel
    const scrollMethods = [
      () => {
        // Method 1: Smooth scroll based on settings
        if (scrollType === 'smooth') {
          window.scrollTo({
            top: window.scrollY + window.innerHeight,
            behavior: 'smooth'
          });
        } else {
          window.scrollBy(0, window.innerHeight);
        }
      },
      () => {
        // Method 2: Find and click next button
        const nextButton = document.querySelector('[aria-label="Next"]');
        if (nextButton) nextButton.click();
      },
      () => {
        // Method 3: Simulate swipe gesture on mobile
        const main = document.querySelector('[role="main"]');
        if (main) {
          if (scrollType === 'smooth') {
            main.scrollTo({
              top: main.scrollTop + window.innerHeight,
              behavior: 'smooth'
            });
          } else {
            main.scrollTop += window.innerHeight;
          }
        }
      },
      () => {
        // Method 4: Advanced scroll with momentum
        this.animatedScroll(window.innerHeight, speed);
      }
    ];

    // Try each method with staggered timing
    scrollMethods.forEach((method, index) => {
      setTimeout(method, index * 100);
    });
  }

  getScrollSpeed() {
    switch (this.scrollSpeed) {
      case 'slow': return 1000;
      case 'medium': return 500;
      case 'fast': return 200;
      default: return 500;
    }
  }

  animatedScroll(distance, duration = 500) {
    const start = window.pageYOffset;
    const startTime = performance.now();
    
    const animateScroll = (currentTime) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth animation
      const ease = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, start + (distance * ease));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };
    
    requestAnimationFrame(animateScroll);
  }

  initYouTubeMonitoring() {
    const checkForShorts = () => {
      // Check if we're on YouTube Shorts
      if (window.location.pathname.includes('/shorts/')) {
        this.startYouTubeVideoMonitoring();
      } else {
        setTimeout(checkForShorts, 1000);
      }
    };

    checkForShorts();

    // Monitor for navigation changes
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(checkForShorts, 1000);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  startYouTubeVideoMonitoring() {
    const findYouTubeVideo = () => {
      return document.querySelector('#shorts-player video') || 
             document.querySelector('video.video-stream');
    };

    const monitorYouTubeVideo = () => {
      const video = findYouTubeVideo();
      if (!video || this.observers.has(video)) return;

      const observer = {
        video: video,
        hasEnded: false,
        duration: 0
      };

      const handleVideoEnd = () => {
        if (!this.isEnabled || !this.platformSettings.youtube.enabled || 
            this.isPaused || observer.hasEnded) return;
        
        // Check scroll cooldown
        const now = Date.now();
        if (now - this.lastScrollTime < this.scrollCooldown) return;
        
        observer.hasEnded = true;
        console.log('YouTube Short ended, scrolling to next...');
        
        // Use platform-specific delay
        const delay = this.platformSettings.youtube.delay || this.scrollDelay;
        
        setTimeout(() => {
          this.scrollToNextYouTubeShort();
          this.updateStatistics('youtube');
          observer.hasEnded = false;
          this.lastScrollTime = Date.now();
        }, delay);
      };

      video.addEventListener('ended', handleVideoEnd);
      
      // Monitor for when video reaches near end (YouTube Shorts auto-loop)
      video.addEventListener('timeupdate', () => {
        if (video.duration && video.currentTime) {
          const timeLeft = video.duration - video.currentTime;
          if (timeLeft < 0.5 && timeLeft > 0 && !observer.hasEnded) {
            handleVideoEnd();
          }
        }
      });

      this.observers.set(video, observer);
    };

    monitorYouTubeVideo();
    setInterval(monitorYouTubeVideo, 2000);
  }

  scrollToNextYouTubeShort() {
    const scrollType = this.platformSettings.youtube.scrollType || 'smooth';
    const speed = this.getScrollSpeed();
    
    // Try different methods to go to next YouTube Short
    const scrollMethods = [
      () => {
        // Method 1: Press down arrow key (most reliable for YouTube Shorts)
        document.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          code: 'ArrowDown',
          keyCode: 40,
          bubbles: true
        }));
      },
      () => {
        // Method 2: Click next button if available
        const nextButton = document.querySelector('#navigation-button-down button') ||
                          document.querySelector('[aria-label="Next video"]');
        if (nextButton) nextButton.click();
      },
      () => {
        // Method 3: Scroll container
        const shortsContainer = document.querySelector('#shorts-container') ||
                               document.querySelector('[role="main"]');
        if (shortsContainer) {
          if (scrollType === 'smooth') {
            shortsContainer.scrollTo({
              top: shortsContainer.scrollTop + window.innerHeight,
              behavior: 'smooth'
            });
          } else {
            shortsContainer.scrollTop += window.innerHeight;
          }
        }
      },
      () => {
        // Method 4: Window scroll as fallback
        if (scrollType === 'smooth') {
          window.scrollTo({
            top: window.scrollY + window.innerHeight,
            behavior: 'smooth'
          });
        } else {
          window.scrollBy(0, window.innerHeight);
        }
      }
    ];

    // Try each method with staggered timing
    scrollMethods.forEach((method, index) => {
      setTimeout(method, index * 100);
    });
  }

  updateStatistics(platform) {
    this.statistics.sessionScrolls++;
    
    try {
      chrome.runtime.sendMessage({
        action: 'updateStatistics',
        platform: platform
      });
    } catch (error) {
      console.log('Could not update statistics');
    }
  }

  // Public methods for popup control
  toggle() {
    this.isEnabled = !this.isEnabled;
    chrome.storage.sync.set({ autoScrollEnabled: this.isEnabled });
    return this.isEnabled;
  }

  setDelay(delay) {
    this.scrollDelay = delay;
    chrome.storage.sync.set({ scrollDelay: delay });
  }
}

// Initialize the auto scroll agent
let autoScrollAgent;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    autoScrollAgent = new AutoScrollAgent();
  });
} else {
  autoScrollAgent = new AutoScrollAgent();
}

// Make agent available globally for popup communication
window.autoScrollAgent = autoScrollAgent;
