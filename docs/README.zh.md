# AI Summarize Widget ✨

一个轻量、CSS 安全的小组件，让访客一键将您的文章发送给 **ChatGPT、Claude、Gemini 或 Perplexity**。

📦 **NPM：** https://www.npmjs.com/package/ai-summarize-widget

---

## ⚡ 5 分钟完成安装

### 第 1 步 — 引入脚本

将以下代码粘贴到 HTML 文件的 `</body>` 结束标签之前：

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **使用 NPM？**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

---

### 第 2 步 — 初始化组件

在脚本标签正下方添加以下代码，完成！

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // 在页面右下角显示 ✨ 悬浮按钮
    lang: 'zh'
  });
</script>
```

打开页面，右下角会出现一个 **✨ 按钮**。点击它，选择一个 AI 助手，文章内容自动复制到剪贴板，并自动跳转。

---

## 🔧 两种使用模式

### 模式 1：悬浮按钮 + 弹窗 (`type: 'fixed'`)

屏幕角落固定的按钮，点击后在屏幕中央打开对话框。**最适合博客和新闻网站。**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',  // 任意十六进制颜色
    lang: 'zh'
  });
</script>
```

### 模式 2：内嵌按钮 + 气泡框 (`type: 'inline'`)

将按钮注入页面中现有的元素（例如分享按钮旁边）。

```html
<!-- 您现有的分享按钮 -->
<div class="share-area">
  <button>分享到 X</button>
  <!-- ✨ 组件按钮将被注入到这里 -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.share-area',   // 目标元素的 CSS 选择器
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🌗 主题 (`theme`)

| 值 | 行为 |
|---|---|
| `'auto'` *（默认）* | 跟随操作系统深色/浅色模式，实时切换 |
| `'dark'` | 始终深色主题 |
| `'light'` | 始终浅色主题 |

---

## ⚙️ 所有配置项

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'`（悬浮按钮 + 弹窗）或 `'inline'`（注入到容器中） |
| `theme` | `String` | `'auto'` | 颜色主题：`'auto'`、`'dark'`、`'light'` |
| `target` | `String` | `null` | **`'inline'` 时必填**。目标元素的 CSS 选择器，例如 `'#share-bar'` |
| `buttonColor` | `String` | `'#4f46e5'` | 按钮颜色（任意 HEX 或 RGB 值） |
| `lang` | `String` | *自动检测* | 语言代码：`'zh'`、`'en'`、`'de'`…… 未设置时读取浏览器语言 |
| `redirectDelay` | `Number` | `1200` | 跳转到 AI 助手之前显示"已复制"提示的毫秒数 |

---

## 🚀 功能特点

- 🌗 **深色 / 浅色 / 自动主题** — 操作系统主题更改时即时切换
- 🛡️ **零 CSS 冲突** — 所有样式通过 `all: unset` 隔离在 `#aisw-root` 下，与 Tailwind、Bootstrap 及任何全局重置兼容
- 🔗 **AIO（AI SEO）** — 自动提取 JSON-LD、OpenGraph 和 Twitter Card 元数据，作为上下文注入 AI 提示词
- 🧹 **智能内容提取** — 过滤广告、导航栏、侧边栏和评论，只发送纯文章正文
- 📱 **移动端支持** — 绕过 iOS/Android 弹窗拦截器，直接打开原生应用
- 🌍 **多语言 + RTL** — 支持 `zh`、`en`、`de`、`fr`、`tr`、`ru` 等十余种语言；完整支持 `ar`、`fa`、`he`、`ur` 的从右到左排版

---

## 📄 许可证

MIT © 2026 Mustafa Savul
