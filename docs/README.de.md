```markdown
# AI Summarize Widget ✨

Ein leichtgewichtiges, SEO-freundliches und hochgradig anpassbares Widget, mit dem Ihre Website-Besucher Ihre Artikel an ihre bevorzugten KI-Assistenten (ChatGPT, Claude, Gemini, Perplexity) zur Zusammenfassung senden können.

Entwickelt mit **Shadcn UI**-Ästhetik, **JSON-LD (AIO)**-Kontextextraktion und **Mobile Native Deep Linking**.

## 🚀 Funktionen

- 🛡️ **Kein Auto-Einfügen:** Strenge manuelle Einfügefunktion verhindert URL-Limit-Kürzungen.
- 🔗 **AIO (AI SEO) Unterstützung:** Extrahiert automatisch JSON-LD Schema und Meta-Tags, um Ihren Seitennamen, Autor und URL als Kontext für die KI zu injizieren.
- 🧹 **Intelligente Bereinigung:** Ignoriert Werbung, Navigationsleisten, Sidebars und Kommentare. Extrahiert nur den reinen Artikelinhalt.
- 📱 **Mobile Deep Linking:** Umgeht mobile Pop-up-Blocker und öffnet nahtlos native KI-Apps (iOS/Android).
- 🌍 **Mehrsprachig & RTL:** Erkennt automatisch `en`, `tr`, `es`, `zh`, `de`, `fr`, `it`, `pt`, `ru`, `nl`. Vollständige Unterstützung für RTL-Layouts (`ar`, `fa`, `he`, `ur`).
- 🎨 **Kein CSS-Bleeding:** Vollständig gekapselte Styles, die niemals mit dem CSS Ihrer Website kollidieren.

---

## 📦 Installation

### Methode 1: Via CDN (Am einfachsten für reines HTML/JS)
Fügen Sie dieses Script vor dem schließenden `</body>`-Tag in Ihre HTML-Datei ein:

```html
<script src="[https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js](https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js)"></script>

```

### Methode 2: Via NPM (Für React, Vue, Next.js)

```bash
npm install ai-summarize-widget

```

```javascript
import AISummarizeWidget from 'ai-summarize-widget';

```

---

## 💻 Verwendung & Implementierungstypen

Sie können dieses Widget je nach Ihren UI/UX-Anforderungen auf zwei verschiedene Arten in Ihre Website integrieren.

### Typ 1: Fixer Schwebender Button & Modal (Standard)

Platziert einen schwebenden Aktionsbutton (FAB) in der Ecke des Bildschirms. Bei Klick öffnet sich ein zentriertes, elegantes Modal. Ideal für Blogs und lange Nachrichtenartikel.

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    buttonColor: '#4f46e5',   // Ihre Markenfarbe
    lang: 'de'                // Erzwingt Deutsch (optional)
  });
</script>

```

### Typ 2: Inline-Button & Popover

Fügt den Button direkt in einen bestimmten Teil Ihres DOM ein (z. B. neben Ihren Social-Share-Buttons oder dem Artikelkopf). Bei Klick öffnet sich ein kontextbezogener Popover am Button.

```html
<div class="my-share-buttons">
    <button>Auf X teilen</button>
    </div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.my-share-buttons', // CSS-Selektor, wo der Button erscheinen soll
    buttonColor: '#10b981'
  });
</script>

```

---

## ⚙️ Konfigurationsoptionen

Sie können das Widget leicht anpassen, indem Sie bei der Initialisierung ein Optionsobjekt übergeben.

| Option | Typ | Standard | Beschreibung |
| --- | --- | --- | --- |
| **`type`** | `String` | `'fixed'` | Der Rendermodus. Verwenden Sie `'fixed'` für einen schwebenden Button/Modal oder `'inline'` zur Einbettung in einen bestimmten Container mit Popover. |
| **`target`** | `String` | `null` | **Erforderlich, wenn `type` `'inline'` ist.** Der CSS-Selektor des DOM-Elements, an das der Button angehängt wird (z. B. `'.article-actions'`). |
| **`position`** | `String` | `'bottom-right'` | Positionierung für den Typ `'fixed'`. Optionen: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`. |
| **`buttonColor`** | `String` | `'#4f46e5'` | Der HEX- oder RGB-Farbcode für die Widget-Buttons und Fortschrittsbalken zur Anpassung an Ihre Markenidentität. |
| **`lang`** | `String` | *Automatisch erkannt* | Erzwingt eine bestimmte Sprache. Wenn weggelassen, liest es automatisch das `<html lang="x">`-Attribut oder die Browser-Sprache des Nutzers. |
| **`redirectDelay`** | `Number` | `1200` | Die Verzögerung (in Millisekunden) vor der Weiterleitung zum KI-Assistenten, damit der Nutzer die „Kopiert“-Toast-Animation sehen kann. |

---

## 📄 Lizenz

MIT-Lizenz © 2026
```
