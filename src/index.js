import locales from './locales.json';

/**
 * AISummarizeWidget
 * Handles DOM extraction, JSON-LD parsing, i18n, and deep-linking routing.
 * Features: Multi-Type Support (Fixed Modal vs Inline Popover), Dark Theme Popover.
 */
class AISummarizeWidget {
  constructor(options = {}) {
    // Initialize configuration with defaults
    this.options = {
      type: options.type || 'fixed', // 'fixed' or 'inline'
      target: options.target || null, // CSS selector for 'inline'
      buttonColor: options.buttonColor || '#4f46e5',
      lang: (options.lang || document.documentElement.lang || navigator.language || 'en').substring(0, 2).toLowerCase(),
      redirectDelay: 1200,
      ...options
    };
    
    // Define LLM provider root domains
    this.providers = {
      chatgpt: "https://chatgpt.com/",
      claude: "https://claude.ai/new",
      gemini: "https://gemini.google.com/app",
      perplexity: "https://perplexity.ai/"
    };

    // Determine text direction (RTL/LTR)
    this.rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    this.isRTL = this.rtlLanguages.includes(this.options.lang);

    this.initTranslations();
    this.init();
  }

  // Load language dictionary from imported JSON
  initTranslations() {
    this.t = locales[this.options.lang] || locales['en'];
  }

  init() {
    this.injectStyles();
    this.createDom();
    this.attachGlobalEvents();
  }

  // Handle global events (ESC key & Resize)
  attachGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllOverlays();
    });

    // Reposition popover on window resize if active
    window.addEventListener('resize', () => {
      const popover = document.getElementById('aiswPopover');
      if (popover && popover.classList.contains('active') && this.inlineBtn) {
        this.positionPopover();
      }
    });
  }

  closeAllOverlays() {
    const modal = document.getElementById('aiswModal');
    const popover = document.getElementById('aiswPopover');
    if (modal) modal.classList.remove('active');
    if (popover) popover.classList.remove('active');
  }

  // Extract metadata via hybrid fallback approach
  extractMetadata() {
    let meta = {
      title: document.title || "", author: "", date: "", 
      publisher: window.location.hostname.replace(/^www\./, ''), url: window.location.href
    };

    const getMeta = (q) => document.querySelector(`meta[name="${q}"], meta[property="${q}"]`)?.content;
    
    meta.title = getMeta('og:title') || getMeta('twitter:title') || meta.title;
    meta.author = getMeta('author') || getMeta('article:author') || getMeta('twitter:creator') || "";
    meta.date = getMeta('article:published_time') || getMeta('date') || getMeta('pubdate') || "";
    meta.publisher = getMeta('og:site_name') || meta.publisher;

    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (let script of scripts) {
      try {
        const data = JSON.parse(script.innerText);
        const items = data['@graph'] ? data['@graph'] : (Array.isArray(data) ? data : [data]);
        
        for (let item of items) {
          const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
          if (types.some(t => ['Article', 'NewsArticle', 'BlogPosting'].includes(t))) {
            if (item.headline) meta.title = item.headline;
            if (item.datePublished) meta.date = item.datePublished;
            if (item.author) {
              if (Array.isArray(item.author)) meta.author = item.author[0].name || meta.author;
              else if (typeof item.author === 'string') meta.author = item.author;
              else meta.author = item.author.name || meta.author;
            }
            if (item.publisher && item.publisher.name) meta.publisher = item.publisher.name;
            break; 
          }
        }
      } catch (e) {}
    }

    meta.author = meta.author || this.t.unknown;
    try { 
      if (meta.date) meta.date = new Date(meta.date).toLocaleDateString(this.options.lang); 
      else meta.date = this.t.unknown; 
    } catch(e) { meta.date = this.t.unknown; }

    return meta;
  }

  // Strict Content Extraction with DOM wrapping
  extractContent() {
    const junkSelectors = 'nav, footer, aside, script, style, iframe, .ads, .advertisement, .social-share, .related, .sidebar, .menu, .comments, [class*="ad-"], [id*="ad-"], [class*="widget"]';
    let target = document.querySelector('article, .post-content, .entry-content, .article-body, #article-content');
    let isFallback = false;

    if (!target) {
      const containers = document.querySelectorAll('main, div, section');
      let maxScore = 0;
      containers.forEach(el => {
        if (el.matches(junkSelectors)) return;
        const score = (el.querySelectorAll('p').length * 100) + el.innerText.trim().length - (el.querySelectorAll('a').length * 50);
        if (score > maxScore && el.innerText.trim().length > 150) { maxScore = score; target = el; }
      });
    }

    if (!target) { target = document.body; isFallback = true; }

    const wrapper = document.createElement('div');
    wrapper.appendChild(target.cloneNode(true));

    if (isFallback) {
      wrapper.querySelectorAll('header, #header, .site-header').forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    }

    wrapper.querySelectorAll(junkSelectors).forEach(el => {
      if (el.parentNode) el.parentNode.removeChild(el);
    });
    
    const tags = wrapper.querySelectorAll('p, h1, h2, h3, h4, h5, li');
    let text = "";
    if (tags.length > 0) {
      tags.forEach(t => {
        const inner = (t.innerText || t.textContent).trim();
        if (inner.length > 0) text += inner + "\n\n";
      });
    } else {
      text = (wrapper.innerText || wrapper.textContent).trim();
    }
    return text.replace(/\n{3,}/g, '\n\n').trim();
  }

  // Inject encapsulated CSS 
  injectStyles() {
    if (document.getElementById('ai-sum-styles')) return;
    
    const css = `
      /* TYPE 1: Fixed Floating Button & Modal (Light Theme) */
      .aisw-fab { position: fixed; bottom: 30px; right: 30px; width: 60px; height: 60px; border-radius: 50%; background: ${this.options.buttonColor}; color: white; border: none; cursor: pointer; z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-size: 26px; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
      .aisw-fab:hover { transform: scale(1.1); }
      .aisw-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 100000; align-items: center; justify-content: center; animation: aiswFadeIn 0.2s ease-out; }
      .aisw-modal.active { display: flex; }
      .aisw-card { background: white; padding: 32px; border-radius: 20px; width: 90%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); font-family: ui-sans-serif, system-ui, sans-serif; transform: scale(0.95); opacity: 0; transition: all 0.2s ease-out; }
      .aisw-modal.active .aisw-card { transform: scale(1); opacity: 1; }
      .aisw-card[dir="rtl"] { text-align: right; }
      .aisw-card[dir="ltr"] { text-align: left; }
      .aisw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
      .aisw-btn { padding: 14px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; cursor: pointer; transition: 0.2s; font-weight: 600; font-size: 15px; color: #1f2937; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      .aisw-btn:hover { background: #f9fafb; border-color: #d1d5db; transform: translateY(-1px); }
      .aisw-footer { display: flex; justify-content: flex-end; margin-top: 24px; }
      .aisw-secondary-btn { padding: 10px 24px; border: 1px solid #e5e7eb; border-radius: 10px; background: #fff; cursor: pointer; transition: 0.2s; font-weight: 500; font-size: 14px; color: #4b5563; }
      .aisw-secondary-btn:hover { background: #f3f4f6; border-color: #d1d5db; color: #1f2937; }

      /* TYPE 2: Inline Button & Popover (Dark Theme from Reference) */
      .aisw-inline-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 8px; background: ${this.options.buttonColor}; color: white; border: none; cursor: pointer; font-family: ui-sans-serif, system-ui, sans-serif; font-weight: 600; font-size: 14px; transition: opacity 0.2s; }
      .aisw-inline-btn:hover { opacity: 0.9; }
      
      .aisw-popover { display: none; position: absolute; z-index: 100000; background: #09090b; border: 1px solid #27272a; border-radius: 12px; padding: 16px; min-width: 220px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); font-family: ui-sans-serif, system-ui, sans-serif; color: #fafafa; opacity: 0; transform: translateY(10px); transition: all 0.2s ease; }
      .aisw-popover.active { display: block; opacity: 1; transform: translateY(0); }
      .aisw-popover-header { margin-bottom: 12px; }
      .aisw-popover-title { margin: 0; font-size: 16px; font-weight: 600; }
      .aisw-popover-grid { display: flex; flex-direction: column; gap: 8px; }
      .aisw-popover-btn { background: #09090b; border: 1px solid #27272a; color: #fafafa; border-radius: 6px; padding: 10px 12px; cursor: pointer; font-weight: 500; font-size: 14px; transition: background 0.2s; }
      .aisw-popover-btn:hover { background: #27272a; }
      .aisw-popover[dir="rtl"] { text-align: right; }
      .aisw-popover[dir="ltr"] { text-align: left; }

      /* Common Toast Notification */
      .aisw-toast { position: fixed; top: -100px; left: 50%; transform: translateX(-50%); background: #111827; color: #fff; padding: 16px 32px; border-radius: 50px; z-index: 100001; transition: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); box-shadow: 0 20px 40px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 12px; font-weight: 600; font-size: 15px; overflow: hidden; }
      .aisw-toast.show { top: 40px; }
      .aisw-bar { position: absolute; bottom: 0; left: 0; height: 3px; background: #10b981; transition: width 1.2s linear; width: 0%; }
      .aisw-toast[dir="rtl"] .aisw-bar { right: 0; left: auto; }

      @keyframes aiswFadeIn { from { opacity: 0; } to { opacity: 1; } }
    `;
    const style = document.createElement("style");
    style.id = "ai-sum-styles";
    style.innerText = css;
    document.head.appendChild(style);
  }

  createDom() {
    this.root = document.createElement('div');
    this.root.id = "aisw-root";
    const dir = this.isRTL ? 'rtl' : 'ltr';

    if (this.options.type === 'fixed') {
      // ---------------------------------------------
      // RENDER TYPE 1: FIXED MODAL
      // ---------------------------------------------
      this.root.innerHTML = `
        <button class="aisw-fab" id="aiswFab">✨</button>
        <div class="aisw-modal" id="aiswModal">
          <div class="aisw-card" dir="${dir}">
            <h3 style="margin:0; font-size:20px; font-weight: 700; color:#111827;">${this.t.title}</h3>
            <p style="font-size:14px; color:#6b7280; margin-top:8px; line-height: 1.5;">${this.t.desc}</p>
            <div class="aisw-grid">
              <button class="aisw-btn" data-id="chatgpt">ChatGPT</button>
              <button class="aisw-btn" data-id="claude">Claude</button>
              <button class="aisw-btn" data-id="gemini">Gemini</button>
              <button class="aisw-btn" data-id="perplexity">Perplexity</button>
            </div>
            <div class="aisw-footer">
              <button id="aiswClose" class="aisw-secondary-btn">${this.t.cancel}</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(this.root);

      const fab = this.root.querySelector('#aiswFab');
      const modal = this.root.querySelector('#aiswModal');
      const closeBtn = this.root.querySelector('#aiswClose');

      // Modal Events
      fab.onclick = () => modal.classList.add('active');
      closeBtn.onclick = () => this.closeAllOverlays();
      modal.onclick = (e) => { if (e.target === modal) this.closeAllOverlays(); };

    } else if (this.options.type === 'inline') {
      // ---------------------------------------------
      // RENDER TYPE 2: INLINE POPOVER (DARK THEME)
      // ---------------------------------------------
      
      // 1. Create Popover hidden in body
      const popoverHtml = `
        <div class="aisw-popover" id="aiswPopover" dir="${dir}">
          <div class="aisw-popover-header">
            <h4 class="aisw-popover-title">${this.t.title}</h4>
          </div>
          <div class="aisw-popover-grid">
            <button class="aisw-popover-btn" data-id="chatgpt">ChatGPT</button>
            <button class="aisw-popover-btn" data-id="claude">Claude</button>
            <button class="aisw-popover-btn" data-id="gemini">Gemini</button>
            <button class="aisw-popover-btn" data-id="perplexity">Perplexity</button>
          </div>
        </div>
      `;
      this.root.innerHTML = popoverHtml;
      document.body.appendChild(this.root);

      // 2. Create Inline Trigger Button and inject to target
      this.inlineBtn = document.createElement('button');
      this.inlineBtn.className = 'aisw-inline-btn';
      this.inlineBtn.innerHTML = `✨ <span>${this.t.title}</span>`;
      
      const targetEl = document.querySelector(this.options.target);
      if (targetEl) {
        targetEl.appendChild(this.inlineBtn);
      } else {
        console.warn(`AI Summarize Widget: Target element '${this.options.target}' not found.`);
      }

      // Popover Events
      const popover = document.getElementById('aiswPopover');
      this.inlineBtn.onclick = (e) => {
        e.stopPropagation();
        if (!popover.classList.contains('active')) {
          popover.classList.add('active');
          this.positionPopover(); // Calculate coordinates
        } else {
          popover.classList.remove('active');
        }
      };

      // Close Popover when clicking outside
      document.addEventListener('click', (e) => {
        if (!popover.contains(e.target) && e.target !== this.inlineBtn && !this.inlineBtn.contains(e.target)) {
          popover.classList.remove('active');
        }
      });
    }

    // Common Toast Injection
    const toastHtml = `
      <div id="aiswToast" class="aisw-toast" dir="${dir}">
        <span style="color:#10b981">✔</span>
        <span id="aiswToastMsg">${this.t.toast}</span>
        <div id="aiswBar" class="aisw-bar"></div>
      </div>
    `;
    this.root.insertAdjacentHTML('beforeend', toastHtml);

    // Bind AI Action Buttons (Works for both Modal and Popover buttons)
    this.root.querySelectorAll('.aisw-btn, .aisw-popover-btn').forEach(btn => {
      btn.onclick = () => this.handleAction(btn.dataset.id);
    });
  }

  // Calculate coordinates to float Popover near the Inline button
  positionPopover() {
    if (!this.inlineBtn) return;
    const btnRect = this.inlineBtn.getBoundingClientRect();
    const popover = document.getElementById('aiswPopover');
    
    // Temporarily make block to calculate exact dimensions
    popover.style.display = 'block'; 
    const popRect = popover.getBoundingClientRect();
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // Default to positioning ABOVE the button
    let top = btnRect.top + scrollTop - popRect.height - 8;
    let left = btnRect.left + scrollLeft;

    // If there is not enough space above, position BELOW the button
    if (btnRect.top - popRect.height < 0) {
      top = btnRect.bottom + scrollTop + 8;
    }

    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.display = ''; // Restore to CSS control
  }

  // Handle LLM routing and clipboard operations
  async handleAction(id) {
    const text = this.extractContent();
    const meta = this.extractMetadata();
    
    const contextBlock = `\n\n---\n${this.t.ctxHeader}\n- ${this.t.ctxTitle}: ${meta.title}\n- ${this.t.ctxAuthor}: ${meta.author}\n- ${this.t.ctxDate}: ${meta.date}\n- ${this.t.ctxSource}: ${meta.publisher} (${meta.url})`;
    const prompt = `${this.t.prompt}${text}${contextBlock}`;

    try {
      await navigator.clipboard.writeText(prompt);
      
      const toast = document.getElementById('aiswToast');
      const bar = document.getElementById('aiswBar');
      bar.style.width = "0%";
      toast.classList.add('show');
      
      setTimeout(() => { bar.style.width = "100%"; }, 50);

      setTimeout(() => {
        const targetUrl = this.providers[id];
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.assign(targetUrl);
        } else {
          const newWindow = window.open(targetUrl, '_blank');
          if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
            window.location.assign(targetUrl);
          }
        }

        this.closeAllOverlays();
        toast.classList.remove('show');
      }, this.options.redirectDelay);

    } catch (err) {
      console.error("Clipboard write failed: ", err);
      alert("Error: Clipboard write failed.");
    }
  }
}

export default AISummarizeWidget;