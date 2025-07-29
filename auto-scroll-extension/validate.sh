#!/bin/bash
echo "🔍 Auto Scroll Extension Validation"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ manifest.json not found in current directory"
    echo "💡 Make sure you're in the auto-scroll-extension folder"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

echo "📋 Checking required files:"
files=("manifest.json" "content.js" "background.js" "popup.html" "popup.js" "style.css" "icon.png")

all_present=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (missing)"
        all_present=false
    fi
done

echo ""

if [ "$all_present" = true ]; then
    echo "🎉 All required files are present!"
    echo ""
    echo "📖 Loading Instructions:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' (toggle in top right)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select this folder: $(pwd)"
    echo "5. The extension should load successfully!"
else
    echo "⚠️  Some files are missing. Please ensure all files are present."
fi

echo ""
echo "🧪 Testing manifest.json validity:"
if python3 -c "import json; json.load(open('manifest.json'))" 2>/dev/null; then
    echo "  ✅ manifest.json is valid JSON"
else
    echo "  ❌ manifest.json has JSON syntax errors"
fi

echo ""
echo "🔧 File permissions:"
ls -la *.json *.js *.html *.css *.png 2>/dev/null | while read line; do
    echo "  $line"
done
