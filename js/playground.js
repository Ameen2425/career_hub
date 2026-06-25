/**
 * CareerLaunch Hub - Coding Playground Engine
 */

const CodingPlayground = {
  // Templates Bank
  templates: {
    counter: {
      name: "Counter App",
      html: `<div class="counter-container">\n  <h2>Counter Application</h2>\n  <div id="counter-value">0</div>\n  <div class="btn-group">\n    <button id="decrement">-</button>\n    <button id="reset">Reset</button>\n    <button id="increment">+</button>\n  </div>\n</div>`,
      css: `body {\n  font-family: system-ui, -apple-system, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 80vh;\n  margin: 0;\n  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);\n  color: white;\n}\n.counter-container {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  padding: 40px;\n  border-radius: 20px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  text-align: center;\n  box-shadow: 0 12px 40px rgba(0,0,0,0.15);\n}\n#counter-value {\n  font-size: 5rem;\n  font-weight: 800;\n  margin: 20px 0;\n}\n.btn-group button {\n  background: white;\n  color: #6366f1;\n  border: none;\n  padding: 12px 24px;\n  margin: 6px;\n  border-radius: 8px;\n  font-size: 1rem;\n  font-weight: 700;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.btn-group button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px rgba(0,0,0,0.2);\n}`,
      js: `let count = 0;\nconst val = document.getElementById('counter-value');\n\ndocument.getElementById('increment').addEventListener('click', () => {\n  count++;\n  val.textContent = count;\n});\ndocument.getElementById('decrement').addEventListener('click', () => {\n  count--;\n  val.textContent = count;\n});\ndocument.getElementById('reset').addEventListener('click', () => {\n  count = 0;\n  val.textContent = count;\n});`
    },
    clock: {
      name: "Digital Clock",
      html: `<div class="clock-card">\n  <div class="clock-title">Digital Clock</div>\n  <div id="clock-display">00:00:00</div>\n  <div id="clock-date">Loading...</div>\n</div>`,
      css: `body {\n  font-family: system-ui, -apple-system, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 80vh;\n  margin: 0;\n  background: #0f172a;\n  color: white;\n}\n.clock-card {\n  background: #1e293b;\n  padding: 30px 50px;\n  border-radius: 16px;\n  border: 1px solid #334155;\n  text-align: center;\n  box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);\n}\n.clock-title {\n  font-size: 0.875rem;\n  color: #94a3b8;\n  text-transform: uppercase;\n  letter-spacing: 2px;\n  margin-bottom: 10px;\n}\n#clock-display {\n  font-size: 3.5rem;\n  font-weight: 800;\n  font-family: monospace;\n  color: #38bdf8;\n  margin-bottom: 8px;\n}\n#clock-date {\n  color: #64748b;\n  font-size: 0.95rem;\n}`,
      js: `function updateClock() {\n  const now = new Date();\n  const time = now.toTimeString().split(' ')[0];\n  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });\n  document.getElementById('clock-display').textContent = time;\n  document.getElementById('clock-date').textContent = date;\n}\n\nsetInterval(updateClock, 1000);\nupdateClock();`
    },
    card: {
      name: "Product Card",
      html: `<div class="product-card">\n  <div class="product-badge">Hot</div>\n  <div class="product-img">👟</div>\n  <h3 class="product-title">Supercharged Sneakers</h3>\n  <p class="product-desc">Extremely lightweight, performance-tuned runners designed for next-generation developer speed.</p>\n  <div class="product-footer">\n    <span class="product-price">$120.00</span>\n    <button class="buy-btn" onclick="alert('Added to cart!')">Buy Now</button>\n  </div>\n</div>`,
      css: `body {\n  font-family: system-ui, -apple-system, sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 80vh;\n  margin: 0;\n  background: #f1f5f9;\n  color: #1e293b;\n}\n.product-card {\n  background: white;\n  width: 320px;\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.05);\n  position: relative;\n  border: 1px solid #e2e8f0;\n}\n.product-badge {\n  position: absolute;\n  top: 16px;\n  left: 16px;\n  background: #ef4444;\n  color: white;\n  padding: 4px 10px;\n  border-radius: 20px;\n  font-size: 0.75rem;\n  font-weight: 700;\n  text-transform: uppercase;\n}\n.product-img {\n  font-size: 5rem;\n  text-align: center;\n  margin: 20px 0;\n}\n.product-title {\n  font-size: 1.25rem;\n  margin-bottom: 8px;\n  font-weight: 700;\n}\n.product-desc {\n  font-size: 0.875rem;\n  color: #64748b;\n  margin-bottom: 20px;\n  line-height: 1.5;\n}\n.product-footer {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.product-price {\n  font-size: 1.5rem;\n  font-weight: 800;\n  color: #0f172a;\n}\n.buy-btn {\n  background: #6366f1;\n  color: white;\n  border: none;\n  padding: 10px 18px;\n  border-radius: 8px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n.buy-btn:hover {\n  background: #4f46e5;\n}`,
      js: `// Interactive card animations can be added here\nconsole.log('Product card loaded successfully');`
    }
  },

  activeTab: 'html',

  init() {
    this.bindEvents();
    this.loadSavedDrafts();
    this.runCode();
  },

  bindEvents() {
    // Editor Tabs
    document.querySelectorAll('.editor-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Run Button
    document.getElementById('run-btn')?.addEventListener('click', () => {
      this.runCode();
    });

    // Clear Button
    document.getElementById('clear-btn')?.addEventListener('click', () => {
      this.clearEditors();
    });

    // Template Dropdown
    document.getElementById('template-select')?.addEventListener('change', (e) => {
      const template = e.target.value;
      if (template) {
        this.loadTemplate(template);
      }
    });

    // Copy Button
    document.getElementById('copy-btn')?.addEventListener('click', () => {
      this.copyCurrentCode();
    });

    // Download Button
    document.getElementById('download-btn')?.addEventListener('click', () => {
      this.downloadCode();
    });

    // Auto-save on input
    ['html-code', 'css-code', 'js-code'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        this.saveDrafts();
      });
    });
  },

  switchTab(tab) {
    this.activeTab = tab;
    document.querySelectorAll('.editor-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    document.querySelectorAll('.editor-textarea-container').forEach(cont => {
      cont.classList.toggle('active', cont.getAttribute('id') === `${tab}-container`);
    });
  },

  loadTemplate(templateKey) {
    const tmpl = this.templates[templateKey];
    if (!tmpl) return;

    document.getElementById('html-code').value = tmpl.html;
    document.getElementById('css-code').value = tmpl.css;
    document.getElementById('js-code').value = tmpl.js;

    this.saveDrafts();
    this.runCode();
    App.showToast(`Loaded ${tmpl.name} template!`, 'success');
  },

  loadSavedDrafts() {
    const drafts = App.getPlaygroundDrafts();
    
    // Fallback default load Counter if storage empty
    if (!drafts.html && !drafts.css && !drafts.js) {
      this.loadTemplate('counter');
    } else {
      document.getElementById('html-code').value = drafts.html || '';
      document.getElementById('css-code').value = drafts.css || '';
      document.getElementById('js-code').value = drafts.js || '';
    }
  },

  saveDrafts() {
    const html = document.getElementById('html-code').value;
    const css = document.getElementById('css-code').value;
    const js = document.getElementById('js-code').value;

    App.savePlaygroundDrafts({ html, css, js });
  },

  runCode() {
    const html = document.getElementById('html-code').value;
    const css = document.getElementById('css-code').value;
    const js = document.getElementById('js-code').value;

    const iframe = document.getElementById('preview-iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          // Catch errors and log to console if needed
          window.onerror = function(msg, url, line) {
            console.error("Playground Error: " + msg + " on line " + line);
            return false;
          };
          ${js}
        <\/script>
      </body>
      </html>
    `);
    iframeDoc.close();

    // Turn green active preview dot
    const dot = document.getElementById('preview-status-dot');
    if (dot) {
      dot.className = 'preview-dot active';
      setTimeout(() => {
        dot.className = 'preview-dot';
      }, 1000);
    }

    App.trackPerformanceEvent('codeRun');
  },

  clearEditors() {
    if (confirm('Are you sure you want to clear all code? This will delete your current drafts.')) {
      document.getElementById('html-code').value = '';
      document.getElementById('css-code').value = '';
      document.getElementById('js-code').value = '';
      this.saveDrafts();
      this.runCode();
      App.showToast('Editors cleared!', 'info');
    }
  },

  copyCurrentCode() {
    const textarea = document.getElementById(`${this.activeTab}-code`);
    if (!textarea) return;

    const code = textarea.value;
    if (!code) {
      App.showToast('No code to copy', 'warning');
      return;
    }

    App.copyToClipboard(code);
  },

  downloadCode() {
    const html = document.getElementById('html-code').value;
    const css = document.getElementById('css-code').value;
    const js = document.getElementById('js-code').value;

    const fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareerLaunch Hub Playground Export</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${js}
  </script>
</body>
</html>`;

    const blob = new Blob([fileContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'playground-export.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    App.showToast('Downloaded export.html!', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => CodingPlayground.init());
