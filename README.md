```markdown
# AI Summarize Widget ✨

A lightweight, SEO-friendly, and highly customizable widget that allows your website visitors to send your articles to their favorite AI assistants (ChatGPT, Claude, Gemini, Perplexity) for summarization.

Built with **Shadcn UI** aesthetics, **JSON-LD (AIO)** context extraction, and **Mobile Native Deep Linking**.

## 🚀 Features

- 🛡️ **Zero Auto-Paste:** Strict manual paste functionality ensures no URL-limit truncation.
- 🔗 **AIO (AI SEO) Support:** Automatically extracts JSON-LD Schema and Meta tags to inject your Site Name, Author, and URL as context for the AI.
- 🧹 **Smart Clean-up:** Ignores ads, navbars, sidebars, and comments. Extracts only the pure article body.
- 📱 **Mobile Deep Linking:** Bypasses mobile pop-up blockers and seamlessly opens native AI apps (iOS/Android).
- 🌍 **Multi-Language & RTL:** Auto-detects `en`, `tr`, `es`, `zh`, `de`, `fr`, `it`, `pt`, `ru`, `nl`. Fully supports RTL layouts (`ar`, `fa`, `he`, `ur`).
- 🎨 **Zero CSS Bleeding:** Fully encapsulated styles that will never conflict with your website's CSS.

---

## 📦 Installation

### Method 1: Via CDN (Easiest for plain HTML/JS)
Add this script to your HTML before the closing `</body>` tag:

```html
<script src="[https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js](https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js)"></script>

```

### Method 2: Via NPM (For React, Vue, Next.js)

```bash
npm install ai-summarize-widget

```

```javascript
import AISummarizeWidget from 'ai-summarize-widget';

```

---

## 💻 Usage & Implementation Types

You can integrate this widget into your website in two different ways depending on your UI/UX needs.

### Type 1: Fixed Floating Button & Modal (Default)

Places a floating action button (FAB) at the corner of the screen. When clicked, it opens a centered, elegant modal. Perfect for blogs and long-form news articles.

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    buttonColor: '#4f46e5',   // Your brand color
    lang: 'en'                // Forces English (optional)
  });
</script>

```

### Type 2: Inline Button & Popover

Injects the button directly into a specific part of your DOM (e.g., next to your social share buttons or article header). When clicked, it opens a contextual popover attached to the button.

```html
<div class="my-share-buttons">
    <button>Share on X</button>
    </div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.my-share-buttons', // CSS selector where the button should appear
    buttonColor: '#10b981'
  });
</script>

```

---

## ⚙️ Configuration Options

You can easily customize the widget by passing an options object during initialization.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| **`type`** | `String` | `'fixed'` | The rendering mode. Use `'fixed'` for a floating button/modal, or `'inline'` to inject it into a specific container with a popover. |
| **`target`** | `String` | `null` | **Required if `type` is `'inline'`.** The CSS selector of the DOM element where the button will be appended (e.g., `'.article-actions'`). |
| **`position`** | `String` | `'bottom-right'` | Positioning for the `'fixed'` type. Options: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`. |
| **`buttonColor`** | `String` | `'#4f46e5'` | The HEX or RGB color code for the widget's buttons and progress bars to match your brand identity. |
| **`lang`** | `String` | *Auto-detected* | Forces a specific language. If omitted, it automatically reads the `<html lang="x">` attribute or the user's browser language. |
| **`redirectDelay`** | `Number` | `1200` | The delay (in milliseconds) before redirecting the user to the AI assistant, allowing them to see the "Copied" toast animation. |

---

## 📄 License

MIT License © 2026