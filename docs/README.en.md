# AI Summarize Widget ✨

A tiny, CSS-safe widget that lets visitors send your articles to **ChatGPT, Claude, Gemini, or Perplexity** in one click.

📦 **NPM:** https://www.npmjs.com/package/ai-summarize-widget

---

## ⚡ Setup in 5 Minutes

### Step 1 — Add the script

Paste this just before the closing `</body>` tag of your HTML:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **Using NPM?**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

---

### Step 2 — Initialize the widget

Add this right below the script tag. That's it!

```html
<script>
  new AISummarizeWidget({
    type: 'fixed'   // shows a ✨ floating button in the bottom-right corner
  });
</script>
```

Open your page — a **✨ button** will appear in the bottom-right corner. Click it, pick an AI assistant, the article content is copied to your clipboard, and you're redirected automatically.

---

## 🔧 Two Modes

### Mode 1: Floating Button + Modal (`type: 'fixed'`)

A sticky button in the corner of the screen. Clicking it opens a centered dialog. **Best for blogs and news sites.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',  // any hex color
    lang: 'en'
  });
</script>
```

### Mode 2: Inline Button + Popover (`type: 'inline'`)

Injects the button into an existing element on your page (e.g., alongside your share buttons).

```html
<!-- Your existing share buttons -->
<div class="share-area">
  <button>Share on X</button>
  <!-- ✨ widget will be injected here -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.share-area',   // the element to inject into
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🌗 Theme (`theme`)

| Value | Behavior |
|---|---|
| `'auto'` *(default)* | Follows the OS dark/light mode setting, updates in real-time |
| `'dark'` | Always dark |
| `'light'` | Always light |

---

## ⚙️ All Options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` (floating button + modal) or `'inline'` (inject into a container) |
| `theme` | `String` | `'auto'` | Color theme: `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Required for `'inline'`**. CSS selector of the element to inject the button into, e.g. `'#share-bar'` |
| `buttonColor` | `String` | `'#4f46e5'` | Button color (any HEX or RGB value) |
| `lang` | `String` | *Auto-detected* | Language code: `'en'`, `'tr'`, `'de'`… Reads browser language if not set |
| `redirectDelay` | `Number` | `1200` | Milliseconds to show the "Copied!" toast before redirecting to the AI assistant |

---

## 🚀 Features

- 🌗 **Dark / Light / Auto Theme** — Switches instantly when the OS theme changes
- 🛡️ **Zero CSS Conflict** — All styles are scoped under `#aisw-root` with `all: unset` guards. Safe next to Tailwind, Bootstrap, or any global reset
- 🔗 **AIO (AI SEO)** — Auto-extracts JSON-LD, OpenGraph, and Twitter Card metadata and injects it into the AI prompt as context
- 🧹 **Smart Content Extraction** — Strips ads, navbars, sidebars, and comments. Pure article body only
- 📱 **Mobile Support** — Bypasses popup blockers on iOS/Android, opens native apps directly
- 🌍 **Multi-Language + RTL** — `en`, `tr`, `de`, `fr`, `es`, `zh`, `ru` and more; full RTL for `ar`, `fa`, `he`, `ur`

---

## 📄 License

MIT © 2026 Mustafa Savul
