# 🤝 Contributing to OceanHub Website

Grazie per l'interesse nel contribuire! Ecco le linee guida.

## 🚀 Setup Locale

```bash
# 1. Clone il repository
git clone https://github.com/yourusername/oceanhub-sito.git
cd oceanhub-sito

# 2. Avvia un server locale (Python)
python -m http.server 8000

# 3. Apri nel browser
# http://localhost:8000
```

## 📝 Workflow Development

### 1. Crea un Branch Feature

```bash
git checkout -b feature/my-awesome-feature
```

**Naming Convention:**
- `feature/` — Nuove feature
- `fix/` — Bug fixes
- `docs/` — Documentazione
- `style/` — Formatting
- `refactor/` — Codice riorganizzato

### 2. Fai Commit Atomici

```bash
git add .
git commit -m "feat: aggiungi dark mode toggle"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipi:**
- `feat` — Nuova feature
- `fix` — Bug fix
- `docs` — Documentazione
- `style` — Formatting (no logic change)
- `refactor` — Riorganizzazione codice
- `perf` — Performance improvement
- `test` — Test code

**Esempio Completo:**
```
feat(shop): add product filtering

- Aggiungi filtri per categor ruoli/personalizzati
- Implementa persistenza filtro in URL params
- Update jest tests

Fixes #42
```

### 3. Push & Create Pull Request

```bash
git push origin feature/my-awesome-feature
```

Su GitHub, apri una PR con descrizione dettagliata.

**PR Template:**
```markdown
## Descrizione
Cosa fa questa PR?

## Tipo di Cambio
- [ ] Bug fix
- [ ] Nuova feature
- [ ] Breaking change
- [ ] Documentazione

## Checklist
- [ ] Ho testato su mobile (480px)
- [ ] Ho testato su tablet (768px)
- [ ] Ho testato su desktop
- [ ] No console errors/warnings
- [ ] Debug mode funziona (?debug=1)
```

## 🎨 Code Style

### JavaScript

```javascript
// ✅ BUONO
const shopManager = (() => {
    let state = {};
    
    const init = () => {
        logger.info('Initializing shop');
    };
    
    return { init };
})();

// ❌ EVITARE
var shop = {};
function init() { console.log('init'); }
```

**Regole:**
- `const` per default, `let` se necessario
- Arrow functions per callback
- IIFE per moduli con stato privato
- Docstring JSDoc per funzioni pubbliche
- Commenti per "perché" non solo "cosa"

### CSS

```css
/* ✅ BUONO */
.button {
    /* Shadow sottile per profondità */
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
    padding: var(--spacing-md);
}

.button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* ❌ EVITARE */
.button {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
    padding: 1rem;
}
```

**Regole:**
- Usa variabili CSS per colori, spacing, shadows
- Scrivi media query per responsive
- Commenta sezioni CSS (/* ===== SECTION ===== */)
- Evita `!important`
- Ordina proprietà: display → position → size → colors → effects

### HTML

```html
<!-- ✅ BUONO -->
<div class="card" role="article" aria-label="Premium Item">
    <h3>Premium Item</h3>
    <p>Descrizione</p>
</div>

<!-- ❌ EVITARE -->
<div id="card" onclick="doSomething()">
    <b>Premium Item</b>
    <span>Descrizione</span>
</div>
```

**Regole:**
- Semantic HTML (`<section>`, `<article>`, `<nav>`)
- Aria-labels per accessibilità
- Data attributes per JS hooks (`data-shop-id`)
- Evita `<b>`, `<i>` — usa `<strong>`, `<em>`

## 🧪 Testing

### Manual Testing Checklist

Prima di PR, testa:

- [ ] **Desktop** (1920px+) — Tutto allineato correttamente
- [ ] **Tablet** (768px) — Grids diventano 1 colonna
- [ ] **Mobile** (480px) — Font leggibile, spacing ok
- [ ] **Dark Mode** — Contrasti visibili
- [ ] **Debug Mode** — Premi `D`, dev panel appare
- [ ] **Shop** — Clicca "Riscatta", modal si apre
- [ ] **Form Validation** — Termini checkbox required
- [ ] **Error State** — Carica API fail (10% chance)
- [ ] **Keyboard Nav** — Tab, Enter funzionano
- [ ] **Console** — No errors, solo warning accettati

### Performance Testing

```bash
# Lighthouse (browser DevTools)
# F12 → Lighthouse tab → Generate report

# Target:
# - Performance: > 85
# - Accessibility: > 95
# - Best Practices: > 90
```

## 📚 Documentazione

### Quando Aggiungere Docs

1. **Nuova Feature** → Aggiorna README.md o DESIGN_DECISIONS.md
2. **Breaking Change** → Documenta nel CHANGELOG.md
3. **Nuova Funzione** → Aggiungi JSDoc comments
4. **Nuova Sezione CSS** → Aggiungi commento sezione

### Esempio Documentazione

```javascript
/**
 * Carica i premi dello shop via mock API
 * @param {string} filter - Filtro categoria ('all', 'role', 'custom')
 * @returns {Promise<Array>} Lista premi
 * 
 * @example
 * const items = await shopManager.loadShop('role');
 */
const loadShop = async (filter = 'all') => {
    // implementazione
};
```

## 🐛 Segnalare Bug

1. Controlla che il bug non esista già in [Issues](https://github.com/yourusername/oceanhub-sito/issues)
2. Apri una nuova Issue con:
   - **Titolo descrittivo**
   - **Passi per riprodurre**
   - **Comportamento atteso vs. effettivo**
   - **Screenshot** (se applicabile)
   - **Browser/OS**

**Esempio:**
```markdown
# Modal non si chiude dopo riscatto

## Passi
1. Apri il sito
2. Clicca "Riscatta" su un premio
3. Compila il form e clicca "Invia"

## Atteso
Modal si chiude dopo 3 secondi

## Effettivo
Modal rimane aperta

## Environment
- Browser: Chrome 120
- OS: Windows 11
```

## 💡 Suggerire Features

Apri una Issue con tag `enhancement`:

```markdown
# Feature: Sorting premi per prezzo

Sarebbe bello poter sortare i premi per costo (ascending/descending).

## Implementazione Suggerita
- Aggiungi dropdown "Ordina per" nel shop header
- Salva preference in sessionStorage
```

## 🎯 Priority Areas

Priorità per contribuenti:

1. **High** 🔴
   - Bug critici (shop non carica)
   - Accessibilità (colori con contrasto insufficiente)

2. **Medium** 🟡
   - Feature proposte nella Roadmap
   - Miglioramenti UX

3. **Low** 🟢
   - Documentazione
   - Refactoring codice
   - Ottimizzazioni minori

## 📞 Contatti

- **Discord**: [Server OceanHub](https://discord.gg/oceanhub)
- **Issues**: [GitHub Issues](https://github.com/yourusername/oceanhub-sito/issues)
- **Email**: team@oceanhub.com (se applicabile)

## 📋 Code Review

I maintainer faranno review su:

1. **Funzionalità** — Funziona come promesso?
2. **Style** — Segue le linee guida?
3. **Performance** — Aggiunge overhead?
4. **Accessibilità** — Funziona su screen reader?
5. **Documentazione** — È ben documentato?

Sii aperto ai feedback! Sono per migliorare il codice collettivamente.

## 🎓 Imparare di Più

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [Web.dev](https://web.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Grazie per il tuo contributo al progetto OceanHub! 🌊**
