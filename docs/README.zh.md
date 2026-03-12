# AI Summarize Widget ✨

一个轻量、CSS 安全的小组件，让访客一键将您的文章发送给 **ChatGPT、Claude、Gemini 或 Perplexity**。

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](../LICENSE)

---

## ⚡ 两步完成安装

### 第 1 步 — 引入脚本

在 `</body>` 结束标签之前粘贴：

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **使用 NPM / React / Next.js？**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

### 第 2 步 — 初始化

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // 右下角出现 ✨ 悬浮按钮
    lang: 'zh'
  });
</script>
```

打开页面 — 右下角出现 **✨ 按钮**。点击 → 选择 AI → 内容自动复制 → 自动跳转。

---

## 🔧 两种模式

### 模式 1 — 悬浮按钮 + 弹窗 (`type: 'fixed'`)

屏幕角落固定按钮，点击打开居中对话框。**最适合博客和文章页面。**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',
    lang: 'zh'
  });
</script>
```

### 模式 2 — 内嵌按钮 + 气泡框 (`type: 'inline'`)

将按钮注入现有元素（如分享按钮区域）。

```html
<div class="share-area">
  <button>分享到 X</button>
  <!-- ✨ 注入到这里 -->
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

## 🎯 内容范围 (`contentScope`)

将解析限制到特定元素 — 适合页面有多篇文章的新闻网站。

```js
// 新闻流：页面有 40 个文章卡片
// inline → 自动使用 closest('.article') 找到正确的卡片
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
});

// 悬浮 FAB：选择视口中可见面积最大的文章
new AISummarizeWidget({
  type: 'fixed',
  contentScope: '.article',
});
```

| 情况 | 行为 |
|---|---|
| 未设置 `contentScope` | 默认启发式检测（不变） |
| 1 个匹配 | 直接解析该元素 |
| `inline` + 多个匹配 | `inlineBtn.closest(sel)` → 包含按钮的卡片 |
| `fixed` + 多个匹配 | 视口中可见面积最大的元素 |
| 0 个匹配 | 回退到默认启发式 |

---

## 🌗 主题

| 值 | 行为 |
|---|---|
| `'auto'` *（默认）* | 跟随系统主题，实时切换 |
| `'dark'` | 始终深色 |
| `'light'` | 始终浅色 |

---

## ⚙️ 所有配置项

| 配置项 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` 或 `'inline'` |
| `theme` | `String` | `'auto'` | `'auto'`、`'dark'`、`'light'` |
| `target` | `String` | `null` | **`'inline'` 时必填**。目标元素的 CSS 选择器 |
| `contentScope` | `String` | `null` | 将解析限制到 CSS 选择器。内置智能多元素检测 |
| `buttonColor` | `String` | `'#4f46e5'` | 按钮颜色（HEX 或 RGB） |
| `lang` | `String` | *自动* | 语言代码：`'zh'`、`'en'`…… 未设置时读取浏览器语言 |
| `redirectDelay` | `Number` | `1200` | 跳转前显示"已复制"提示的毫秒数 |

---

## 📄 许可证

MIT © 2026 Mustafa Savul
