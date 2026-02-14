#!/bin/bash

echo "📚 PageKeeper - Setup Script"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Please run this script from the page-keeper-extension directory"
    exit 1
fi

# Create lib directory if it doesn't exist
mkdir -p lib

echo "📦 Downloading required libraries..."
echo ""

# Download Turndown.js
echo "1️⃣  Downloading Turndown.js (HTML to Markdown)..."
if command -v curl &> /dev/null; then
    curl -sL https://unpkg.com/turndown@7.1.2/dist/turndown.js -o lib/turndown.min.js
    if [ $? -eq 0 ]; then
        echo "   ✓ Turndown.js downloaded successfully"
    else
        echo "   ❌ Failed to download Turndown.js"
        echo "   Manual download: https://unpkg.com/turndown@7.1.2/dist/turndown.js"
    fi
else
    echo "   ⚠️  curl not found. Please download manually:"
    echo "   URL: https://unpkg.com/turndown@7.1.2/dist/turndown.js"
    echo "   Save as: lib/turndown.min.js"
fi

echo ""

# Download jsPDF
echo "2️⃣  Downloading jsPDF (PDF generation)..."
if command -v curl &> /dev/null; then
    curl -sL https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js -o lib/jspdf.min.js
    if [ $? -eq 0 ]; then
        echo "   ✓ jsPDF downloaded successfully"
    else
        echo "   ❌ Failed to download jsPDF"
        echo "   Manual download: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    fi
else
    echo "   ⚠️  curl not found. Please download manually:"
    echo "   URL: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    echo "   Save as: lib/jspdf.min.js"
fi

echo ""
echo "=============================="

# Check if files exist
if [ -f "lib/turndown.min.js" ] && [ -f "lib/jspdf.min.js" ]; then
    echo "✅ Setup complete! All libraries are ready."
    echo ""
    echo "Next steps:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' (toggle in top right)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select this folder (page-keeper-extension)"
    echo "5. Start using PageKeeper! 📚"
else
    echo "⚠️  Some libraries are missing. Please download them manually."
    echo "See lib/DOWNLOAD.md for instructions."
fi

echo ""
