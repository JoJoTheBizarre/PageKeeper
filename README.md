<div align="center">
  <img src="project_logo.png" width="200">
</div>

# PageKeeper

A Chrome extension that saves web pages as Markdown or PDF. All data stays in your browser—nothing is sent to external servers.

## Quick Setup

1. **Download** or clone this repository
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable** "Developer mode" (toggle in top right)
4. **Click** "Load unpacked"
5. **Select** the `PageKeeper` folder
6. **Pin** the extension from the toolbar puzzle piece menu

## How It Works

- **Scrape**: Click the PageKeeper icon on any webpage, then "Scrape Current Page"
- **View**: All saved pages appear in the popup with dates and previews
- **Export**: Expand any page to export as Markdown (`.md`) or PDF
- **Delete**: Remove individual pages or clear all with one click

## Where Data Is Saved

Pages are stored locally using Chrome's `storage.local` API (up to 10 MB per extension). This means:

- Your content never leaves your computer
- No cloud sync or external servers involved
- Data persists across browser restarts
- You can clear it anytime from the extension

## Privacy

PageKeeper is completely private:
- No tracking or analytics
- No data collection
- No network requests for your content
- All processing happens locally