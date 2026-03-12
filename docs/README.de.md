# AI Summarize Widget ✨

Ein kleines, CSS-sicheres Widget, mit dem Besucher Ihre Artikel mit einem Klick an **ChatGPT, Claude, Gemini oder Perplexity** senden können.

📦 **NPM:** https://www.npmjs.com/package/ai-summarize-widget

---

## ⚡ Setup in 5 Minuten

### Schritt 1 — Script einbinden

Fügen Sie diese Zeile direkt vor dem schließenden `</body>`-Tag Ihrer HTML-Seite ein:

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **NPM-Nutzer:**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

---

### Schritt 2 — Widget initialisieren

Fügen Sie dies direkt unter dem Script-Tag hinzu. Das war's!

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // zeigt einen ✨ Schwebeschaltfläche unten rechts
    lang: 'de'
  });
</script>
```

Öffnen Sie Ihre Seite — ein **✨ Button** erscheint unten rechts. Klicken Sie darauf, wählen Sie einen KI-Assistenten, der Inhalt wird automatisch kopiert und Sie werden weitergeleitet.

---

## 🔧 Zwei Modi

### Modus 1: Schwebender Button + Modal (`type: 'fixed'`)

Ein fixer Button in der Ecke. Klicken öffnet einen zentrierten Dialog. **Ideal für Blogs und Nachrichtenwebsites.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',  // beliebige Farbe
    lang: 'de'
  });
</script>
```

### Modus 2: Inline-Button + Popover (`type: 'inline'`)

Fügt den Button in ein vorhandenes Element Ihrer Seite ein (z. B. neben Ihren Share-Buttons).

```html
<!-- Vorhandene Share-Buttons -->
<div class="share-bereich">
  <button>Auf X teilen</button>
  <!-- ✨ Widget wird hier eingefügt -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.share-bereich',   // CSS-Selektor des Zielelements
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🌗 Theme (`theme`)

| Wert | Verhalten |
|---|---|
| `'auto'` *(Standard)* | Folgt dem Hell-/Dunkelmodus des Betriebssystems, aktualisiert sich in Echtzeit |
| `'dark'` | Immer dunkles Theme |
| `'light'` | Immer helles Theme |

---

## ⚙️ Alle Optionen

| Option | Typ | Standard | Beschreibung |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` (schwebender Button + Modal) oder `'inline'` (in Container einfügen) |
| `theme` | `String` | `'auto'` | Farbthema: `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Pflicht bei `'inline'`**. CSS-Selektor des Zielelements, z. B. `'#share-leiste'` |
| `buttonColor` | `String` | `'#4f46e5'` | Buttonfarbe (beliebiger HEX- oder RGB-Wert) |
| `lang` | `String` | *Automatisch* | Sprachcode: `'de'`, `'en'`, `'tr'`… Liest Browsersprache falls nicht angegeben |
| `redirectDelay` | `Number` | `1200` | Millisekunden vor der Weiterleitung zum KI-Assistenten |

---

## 🚀 Funktionen

- 🌗 **Dark / Light / Auto Theme** — Wechselt sofort wenn sich das OS-Theme ändert
- 🛡️ **Kein CSS-Konflikt** — Alle Stile unter `#aisw-root` isoliert mit `all: unset`. Sicher neben Tailwind, Bootstrap oder jedem globalen Reset
- 🔗 **AIO (KI-SEO)** — Extrahiert automatisch JSON-LD, OpenGraph und Twitter Card Metadaten und fügt sie dem KI-Prompt als Kontext hinzu
- 🧹 **Intelligente Inhaltsextraktion** — Entfernt Werbung, Navigation, Sidebars und Kommentare. Nur der reine Artikeltext
- 📱 **Mobile-Unterstützung** — Umgeht Popup-Blocker auf iOS/Android, öffnet native Apps direkt
- 🌍 **Mehrsprachig + RTL** — `de`, `en`, `tr`, `fr`, `es`, `zh`, `ru` und mehr; vollständiges RTL für `ar`, `fa`, `he`, `ur`

---

## 📄 Lizenz

MIT © 2026 Mustafa Savul
