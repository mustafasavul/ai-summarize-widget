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
      type: options.type || 'fixed',            // 'fixed' or 'inline'
      target: options.target || null,            // CSS selector for 'inline'
      theme: options.theme || 'auto',            // 'auto' | 'light' | 'dark'
      buttonColor: options.buttonColor || '#4f46e5',
      lang: (options.lang || document.documentElement.lang || navigator.language || 'en').substring(0, 2).toLowerCase(),
      redirectDelay: 1200,
      contentScope: options.contentScope || null, // CSS selector to restrict content parsing
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
    this.root = document.createElement('div');
    this.root.id = 'aisw-root';
    this.injectStyles();
    this.applyTheme();
    this.createDom();
    this.attachGlobalEvents();
  }

  // Apply theme class to root based on options.theme
  applyTheme() {
    const { theme } = this.options;
    if (theme === 'dark') {
      this.root.classList.add('aisw-dark');
    } else if (theme === 'light') {
      this.root.classList.add('aisw-light');
    } else {
      // 'auto': CSS media query handles most of it;
      // also add a runtime listener so dynamic OS changes work instantly.
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const sync = (e) => {
        this.root.classList.toggle('aisw-dark', e.matches);
        this.root.classList.toggle('aisw-light', !e.matches);
      };
      sync(mq); // apply immediately
      mq.addEventListener('change', sync);
    }
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

  // Resolve the best-matching DOM element for contentScope
  _resolveScope() {
    const sel = this.options.contentScope;
    if (!sel) return null;

    const matches = [...document.querySelectorAll(sel)];
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];

    // INLINE: walk up from the injected button — finds the enclosing article card
    if (this.options.type === 'inline' && this.inlineBtn) {
      const ancestor = this.inlineBtn.closest(sel);
      if (ancestor) return ancestor;
    }

    // FIXED / fallback: pick the element with the largest visible area in the viewport
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let best = null, bestArea = 0;

    for (const el of matches) {
      const r = el.getBoundingClientRect();
      const ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
      const iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      const area = ix * iy;
      if (area > bestArea) { bestArea = area; best = el; }
    }

    return best; // null when nothing is in the viewport at all
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

    // --- contentScope fast-path -------------------------------------------
    // If the user pinpointed a specific element we skip heuristic detection
    // entirely and parse only that element's clone.
    const scoped = this._resolveScope();
    if (scoped) {
      const wrapper = document.createElement('div');
      wrapper.appendChild(scoped.cloneNode(true));
      wrapper.querySelectorAll(junkSelectors).forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      const tags = wrapper.querySelectorAll('p, h1, h2, h3, h4, h5, li');
      let text = '';
      if (tags.length > 0) {
        tags.forEach(t => {
          const inner = (t.innerText || t.textContent).trim();
          if (inner.length > 0) text += inner + '\n\n';
        });
      } else {
        text = (wrapper.innerText || wrapper.textContent).trim();
      }
      return text.replace(/\n{3,}/g, '\n\n').trim();
    }
    // --- end contentScope fast-path ----------------------------------------

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

  // Inject encapsulated CSS – all rules are scoped inside #aisw-root to prevent
  // host-page styles from bleeding in. The card uses an isolation layer via
  // a dedicated CSS custom-property namespace and explicit property resets.
  injectStyles() {
    if (document.getElementById('ai-sum-styles')) return;

    const css = `
      /* ─── DESIGN TOKENS ─── */

      /* Light defaults */
      #aisw-root {
        --aisw-overlay: rgba(0,0,0,0.55);
        --aisw-card-bg: #ffffff;
        --aisw-card-border: rgba(0,0,0,0.08);
        --aisw-text: #09090b;
        --aisw-muted: #71717a;
        --aisw-sep: #f4f4f5;
        --aisw-btn-bg: #fafafa;
        --aisw-btn-border: #e4e4e7;
        --aisw-btn-hover-bg: #f0f0f2;
        --aisw-btn-hover-border: #c4c4c8;
        --aisw-btn-color: #18181b;
        --aisw-secondary-bg: transparent;
        --aisw-secondary-color: #71717a;
        --aisw-secondary-border: #e4e4e7;
        --aisw-secondary-hover-bg: #f4f4f5;
        --aisw-secondary-hover-border: #d4d4d8;
        --aisw-secondary-hover-color: #3f3f46;
        --aisw-card-shadow:
          0 0 0 1px rgba(0,0,0,0.04),
          0 4px 6px -1px rgba(0,0,0,0.06),
          0 20px 32px -8px rgba(0,0,0,0.14);
        /* Popover tokens – light */
        --aisw-pop-bg: #ffffff;
        --aisw-pop-border: #e4e4e7;
        --aisw-pop-text: #09090b;
        --aisw-pop-btn-bg: #fafafa;
        --aisw-pop-btn-hover: #f0f0f2;
        --aisw-pop-shadow: 0 20px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08);
      }

      /* Dark – forced via .aisw-dark class */
      #aisw-root.aisw-dark {
        --aisw-overlay: rgba(0,0,0,0.75);
        --aisw-card-bg: #09090b;
        --aisw-card-border: rgba(255,255,255,0.08);
        --aisw-text: #fafafa;
        --aisw-muted: #a1a1aa;
        --aisw-sep: #27272a;
        --aisw-btn-bg: #18181b;
        --aisw-btn-border: #27272a;
        --aisw-btn-hover-bg: #27272a;
        --aisw-btn-hover-border: #3f3f46;
        --aisw-btn-color: #fafafa;
        --aisw-secondary-bg: transparent;
        --aisw-secondary-color: #a1a1aa;
        --aisw-secondary-border: #27272a;
        --aisw-secondary-hover-bg: #18181b;
        --aisw-secondary-hover-border: #3f3f46;
        --aisw-secondary-hover-color: #e4e4e7;
        --aisw-card-shadow:
          0 0 0 1px rgba(255,255,255,0.04),
          0 4px 6px -1px rgba(0,0,0,0.3),
          0 20px 32px -8px rgba(0,0,0,0.5);
        /* Popover tokens – dark */
        --aisw-pop-bg: #09090b;
        --aisw-pop-border: #27272a;
        --aisw-pop-text: #fafafa;
        --aisw-pop-btn-bg: #18181b;
        --aisw-pop-btn-hover: #27272a;
        --aisw-pop-shadow: 0 20px 40px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3);
      }

      /* ─── SCOPING LAYER: every rule lives under #aisw-root ─── */

      /* FAB */
      #aisw-root .aisw-fab {
        all: unset;
        box-sizing: border-box;
        position: fixed;
        bottom: 28px;
        right: 28px;
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: ${this.options.buttonColor};
        color: #fff;
        cursor: pointer;
        z-index: 2147483640;
        box-shadow: 0 4px 24px rgba(0,0,0,0.25), 0 1px 4px rgba(0,0,0,0.15);
        font-size: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                    box-shadow 0.2s ease;
        line-height: 1;
      }
      #aisw-root .aisw-fab:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2);
      }
      #aisw-root .aisw-fab:active { transform: scale(0.96); }

      /* MODAL OVERLAY */
      #aisw-root .aisw-modal {
        all: unset;
        box-sizing: border-box;
        display: none;
        position: fixed;
        inset: 0;
        background: var(--aisw-overlay);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 2147483641;
        align-items: center;
        justify-content: center;
      }
      #aisw-root .aisw-modal.active {
        display: flex;
        animation: aiswOverlayIn 0.18s ease-out both;
      }

      /* DIALOG CARD */
      #aisw-root .aisw-card {
        all: unset;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI",
                     Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: var(--aisw-text);
        background: var(--aisw-card-bg);
        padding: 24px;
        border-radius: 16px;
        width: min(90vw, 420px);
        border: 1px solid var(--aisw-card-border);
        box-shadow: var(--aisw-card-shadow);
        transform: scale(0.96) translateY(6px);
        opacity: 0;
        transition: transform 0.22s cubic-bezier(0.34,1.36,0.64,1),
                    opacity 0.18s ease;
        display: block;
      }
      #aisw-root .aisw-modal.active .aisw-card {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      #aisw-root .aisw-card[dir="rtl"] { text-align: right; }
      #aisw-root .aisw-card[dir="ltr"] { text-align: left; }

      /* CARD HEADER */
      #aisw-root .aisw-card-header {
        all: unset;
        box-sizing: border-box;
        display: block;
        margin-bottom: 6px;
      }
      #aisw-root .aisw-card-title {
        all: unset;
        box-sizing: border-box;
        display: block;
        font-size: 17px;
        font-weight: 700;
        color: var(--aisw-text);
        letter-spacing: -0.3px;
        line-height: 1.3;
      }
      #aisw-root .aisw-card-desc {
        all: unset;
        box-sizing: border-box;
        display: block;
        font-size: 13px;
        color: var(--aisw-muted);
        margin-top: 5px;
        line-height: 1.5;
      }

      /* SEPARATOR */
      #aisw-root .aisw-sep {
        all: unset;
        box-sizing: border-box;
        display: block;
        height: 1px;
        background: var(--aisw-sep);
        margin: 18px 0;
      }

      /* AI PROVIDER GRID */
      #aisw-root .aisw-grid {
        all: unset;
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      /* AI PROVIDER BUTTONS */
      #aisw-root .aisw-btn {
        all: unset;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 11px 14px;
        border: 1px solid var(--aisw-btn-border);
        border-radius: 10px;
        background: var(--aisw-btn-bg);
        cursor: pointer;
        transition:
          background 0.15s ease,
          border-color 0.15s ease,
          box-shadow 0.15s ease,
          transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
        font-family: inherit;
        font-weight: 600;
        font-size: 13.5px;
        color: var(--aisw-btn-color);
        line-height: 1;
        white-space: nowrap;
        overflow: hidden;
      }
      #aisw-root .aisw-btn:hover {
        background: var(--aisw-btn-hover-bg);
        border-color: var(--aisw-btn-hover-border);
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transform: translateY(-1px);
      }
      #aisw-root .aisw-btn:active { transform: translateY(0) scale(0.97); }

      /* AI ICON BADGE */
      #aisw-root .aisw-btn-icon {
        all: unset;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        font-size: 13px;
        flex-shrink: 0;
      }
      #aisw-root .aisw-btn-icon--chatgpt  { background: #10a37f; color: #fff; }
      #aisw-root .aisw-btn-icon--claude    { background: #d97706; color: #fff; }
      #aisw-root .aisw-btn-icon--gemini    { background: linear-gradient(135deg,#4285f4,#9b72cb); color: #fff; }
      #aisw-root .aisw-btn-icon--perplexity{ background: #1fb8ac; color: #fff; }

      /* FOOTER */
      #aisw-root .aisw-footer {
        all: unset;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        margin-top: 18px;
      }
      #aisw-root .aisw-secondary-btn {
        all: unset;
        box-sizing: border-box;
        padding: 8px 18px;
        border: 1px solid var(--aisw-secondary-border);
        border-radius: 8px;
        background: var(--aisw-secondary-bg);
        cursor: pointer;
        font-family: inherit;
        font-weight: 500;
        font-size: 13px;
        color: var(--aisw-secondary-color);
        transition: background 0.15s, color 0.15s, border-color 0.15s;
        line-height: 1;
      }
      #aisw-root .aisw-secondary-btn:hover {
        background: var(--aisw-secondary-hover-bg);
        border-color: var(--aisw-secondary-hover-border);
        color: var(--aisw-secondary-hover-color);
      }

      /* ─── TYPE 2: INLINE POPOVER (Dark) ─── */
      #aisw-root .aisw-inline-btn {
        all: unset;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 9px 15px;
        border-radius: 8px;
        background: ${this.options.buttonColor};
        color: #fff;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI",
                     Roboto, sans-serif;
        font-weight: 600;
        font-size: 13.5px;
        line-height: 1;
        transition: opacity 0.15s, transform 0.15s;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
      }
      #aisw-root .aisw-inline-btn:hover { opacity: 0.88; transform: translateY(-1px); }

      #aisw-root .aisw-popover {
        all: unset;
        box-sizing: border-box;
        display: none;
        position: absolute;
        z-index: 2147483641;
        background: var(--aisw-pop-bg);
        border: 1px solid var(--aisw-pop-border);
        border-radius: 14px;
        padding: 16px;
        min-width: 230px;
        box-shadow: var(--aisw-pop-shadow);
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI",
                     Roboto, sans-serif;
        color: var(--aisw-pop-text);
        opacity: 0;
        transform: translateY(8px) scale(0.97);
        transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.34,1.36,0.64,1);
      }
      #aisw-root .aisw-popover.active {
        display: block;
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      #aisw-root .aisw-popover-header { margin-bottom: 12px; }
      #aisw-root .aisw-popover-title {
        all: unset;
        box-sizing: border-box;
        display: block;
        font-size: 15px;
        font-weight: 700;
        color: var(--aisw-pop-text);
        letter-spacing: -0.2px;
      }
      #aisw-root .aisw-popover-grid {
        all: unset;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      #aisw-root .aisw-popover-btn {
        all: unset;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        gap: 9px;
        background: var(--aisw-pop-btn-bg);
        border: 1px solid var(--aisw-pop-border);
        color: var(--aisw-pop-text);
        border-radius: 8px;
        padding: 10px 12px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 500;
        font-size: 13.5px;
        transition: background 0.15s, border-color 0.15s;
        line-height: 1;
      }
      #aisw-root .aisw-popover-btn:hover {
        background: var(--aisw-pop-btn-hover);
        border-color: var(--aisw-btn-hover-border);
      }
      #aisw-root .aisw-popover[dir="rtl"] { text-align: right; }
      #aisw-root .aisw-popover[dir="ltr"] { text-align: left; }

      /* ─── TOAST ─── */
      #aisw-root .aisw-toast {
        all: unset;
        box-sizing: border-box;
        position: fixed;
        top: -100px;
        left: 50%;
        transform: translateX(-50%);
        background: #18181b;
        color: #fafafa;
        padding: 13px 26px;
        border-radius: 100px;
        z-index: 2147483647;
        transition: top 0.45s cubic-bezier(0.68,-0.55,0.265,1.55);
        box-shadow: 0 16px 40px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI",
                     Roboto, sans-serif;
        font-weight: 600;
        font-size: 14px;
        overflow: hidden;
        white-space: nowrap;
        border: 1px solid #27272a;
      }
      #aisw-root .aisw-toast.show { top: 20px; }
      #aisw-root .aisw-bar {
        all: unset;
        box-sizing: border-box;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: #22c55e;
        transition: width 1.2s linear;
        width: 0%;
        border-radius: 0 0 100px 100px;
      }
      #aisw-root .aisw-toast[dir="rtl"] .aisw-bar { right: 0; left: auto; }

      /* ─── KEYFRAMES ─── */
      @keyframes aiswOverlayIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
    `;

    const style = document.createElement('style');
    style.id = 'ai-sum-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  createDom() {
    const dir = this.isRTL ? 'rtl' : 'ltr';

    if (this.options.type === 'fixed') {
      // ---------------------------------------------
      // RENDER TYPE 1: FIXED MODAL
      // ---------------------------------------------
      this.root.innerHTML = `
        <button class="aisw-fab" id="aiswFab">✨</button>
        <div class="aisw-modal" id="aiswModal">
          <div class="aisw-card" dir="${dir}">
            <div class="aisw-card-header">
              <span class="aisw-card-title">${this.t.title}</span>
              <span class="aisw-card-desc">${this.t.desc}</span>
            </div>
            <div class="aisw-sep"></div>
            <div class="aisw-grid">
              <button class="aisw-btn" data-id="chatgpt">
                <span class="aisw-btn-icon aisw-btn-icon--chatgpt">C</span>ChatGPT
              </button>
              <button class="aisw-btn" data-id="claude">
                <span class="aisw-btn-icon aisw-btn-icon--claude">A</span>Claude
              </button>
              <button class="aisw-btn" data-id="gemini">
                <span class="aisw-btn-icon aisw-btn-icon--gemini">G</span>Gemini
              </button>
              <button class="aisw-btn" data-id="perplexity">
                <span class="aisw-btn-icon aisw-btn-icon--perplexity">P</span>Perplexity
              </button>
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
            <span class="aisw-popover-title">${this.t.title}</span>
          </div>
          <div class="aisw-popover-grid">
            <button class="aisw-popover-btn" data-id="chatgpt">
              <span class="aisw-btn-icon aisw-btn-icon--chatgpt">C</span>ChatGPT
            </button>
            <button class="aisw-popover-btn" data-id="claude">
              <span class="aisw-btn-icon aisw-btn-icon--claude">A</span>Claude
            </button>
            <button class="aisw-popover-btn" data-id="gemini">
              <span class="aisw-btn-icon aisw-btn-icon--gemini">G</span>Gemini
            </button>
            <button class="aisw-popover-btn" data-id="perplexity">
              <span class="aisw-btn-icon aisw-btn-icon--perplexity">P</span>Perplexity
            </button>
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
        <span style="color:#22c55e;font-size:15px">✔</span>
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