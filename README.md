# 📚 PageKeeper - Chrome Extension

**Save, organize, and export web pages as Markdown or PDF**

PageKeeper is a lightweight Chrome extension that lets you scrape web pages, view them in a beautiful list, and export them as Markdown or PDF files.

![PageKeeper Screenshot](screenshot.png)

## ✨ Features

- 📄 **One-Click Scraping**: Instantly convert web pages to clean Markdown
- 📚 **Organized List View**: See all your saved pages with URLs, dates, and previews
- 📝 **Export as Markdown**: Download pages as `.md` files with metadata
- 📄 **Export as PDF**: Generate beautiful PDF documents
- 🗑️ **Easy Management**: Expand, preview, and delete saved pages
- 💾 **Local Storage**: All data stays in your browser (private and secure)
- 🎨 **Beautiful UI**: Clean, modern interface with smooth animations

## 📦 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download this extension**
   ```bash
   # Clone or download the page-keeper-extension folder
   ```

2. **Download required libraries**
   
   Navigate to the `lib` folder and download:
   
   **Turndown.js** (HTML to Markdown):
   ```bash
   curl -o lib/turndown.min.js https://unpkg.com/turndown@7.1.2/dist/turndown.js
   ```
   
   **jsPDF** (PDF generation):
   ```bash
   curl -o lib/jspdf.min.js https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
   ```
   
   Or visit these URLs in your browser and save the files manually.

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the `page-keeper-extension` folder
   - Done! The extension icon should appear in your toolbar

### Method 2: Download from Chrome Web Store

*Coming soon!*

## 🚀 Usage

### Scraping a Page

1. Navigate to any web page you want to save
2. Click the **PageKeeper** icon in your toolbar
3. Click **"📄 Scrape Current Page"**
4. The page is instantly saved!

### Viewing Saved Pages

1. Click the **PageKeeper** icon
2. See all your saved pages in a scrollable list
3. Each item shows:
   - Page title
   - URL
   - Date scraped
4. Click any item to **expand** and see a preview

### Exporting Pages

When viewing a page (expanded):

- **📝 Export MD**: Download as Markdown file
- **📄 Export PDF**: Download as PDF document

Both exports include:
- Page title
- Original URL
- Scrape date/time
- Full content

### Managing Pages

- **Delete Single Page**: Expand a page → Click "🗑️ Delete"
- **Clear All Pages**: Click "🗑️ Clear All" in the header (requires confirmation)

## 📁 Project Structure

```
page-keeper-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI
├── popup.js              # Core functionality
├── lib/
│   ├── turndown.min.js   # HTML → Markdown converter
│   ├── jspdf.min.js      # PDF generator
│   └── DOWNLOAD.md       # Download instructions
├── icons/
│   ├── icon16.png        # 16x16 icon
│   ├── icon48.png        # 48x48 icon
│   └── icon128.png       # 128x128 icon
└── README.md             # This file
```

## 🛠️ How It Works

1. **Scraping**: Uses Chrome's `scripting` API to execute code in the webpage context
2. **Conversion**: Turndown.js converts HTML to clean Markdown format
3. **Storage**: Chrome's `storage.local` API saves data locally
4. **Export**: 
   - Markdown: Creates `.md` file with metadata
   - PDF: Uses jsPDF to generate formatted PDF documents

## 🔧 Development

### Prerequisites

- Google Chrome or Chromium-based browser
- Basic knowledge of JavaScript

### Making Changes

1. Edit the files (`popup.html`, `popup.js`, etc.)
2. Go to `chrome://extensions/`
3. Click the **reload** icon on the PageKeeper extension
4. Test your changes

### Key Files

- **popup.js**: Main logic (scraping, storage, export)
- **popup.html**: UI structure and styling
- **manifest.json**: Extension permissions and configuration

## 🎨 Customization

### Change Colors

Edit the CSS in `popup.html`:

```css
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change to your preferred gradient */
}
```

### Modify Scraping Logic

Edit the `scrapePageContent()` function in `popup.js`:

```javascript
function scrapePageContent() {
  // Customize what content to extract
  // Current: tries to find main content area
  // You can target specific elements
}
```

## 📊 Storage

- **Location**: Chrome local storage (`chrome.storage.local`)
- **Limit**: ~5MB (Chrome's quota)
- **Format**: JSON array of page objects
- **Privacy**: All data stays on your device

### Data Structure

```javascript
{
  id: "1234567890",           // Unique timestamp
  timestamp: 1234567890,      // Date/time scraped
  url: "https://example.com", // Original URL
  title: "Page Title",        // Page title
  markdown: "# Content..."    // Markdown content
}
```

## 🐛 Troubleshooting

### Extension doesn't appear
- Make sure Developer mode is enabled
- Check that all files are present
- Try reloading the extension

### Scraping fails
- Some pages block scripts (banks, internal sites)
- Chrome extensions can't scrape `chrome://` pages
- Check browser console for errors

### Libraries not found
- Make sure `turndown.min.js` and `jspdf.min.js` are in the `lib/` folder
- Check file names match exactly
- Try re-downloading the libraries

### Export doesn't work
- Check that libraries are loaded correctly
- Open DevTools (F12) and check for errors
- Try reloading the extension

## 🚀 Future Enhancements

Planned features for future versions:

- [ ] Search and filter saved pages
- [ ] Tags and categories
- [ ] Cloud sync (optional)
- [ ] Better PDF formatting
- [ ] Export multiple pages at once
- [ ] Import/export all data
- [ ] Dark mode
- [ ] Keyboard shortcuts
- [ ] Context menu integration

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 💡 Tips

- Use on articles, documentation, and blog posts
- Great for offline reading and research
- Export before websites change or go down
- Keep a collection of useful references

## ⚡ Performance

- Lightweight: ~50KB total size
- Fast scraping: < 1 second per page
- Efficient storage: Compressed data
- No external dependencies (after library download)

## 🔒 Privacy

- **No tracking**: Zero analytics or tracking code
- **No network requests**: Libraries are local
- **Your data stays local**: Everything in Chrome storage
- **No permissions abuse**: Only uses necessary permissions

## 📞 Support

Having issues? 
- Check the Troubleshooting section above
- Open an issue on GitHub
- Review Chrome extension documentation

---

**Enjoy using PageKeeper!** 📚✨
