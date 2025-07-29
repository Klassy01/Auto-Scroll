# Auto Scroll for Reels & Shorts

A powerful browser extension that automatically scrolls to the next video when Instagram Reels or YouTube Shorts finish playing. Perfect for endless scrolling without manual intervention!

## ✨ Features

### 🎯 Core Functionality
- **Smart Detection**: Automatically detects when videos end on Instagram Reels and YouTube Shorts
- **Seamless Scrolling**: Smooth transition to the next video with customizable timing
- **Cross-Platform**: Works on both Instagram and YouTube with platform-specific settings

### ⚙️ Advanced Settings
- **Customizable Delays**: Set different scroll delays for each platform (100ms - 3000ms)
- **Scroll Speed Options**: Choose between slow, medium, and fast scroll animations
- **Scroll Types**: Smooth or instant scrolling based on your preference
- **Platform Toggle**: Enable/disable for specific platforms independently

### 🎮 Controls & Shortcuts
- **Keyboard Shortcuts**: 
  - `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac) - Toggle extension on/off
  - `Space` - Pause/Resume auto-scrolling (on video pages)
- **Quick Actions**: Pause, test scroll, and instant toggle from popup
- **Smart Cooldown**: Prevents excessive scrolling with built-in cooldown periods

### 📊 Statistics & Tracking
- **Session Tracking**: Monitor scrolls in current session
- **Platform Stats**: Separate counters for Instagram and YouTube
- **Total Usage**: Track overall extension usage over time
- **Reset Option**: Clear statistics anytime

### 🔧 Enhanced Detection
- **Multiple Detection Methods**: Video end detection, loop detection, and time-based triggers
- **Sound Detection**: Experimental audio-based detection for muted videos
- **Fallback Systems**: Multiple scroll methods ensure reliability

## 🚀 Installation

### Method 1: Chrome Web Store (Recommended)
*Coming soon - Extension will be published to Chrome Web Store*

### Method 2: Manual Installation (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone <this-repository>
   cd auto-scroll-extension
   ```

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Navigate to and select the `auto-scroll-extension` folder (NOT the parent folder)
   - **Important**: Select the folder that contains `manifest.json` directly
   - The extension should now appear in your extensions list

4. **Verify Installation**
   - You should see "Auto Scroll for Reels & Shorts" in your extensions list
   - If you see errors, make sure you selected the correct folder with manifest.json

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Auto Scroll for Reels & Shorts"
   - Click the pin icon to keep it visible

### Troubleshooting Installation

If you get "Failed to load extension" or "Manifest file is missing":
1. **Check folder path**: Make sure you're selecting `/path/to/auto-scroll-extension/` (the folder containing manifest.json)
2. **Run validation**: Use the included `validate.sh` script to check all files
3. **File permissions**: Ensure all files are readable (run `chmod 644 *.json *.js *.html *.css *.png`)
4. **Try again**: Remove the extension and reload it

## 📱 Usage

### Quick Start
1. **Install and Enable**: Extension is active by default after installation
2. **Visit Supported Sites**: Go to Instagram Reels or YouTube Shorts
3. **Watch Videos**: The extension will automatically scroll to the next video when the current one ends
4. **Customize Settings**: Click the extension icon to access settings

### Supported Pages
- **Instagram**: `instagram.com/reels/*` and any page with video reels
- **YouTube**: `youtube.com/shorts/*` and YouTube Shorts feed

### Settings Overview

#### General Tab
- **Enable Auto Scroll**: Master toggle for the entire extension
- **Scroll Delay**: Global delay before scrolling (100ms - 2000ms)
- **Scroll Speed**: Animation speed (Slow, Medium, Fast)
- **Keyboard Shortcuts**: Enable/disable keyboard controls
- **Sound Detection**: Experimental audio-based video end detection

#### Instagram Tab
- **Enable for Instagram**: Platform-specific toggle
- **Instagram Delay**: Custom delay for Instagram Reels
- **Scroll Type**: Smooth or instant scrolling

#### YouTube Tab
- **Enable for YouTube**: Platform-specific toggle  
- **YouTube Delay**: Custom delay for YouTube Shorts
- **Scroll Type**: Smooth or instant scrolling

#### Statistics Tab
- **Total Auto-Scrolls**: All-time scroll count
- **This Session**: Current session scroll count
- **Instagram Reels**: Instagram-specific counter
- **YouTube Shorts**: YouTube-specific counter
- **Reset Statistics**: Clear all statistics

## ⌨️ Keyboard Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Shift+A` (Windows/Linux)<br>`Cmd+Shift+A` (Mac) | Toggle extension on/off | Any page |
| `Space` | Pause/Resume auto-scrolling | Video pages only |

## 🔧 Troubleshooting

### Extension Not Working
1. **Check Permissions**: Ensure extension has access to Instagram and YouTube
2. **Refresh Page**: Reload the page after enabling the extension
3. **Check Settings**: Verify extension is enabled in the popup
4. **Platform Settings**: Make sure the specific platform is enabled

### Videos Not Auto-Scrolling
1. **Check Delay Settings**: Increase scroll delay if videos are ending too quickly
2. **Verify Page Type**: Ensure you're on supported pages (Reels/Shorts)
3. **Disable Conflicts**: Turn off other auto-scroll extensions
4. **Check Console**: Open browser developer tools to check for errors

### Performance Issues
1. **Reduce Scroll Speed**: Use slower scroll speed settings
2. **Increase Delays**: Higher delays reduce system load
3. **Disable Sound Detection**: Turn off experimental features
4. **Reset Statistics**: Clear accumulated data

## 🛡️ Privacy & Permissions

### Required Permissions
- **activeTab**: Access current tab for video detection
- **scripting**: Inject content scripts for functionality
- **storage**: Save user preferences and statistics
- **tabs**: Manage tab-specific features

### Data Collection
- **Local Storage Only**: All data stored locally in browser
- **No External Servers**: No data sent to external services
- **Statistics Only**: Only tracks scroll counts and preferences
- **No Personal Data**: No access to personal information or browsing history

## 🔄 Updates

### Version History
- **v1.0**: Initial release with basic auto-scroll functionality
- **Enhanced Features**: Added platform-specific settings, statistics, keyboard shortcuts

### Automatic Updates
- Updates will be delivered automatically through Chrome Web Store
- Manual installations need to be updated manually

## 🆘 Support

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check this README for common solutions
- **Browser Console**: Check for error messages in developer tools

### Contributing
Contributions welcome! Please see contribution guidelines in the repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thanks to the Chrome Extension API documentation
- Inspired by user requests for hands-free social media browsing
- Built with modern web technologies for optimal performance

---

**Enjoy endless scrolling! 🎬📱**
