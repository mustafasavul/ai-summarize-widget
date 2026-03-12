# AI Summarize Widget ✨

A tiny, CSS-safe widget that lets visitors send your articles to **ChatGPT, Claude, Gemini, or Perplexity** in one click.

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](../LICENSE)

---

## ⚡ Setup in 2 Steps

### Step 1 — Add the script

Paste just before the closing `</body>` tag:

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
    type: 'fixed'   // ✨ floating button in the bottom-right corner
  });
</script>
```

Open your page — a **✨ button** appears. Click → pick an AI → article copied → redirected automatically.

---

## 🔧 Two Modes

### Mode 1 — Floating Button + Modal (`type: 'fixed'`)

A sticky FAB in the corner. Click opens a centered dialog. **Best for blogs and article pages.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
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

Restrict parsing to a specific element — perfect for news sites with multiple article cards.

```js
// News feed: 40 article cards on the page
// inline → closest('.article') finds the right card automatically
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
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

## 🌗 Theme

| Value | Behavior |
|---|---|
| `'auto'` *(default)* | Follows OS dark/light mode, updates in real-time |
| `'dark'` | Always dark |
| `'light'` | Always light |

---

## ⚙️ All Options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` or `'inline'` |
| `theme` | `String` | `'auto'` | `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Required for `'inline'`**. CSS selector of the element to inject into |
| `contentScope` | `String` | `null` | Restrict parsing to a CSS selector. Smart multi-element detection included |
| `buttonColor` | `String` | `'#4f46e5'` | Button color (HEX or RGB) |
| `lang` | `String` | *Auto* | Language code: `'en'`, `'tr'`… Reads browser language if omitted |
| `redirectDelay` | `Number` | `1200` | ms before redirecting to the AI (shows "Copied!" toast first) |

---

## 📄 License

MIT © 2026 Mustafa Savul
