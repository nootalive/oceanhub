# OceanHub - Sito Web Ufficiale

Sito web della community Discord **OceanHub**. Design pulito, accessibile, con sistema cookie consent GDPR-compliant e shop Ocean Coins integrato.

## 🌊 Features

- **Design Pulito**: Ispirato a sollary.net, minime emoji, focus su estetica
- **Accessibilità**: Skip-link, ARIA labels, focus states WCAG AA
- **Cookie Consent**: Banner GDPR con categorie Necessary/Analytics/Marketing
- **Shop Ocean Coins**: Sistema premi visualizzato dinamicamente da JSON
- **Responsive**: Mobile-first, ottimizzato per tutti i dispositivi
- **Performance**: Lazy loading, animazioni ridotte per prefers-reduced-motion
- **SEO**: Meta tags, Open Graph, JSON-LD schema

## 📁 Struttura File

```
oceanhub-sito/
├── index.html              # Homepage principale
├── styles.css              # Stili completi con variabili CSS
├── script.js               # JavaScript principale
├── cookies.js              # Gestione cookie consent
├── privacy.html            # Privacy policy
├── cookie-policy.html      # Cookie policy
├── data/
│   └── shop.json          # Dati shop Ocean Coins
├── assets/
│   ├── logo.svg           # Logo OceanHub
│   ├── hero-illustration.svg # Illustrazione hero
│   └── og-image.png       # (DA CREARE) Immagine Open Graph
└── README.md              # Questo file
```

## 🚀 Quick Start

### 1. Setup Locale

```bash
# Clone o scarica il repository
git clone https://github.com/yourusername/oceanhub-sito.git
cd oceanhub-sito

# Apri con Live Server (VS Code) o altro server locale
```

### 2. Personalizza Contenuti

#### Testi e Link Discord

Cerca nel codice e sostituisci:
- `https://www.discord.gg/oceanhub` → il tuo link Discord
- Testi nelle sezioni (Hero, Features, About) → personalizza come preferisci

#### Shop Ocean Coins

Modifica `data/shop.json`:

```json
{
  "items": [
    {
      "name": "Ruolo VIP",
      "description": "Descrizione premio",
      "price": 5000
    }
  ]
}
```

#### Colori e Palette

Modifica variabili in `styles.css` (linee 1-70):

```css
:root {
    --primary: #0370a6;       /* Blu oceano principale */
    --accent: #ffb84d;        /* Arancione accento */
    --bg-light: #f7fafc;      /* Background chiaro */
    /* ... */
}
```

### 3. Aggiungi Immagini

#### Open Graph Image (Obbligatorio per SEO)

Crea `assets/og-image.png` (1200x630px) con:
- Logo OceanHub
- Testo "OceanHub Community"
- Colori brand (#0370a6, #ffb84d)

Tool consigliati:
- [Canva](https://www.canva.com/) - template "Facebook Post"
- [Figma](https://www.figma.com/) - design da zero

#### Logo e Hero

I file SVG placeholder sono già presenti in `assets/`. Sostituiscili con design personalizzati se desiderato.

## 🔧 Configurazione Analytics

### Google Analytics 4

1. **Ottieni Tracking ID**:
   - Vai su [Google Analytics](https://analytics.google.com/)
   - Crea proprietà GA4
   - Copia il Measurement ID (formato `G-XXXXXXXXXX`)

2. **Aggiungi al sito**:
   
   In `cookies.js` (linea ~185), decomment e sostituisci:

   ```javascript
   loadAnalytics() {
       const script = document.createElement('script');
       script.async = true;
       script.src = 'https://www.googletagmanager.com/gtag/js?id=G-YOUR-ID-HERE';
       document.head.appendChild(script);

       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-YOUR-ID-HERE');
       window.gtag = gtag;
   }
   ```

3. **Verifica**:
   - Apri sito, accetta cookie Analytics
   - Vai su GA4 → Realtime
   - Verifica che la tua visita venga tracciata

### Plausible Analytics (Alternativa Privacy-Friendly)

```html
<!-- In index.html, prima di </head> -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🌐 Deploy su GitHub Pages

### Setup Repository

```bash
# Inizializza git (se non fatto)
git init
git add .
git commit -m "chore: initial site scaffold"

# Crea repository su GitHub e push
git remote add origin https://github.com/USERNAME/oceanhub-sito.git
git branch -M main
git push -u origin main
```

### Abilita GitHub Pages

1. Vai su repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `root`
4. Salva

Il sito sarà disponibile su: `https://USERNAME.github.io/oceanhub-sito/`

### Custom Domain (Opzionale)

1. Acquista dominio (es. Namecheap, CloudFlare)
2. Aggiungi DNS records:
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
          185.199.109.153
          185.199.110.153
          185.199.111.153
   
   Type: CNAME
   Name: www
   Value: USERNAME.github.io
   ```
3. GitHub → Settings → Pages → Custom domain → `yourdomain.com`
4. Abilita **Enforce HTTPS**

## ✅ Checklist Pre-Deploy

### Contenuti

- [ ] Link Discord aggiornati
- [ ] Testi personalizzati (Hero, About, Footer)
- [ ] Shop items aggiornati in `shop.json`
- [ ] Email contatto aggiornata (privacy/cookie policy)

### Immagini

- [ ] `assets/og-image.png` creata (1200x630px)
- [ ] Logo personalizzato (opzionale)
- [ ] Hero illustration personalizzata (opzionale)

### SEO

- [ ] Meta description personalizzata in `index.html`
- [ ] OG image path corretto
- [ ] Sitemap.xml generata (opzionale)

### Analytics & Cookie

- [ ] Google Analytics ID configurato (se usato)
- [ ] Cookie consent testato
- [ ] Privacy/Cookie Policy personalizzate

### Accessibility

- [ ] Test keyboard navigation (Tab, Enter, Esc)
- [ ] Test screen reader (NVDA/JAWS)
- [ ] Contrast ratio >= 4.5:1 (WCAG AA)

### Performance

- [ ] Lighthouse score >= 90 (Performance, Accessibility)
- [ ] Immagini ottimizzate (WebP/AVIF se possibile)
- [ ] CSS/JS minificati per produzione

## 🧪 Testing

### Lighthouse (Chrome DevTools)

```bash
# Apri DevTools → Lighthouse
# Run audit: Performance, Accessibility, Best Practices, SEO
# Target: >= 90 su tutti
```

### Keyboard Navigation

- **Tab**: navigazione tra link/bottoni
- **Enter**: attivazione link
- **Esc**: chiude menu mobile
- Skip-link visibile su **Tab** iniziale

### Cookie Consent

1. **Apri sito in incognito**
2. Verifica banner appare dopo 1s
3. Clicca "Personalizza" → verifica toggles funzionano
4. Salva preferenze → ricarica → banner non appare
5. **Console**: verifica `loadAnalytics()` chiamata solo se consenso dato

### Responsive

Test breakpoints:
- **Mobile**: 375px (iPhone SE)
- **Tablet**: 768px (iPad)
- **Desktop**: 1280px+

### Shop Loading

1. **Apri Console**
2. Verifica `shop.json` caricato correttamente
3. Items visualizzati nella sezione "Ocean Coins & Shop"

## 🎨 Customizzazione Avanzata

### Aggiungere Nuove Sezioni

```html
<!-- In index.html, dentro <main> -->
<section id="nuova-sezione" class="section">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">Titolo Sezione</h2>
            <p class="section-description">Descrizione</p>
        </div>
        
        <!-- Contenuto -->
    </div>
</section>
```

### Aggiungere Animazioni

```css
/* In styles.css */
@keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.mio-elemento {
    animation: slideIn 0.5s ease-out;
}

/* Rispetta prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
    .mio-elemento {
        animation: none;
    }
}
```

### Discord Server Widget

In `script.js` (linea ~270), decomment:

```javascript
function loadDiscordWidget() {
    const widgetContainer = document.getElementById('discord-widget');
    if (!widgetContainer) return;
    
    widgetContainer.innerHTML = `
        <iframe 
            src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=light" 
            width="350" 
            height="500" 
            allowtransparency="true" 
            frameborder="0"
        ></iframe>
    `;
}
```

Poi in `index.html`, aggiungi:

```html
<div id="discord-widget"></div>
```

## 🛠️ Ottimizzazione Produzione

### Minify CSS/JS

```bash
# Installa tools
npm install -g csso-cli terser

# Minify
csso styles.css -o styles.min.css
terser script.js -o script.min.js -c -m
terser cookies.js -o cookies.min.js -c -m

# Aggiorna link in index.html
<link rel="stylesheet" href="./styles.min.css">
<script src="./cookies.min.js"></script>
<script src="./script.min.js"></script>
```

### Ottimizzare Immagini

```bash
# WebP
cwebp og-image.png -o og-image.webp -q 85

# AVIF (massima compressione)
avif og-image.png -o og-image.avif -q 65
```

Usa `<picture>` per fallback:

```html
<picture>
    <source srcset="og-image.avif" type="image/avif">
    <source srcset="og-image.webp" type="image/webp">
    <img src="og-image.png" alt="OceanHub">
</picture>
```

## 📊 Monitoraggio

### Google Search Console

1. Vai su [Search Console](https://search.google.com/search-console)
2. Aggiungi proprietà con il tuo dominio
3. Verifica ownership (meta tag o file HTML)
4. Monitora indicizzazione e performance

### Plausible Dashboard

Se usi Plausible:
- Dashboard: `https://plausible.io/yourdomain.com`
- Metriche: pageviews, bounce rate, referrers, goals

## 🐛 Troubleshooting

### Cookie Banner Non Appare

1. Controlla Console per errori
2. Verifica `cookies.js` caricato correttamente
3. Cancella localStorage: `localStorage.clear()`
4. Ricarica in incognito

### Shop Non Carica

1. Verifica `data/shop.json` path corretto
2. Console → Network → verifica 200 OK per shop.json
3. Valida JSON su [jsonlint.com](https://jsonlint.com/)

### Analytics Non Traccia

1. Verifica consenso cookie dato (Console log)
2. Controlla GA4 Measurement ID corretto
3. DevTools → Network → cerca `google-analytics`
4. GA4 Realtime dovrebbe mostrare visite

### Menu Mobile Non Chiude

1. Verifica `script.js` caricato
2. Console → cerca errori JS
3. Test: click fuori menu dovrebbe chiudere

## 📝 Changelog

### v1.0.0 - 2024-12-07

- ✅ Scaffold iniziale sito completo
- ✅ Cookie consent GDPR-compliant
- ✅ Shop Ocean Coins dinamico
- ✅ Privacy e Cookie Policy
- ✅ Design responsive accessibile
- ✅ Integrazioni Discord tracking

## 🤝 Contributi

Per suggerimenti o bug:
1. Apri issue su GitHub
2. Contattaci su Discord: [discord.gg/oceanhub](https://www.discord.gg/oceanhub)

## 📄 Licenza

© 2024 OceanHub. Tutti i diritti riservati.

Il codice del sito è rilasciato sotto licenza MIT. I contenuti e i brand sono proprietà di OceanHub.

---

**Fatto con ❤️ dalla community OceanHub**

Per supporto o domande: [discord.gg/oceanhub](https://www.discord.gg/oceanhub)
