```markdown
# AI Summarize Widget ✨

Un widget léger, optimisé pour le SEO et hautement personnalisable qui permet aux visiteurs de votre site d'envoyer vos articles à leurs assistants IA préférés (ChatGPT, Claude, Gemini, Perplexity) pour les résumer.

Développé avec l'esthétique **Shadcn UI**, l'extraction de contexte **JSON-LD (AIO)** et le **Mobile Native Deep Linking**.

## 🚀 Fonctionnalités

- 🛡️ **Pas de collage automatique :** Une fonctionnalité de collage manuel stricte évite toute troncature due à la limite d'URL.
- 🔗 **Prise en charge AIO (AI SEO) :** Extrait automatiquement le schéma JSON-LD et les balises Meta pour injecter le nom du site, l'auteur et l'URL comme contexte pour l'IA.
- 🧹 **Nettoyage intelligent :** Ignore les publicités, barres de navigation, barres latérales et commentaires. Extrait uniquement le corps pur de l'article.
- 📱 **Mobile Deep Linking :** Contourne les bloqueurs de pop-ups mobiles et ouvre de manière fluide les applications IA natives (iOS/Android).
- 🌍 **Multilingue et RTL :** Détecte automatiquement `en`, `tr`, `es`, `zh`, `de`, `fr`, `it`, `pt`, `ru`, `nl`. Prise en charge complète des mises en page RTL (`ar`, `fa`, `he`, `ur`).
- 🎨 **Pas de fuite CSS :** Styles entièrement encapsulés qui ne conflueront jamais avec le CSS de votre site.

---

## 📦 Installation

### Méthode 1 : Via CDN (Le plus simple pour HTML/JS pur)
Ajoutez ce script dans votre HTML avant la balise fermante `</body>` :

```html
<script src="[https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js](https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js)"></script>

```

### Méthode 2 : Via NPM (Pour React, Vue, Next.js)

```bash
npm install ai-summarize-widget

```

```javascript
import AISummarizeWidget from 'ai-summarize-widget';

```

---

## 💻 Utilisation et types d'implémentation

Vous pouvez intégrer ce widget sur votre site de deux manières différentes selon vos besoins UI/UX.

### Type 1 : Bouton flottant fixe et modal (par défaut)

Place un bouton d'action flottant (FAB) dans le coin de l'écran. Au clic, il ouvre un modal centré et élégant. Parfait pour les blogs et les articles de presse longs.

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    buttonColor: '#4f46e5',   // Votre couleur de marque
    lang: 'fr'                // Force le français (optionnel)
  });
</script>

```

### Type 2 : Bouton inline et popover

Injecte le bouton directement dans une partie spécifique de votre DOM (par ex. à côté de vos boutons de partage social ou de l'en-tête de l'article). Au clic, il ouvre un popover contextuel attaché au bouton.

```html
<div class="my-share-buttons">
    <button>Partager sur X</button>
    </div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.my-share-buttons', // Sélecteur CSS où le bouton doit apparaître
    buttonColor: '#10b981'
  });
</script>

```

---

## ⚙️ Options de configuration

Vous pouvez facilement personnaliser le widget en passant un objet d'options lors de l'initialisation.

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| **`type`** | `String` | `'fixed'` | Le mode de rendu. Utilisez `'fixed'` pour un bouton/modal flottant, ou `'inline'` pour l'injecter dans un conteneur spécifique avec un popover. |
| **`target`** | `String` | `null` | **Requis si `type` est `'inline'`.** Le sélecteur CSS de l'élément DOM où le bouton sera ajouté (ex. `'.article-actions'`). |
| **`position`** | `String` | `'bottom-right'` | Positionnement pour le type `'fixed'`. Options : `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'`. |
| **`buttonColor`** | `String` | `'#4f46e5'` | Le code couleur HEX ou RGB pour les boutons et barres de progression du widget afin de correspondre à l'identité de votre marque. |
| **`lang`** | `String` | *Détecté automatiquement* | Force une langue spécifique. Si omis, il lit automatiquement l'attribut `<html lang="x">` ou la langue du navigateur de l'utilisateur. |
| **`redirectDelay`** | `Number` | `1200` | Le délai (en millisecondes) avant de rediriger l'utilisateur vers l'assistant IA, lui permettant de voir l'animation toast « Copié ». |

---

## 📄 Licence

Licence MIT © 2026
```
