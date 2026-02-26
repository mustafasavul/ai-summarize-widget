```markdown
# AI Summarize Widget ✨

Web sitenizi ziyaret edenlerin makalelerinizi favori yapay zeka asistanlarına (ChatGPT, Claude, Gemini, Perplexity) özetleme için göndermesini sağlayan hafif, SEO dostu ve son derece özelleştirilebilir bir widget.

**Shadcn UI** estetiği, **JSON-LD (AIO)** bağlam çıkarma ve **Mobil Native Deep Linking** ile geliştirilmiştir.

## 🚀 Özellikler

- 🛡️ **Otomatik Yapıştırma Yok:** Katı manuel yapıştırma işlevi URL limit kesintisini önler.
- 🔗 **AIO (AI SEO) Desteği:** Site adı, yazar ve URL'yi yapay zeka için bağlam olarak enjekte etmek üzere JSON-LD Schema ve Meta etiketlerini otomatik olarak çıkarır.
- 🧹 **Akıllı Temizlik:** Reklamları, navigasyon çubuklarını, kenar çubuklarını ve yorumları yok sayar. Yalnızca saf makale gövdesini çıkarır.
- 📱 **Mobil Deep Linking:** Mobil açılır pencere engelleyicilerini atlar ve yerel yapay zeka uygulamalarını (iOS/Android) sorunsuz açar.
- 🌍 **Çoklu Dil ve RTL:** `en`, `tr`, `es`, `zh`, `de`, `fr`, `it`, `pt`, `ru`, `nl` dillerini otomatik algılar. RTL düzenleri (`ar`, `fa`, `he`, `ur`) tam desteklenir.
- 🎨 **CSS Sızıntısı Yok:** Web sitenizin CSS'i ile asla çakışmayacak tamamen kapsüllenmiş stiller.

---

## 📦 Kurulum

### Yöntem 1: CDN ile (Düz HTML/JS için en kolay)
Bu scripti HTML dosyanızda `</body>` etiketinden önce ekleyin:

```html
<script src="[https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js](https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js)"></script>

```

### Yöntem 2: NPM ile (React, Vue, Next.js için)

```bash
npm install ai-summarize-widget

```

```javascript
import AISummarizeWidget from 'ai-summarize-widget';

```

---

## 💻 Kullanım ve Uygulama Türleri

UI/UX ihtiyaçlarınıza göre bu widget'ı web sitenize iki farklı şekilde entegre edebilirsiniz.

### Tip 1: Sabit Yüzen Buton ve Modal (Varsayılan)

Ekranın köşesine yüzen bir aksiyon butonu (FAB) yerleştirir. Tıklandığında ortalanmış, şık bir modal açar. Bloglar ve uzun form haber makaleleri için idealdir.

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    buttonColor: '#4f46e5',   // Marka renginiz
    lang: 'tr'                // Türkçe zorlar (isteğe bağlı)
  });
</script>

```

### Tip 2: Satır İçi Buton ve Popover

Butonu doğrudan DOM'unuzun belirli bir bölümüne (ör. sosyal paylaşım butonlarınızın veya makale başlığınızın yanına) yerleştirir. Tıklandığında, butona bağlı bağlamsal bir popover açar.

```html
<div class="my-share-buttons">
    <button>X'te Paylaş</button>
    </div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.my-share-buttons', // Butonun görüneceği CSS seçicisi
    buttonColor: '#10b981'
  });
</script>

```

---

## ⚙️ Yapılandırma Seçenekleri

Widget'ı başlatma sırasında bir seçenek nesnesi geçirerek kolayca özelleştirebilirsiniz.

| Seçenek | Tip | Varsayılan | Açıklama |
| --- | --- | --- | --- |
| **`type`** | `String` | `'fixed'` | Render modu. Yüzen buton/modal için `'fixed'`, belirli bir kapsayıcıya popover ile yerleştirmek için `'inline'` kullanın. |
| **`target`** | `String` | `null` | **`type` `'inline'` ise zorunludur.** Butonun ekleneceği DOM öğesinin CSS seçicisi (ör. `'.article-actions'`). |
| **`position`** | `String` | `'bottom-right'` | `'fixed'` tipi için konumlandırma. Seçenekler: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`. |
| **`buttonColor`** | `String` | `'#4f46e5'` | Widget butonları ve ilerleme çubukları için marka kimliğinize uyacak HEX veya RGB renk kodu. |
| **`lang`** | `String` | *Otomatik algılanır* | Belirli bir dili zorlar. Belirtilmezse `<html lang="x">` özniteliğini veya kullanıcının tarayıcı dilini otomatik okur. |
| **`redirectDelay`** | `Number` | `1200` | Kullanıcıyı yapay zeka asistanına yönlendirmeden önce "Kopyalandı" toast animasyonunu görmesine izin veren gecikme (milisaniye cinsinden). |

---

## 📄 Lisans

MIT Lisansı © 2026
```
