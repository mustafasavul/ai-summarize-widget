# AI Summarize Widget ✨

Ziyaretçilerin makalelerinizi **ChatGPT, Claude, Gemini veya Perplexity**'e tek tıkla göndermesini sağlayan hafif, CSS-güvenli bir widget.

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](../LICENSE)

---

## ⚡ 2 Adımda Kurulum

### Adım 1 — Script ekle

`</body>` kapanma etiketinden hemen önceye yapıştırın:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **NPM / React / Next.js kullanıyorsanız:**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

### Adım 2 — Başlat

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // sağ altta ✨ butonu görünür
    lang: 'tr'
  });
</script>
```

Sayfayı açın — **✨ butonu** sağ altta görünür. Tıklayın → AI seçin → içerik kopyalanır → yönlendirilirsiniz.

---

## 🔧 İki Mod

### Mod 1 — Yüzen Buton + Modal (`type: 'fixed'`)

Köşede sabit FAB butonu. Tıklanınca ortada dialog açılır. **Blog ve haber sayfaları için idealdir.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',
    lang: 'tr'
  });
</script>
```

### Mod 2 — Satır İçi Buton + Popover (`type: 'inline'`)

Butonu mevcut bir alana enjekte eder (örn. paylaşım butonlarınızın yanına).

```html
<div class="paylas-alani">
  <button>X'te Paylaş</button>
  <!-- ✨ buraya enjekte edilir -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.paylas-alani',
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🎯 İçerik Alanı Seçimi (`contentScope`)

Parse işlemini belirli bir elementle sınırlar. Sayfada birden fazla makale olan haber sitelerinde çok işe yarar.

```js
// Haber akışı: sayfada 40 makale kartı var
// inline → closest('.article') ile otomatik doğru kart bulunur
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
  buttonColor: '#4f46e5'
});

// Fixed FAB: viewport'ta en görünür .article parse edilir
new AISummarizeWidget({
  type: 'fixed',
  contentScope: '.article',
});
```

| Durum | Davranış |
|---|---|
| `contentScope` belirtilmemiş | Varsayılan heuristik sistem (değişmez) |
| 1 eşleşme | O element doğrudan parse edilir |
| `inline` + çoklu eşleşme | `inlineBtn.closest(sel)` → butonu içeren kart |
| `fixed` + çoklu eşleşme | Viewport'ta en büyük görünen alan |
| Eşleşme yok | Varsayılan heuristik devreye girer |

---

## 🌗 Tema (`theme`)

| Değer | Davranış |
|---|---|
| `'auto'` *(varsayılan)* | OS dark/light modunu takip eder, anlık değişir |
| `'dark'` | Her zaman karanlık |
| `'light'` | Her zaman aydınlık |

---

## ⚙️ Tüm Seçenekler

| Seçenek | Tip | Varsayılan | Açıklama |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` (yüzen FAB + modal) veya `'inline'` (alana enjeksiyon) |
| `theme` | `String` | `'auto'` | Renk teması: `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | `'inline'` için **zorunlu**. Butonun ekleneceği CSS seçicisi |
| `contentScope` | `String` | `null` | Parse'ı kısıtlayacak CSS seçicisi. Akıllı çoklu-element algılama dahil |
| `buttonColor` | `String` | `'#4f46e5'` | Buton rengi (HEX veya RGB) |
| `lang` | `String` | *Otomatik* | Dil kodu: `'tr'`, `'en'`, `'de'`… Belirtilmezse tarayıcı dilini okur |
| `redirectDelay` | `Number` | `1200` | "Kopyalandı" toastından AI'ya yönlendirmeye kadar geçen ms |

---

## 🚀 Özellikler

- 🎯 **`contentScope`** — Hangi elementi parse edeceğini tam belirle. Birden fazla makale kartı olan haber siteleri için ideal
- 🌗 **Dark / Light / Auto Tema** — OS teması değişince anlık geçiş; modal ve inline popover'da geçerli
- 🛡️ **Sıfır CSS Çakışması** — Tüm stiller `#aisw-root` altında `all: unset` ile izole. Tailwind, Bootstrap ve her CSS reset ile uyumlu
- 🔗 **AIO (AI SEO)** — JSON-LD, OpenGraph, Twitter Card metadata'sını otomatik çeker ve prompt'a bağlam olarak ekler
- 🧹 **Akıllı İçerik Temizliği** — Reklam, navigasyon, sidebar ve yorumları ayıklar
- 📱 **Mobil Desteği** — iOS/Android'de popup engelleyicileri aşar, native uygulamaları doğrudan açar
- 🌍 **Çoklu Dil + RTL** — `tr`, `en`, `de`, `fr` ve daha fazlası; `ar`, `fa`, `he`, `ur` için tam RTL

---

## 📦 npm / unpkg'ya Yayınlama

```bash
# Build
npm run build

# Yayınla (npm login gerekli)
npm publish
```

Yayınlandıktan sonra CDN URL'leri hemen aktif olur:

```
https://unpkg.com/ai-summarize-widget@latest/dist/ai-summarize-widget.min.js
https://cdn.jsdelivr.net/npm/ai-summarize-widget@latest/dist/ai-summarize-widget.min.js
```

---

## 📄 Lisans

MIT © 2026 Mustafa Savul
