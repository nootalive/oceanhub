# 🌊 OceanHub - Community Discord

Sito web ufficiale della community Discord OceanHub. Design pulito, accessibile e performante con sistema Ocean Coins integrato.

## ✨ Features

- ✅ **Design fluido** con sfumature oceano (cyan/teal/turquoise)
- ✅ **Responsive** mobile-first con hamburger menu
- ✅ **Accessibilità WCAG AA**: skip-link, focus states, ARIA labels
- ✅ **Cookie consent GDPR** con gating Analytics/Marketing
- ✅ **Shop Ocean Coins** con loader dinamico da JSON
- ✅ **SEO completo**: Open Graph, Twitter Cards, JSON-LD
- ✅ **Performance**: CSS/JS minificati (-29% CSS, -47% JS)
- ✅ **No emoji eccessivi**: solo SVG Heroicons outline

## 📁 Struttura File

```
oceanhub/
├── index.html              # Pagina principale
├── styles.css              # CSS completo (dev)
├── styles.min.css          # CSS minificato (prod) -29%
├── script.js               # JavaScript principale (dev)
├── script.min.js           # JS minificato (prod) -47%
├── cookies.js              # Gestione cookie consent (dev)
├── cookies.min.js          # Cookie JS minificato (prod)
├── cookie-policy.html      # Policy cookie
├── privacy.html            # Privacy policy
├── assets/
│   ├── logo.svg           # Logo OceanHub
│   ├── og-image.svg       # Open Graph image 1200x630
│   └── hero-illustration.svg
├── data/
│   └── shop.json          # Prodotti shop Ocean Coins
└── README.md              # Questo file
```

## 🚀 Deploy su GitHub Pages

### Setup Iniziale

1. **Push su GitHub**:
   ```bash
   git add -A
   git commit -m "feat: sito completo con minificazione e OG image"
   git push origin feature/fix-mod-banner-audio
   ```

2. **Merge su main**:
   ```bash
   git checkout main
   git merge feature/fix-mod-banner-audio
   git push origin main
   ```

3. **Abilita GitHub Pages**:
   - Vai su Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save

4. **Verifica deployment**:
   - URL: `https://nootalive.github.io/oceanhub/`
   - Attendi 1-2 minuti per build

## 🎨 Personalizzazione

### Colori

Modifica variabili CSS in `styles.css`:

```css
:root {
    --ocean-1: #0891b2;  /* Cyan oceano */
    --ocean-2: #06b6d4;  /* Cyan chiaro */
    --ocean-3: #22d3ee;  /* Turquoise */
    --accent: #f59e0b;   /* Arancio */
}
```

### Contenuti

- **Testi**: modifica direttamente `index.html`
- **Shop prodotti**: edita `data/shop.json`
- **Policy**: aggiorna `privacy.html` e `cookie-policy.html`

### Immagini

Sostituisci in `assets/`:
- `og-image.svg` - Open Graph (1200x630px)
- `logo.svg` - Logo navbar
- `hero-illustration.svg` - Illustrazione hero

## 🔒 Privacy & Cookie

### Cookie Consent

Il sistema è già configurato in `cookies.js`:

- **Necessary**: Sempre attivi (preferenze utente)
- **Analytics**: Google Analytics (G-XXXXXXXXXX) - richiede consenso
- **Marketing**: Widget esterni - richiede consenso

### Configurare Google Analytics

1. Ottieni tracking ID da Google Analytics
2. Sostituisci `G-XXXXXXXXXX` in `cookies.js` (linee 306, 312)
3. Verifica gating: Analytics non si carica senza consenso

## ⚡ Performance

### Minificazione

File minificati già generati:
- `styles.min.css`: 14.3 KB (-29%)
- `script.min.js`: 6.1 KB (-47%)
- `cookies.min.js`: Minificato

### Ottimizzazioni Implementate

✅ Lazy loading immagini  
✅ Font preconnect (Google Fonts)  
✅ CSS/JS minificati  
✅ SVG invece di PNG per icone  
✅ Glassmorphism con backdrop-filter

### Lighthouse Target

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 95

## ♿ Accessibilità

### Implementato

✅ Skip link visibile al focus  
✅ Focus states WCAG AA (outline 3px)  
✅ ARIA labels completi  
✅ Semantic HTML5  
✅ Contrasto WCAG AA  
✅ Keyboard navigation  

### Test Checklist

- [ ] Naviga con solo TAB
- [ ] Focus visibile ovunque
- [ ] Screen reader (NVDA/JAWS)
- [ ] Lighthouse ≥ 95
- [ ] Contrasto ≥ 4.5:1

## 🧪 Testing

### Test Locale

```bash
python -m http.server 8080
# Apri http://localhost:8080
```

### Test Cookie Gating

1. Apri in incognito
2. DevTools → Network
3. Rifiuta Analytics
4. Verifica gtag NON caricato
5. Accetta → verifica caricamento

## 🐛 Troubleshooting

**Navbar non apre**: Check `script.js` e classe `.active`  
**Sfondo statico**: Verifica variabili CSS ocean  
**Shop vuoto**: Valida `shop.json` (JSONLint)  
**Analytics manca**: Check tracking ID e consenso

## 📊 Analytics

Eventi tracciati:
- `discord-nav`, `discord-hero`, `discord-coins`, `discord-community`

## 🔗 Link Utili

- **Discord**: https://www.discord.gg/oceanhub
- **GitHub**: https://github.com/nootalive/oceanhub
- **Live**: https://nootalive.github.io/oceanhub/

---

**Sviluppato con ❤️ per OceanHub** 🌊
