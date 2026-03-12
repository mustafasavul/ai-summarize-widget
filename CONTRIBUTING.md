---

# Contributing to AI Summarize Widget 🤝

First of all, thank you for being here! We are thrilled that you want to help improve this project. Whether you are fixing a bug, adding a new language, or improving the documentation, your contribution is highly valued.

As a senior-focused project, we strive for high-quality, lightweight, and efficient code. Let's build the best AI content bridge together!

## 🌟 How Can You Help?

You can contribute in many ways:

* **Reporting Bugs:** Found a site where the cleaning engine fails? Open an issue!
* **Suggesting Features:** Have an idea for a 3rd implementation type? Let us know.
* **Improving Translations:** Help us reach more people by adding or fixing locales in `src/locales.json`.
* **Code Contributions:** Refactor logic, improve CSS isolation, or enhance metadata extraction.

---

## 🛠️ Development Setup

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
```bash
git clone https://github.com/YOUR_USERNAME/ai-summarize-widget.git

```


3. **Install dependencies** (Rollup and its plugins):
```bash
npm install

```


4. **Make your changes** in the `src/` directory.
5. **Build and test** your changes:
```bash
npm run build

```


*Tip: Use the `test.html` file to verify your changes in a real browser environment.*

---

## 📮 Pull Request Process

1. **Create a new branch** for your feature or fix: `git checkout -b feat/your-feature-name` or `git checkout -b fix/bug-name`.
2. **Commit your changes** with descriptive messages.
3. **Push to your fork** and **submit a Pull Request** (PR) to the `main` branch.
4. **Link your PR** to any related issues.
5. Once your PR is submitted, it will be reviewed as soon as possible.

---

## 📜 Code Style Guidelines

* **Keep it Lightweight:** Avoid adding external dependencies. We aim for a zero-dependency architecture.
* **Maintain Isolation:** Use the `aisw-` prefix for all CSS classes to prevent bleeding into the host website.
* **I18n Mindset:** If you add a new feature that includes text, please update all languages in `locales.json`.
* **Technical Accuracy:** Ensure metadata extraction logic remains hybrid and fallback-safe.

---

## ⚖️ Code of Conduct

Please note that this project is released with a [Code of Conduct](https://www.google.com/search?q=CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.

## ❓ Questions?

If you have any questions or need help getting started, feel free to open an issue or reach out to the project maintainer.

**Happy Coding!** 🚀
