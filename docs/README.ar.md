# AI Summarize Widget ✨

ودجة صغيرة وآمنة للـ CSS تتيح للزوار إرسال مقالاتك إلى **ChatGPT أو Claude أو Gemini أو Perplexity** بنقرة واحدة.

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](../LICENSE)

---

## ⚡ التثبيت في خطوتين

### الخطوة 1 — أضف السكريبت

الصق هذا مباشرةً قبل وسم `</body>`:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **تستخدم NPM / React / Next.js؟**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

### الخطوة 2 — شغّل الودجة

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // زر ✨ عائم يظهر في أسفل يمين الصفحة
    lang: 'ar'
  });
</script>
```

افتح الصفحة — سيظهر **زر ✨**. انقر عليه → اختر مساعداً → يُنسخ المحتوى → تُعاد توجيهك تلقائياً.

---

## 🔧 نمطان للاستخدام

### النمط 1 — زر عائم + نافذة (`type: 'fixed'`)

زر ثابت في زاوية الشاشة، يفتح نافذة حوار في المنتصف. **مثالي للمدونات ومقالات الأخبار.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',
    lang: 'ar'
  });
</script>
```

### النمط 2 — زر مضمّن + نافذة منبثقة (`type: 'inline'`)

يحقن الزر داخل عنصر موجود (مثل أزرار المشاركة).

```html
<div class="share-area">
  <button>مشاركة على X</button>
  <!-- ✨ سيُحقن هنا -->
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

## 🎯 نطاق المحتوى (`contentScope`)

تقييد التحليل على عنصر محدد — مفيد للمواقع التي تعرض عدة مقالات في نفس الصفحة.

```js
// موقع أخبار: 40 بطاقة مقالة في الصفحة
// inline → يستخدم closest('.article') تلقائياً للعثور على البطاقة الصحيحة
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
});

// زر عائم: يختار المقالة الأكثر ظهوراً في نافذة العرض
new AISummarizeWidget({
  type: 'fixed',
  contentScope: '.article',
});
```

| الحالة | السلوك |
|---|---|
| `contentScope` غير محدد | الكشف التلقائي الافتراضي (دون تغيير) |
| تطابق واحد | يُحلَّل هذا العنصر مباشرةً |
| `inline` + تطابقات متعددة | `inlineBtn.closest(sel)` → البطاقة التي تحتوي على الزر |
| `fixed` + تطابقات متعددة | العنصر ذو أكبر مساحة مرئية في نافذة العرض |
| لا تطابق | الرجوع إلى الكشف الافتراضي |

---

## 🌗 الثيم

| القيمة | السلوك |
|---|---|
| `'auto'` *(افتراضي)* | يتبع ثيم نظام التشغيل، يتحدث فورياً |
| `'dark'` | وضع داكن دائماً |
| `'light'` | وضع فاتح دائماً |

---

## ⚙️ جميع الخيارات

| الخيار | النوع | الافتراضي | الوصف |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` أو `'inline'` |
| `theme` | `String` | `'auto'` | `'auto'`، `'dark'`، `'light'` |
| `target` | `String` | `null` | **مطلوب لـ `'inline'`**. محدد CSS للعنصر المستهدف |
| `contentScope` | `String` | `null` | تقييد التحليل على محدد CSS. كشف ذكي عند تعدد العناصر |
| `buttonColor` | `String` | `'#4f46e5'` | لون الزر (HEX أو RGB) |
| `lang` | `String` | *تلقائي* | رمز اللغة: `'ar'`، `'en'`…… يقرأ لغة المتصفح إن لم يُحدَّد |
| `redirectDelay` | `Number` | `1200` | المدة (بالميلي ثانية) قبل التوجيه إلى مساعد الذكاء الاصطناعي |

---

## 📄 الترخيص

MIT © 2026 Mustafa Savul
