# AI Summarize Widget ✨

A tiny, CSS-safe widget that lets visitors send your articles to **ChatGPT, Claude, Gemini, or Perplexity** in one click.

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](LICENSE)

**Other languages:** [Türkçe](docs/README.tr.md) · [Deutsch](docs/README.de.md) · [Français](docs/README.fr.md) · [中文](docs/README.zh.md) · [العربية](docs/README.ar.md)

---

## ⚡ Setup in 2 Steps

### Step 1 — Add the script

Paste this just before the closing `</body>` tag:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **Using NPM / React / Next.js?**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

### Step 2 — Initialize

```html
<script>
  new AISummarizeWidget({
    type: 'fixed'   // ✨ floating button appears in the bottom-right corner
  });
</script>
```

Open your page — a **✨ button** appears. Click it → pick an AI → article is copied to clipboard → redirected automatically.

---

## 🔧 Two Modes

### Mode 1 — Floating Button + Modal (`type: 'fixed'`)

A sticky FAB in the corner. Clicking opens a centered dialog. **Best for blogs and article pages.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',            // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',
    lang: 'en'
  });
</script>
```

### Mode 2 — Inline Button + Popover (`type: 'inline'`)

Injects the button into any existing element (e.g. your share bar).

```html
<div class="share-area">
  <button>Share on X</button>
  <!-- ✨ injected here -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.share-area',
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🎯 Content Scope (`contentScope`)

Restrict parsing to a specific element — useful when a page has multiple articles (e.g. news feeds).

```js
// News feed: 40 article cards on the page
// inline → closest('.article') is used automatically
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
  buttonColor: '#4f46e5'
});

// Fixed FAB: picks the article most visible in the viewport
new AISummarizeWidget({
  type: 'fixed',
  contentScope: '.article',
});
```

| Situation | Behavior |
|---|---|
| `contentScope` not set | Default heuristic detection (unchanged) |
| 1 match | That element is parsed |
| `inline` + multiple matches | `inlineBtn.closest(sel)` → the card containing the button |
| `fixed` + multiple matches | Element with the largest visible area in the viewport |
| 0 matches | Falls back to default heuristic |

---

## 🌗 Theme (`theme`)

| Value | Behavior |
|---|---|
| `'auto'` *(default)* | Follows OS dark/light mode, updates in real-time |
| `'dark'` | Always dark |
| `'light'` | Always light |

---

## ⚙️ All Options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` (floating FAB + modal) or `'inline'` (inject into a container) |
| `theme` | `String` | `'auto'` | Color theme: `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Required for `'inline'`**. CSS selector of the element to inject the button into |
| `contentScope` | `String` | `null` | Restrict parsing to a CSS selector. Smart multi-element detection included |
| `buttonColor` | `String` | `'#4f46e5'` | Button color (any HEX or RGB) |
| `lang` | `String` | *Auto* | Language code: `'en'`, `'tr'`, `'de'`… Reads browser language if omitted |
| `redirectDelay` | `Number` | `1200` | ms before redirecting to the AI (shows "Copied!" toast first) |

---

## 🚀 Features

- 🎯 **`contentScope`** — Pinpoint which element to parse. Perfect for news sites with many article cards
- 🌗 **Dark / Light / Auto Theme** — Switches instantly when OS theme changes; applies to both the modal and the inline popover
- 🛡️ **Zero CSS Conflict** — All styles scoped under `#aisw-root` with `all: unset`. Safe with Tailwind, Bootstrap, and any CSS reset
- 🔗 **AIO (AI SEO)** — Auto-extracts JSON-LD, OpenGraph, and Twitter Card metadata as prompt context
- 🧹 **Smart Content Extraction** — Strips ads, navbars, sidebars, and comments. Pure article body only
- 📱 **Mobile Deep Linking** — Bypasses popup blockers on iOS/Android. Opens native apps directly
- 🌍 **Multi-Language + RTL** — `en`, `tr`, `de`, `fr`, `es`, `zh`, `ru` and more; full RTL for `ar`, `fa`, `he`, `ur`

---

## 📦 Publishing to npm / unpkg

```bash
# Build
npm run build

# Publish (requires npm login)
npm publish
```

After publishing, the CDN URL is live immediately:

```
https://unpkg.com/ai-summarize-widget@latest/dist/ai-summarize-widget.min.js
https://cdn.jsdelivr.net/npm/ai-summarize-widget@latest/dist/ai-summarize-widget.min.js
```

---

## 📄 License

MIT © 2026 Mustafa Savul
