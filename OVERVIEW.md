# 📚 PageKeeper - Visual Overview

## What is PageKeeper?

PageKeeper is a Chrome extension that lets you save web pages and export them as Markdown or PDF files.

```
┌─────────────────────────────────────────────────┐
│  You're reading an interesting article...      │
│  https://example.com/great-article             │
│                                                 │
│  Click PageKeeper icon → Scrape!               │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  📚 PageKeeper                                  │
│  ┌────────────────────────────────────────┐    │
│  │ 📄 Scrape Current Page  │  🗑️ Clear All │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  3 pages saved                                  │
│  ═══════════════════════════════════════════   │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ Great Article About Web Dev    2h ago│       │
│  │ https://example.com/great-article   │       │
│  │                                     │       │
│  │ [Click to expand preview]          │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ How to Build a Chrome Extension     │       │
│  │ https://developer.chrome.com...     │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ Python Best Practices          1d ago│       │
│  │ https://realpython.com...           │       │
│  └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

## When You Click a Page

```
┌─────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────┐       │
│  │ ▼ Great Article About Web Dev  2h ago│      │
│  │   https://example.com/great-article │       │
│  │                                     │       │
│  │   ┌─────────────────────────────┐  │       │
│  │   │ # Introduction              │  │       │
│  │   │                             │  │       │
│  │   │ This article covers the     │  │       │
│  │   │ fundamentals of modern web  │  │       │
│  │   │ development including...    │  │       │
│  │   │                             │  │       │
│  │   │ [Scrollable preview]        │  │       │
│  │   └─────────────────────────────┘  │       │
│  │                                     │       │
│  │   📝 Export MD  📄 Export PDF  🗑️   │       │
│  └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

## Export Options

### 📝 Markdown Export

Downloads a `.md` file:

```markdown
# Great Article About Web Dev

**URL:** https://example.com/great-article
**Scraped:** 1/15/2024, 10:30:25 AM

---

# Introduction

This article covers the fundamentals of modern web
development including...

[Full content here]
```

### 📄 PDF Export

Downloads a formatted PDF with:
- Title (bold, large)
- URL (clickable, blue)
- Scrape date
- Full content (formatted)

## Use Cases

### 📖 Research
Save articles and papers for offline reading

### 📚 Documentation
Archive important documentation before it changes

### ✍️ Content Creation
Save references and inspiration for writing

### 🎓 Learning
Build a personal knowledge base

### 💼 Work
Save meeting notes, specs, and references

## Features at a Glance

| Feature | Description |
|---------|-------------|
| **One-Click Scraping** | Instant page capture |
| **Clean Conversion** | HTML → Beautiful Markdown |
| **Organized List** | Chronological with dates |
| **Search-Ready** | URLs and titles visible |
| **Export Formats** | Markdown + PDF |
| **Privacy-First** | All data local, no tracking |
| **Lightweight** | < 100KB total |
| **Free Forever** | Open source, no subscriptions |

## How It Works

```
Your Browser
    │
    ├─ You: "I want to save this page"
    │
    ▼
Chrome Extension
    │
    ├─ Scrapes HTML content
    ├─ Converts to Markdown
    ├─ Saves locally
    │
    ▼
Chrome Storage
    │
    └─ Pages stored as JSON
    
When you export:
    │
    ├─ Markdown: Creates .md file
    └─ PDF: Generates formatted PDF
```

## Technical Details

- **Built with**: Vanilla JavaScript (no frameworks)
- **Storage**: Chrome Storage API (~5MB limit)
- **Libraries**: Turndown.js + jsPDF
- **Permissions**: Only what's needed (activeTab, storage, scripting)
- **Size**: ~50KB (plus ~200KB for libraries)
- **Performance**: Instant scraping, < 1 second

## What Makes PageKeeper Different?

### ❌ Other Solutions
- Cloud-based (privacy concerns)
- Subscription fees
- Complex UI
- Bloated with features
- Require account signup

### ✅ PageKeeper
- Fully local (your data stays yours)
- 100% free
- Simple, focused UI
- Does one thing well
- Works offline
- No account needed

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Edge | ✅ Full support |
| Brave | ✅ Full support |
| Opera | ✅ Full support |
| Firefox | ❌ (uses different extension API) |

## Roadmap

### ✅ Version 1.0 (Current)
- Basic scraping
- List view
- MD/PDF export
- Local storage

### 🚧 Version 1.1 (Planned)
- Search functionality
- Tags/categories
- Better PDF styling
- Bulk export

### 💡 Version 2.0 (Future)
- Cloud sync (optional)
- Browser action on page
- Keyboard shortcuts
- Dark mode

## Perfect For

- 👨‍💻 Developers
- 📚 Researchers
- ✍️ Writers
- 🎓 Students
- 📰 Journalists
- 💼 Professionals

---

Made with ❤️ for people who love saving knowledge!
