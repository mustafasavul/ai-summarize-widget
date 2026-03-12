# AI Summarize Widget ✨

Ein kleines, CSS-sicheres Widget, mit dem Besucher Ihre Artikel mit einem Klick an **ChatGPT, Claude, Gemini oder Perplexity** senden können.

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](../LICENSE)

---

## ⚡ Setup in 2 Schritten

### Schritt 1 — Script einbinden

Direkt vor dem schließenden `</body>`-Tag einfügen:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **NPM / React / Next.js?**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

### Schritt 2 — Initialisieren

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // ✨ Schwebeschaltfläche erscheint unten rechts
    lang: 'de'
  });
</script>
```

Seite öffnen — **✨ Button** erscheint. Klick → KI auswählen → Inhalt kopiert → weitergeleitet.

---

## 🔧 Zwei Modi

### Modus 1 — Schwebender Button + Modal (`type: 'fixed'`)

Fixer Button in der Ecke. Klick öffnet einen Dialog in der Mitte. **Ideal für Blogs und Artikel.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',
    lang: 'de'
  });
</script>
```

### Modus 2 — Eingebetteter Button + Popover (`type: 'inline'`)

Fügt den Button in ein vorhandenes Element ein (z. B. Share-Leiste).

```html
<div class="share-bereich">
  <button>Auf X teilen</button>
  <!-- ✨ wird hier eingefügt -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.share-bereich',
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🎯 Inhaltsbereich (`contentScope`)

Parsing auf ein bestimmtes Element einschränken — nützlich bei News-Feeds mit vielen Artikeln.

```js
// News-Feed: 40 Artikel-Cards auf der Seite
// inline → closest('.article') findet die richtige Card automatisch
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
});

// Fixer FAB: sichtbarster Artikel im Viewport
new AISummarizeWidget({
  type: 'fixed',
  contentScope: '.article',
});
```

| Situation | Verhalten |
|---|---|
| `contentScope` nicht gesetzt | Standard-Heuristik (unverändert) |
| 1 Treffer | Dieses Element wird geparst |
| `inline` + mehrere Treffer | `inlineBtn.closest(sel)` → Card mit dem Button |
| `fixed` + mehrere Treffer | Element mit größter sichtbarer Fläche im Viewport |
| 0 Treffer | Fallback auf Standard-Heuristik |

---

## 🌗 Theme

| Wert | Verhalten |
|---|---|
| `'auto'` *(Standard)* | Folgt OS-Theme, aktualisiert sich in Echtzeit |
| `'dark'` | Immer dunkel |
| `'light'` | Immer hell |

---

## ⚙️ Alle Optionen

| Option | Typ | Standard | Beschreibung |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` oder `'inline'` |
| `theme` | `String` | `'auto'` | `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Pflicht bei `'inline'`**. CSS-Selektor des Zielelements |
| `contentScope` | `String` | `null` | Parsing auf CSS-Selektor beschränken. Intelligente Multi-Element-Erkennung |
| `buttonColor` | `String` | `'#4f46e5'` | Buttonfarbe (HEX oder RGB) |
| `lang` | `String` | *Auto* | Sprachcode: `'de'`, `'en'`… Liest Browsersprache falls leer |
| `redirectDelay` | `Number` | `1200` | ms vor der Weiterleitung zur KI |

---

## 📄 Lizenz

MIT © 2026 Mustafa Savul
