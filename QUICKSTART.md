# 🚀 Quick Start Guide

Get PageKeeper up and running in 5 minutes!

## Step 1: Download Libraries (1 minute)

### Option A: Automatic (if you have curl)
```bash
cd page-keeper-extension
./setup.sh
```

### Option B: Manual Download

1. **Download Turndown.js**
   - Visit: https://unpkg.com/turndown@7.1.2/dist/turndown.js
   - Save as: `lib/turndown.min.js`

2. **Download jsPDF**
   - Visit: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
   - Save as: `lib/jspdf.min.js`

## Step 2: Install Extension (2 minutes)

1. Open Chrome
2. Go to `chrome://extensions/`
3. Turn ON **Developer mode** (top-right toggle)
4. Click **Load unpacked**
5. Select the `page-keeper-extension` folder
6. Done! 🎉

You should see the PageKeeper icon in your toolbar.

## Step 3: Use It! (2 minutes)

### Try it now:

1. Go to any website (try Wikipedia or a news article)
2. Click the **PageKeeper** icon
3. Click **"📄 Scrape Current Page"**
4. See the page appear in your list!
5. Click the page to expand it
6. Try **"📝 Export MD"** or **"📄 Export PDF"**

## Common First-Time Issues

### "Extension is not loading"
- Make sure all files are in the folder
- Check that you selected the right folder
- Look for errors in `chrome://extensions/`

### "Scrape button doesn't work"
- Can't scrape `chrome://` pages (Chrome restriction)
- Some banking/secure sites block scripts
- Try on a news article or blog post first

### "Export buttons are gray"
- Libraries might not be loaded
- Check that files exist in `lib/` folder
- Reload the extension

## What to Do Next

✅ **Test it out**: Scrape 3-5 different pages  
✅ **Export**: Try both MD and PDF exports  
✅ **Organize**: Check the date sorting  
✅ **Clean up**: Try deleting a page  

## Tips for Best Results

- **Works best on**: Articles, blogs, documentation
- **May not work well on**: Social media, web apps, Gmail
- **Perfect for**: Research, offline reading, archiving

## Need Help?

Check the main README.md for:
- Full feature list
- Troubleshooting
- Customization options
- Development guide

---

**You're all set!** Start saving pages! 📚✨
