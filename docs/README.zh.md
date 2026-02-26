```markdown
# AI Summarize Widget ✨

一款轻量级、SEO 友好且高度可定制的小部件，让您网站的访客可以将文章发送到他们喜爱的 AI 助手（ChatGPT、Claude、Gemini、Perplexity）进行摘要。

采用 **Shadcn UI** 美学、**JSON-LD (AIO)** 上下文提取和 **Mobile Native Deep Linking** 构建。

## 🚀 功能特性

- 🛡️ **无自动粘贴：** 严格的手动粘贴功能确保不会因 URL 长度限制而被截断。
- 🔗 **AIO (AI SEO) 支持：** 自动提取 JSON-LD Schema 和 Meta 标签，将站点名称、作者和 URL 作为上下文注入 AI。
- 🧹 **智能清理：** 忽略广告、导航栏、侧边栏和评论。仅提取纯净的文章正文。
- 📱 **移动端 Deep Linking：** 绕过移动端弹窗拦截器，无缝打开原生 AI 应用（iOS/Android）。
- 🌍 **多语言与 RTL：** 自动检测 `en`、`tr`、`es`、`zh`、`de`、`fr`、`it`、`pt`、`ru`、`nl`。完整支持 RTL 布局（`ar`、`fa`、`he`、`ur`）。
- 🎨 **零 CSS 污染：** 完全封装的样式，绝不会与您网站的 CSS 冲突。

---

## 📦 安装

### 方式 1：通过 CDN（纯 HTML/JS 最简单）
在 HTML 的 `</body>` 闭合标签之前添加此脚本：

```html
<script src="[https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js](https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js)"></script>

```

### 方式 2：通过 NPM（适用于 React、Vue、Next.js）

```bash
npm install ai-summarize-widget

```

```javascript
import AISummarizeWidget from 'ai-summarize-widget';

```

---

## 💻 使用与实现类型

您可以根据 UI/UX 需求，以两种不同方式将小部件集成到网站中。

### 类型 1：固定悬浮按钮与模态框（默认）

在屏幕角落放置悬浮操作按钮（FAB）。点击后打开居中优雅的模态框。适合博客和长篇新闻文章。

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    buttonColor: '#4f46e5',   // 您的品牌色
    lang: 'zh'                // 强制中文（可选）
  });
</script>

```

### 类型 2：内联按钮与弹出框

将按钮直接注入到 DOM 的特定部分（例如社交分享按钮或文章标题旁）。点击后打开附着在按钮上的上下文弹出框。

```html
<div class="my-share-buttons">
    <button>在 X 上分享</button>
    </div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.my-share-buttons', // 按钮应出现的 CSS 选择器
    buttonColor: '#10b981'
  });
</script>

```

---

## ⚙️ 配置选项

您可以在初始化时传入配置对象，轻松自定义小部件。

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| **`type`** | `String` | `'fixed'` | 渲染模式。使用 `'fixed'` 表示悬浮按钮/模态框，或使用 `'inline'` 将其注入到带弹出框的特定容器中。 |
| **`target`** | `String` | `null` | **当 `type` 为 `'inline'` 时必填。** 按钮将追加到的 DOM 元素的 CSS 选择器（如 `'.article-actions'`）。 |
| **`position`** | `String` | `'bottom-right'` | `'fixed'` 类型的位置。选项：`'bottom-right'`、`'bottom-left'`、`'top-right'`、`'top-left'`。 |
| **`buttonColor`** | `String` | `'#4f46e5'` | 小部件按钮和进度条使用的 HEX 或 RGB 颜色代码，以匹配您的品牌形象。 |
| **`lang`** | `String` | *自动检测* | 强制使用特定语言。若省略，将自动读取 `<html lang="x">` 属性或用户浏览器语言。 |
| **`redirectDelay`** | `Number` | `1200` | 将用户重定向到 AI 助手前的延迟（毫秒），让用户能看到「已复制」的 Toast 动画。 |

---

## 📄 许可证

MIT 许可证 © 2026
```
