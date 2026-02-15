// Storage helper
const Storage = {
  async getPages() {
    const result = await chrome.storage.local.get(['pages']);
    return result.pages || [];
  },

  async savePage(page) {
    const pages = await this.getPages();
    pages.unshift(page); // Add to beginning
    await chrome.storage.local.set({ pages });
    return pages;
  },

  async deletePage(id) {
    let pages = await this.getPages();
    pages = pages.filter(p => p.id !== id);
    await chrome.storage.local.set({ pages });
    return pages;
  },

  async clearAll() {
    await chrome.storage.local.set({ pages: [] });
    return [];
  }
};


// Enhanced toast notification with types
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast'; // Reset classes
  toast.classList.add(type);
  toast.classList.add('show');

  // Auto-hide after 3 seconds for success/info, 5 seconds for errors/warnings
  const duration = type === 'error' || type === 'warning' ? 5000 : 3000;

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Search helper
const Search = {
  filterPages(pages, query) {
    if (!query || query.trim() === '') return pages;

    const searchTerm = query.toLowerCase().trim();
    return pages.filter(page => {
      // Search in title, URL, and markdown content
      return (
        (page.title && page.title.toLowerCase().includes(searchTerm)) ||
        (page.url && page.url.toLowerCase().includes(searchTerm)) ||
        (page.markdown && page.markdown.toLowerCase().includes(searchTerm))
      );
    });
  }
};

// Storage size helper
const StorageSize = {
  async getUsage() {
    const pages = await Storage.getPages();
    const json = JSON.stringify(pages);
    const bytes = new TextEncoder().encode(json).length; // Accurate byte count
    const maxBytes = 10 * 1024 * 1024; // 10 MB
    return {
      used: bytes,
      max: maxBytes,
      percentage: Math.min(100, (bytes / maxBytes) * 100)
    };
  },

  formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  },

  async updateBar() {
    const usage = await this.getUsage();
    const fill = document.querySelector('.storage-fill');
    const text = document.querySelector('.storage-text');
    if (!fill || !text) return;

    fill.style.width = usage.percentage + '%';
    text.textContent = this.formatBytes(usage.used) + ' / ' + this.formatBytes(usage.max);
  }
};

// Search state
let currentSearchQuery = '';

// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  if (!searchInput || !searchClear) return;

  // Load saved search query
  chrome.storage.local.get(['searchQuery'], (result) => {
    if (result.searchQuery) {
      currentSearchQuery = result.searchQuery;
      searchInput.value = currentSearchQuery;
      if (currentSearchQuery) {
        searchClear.classList.add('visible');
      }
    }
  });

  // Search input event
  searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();

    // Show/hide clear button
    if (currentSearchQuery) {
      searchClear.classList.add('visible');
    } else {
      searchClear.classList.remove('visible');
    }

    // Save search query
    chrome.storage.local.set({ searchQuery: currentSearchQuery });

    // Debounce the search to avoid too many renders
    clearTimeout(searchInput.debounceTimer);
    searchInput.debounceTimer = setTimeout(() => {
      renderPages(currentSearchQuery);
    }, 300);
  });

  // Clear search button
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    currentSearchQuery = '';
    searchClear.classList.remove('visible');
    chrome.storage.local.set({ searchQuery: '' });
    renderPages('');
  });

  // Focus search on Ctrl+F
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// Render pages list with optional search filtering
async function renderPages(searchQuery = '') {
  const container = document.getElementById('listContainer');
  const loading = document.getElementById('loading');
  const pageCount = document.getElementById('pageCount');

  loading.style.display = 'block';

  const allPages = await Storage.getPages();
  const filteredPages = Search.filterPages(allPages, searchQuery);

  loading.style.display = 'none';
  await StorageSize.updateBar();

  // Update page count with filtering info
  if (searchQuery && filteredPages.length !== allPages.length) {
    pageCount.textContent = `${filteredPages.length} of ${allPages.length} pages (filtered)`;
  } else {
    pageCount.textContent = `${allPages.length} page${allPages.length !== 1 ? 's' : ''} saved`;
  }

  if (filteredPages.length === 0) {
    if (allPages.length === 0) {
      // No pages at all
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3>No pages saved yet</h3>
          <p>Click "Scrape Current Page" to get started</p>
        </div>
      `;
    } else {
      // Pages exist but none match search
      container.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9.172 16.242L12 13.414l2.828 2.828 1.414-1.414L13.414 12l2.828-2.828-1.414-1.414L12 10.586 9.172 7.758 7.758 9.172 10.586 12l-2.828 2.828zM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
          </svg>
          <h3>No pages match your search</h3>
          <p>Try a different search term or clear the search</p>
        </div>
      `;
    }
    return;
  }

  container.innerHTML = filteredPages.map(page => `
    <div class="page-item" data-id="${page.id}">
      <div class="page-header">
        <div class="page-info">
          <div class="page-title" title="${escapeHtml(page.title)}">${escapeHtml(page.title)}</div>
          <div class="page-url" title="${escapeHtml(page.url)}">${escapeHtml(page.url)}</div>
        </div>
        <div class="page-date">${formatDate(page.timestamp)}</div>
      </div>

      <div class="page-content">
        <div class="page-preview">${escapeHtml(truncateText(page.markdown, 500))}</div>
        <div class="export-buttons">
          <button class="btn-small btn-export export-md" data-id="${page.id}">
            📝 Export MD
          </button>
          <button class="btn-small btn-copy copy-page" data-id="${page.id}">
            📋 Copy
          </button>
          <button class="btn-small btn-delete delete-page" data-id="${page.id}">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Add click handlers
  document.querySelectorAll('.page-item').forEach(item => {
    const header = item.querySelector('.page-header');
    header.addEventListener('click', () => {
      item.classList.toggle('expanded');
    });
  });

  // Export MD handlers
  document.querySelectorAll('.export-md').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      exportAsMarkdown(id);
    });
  });

  // Copy handlers
  document.querySelectorAll('.copy-page').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      await copyToClipboard(id);
    });
  });

  // Delete handlers
  document.querySelectorAll('.delete-page').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (confirm('Delete this page?')) {
        await Storage.deletePage(id);
        await StorageSize.updateBar();
        showToast('Page deleted', 'success');
        renderPages(currentSearchQuery);
      }
    });
  });
}

// Export as Markdown
async function exportAsMarkdown(id) {
  const pages = await Storage.getPages();
  const page = pages.find(p => p.id === id);
  
  if (!page) return;

  const content = `# ${page.title}

**URL:** ${page.url}  
**Scraped:** ${new Date(page.timestamp).toLocaleString()}

---

${page.markdown}
`;

  downloadFile(content, `${sanitizeFilename(page.title)}.md`, 'text/markdown');
  showToast('Exported as Markdown', 'success');
}

// Copy to clipboard
async function copyToClipboard(id) {
  const pages = await Storage.getPages();
  const page = pages.find(p => p.id === id);

  if (!page) return;

  const content = '# ' + page.title + '\n\n**URL:** ' + page.url + '  \n**Scraped:** ' + new Date(page.timestamp).toLocaleString() + '\n\n---\n\n' + page.markdown;

  try {
    await navigator.clipboard.writeText(content);
    showToast('Copied to clipboard', 'success');
  } catch (error) {
    console.error('Copy failed:', error);
    showToast('Copy failed', 'error');
  }
}

// Scrape current page
async function scrapePage() {
  const scrapeBtn = document.getElementById('scrapeBtn');
  const listContainer = document.getElementById('listContainer');

  // Set loading state
  scrapeBtn.disabled = true;
  scrapeBtn.classList.add('btn-loading');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
      showToast('Cannot scrape this page', 'error');
      return;
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapePageContent
    });

    if (!result || !result.result) {
      showToast('Failed to scrape page', 'error');
      return;
    }

    // Convert HTML to Markdown using Turndown
    let markdown = '';
    try {
      const turndownService = new TurndownService();
      markdown = turndownService.turndown(result.result.html);
    } catch (error) {
      console.error('Turndown conversion error:', error);
      // Fallback to empty markdown
      markdown = '[Conversion failed]';
    }

    const page = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      url: result.result.url,
      title: result.result.title,
      markdown: markdown.trim()
    };

    await Storage.savePage(page);
    await StorageSize.updateBar();
    showToast('Page scraped successfully!', 'success');

    // Refresh list and scroll to top to show new page
    await renderPages(currentSearchQuery);
    listContainer.scrollTop = 0;

    // Highlight the newly added page
    const newPageElement = listContainer.querySelector(`[data-id="${page.id}"]`);
    if (newPageElement) {
      newPageElement.classList.add('highlighted');
      // Remove highlight after animation completes
      setTimeout(() => {
        newPageElement.classList.remove('highlighted');
      }, 2000);
    }
  } catch (error) {
    console.error('Scrape error:', error);
    showToast('Error scraping page', 'error');
  } finally {
    // Restore button state
    scrapeBtn.disabled = false;
    scrapeBtn.classList.remove('btn-loading');
  }
}

// This function runs in the context of the web page
function scrapePageContent() {

  // Get main content (try to get article/main content)
  let content = document.querySelector('main') ||
                document.querySelector('article') ||
                document.querySelector('[role="main"]') ||
                document.querySelector('.main-content') ||
                document.querySelector('#content') ||
                document.body;
  
  // Remove unwanted elements
  const clone = content.cloneNode(true);
  const unwanted = clone.querySelectorAll('script, style, nav, header, footer, iframe, .ad, .advertisement, .sidebar, .menu, .navigation');
  unwanted.forEach(el => el.remove());

  const html = clone.innerHTML;

  return {
    url: window.location.href,
    title: document.title || 'Untitled Page',
    html: html
  };
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 100);
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Event listeners
document.getElementById('scrapeBtn').addEventListener('click', scrapePage);

document.getElementById('clearAllBtn').addEventListener('click', async () => {
  if (confirm('Delete all saved pages?')) {
    await Storage.clearAll();
    await StorageSize.updateBar();
    showToast('All pages cleared', 'success');
    renderPages(currentSearchQuery);
  }
});

document.getElementById('resizeBtn').addEventListener('click', () => {
  document.body.classList.toggle('window-large');
  const isLarge = document.body.classList.contains('window-large');
  showToast(`Window ${isLarge ? 'enlarged' : 'restored'}`, 'info');
});

// Initialize search and render pages
initSearch();
renderPages(currentSearchQuery);