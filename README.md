# 🌊 OceanHub Website

Sito web ufficiale della community Discord OceanHub — una community attiva dal 2022 con eventi, giochi, voice chat e un esclusivo sistema di Ocean Coins.

## 📁 Struttura del Progetto

```
oceanhub-sito/
├── index.html              # HTML principale con markup semantico
├── styles.css              # Stylesheet completo con design system
├── script.js               # JavaScript vanilla con logger, mock API, modals
├── README.md               # Questo file
├── DESIGN_DECISIONS.md     # Decisioni architetturali e di design
└── CHANGELOG.md            # Versioni e improvements
```

## 🎯 Tecnologie Scelte

### Perché HTML/CSS/JavaScript Vanilla?

1. **Zero Dipendenze** — Nessun bundler, nessun framework — perfetto per un sito statico
2. **Performance** — Caricamento istantaneo, nessun overhead di runtime
3. **Manutenibilità** — Codice leggibile e facilmente modificabile
4. **SEO** — HTML semantico con meta tags appropriati
5. **Compatibilità** — Funziona su tutti i browser moderni
6. **Scalabilità** — Facile aggiungere integrazioni (bot Discord, analytics, ecc.)

### Google Fonts

- **Inter** (700-900): Headings e UI — pulito, moderno, Discord-like
- **Roboto** (400): Body text — leggibile e professionale

### Tipografia Responsiva

Utilizzo `CSS clamp()` per una scala automatica basata sul viewport:

```css
h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); }
```

Questo garantisce:
- Mobile: font leggibile e compatto
- Desktop: font ampio e impattante
- Transizioni smooth senza breakpoint rigidi

## 🎨 Design System - Neon Theme

### Palette Colori Neon

Tema dark **neon** ispirato a Discord con effetti glow:

```
Neon Blue:    #5865f2 (Discord Primary)
Neon Cyan:    #00d4ff (Glow Accent — PRIMARY!)
Neon Purple:  #b300ff (Secondary Glow)
Neon Green:   #57f287 (Success Color)
Ocean Blue:   #00A8E8 (Brand Color)

Neutrals:
Dark BG:      #0a0e27 (Very dark blue-black)
Card BG:      #1a1f3a (Card background)
Text Primary: #ffffff
Text Secondary: #b4bcc6
```

### Neon Effects

Ogni elemento ha:
- **Glow Effects** — Text-shadow e box-shadow con cyan neon
- **Gradienti Animati** — Linear gradient su buttons e hero
- **Micro Glow** — Soft bloom on hover con cubic-bezier easing
- **Pulsing Animation** — Subtle neon pulse su CTA buttons

**Razionale:** La palette riflette il tema Discord (primary blue) ma aggiunge due accenti complementari (green e cyan) per richiamare il tema "oceano" di OceanHub. Crea contrasto visivo e migliora l'accessibilità.

### Spacing & Sizing

Sistema di spacing coerente basato su `1rem = 16px`:

```
--spacing-xs: 0.25rem    (4px)
--spacing-sm: 0.5rem     (8px)
--spacing-md: 1rem       (16px)
--spacing-lg: 1.5rem     (24px)
--spacing-xl: 2rem       (32px)
--spacing-2xl: 3rem      (48px)
```

### Shadows & Glassmorphism

Ombre sottili per profondità con effetto glassmorphism leggero:

```css
--shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.15);
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 20px 60px rgba(88, 101, 242, 0.3);
--backdrop-blur: blur(10px);
```

**Razionale:** Le ombre blu (primary color) creano coesione visiva e danno un senso di "immersione" nel tema.

## ⚡ Features Implementate

### 1. Discord OAuth2 Integration (Demo)

- **Connect Discord Button** — Apre OAuth2 flow di Discord
- **Placeholder Credentials** — `YOUR_CLIENT_ID` e redirect_uri da sostituire
- **User Status Display** — Mostra username e avatar quando connesso
- **Demo Mode** — Simula OAuth success con parametro `?oauth=success`

#### Setup OAuth2 Reale

1. **Crea Discord Application**:
   - Vai a [Discord Developer Portal](https://discord.com/developers/applications)
   - New Application → Nomina "OceanHub"
   - Copia il `CLIENT_ID`

2. **Configura Redirect URI**:
   - OAuth2 tab → Add Redirect
   - Inserisci: `https://your-domain.com/oauth` (o localhost:8000 per dev)

3. **Sostituisci in script.js**:

```javascript
// Linea ~150 in script.js
const CLIENT_ID = 'YOUR_CLIENT_ID_QUI';
const REDIRECT_URI = 'https://your-domain.com/oauth';
```

4. **Backend per OAuth Callback**:
   - Il tuo server riceve `code` da Discord
   - Exchange `code` per access token
   - Fetch user info: `/oauth2/@me`
   - Store token (secure, httpOnly cookie)

### 2. Discord Roles Sync (Mock)

- **Sync Roles Button** — Sincronizza ruoli dal server Discord
- **Rank Display** — Mostra ruoli con colore Discord
- **Mock API** — Simula `/guilds/{id}/members/@me`

#### Setup Ruoli Reali

In **script.js**, la funzione `mockAPI.fetchRoles()` simula:

```javascript
// In produzione: usare questo endpoint
GET /api/guilds/{guild_id}/members/@me HTTP/1.1
Authorization: Bearer {bot_token}
```

Oppure via **OAuth2 scope `guilds`**:

```javascript
GET https://discord.com/api/oauth2/@me/guilds HTTP/1.1
Authorization: Bearer {access_token}
```

I ruoli ritornati hanno: `id`, `name`, `color`, `position`

### 3. Shop Ocean Coins (Dinamico)

- **Wallet Demo** — Mostra saldo coins in tempo reale
- **Grid Prodotti** — 6 premi con icone, descrizioni e costi
- **Filtri** — Tutti / Ruoli / Personalizzati
- **Mock API** — Simulazione /coins shop con latenza realistica
- **Error Handling** — Fallback UI se il fetch "fallisce"

### 4. Modal Ticket PERKS

- **Form Validazione** — Client-side validation (checkbox required)
- **Integrazione Shop** — Clicca "Riscatta" per aprire la modal
- **Focus Management** — Focus trap sul primo input (accessibility)
- **Escape Close** — Premi ESC per chiudere
- **Success Feedback** — Ticket ID generato + nuovo saldo mostrato
- **Auto-close** — Modal chiude automaticamente dopo 5 secondi

#### Webhook POST per Ticket (Produzione)

Quando l'utente invia il ticket, il form chiama `mockAPI.submitTicket()`.

**In produzione, inviare a Discord webhook:**

```javascript
// Header: webhook POST
POST /api/webhooks/{webhook_id}/{token} HTTP/1.1
Content-Type: application/json

// Body:
{
  "content": "🎫 Nuovo Ticket PERKS",
  "embeds": [{
    "title": "Richiesta Riscatto",
    "description": "Un utente ha richiesto un premio",
    "fields": [
      { "name": "Premio", "value": "⭐ Ruolo Supporter", "inline": true },
      { "name": "Costo", "value": "500 coins", "inline": true },
      { "name": "Note", "value": "Preferisco colore blu" },
      { "name": "Ticket ID", "value": "TICKET-1234567890" }
    ],
    "color": 16711680
  }]
}
```

Oppure **API REST endpoint personalizzato:**

```javascript
POST /api/ticket HTTP/1.1
Content-Type: application/json
Authorization: Bearer BOT_TOKEN

{
  "userId": "123456789",
  "guildId": "987654321",
  "prizeId": "role_supporter",
  "prizeName": "⭐ Ruolo Supporter",
  "cost": 500,
  "notes": "Preferisco colore blu",
  "timestamp": "2024-12-07T23:59:59Z"
}
```

### 5. Logger & Debug Mode

#### Debug Mode (Tasto `D` o `?debug=1`)

Attiva:
- Overlay griglia CSS per debugging layout
- Dev Panel in basso a destra con log in tempo reale
- Viewport info nel logger
- All logs di API calls

**Comandi:**

```
D — Toggle debug mode on/off
?debug=1 — URL parameter per enable debug all'apertura
?oauth=success — Simula OAuth login (demo mode)
```

#### Logger Utility

```javascript
logger.info('Messaggio informativo');        // Cyan
logger.warn('Avvertimento');                 // Yellow
logger.error('Errore critico');              // Red
```

Output simultaneo su:
- **Console Browser** (Ctrl+Shift+J o F12 → Console tab)
- **Dev Panel** (toggle con D key) — Utile se DevTools non disponibili

### 6. Mock API

Simula chiamate al backend Discord bot con latenza realistica:

```javascript
// /coins/shop - Restituisce lista premi
const result = await mockAPI.fetchShop('all')
// → { success: true, data: [6 items] }

// /coins/wallet - Restituisce saldo
const result = await mockAPI.fetchWallet()
// → { success: true, data: { balance: 1250, ... } }

// /guilds/{id}/members/@me - Sincronizza ruoli
const result = await mockAPI.fetchRoles()
// → { success: true, data: [rank badges] }

// POST /api/ticket - Sottometti ticket PERKS
const result = await mockAPI.submitTicket({ itemId, cost, notes })
// → { success: true, data: { ticketId: 'TICKET-1234567890', newBalance: 750 } }
```

**Features:**
- Latenza realistica (500-1500ms) per simulare network
- Fallimento casuale (3-10% probabilità) per testare error handling
- Detrimento coins realistico con validazione saldo

### 7. Animazioni Leggere (Neon Fluido)

- **Fade-in on scroll** — Card appaiono con animation quando entrano in viewport
- **Glow Neon** — Text-shadow e box-shadow su titoli e bottoni
- **Micro-glow Hover** — Soft bloom effect con cubic-bezier easing
- **Float animation** — Card hero galleggia dolcemente (4s cycle)
- **Wave SVG** — Onda animata nel background (8s linear)
- **Neon Pulse** — Button CTA pulsa dolcemente (2s cycle)
- **Shine Effect** — Effetto brillamento su shop items hover
- **Prefers-reduced-motion** — Tutte le animazioni disabilitate se preferenza utente

## 📱 Responsività

Tre breakpoint principali:

- **Tablet** (max-width: 768px)
  - Grid 1 colonna per contenuti
  - Buttons a larghezza piena
  - Navigation ottimizzata

- **Mobile** (max-width: 480px)
  - Font size ridotto
  - Spacing compatto
  - Modal full-width
  - Dev panel ottimizzato

- **Large Screen** (min-width: 1440px)
  - Container max 1400px
  - Spacing aumentato
  - Hero altezza 90vh

## 🔍 Accessibilità

- ✅ Colori con contrasto WCAG AA
- ✅ Aria-labels su elementi interattivi
- ✅ Focus states visibili
- ✅ Tastiera navigabile (Tab, Enter, D per debug)
- ✅ Rispetto di `prefers-reduced-motion`
- ✅ Semantic HTML (`<section>`, `<header>`, `<nav>`)

## 🚀 Deployment

### GitHub Pages (Consigliato)

```bash
# 1. Crea un repository su GitHub
git init
git add .
git commit -m "Initial commit: OceanHub website"
git remote add origin https://github.com/yourusername/oceanhub-sito.git
git push -u origin main

# 2. Abilita GitHub Pages nel repository settings
# 3. Deploy automatico da main branch
```

**URL:** `https://yourusername.github.io/oceanhub-sito/`

### Hosting Alternativo

- **Vercel** — `vercel deploy`
- **Netlify** — Drag & drop o git integration
- **Self-hosted** — Copia i file su qualsiasi server web

## 🔧 Development

### Debug Mode

**Attivazione Debug:**

```javascript
// Opzione 1: URL parameter
https://yoursito.com/?debug=1

// Opzione 2: Tasto D da tastiera (toggle on/off)
Premi D per attivare/disattivare debug mode

// Opzione 3: OAuth simulation
https://yoursito.com/?oauth=success
// Simula login Discord per testare ranks sync
```

**Cosa vedrai in debug mode:**
- Overlay griglia CSS (cyan dots) — Aiuta a visualizzare layout
- Dev Panel (basso destra) — Log in tempo reale di:
  - API calls (shop, wallet, roles)
  - User actions (click, form submit)
  - Errors e warnings
- Console browser (F12) — Colored logs

**Esempi di log:**
```
[14:23:45] ✅ Shop loaded: 6 items
[14:23:46] 💰 Wallet updated: 1250 coins
[14:23:47] 🎖️ Roles synced: 2 ruoli
[14:23:48] ❌ Ticket submit failed: Saldo insufficiente
```

### OAuth2 Testing

**Mock OAuth (Demo):**

```
1. Clicca "Connect Discord" button in navbar
2. Clicca "Sì" quando chiede di simulare login
3. Ti reindirizza con ?oauth=success
4. Navbar mostra utente connesso
5. Bottone "Sync Roles" diventa disponibile
```

**Setup OAuth Reale:**

Vedi sezione "Discord OAuth2 Integration" sopra per step completi.

### Ticket & Webhook Testing

**Test in locale (Mock):**

```javascript
// 1. Apri DevTools (F12)
// 2. Console tab
// 3. Esegui:
logger.info('Test ticket submission');
await mockAPI.submitTicket({
    itemId: 'role_supporter',
    itemName: '⭐ Ruolo Supporter',
    cost: 500,
    notes: 'Test ticket'
});
// → Vedrai success/error nel dev panel e console
```

**Test Webhook Reale:**

```bash
# 1. Crea un webhook in un canale Discord
# Settings → Webhooks → New Webhook
# Copia l'URL: https://discord.com/api/webhooks/{id}/{token}

# 2. Testa POST manuale con curl
curl -X POST https://discord.com/api/webhooks/ID/TOKEN \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🎫 Test Ticket",
    "embeds": [{
      "title": "Test Submission",
      "description": "Questo è un test"
    }]
  }'

# 3. Dovresti vedere il messaggio nel canale Discord
```

### Linting & Formatting

#### ESLint (Consigliato)

```bash
npm install -D eslint
npx eslint script.js
```

**Config `.eslintrc.json` (minimal):**

```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "rules": {
    "no-console": ["warn"],
    "no-unused-vars": ["warn"],
    "prefer-const": ["warn"]
  }
}
```

#### Stylelint (Consigliato)

```bash
npm install -D stylelint stylelint-config-standard
npx stylelint styles.css
```

**Config `.stylelintrc` (minimal):**

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "at-rule-no-unknown": null,
    "selector-pseudo-element-no-unknown": null
  }
}
```

## 📚 Integrazioni Future

### 1. Bot Discord Integration

Collegare il sito reale al bot Discord:

```javascript
// Futura: Fetch dal bot via API
const response = await fetch('https://bot.oceanhub.com/api/coins/shop', {
    headers: { Authorization: 'Bearer TOKEN' }
});
```

### 2. Analytics

```javascript
// Google Analytics (opzionale)
// Aggiungi nel <head>
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 3. Error Tracking

```javascript
// Sentry (opzionale)
// Aggiungi prima di script.js
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
</script>
```

## 🧪 Test Features (Local Demo)

### Test MOD Role Purchase

1. Apri http://localhost:8000?debug=1
2. Scorri a Shop
3. Trova "🛡️ Ruolo Moderator" (2000 coins)
4. Clicca "Riscatta"
5. Accetta termini
6. Clicca "Invia Richiesta"
7. Verifica:
   - ✅ Coins diminuiscono da 1250 → 0 (non sufficiente, errore)
   - ✅ Dev panel mostra "purchase attempts" log
   - ✅ Console mostra "Ticket submitted: TICKET-xxx"
   - ✅ Mock assegna il ruolo (demo)

**Production**: Sostituisci mockAPI.submitTicket con POST /api/assign-role

### Test Banner Upload & Preview

1. Scorri a "Personalizza il Profilo"
2. Sezione "📸 Banner Personalizzato"
3. Clicca file input, seleziona immagine
4. Clicca "Anteprima" → vedi immagine con blur neon
5. Clicca "Applica Banner" → salvo in localStorage
6. Apri DevTools → Application → localStorage → oh_banner
7. Verifica:
   - ✅ Dati salvati (url, name, size, appliedAt)
   - ✅ Data URL dentro (no server call in demo)
   - ✅ Preview scompare e riappare su toggle

**Production**: Invia POST /api/upload → CDN/S3, ricevi url, salva nel DB

### Test Audio Effects & Mute

1. Sezione "🔊 Effetto Audio Personalizzato"
2. Select preset: "Chime", "Pop", "Ding"
3. Clicca "Preview" → ascolta tono sintetizzato
4. Clicca checkbox "Silenzia effetti sonori"
5. Clicca "Preview" nuovamente → niente suono (muted)
6. Refresh pagina → checkbox rimane checked (localStorage)
7. Verifica:
   - ✅ Mute state persisted in localStorage key oh_audioMuted
   - ✅ Audio file upload accetta solo mp3/ogg/wav
   - ✅ Dev panel mostra "Playing audio" log
   - ✅ prefers-reduced-motion è rispettato (CSS media query)

**Production**: File upload POST /api/upload-audio, storage in S3/Cloudinary

### Test Discord OAuth Demo

1. Clicca "Connect Discord" (navbar o CTA section)
2. Console mostra OAuth URL placeholder
3. Aggiungi ?oauth=success all'URL: http://localhost:8000?oauth=success
4. Refresh → "Discord connected: OceanLover#1234"
5. "Sync Roles" button diventa enabled
6. Clicca → carica ruoli mock
7. Verifica:
   - ✅ Ruoli visualizzati con colore Discord
   - ✅ Dev panel mostra "Roles synced" log
   - ✅ Rank badges appaiono

**Production**: Implementa backend OAuth callback, salva token in session/JWT

### Test Wallet & Balance Animation

1. Clicca "Riscatta" su item qualsiasi (che costa meno di 1250)
2. Invia richiesta
3. Scriven balance animato:
   - ✅ Numero scala e cambia colore (cyan → verde)
   - ✅ Glow pulsa durante animazione
   - ✅ localStorage aggiornato (key: oh_wallet)
   - ✅ Nuovo saldo mostrato
4. Refresh pagina → saldo persiste (localStorage)

### Test Debug Mode & Dev Panel

1. Premi **D** → Attiva debug mode
2. Vedi:
   - ✅ Grid overlay neon 20px
   - ✅ Dev panel in basso a destra (purple neon)
   - ✅ Tutti i log: shop load, wallet fetch, role sync, audio play
3. Clicca "Cancella Log" → dev panel svuotato
4. Premi **D** di nuovo → debug mode disabilitato

Alternativamente: http://localhost:8000?debug=1

## 🐛 Troubleshooting

**Q: Il modal non si apre quando clicco "Riscatta"**
- A: Controlla la console (F12). Se il debug mode è attivo, vedrai i log.

**Q: I coins non si aggiornano**
- A: In locale, i mock coins diminuiscono. In produzione, il bot aggiornerà il wallet.

**Q: Onda SVG non si vede**
- A: Controlla che `viewBox` sia correctamente definito nel SVG.

## 📝 Commenti e Documentazione

Ogni file ha commenti che spiegano il **"perché"** non solo il "cosa":

- **HTML** — Markup semantico con inline comments su sezioni complesse
- **CSS** — Variabili CSS con descrizioni, organizing in sezioni logiche
- **JS** — IIFE per encapsulation, JSDoc per funzioni pubbliche

Leggi `DESIGN_DECISIONS.md` per spiegazioni architetturali dettagliate.

## 📞 Contatti & Supporto

- **Discord**: [Unisciti a OceanHub](https://discord.gg/oceanhub)
- **GitHub Issues**: Segnala bug o richiedi features

## 📄 Licenza

Tutti i contenuti sono © 2024 OceanHub Community. Usa il sito per fini promozionali.

---

**Versione:** 1.0.0  
**Ultimo Update:** Dicembre 2024  
**Mantainer:** OceanHub Dev Team
