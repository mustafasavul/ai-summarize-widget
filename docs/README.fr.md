# AI Summarize Widget ✨

Un petit widget CSS-safe qui permet aux visiteurs d'envoyer vos articles à **ChatGPT, Claude, Gemini ou Perplexity** en un clic.

[![npm](https://img.shields.io/npm/v/ai-summarize-widget)](https://www.npmjs.com/package/ai-summarize-widget)
[![license](https://img.shields.io/npm/l/ai-summarize-widget)](../LICENSE)

---

## ⚡ Installation en 2 étapes

### Étape 1 — Ajoutez le script

Juste avant la balise fermante `</body>` :

```html
<script src="https://unpkg.com/ai-summarize-widget/dist/ai-summarize-widget.min.js"></script>
```

> **NPM / React / Next.js ?**
> ```bash
> npm install ai-summarize-widget
> ```
> ```js
> import AISummarizeWidget from 'ai-summarize-widget';
> ```

### Étape 2 — Initialisez

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',  // bouton ✨ flottant en bas à droite
    lang: 'fr'
  });
</script>
```

Ouvrez la page — un **bouton ✨** apparaît. Clic → choisissez une IA → contenu copié → redirection automatique.

---

## 🔧 Deux modes

### Mode 1 — Bouton flottant + Modal (`type: 'fixed'`)

Un bouton fixe dans le coin. Un clic ouvre une fenêtre centrée. **Idéal pour les blogs et articles.**

```html
<script>
  new AISummarizeWidget({
    type: 'fixed',
    theme: 'auto',           // 'auto' | 'dark' | 'light'
    buttonColor: '#4f46e5',
    lang: 'fr'
  });
</script>
```

### Mode 2 — Bouton intégré + Popover (`type: 'inline'`)

Injecte le bouton dans un élément existant (ex. barre de partage).

```html
<div class="zone-partage">
  <button>Partager sur X</button>
  <!-- ✨ injecté ici -->
</div>

<script>
  new AISummarizeWidget({
    type: 'inline',
    target: '.zone-partage',
    theme: 'dark',
    buttonColor: '#10b981'
  });
</script>
```

---

## 🎯 Zone de contenu (`contentScope`)

Restreindre le parsing à un élément précis — utile pour les pages avec plusieurs articles.

```js
// Fil d'actualité : 40 cartes d'articles
// inline → closest('.article') trouve la bonne carte automatiquement
new AISummarizeWidget({
  type: 'inline',
  target: '.article .share-bar',
  contentScope: '.article',
});

// FAB fixe : l'article le plus visible dans le viewport
new AISummarizeWidget({
  type: 'fixed',
  contentScope: '.article',
});
```

| Situation | Comportement |
|---|---|
| `contentScope` absent | Heuristique par défaut (inchangée) |
| 1 correspondance | Cet élément est parsé |
| `inline` + plusieurs | `inlineBtn.closest(sel)` → la carte contenant le bouton |
| `fixed` + plusieurs | Élément avec la plus grande surface visible dans le viewport |
| 0 correspondance | Retour à l'heuristique par défaut |

---

## 🌗 Thème

| Valeur | Comportement |
|---|---|
| `'auto'` *(défaut)* | Suit l'OS, mise à jour en temps réel |
| `'dark'` | Toujours sombre |
| `'light'` | Toujours clair |

---

## ⚙️ Toutes les options

| Option | Type | Défaut | Description |
|---|---|---|---|
| `type` | `String` | `'fixed'` | `'fixed'` ou `'inline'` |
| `theme` | `String` | `'auto'` | `'auto'`, `'dark'`, `'light'` |
| `target` | `String` | `null` | **Obligatoire pour `'inline'`**. Sélecteur CSS de l'élément cible |
| `contentScope` | `String` | `null` | Restreindre le parsing à un sélecteur CSS. Détection multi-éléments intelligente |
| `buttonColor` | `String` | `'#4f46e5'` | Couleur du bouton (HEX ou RGB) |
| `lang` | `String` | *Auto* | Code langue : `'fr'`, `'en'`… Lit la langue du navigateur si absent |
| `redirectDelay` | `Number` | `1200` | ms avant la redirection vers l'IA |

---

## 📄 Licence

MIT © 2026 Mustafa Savul
