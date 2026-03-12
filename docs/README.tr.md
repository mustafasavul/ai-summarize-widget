# AI Summarize Widget ✨

Ziyaretçilerin makalelerinizi **ChatGPT, Claude, Gemini veya Perplexity**'e tek tıkla göndermesini sağlayan hafif, CSS-güvenli bir widget.

📦 **NPM:** https://www.npmjs.com/package/ai-summarize-widget

---

## ⚡ 5 Dakikada Kurulum

### Adım 1 — Script'i sayfanıza ekleyin

HTML dosyanızın `</body>` kapanma etiketinden hemen önce şunu yapıştırın:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **NPM kullanıyorsanız:**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

---

### Adım 2 — Widget'ı başlatın

Script'in hemen altına şunu ekleyin. Hepsi bu kadar!

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',   // sağ altta yüzen ✨ butonu açar
    lang: 'tr'       // opsiyonel: Türkçe arayüz
  });
</script>
```

Sayfanızı açın — sağ alt köşede **✨ butonu** görünecek. Tıklayın, bir AI seçin, içerik otomatik kopyalanır ve AI'ya yönlendirilirsiniz.

---

## 🔧 İki Kullanım Modu

### Mod 1: Yüzen Buton + Modal (`type: 'fixed'`)

Ekranın bir köşesinde sabit duran buton. Tıklanınca ortada bir dialog açılır. **Bloglar ve haber siteleri** için idealdir.

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',  // buton rengi (marka renginiz)
    lang: 'tr'
  });
</script>
```

### Mod 2: Satır İçi Buton + Popover (`type: 'inline'`)

Butonu, sayfanızdaki mevcut bir alana (örn. paylaşım butonlarınızın yanına) yerleştirir.

```html
<!-- Paylaşım butonlarınız -->
<div class="paylas-alani">
  <button>X'te Paylaş</button>
  <!-- ✨ widget buraya enjekte edilir -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.paylas-alani',  // enjekte edilecek alan
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🌗 Tema Ayarı (`theme`)

| Değer | Ne yapar? |
|---|---|
| `'auto'` *(varsayılan)* | İşletim sistemi karanlık/aydınlık modunu takip eder, anlık değişir |
| `'dark'` | Her zaman karanlık tema |
| `'light'` | Her zaman aydınlık tema |

---

## ⚙️ Tüm Seçenekler

| Seçenek | Tip | Varsayılan | Açıklama |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` (yüzen buton+modal) veya `'inline'` (belirli alana enjeksiyon) |
| `theme` | `String` | `'auto'` | Renk teması: `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | `type:'inline'` için **zorunlu**. Butonun ekleneceği CSS seçicisi, örn. `'#paylaş'` |
| `buttonColor` | `String` | `'#4f46e5'` | Butonun rengi (HEX veya RGB) |
| `lang` | `String` | *Otomatik* | Dil kodu: `'tr'`, `'en'`, `'de'`… Belirtilmezse tarayıcı dilini okur |
| `redirectDelay` | `Number` | `1200` | "Kopyalandı" bildirimi gösterildikten kaç ms sonra AI'ya yönlendirileceği |

---

## 🚀 Özellikler

- 🌗 **Dark / Light / Auto Tema** — OS teması değişince widget anlık geçiş yapar
- 🛡️ **Sıfır CSS Çakışması** — Tüm stiller `#aisw-root` altında izole, `all: unset` korumalıdır. Tailwind, Bootstrap veya herhangi bir global reset ile sorunsuz çalışır
- 🔗 **AIO (AI SEO)** — JSON-LD, OpenGraph ve Twitter Card metadata'sını otomatik çeker, AI prompt'una bağlam olarak ekler
- 🧹 **Akıllı İçerik Temizliği** — Reklam, navigasyon, sidebar ve yorumları ayıklar; sadece makale gövdesini gönderir
- 📱 **Mobil Desteği** — iOS/Android'de popup engelleyicileri aşar, native uygulamaları doğrudan açar
- 🌍 **Çoklu Dil + RTL** — `tr`, `en`, `de`, `fr`, `es`, `zh`, `ru` ve daha fazlası; `ar`, `fa`, `he`, `ur` için tam RTL desteği

---

## 📄 Lisans

MIT © 2026 Mustafa Savul
