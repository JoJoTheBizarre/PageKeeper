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

// Toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
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

// Render pages list
async function renderPages() {
  const container = document.getElementById('listContainer');
  const loading = document.getElementById('loading');
  const pageCount = document.getElementById('pageCount');

  loading.style.display = 'block';

  const pages = await Storage.getPages();
  
  loading.style.display = 'none';
  pageCount.textContent = `${pages.length} page${pages.length !== 1 ? 's' : ''} saved`;

  if (pages.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <h3>No pages saved yet</h3>
        <p>Click "Scrape Current Page" to get started</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pages.map(page => `
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
          <button class="btn-small btn-export export-pdf" data-id="${page.id}">
            📄 Export PDF
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

  // Export PDF handlers
  document.querySelectorAll('.export-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      exportAsPDF(id);
    });
  });

  // Delete handlers
  document.querySelectorAll('.delete-page').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (confirm('Delete this page?')) {
        await Storage.deletePage(id);
        showToast('Page deleted');
        renderPages();
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
  showToast('Exported as Markdown');
}

// Export as PDF
async function exportAsPDF(id) {
  const pages = await Storage.getPages();
  const page = pages.find(p => p.id === id);
  
  if (!page) return;

  // Check if jsPDF is available
  if (typeof window.jspdf === 'undefined') {
    showToast('PDF export not available');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Title
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  const titleLines = doc.splitTextToSize(page.title, maxWidth);
  doc.text(titleLines, margin, yPosition);
  yPosition += titleLines.length * 8 + 5;

  // URL
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 255);
  const urlLines = doc.splitTextToSize(page.url, maxWidth);
  doc.text(urlLines, margin, yPosition);
  yPosition += urlLines.length * 5 + 3;

  // Date
  doc.setTextColor(128, 128, 128);
  doc.text(`Scraped: ${new Date(page.timestamp).toLocaleString()}`, margin, yPosition);
  yPosition += 10;

  // Line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  const contentLines = doc.splitTextToSize(page.markdown, maxWidth);
  const lineHeight = 6;
  const pageHeight = doc.internal.pageSize.getHeight();

  contentLines.forEach(line => {
    if (yPosition + lineHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += lineHeight;
  });

  doc.save(`${sanitizeFilename(page.title)}.pdf`);
  showToast('Exported as PDF');
}

// Scrape current page
async function scrapePage() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    showToast('Cannot scrape this page');
    return;
  }

  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: scrapePageContent
    });

    if (!result || !result.result) {
      showToast('Failed to scrape page');
      return;
    }

    const page = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      ...result.result
    };

    await Storage.savePage(page);
    showToast('✓ Page scraped successfully!');
    renderPages();
  } catch (error) {
    console.error('Scrape error:', error);
    showToast('Error scraping page');
  }
}

// This function runs in the context of the web page
function scrapePageContent() {
  // Get or initialize Turndown
  let turndownService;
  if (typeof TurndownService !== 'undefined') {
    turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
  } else {
    // Fallback to simple text extraction
    turndownService = {
      turndown: (html) => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
      }
    };
  }

  // Get main content (try to get article/main content)
  let content = document.body;
  
  // Try to find main content area
  const mainContent = document.querySelector('main') ||
                     document.querySelector('article') ||
                     document.querySelector('[role="main"]') ||
                     document.querySelector('.main-content') ||
                     document.querySelector('#content');
  
  if (mainContent) {
    content = mainContent;
  }

  // Remove unwanted elements
  const clone = content.cloneNode(true);
  const unwanted = clone.querySelectorAll('script, style, nav, header, footer, iframe, .ad, .advertisement');
  unwanted.forEach(el => el.remove());

  const markdown = turndownService.turndown(clone.innerHTML);

  return {
    url: window.location.href,
    title: document.title || 'Untitled Page',
    markdown: markdown
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
    showToast('All pages cleared');
    renderPages();
  }
});

// Initialize
renderPages();
