# ⚡ Quick Start Guide - OceanHub Neon Theme

## 🎯 Setup Locale (5 minuti)

```bash
# 1. Naviga nella cartella
cd "Oceanhub sito"

# 2. Avvia il server locale
python -m http.server 8000

# 3. Apri nel browser
http://localhost:8000

# 4. Attiva debug mode
Premi tasto D (vedi overlay griglia + dev panel)
```

## 🚀 Deployment GitHub Pages (10 minuti)

```bash
# 1. Crea repo su GitHub
# https://github.com/new
# Nome: oceanhub-sito (o quello che vuoi)

# 2. Inizializza git (se non già fatto)
git init
git config user.email "your@email.com"
git config user.name "Your Name"

# 3. Aggiungi e fai il primo commit
git add .
git commit -m "Initial commit: OceanHub neon website"

# 4. Aggiungi remote
git remote add origin https://github.com/YOUR_USERNAME/oceanhub-sito.git

# 5. Push a main
git branch -M main
git push -u origin main

# 6. Abilita GitHub Pages
# Settings → Pages → Source: main branch
# Wait 1-2 minuti...
# Il sito sarà live su: https://YOUR_USERNAME.github.io/oceanhub-sito/
```

## 🔐 Setup OAuth2 Discord (Real)

### 1. Crea Discord Application

```
1. Vai a https://discord.com/developers/applications
2. Click "New Application"
3. Nomina "OceanHub"
4. Vai a "OAuth2" tab
5. Copia il CLIENT_ID (lo userai dopo)
```

### 2. Configura Redirect URI

```
1. In OAuth2 → Redirects
2. Click "Add Redirect"
3. Inserisci: https://YOUR_DOMAIN.com/oauth
   (Per dev locale: http://localhost:8000/oauth)
4. Click "Save"
```

### 3. Sostituisci nel codice

**File: `script.js` (linea ~150)**

```javascript
// Prima:
const CLIENT_ID = 'YOUR_CLIENT_ID';
const REDIRECT_URI = 'https://your-site/oauth';

// Dopo: (sostituisci con i tuoi valori)
const CLIENT_ID = '1234567890123456789';
const REDIRECT_URI = 'https://oceanhub.com/oauth';
```

### 4. Crea Callback Handler (Backend)

Il tuo server riceve `code` e lo scambia per access token:

```javascript
// Pseudocode Node.js/Express
app.get('/oauth', async (req, res) => {
    const code = req.query.code;
    
    // Scambia code con access token
    const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET, // Non mettere nel browser!
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            scope: 'identify guilds'
        })
    });
    
    const { access_token } = await response.json();
    
    // Salva token in secure cookie (httpOnly)
    res.cookie('discord_token', access_token, { httpOnly: true });
    res.redirect('/');
});
```

## 🎫 Setup Webhook Discord (Tickets)

### 1. Crea Webhook nel canale

```
1. Vai al canale #tickets (o quello che vuoi)
2. Click ⚙️ (Settings) → Webhooks
3. "New Webhook"
4. Nomina "OceanHub Tickets"
5. Copia l'URL → SALVA DA QUALCHE PARTE
```

### 2. Test Webhook con curl

```bash
curl -X POST https://discord.com/api/webhooks/123456/ABC-defGHI \
  -H "Content-Type: application/json" \
  -d '{
    "content": "🎫 Test Ticket",
    "embeds": [{
      "title": "Test Submission",
      "color": 16711680
    }]
  }'
```

### 3. Integra in Backend

Quando utente submits ticket form:

```javascript
// Invia a webhook Discord
const webhookUrl = 'https://discord.com/api/webhooks/ID/TOKEN';

const payload = {
    content: '🎫 Nuovo Ticket PERKS',
    embeds: [{
        title: 'Richiesta Riscatto',
        fields: [
            { name: 'Premio', value: 'Ruolo Supporter' },
            { name: 'Costo', value: '500 coins' },
            { name: 'Ticket ID', value: 'TICKET-1234567890' }
        ],
        color: 5865402 // Discord Blue
    }]
};

await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
});
```

## 🎖️ Setup Bot Roles Sync

### 1. Crea Bot Discord

```
1. Developer Portal → Applications → Seleziona OceanHub
2. "Bot" tab → "Add Bot"
3. Copia il TOKEN (secret!)
4. NON mettere il token nel sito — solo nel backend!
```

### 2. Permissions

Bot ha bisogno di:
- `manage_roles` (per assegnare ruoli)
- `read_members` (per leggere info member)

```
Calcola permissions:
manage_roles:    0x10000000
read_members:    0x1000
Total:           0x10001000 = 268435456

URL invito:
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=268435456&scope=bot
```

### 3. Fetch Ruoli Reali

```javascript
// Backend (Node.js)
const guildId = '123456789'; // Il server OceanHub
const userId = '987654321';  // Utente

const response = await fetch(
    `https://discord.com/api/guilds/${guildId}/members/${userId}`,
    {
        headers: { Authorization: `Bot ${BOT_TOKEN}` }
    }
);

const { roles } = await response.json();
// roles = ['123456789', '987654321', ...]
// Mappa con guild roles per ottenere name + color
```

## 🧪 Test Features

### Debug Mode

```
Premi D → Attiva overlay griglia + dev panel
Vedi log di:
  - Shop loading
  - Wallet updates
  - API errors
  - OAuth callbacks
```

### OAuth Demo

```
URL: http://localhost:8000/?oauth=success
Questo simula un login Discord riuscito
Vedrai il bottone "Sync Roles" attivo
Puoi cliccare per sincronizzare ruoli mock
```

### Ticket Submission

```
1. Vedi lo shop con 6 premi
2. Clicca "Riscatta" su uno
3. Si apre modal con form
4. Riempi note (opzionale) e accetta termini
5. Clicca "Invia Richiesta"
6. Vedrai success + ticket ID
7. Modal si chiude automaticamente dopo 5 sec
8. Saldo coins decrementato nel wallet
```

## 📝 Git Workflow

### Feature Branch (Consigliato)

```bash
# 1. Crea feature branch
git checkout -b feature/mio-feature

# 2. Fai modifiche
# ... edit files ...

# 3. Commit atomico
git add .
git commit -m "feat: description of what I added"

# 4. Push
git push origin feature/mio-feature

# 5. Pull Request su main
# GitHub → Pull Requests → New → Seleziona branch
# Descrivi i cambiamenti

# 6. Merge (dopo review)
git checkout main
git pull
git merge feature/mio-feature
git push
```

### Commit Message Format

```
<type>: <subject> (max 50 char)

<body> (optional, max 72 char per riga)

<footer> (optional)

Types:
  feat:  Nuova feature
  fix:   Bug fix
  docs:  Documentation
  style: Formatting, missing semicolons
  refactor: Code reorganization
  perf:  Performance improvement
  test:  Adding tests
  dev:   Dev tools, configs
```

### Esempi Commit

```bash
git commit -m "feat: aggiungi oauth2 discord login"

git commit -m "fix: modal non chiude con escape key

- Aggiungi keydown listener
- Premi ESC per close modal
- Testa su accessibility"

git commit -m "docs: update readme con webhook setup"
```

## 🌐 Environment Variables (Produzione)

**NON mettere nel repo:**
- CLIENT_SECRET (Discord OAuth)
- BOT_TOKEN (Discord Bot)
- Database credentials
- API keys

**Usa .env file (gitignored):**

```bash
# .env (non pushare!)
DISCORD_CLIENT_ID=123456
DISCORD_CLIENT_SECRET=secret-key-here
DISCORD_BOT_TOKEN=bot-token-here
DATABASE_URL=postgresql://...
```

**Accedi in Node.js:**

```javascript
require('dotenv').config();
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
```

**GitHub Secrets (per CI/CD):**

```
Settings → Secrets and Variables → Actions
Aggiungi:
  - DISCORD_CLIENT_SECRET
  - DISCORD_BOT_TOKEN
  - Etc.
```

Poi usali in GitHub Actions workflow.

## 📊 File Sizes (Neon Version)

```
index.html        18.08 KB  (+1.53 KB da prima)
styles.css        26.47 KB  (-6.25 KB, meglio organizzato)
script.js         25.1 KB   (+4.38 KB con OAuth)
README.md         15.22 KB  (+6.19 KB docs migliorata)
CONTRIBUTING.md   7.04 KB   (unchanged)
Configs           1.73 KB   (unchanged)
────────────────────────
Total             93.64 KB  (Neon version)
Gzipped (~30%)    ~28 KB
```

## ✅ Checklist Deploy

- [ ] HTML valido (test con validator.w3.org)
- [ ] CSS test responsive (DevTools device emulation)
- [ ] JS test su console per errori (F12)
- [ ] Debug mode test (premi D)
- [ ] OAuth placeholder test (?oauth=success)
- [ ] Shop items load correttamente
- [ ] Modal form valida
- [ ] Ticket success mostra ID
- [ ] Accessibility test (keyboard nav, colors)
- [ ] Performance test (Lighthouse score 90+)
- [ ] Git commits sono atomici
- [ ] Nessun token reale nel repo
- [ ] README è aggiornato
- [ ] Pronto per push?

---

**Next Steps:**
1. Setup Discord OAuth real
2. Deploy su GitHub Pages
3. Integrazioni backend (Bot, Database)
4. Analytics (opzionale)

🌊 **Happy coding!**
