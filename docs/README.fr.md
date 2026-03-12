# AI Summarize Widget ✨

Un petit widget CSS-safe qui permet aux visiteurs d'envoyer vos articles à **ChatGPT, Claude, Gemini ou Perplexity** en un clic.

📦 **NPM:** https://www.npmjs.com/package/ai-summarize-widget

---

## ⚡ Installation en 5 minutes

### Étape 1 — Ajoutez le script

Collez cette ligne juste avant la balise fermante `</body>` de votre HTML :

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **Vous utilisez NPM ?**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

---

### Étape 2 — Initialisez le widget

Ajoutez ceci juste en dessous du script. C'est tout !

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // affiche un bouton ✨ flottant en bas à droite
    lang: 'fr'
  });
</script>
```

Ouvrez votre page — un **bouton ✨** apparaîtra en bas à droite. Cliquez dessus, choisissez un assistant IA, le contenu est copié automatiquement et vous êtes redirigé.

---

## 🔧 Deux modes

### Mode 1 : Bouton flottant + Modal (`type: 'fixed'`)

Un bouton fixe dans le coin de l'écran. Un clic ouvre une fenêtre de dialogue centrée. **Idéal pour les blogs et les sites d'actualités.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',  // n'importe quelle couleur hex
    lang: 'fr'
  });
</script>
```

### Mode 2 : Bouton intégré + Popover (`type: 'inline'`)

Injecte le bouton dans un élément existant de votre page (ex. à côté de vos boutons de partage).

```html
<!-- Vos boutons de partage existants -->
<div class="zone-partage">
  <button>Partager sur X</button>
  <!-- ✨ le widget sera injecté ici -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.zone-partage',  // sélecteur CSS de l'élément cible
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🌗 Thème (`theme`)

| Valeur | Comportement |
|---|---|
| `'auto'` *(défaut)* | Suit le mode sombre/clair de l'OS et se met à jour en temps réel |
| `'dark'` | Toujours sombre |
| `'light'` | Toujours clair |

---

## ⚙️ Toutes les options

| Option | Type | Défaut | Description |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` (bouton flottant + modal) ou `'inline'` (injection dans un conteneur) |
| `theme` | `String` | `'auto'` | Thème couleur : `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Obligatoire pour `'inline'`**. Sélecteur CSS de l'élément où injecter le bouton |
| `buttonColor` | `String` | `'#4f46e5'` | Couleur du bouton (HEX ou RGB) |
| `lang` | `String` | *Auto-détecté* | Code langue : `'fr'`, `'en'`, `'de'`… Lit la langue du navigateur si non défini |
| `redirectDelay` | `Number` | `1200` | Millisecondes avant la redirection vers l'assistant IA |

---

## 🚀 Fonctionnalités

- 🌗 **Thème Dark / Light / Auto** — Bascule instantanément quand le thème OS change
- 🛡️ **Zéro conflit CSS** — Tous les styles isolés sous `#aisw-root` avec `all: unset`. Compatible Tailwind, Bootstrap et tout reset global
- 🔗 **AIO (SEO pour l'IA)** — Extrait automatiquement JSON-LD, OpenGraph et Twitter Card en tant que contexte du prompt IA
- 🧹 **Extraction intelligente** — Supprime publicités, navigation, sidebars et commentaires. Corps de l'article uniquement
- 📱 **Support mobile** — Contourne les bloqueurs de popups sur iOS/Android, ouvre les apps natives directement
- 🌍 **Multilingue + RTL** — `fr`, `en`, `de`, `tr`, `es`, `zh`, `ru` et plus ; RTL complet pour `ar`, `fa`, `he`, `ur`

---

## 📄 Licence

MIT © 2026 Mustafa Savul
