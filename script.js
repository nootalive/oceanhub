/*========================================
   OCEANHUB - Script v2
   Discord Integration + OAuth2 Demo
   MOD Role Purchase + Banner Upload + Audio Effects
   Modal + Shop + Wallet Management + Neon Glow
   ========================================
   
   PRODUCTION SETUP GUIDE:
   
   1. MOD ROLE ASSIGNMENT (Replace mockAPI.submitTicket)
      POST /api/assign-role
      Headers: { 'Authorization': 'Bearer BOT_TOKEN', 'Content-Type': 'application/json' }
      Body: { userId: string, guildId: string, roleId: string, cost: number }
      Response: { ok: true, roleAssigned: true, newBalance: number }
      
      Example cURL:
      curl -X POST https://your-api.com/api/assign-role \
        -H "Authorization: Bearer YOUR_BOT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"userId":"123","guildId":"456","roleId":"789","cost":2000}'
   
   2. BANNER UPLOAD (Replace bannerManager.setupBannerUpload)
      POST /api/upload (multipart/form-data)
      Headers: { 'Authorization': 'Bearer USER_TOKEN' }
      Body: { file: File, userId: string }
      Response: { ok: true, url: string, filename: string }
      
      Storage: Use S3, Cloudinary, or similar CDN
      Cache headers: Cache-Control: public, max-age=31536000
   
   3. AUDIO UPLOAD (Replace audioManager.setupAudioControls)
      POST /api/upload-audio (multipart/form-data)
      Headers: { 'Authorization': 'Bearer USER_TOKEN' }
      Body: { file: File, userId: string, maxDuration: 10 }
      Response: { ok: true, url: string, duration: number }
      
      Format support: mp3, ogg, wav (validate server-side)
      Max file: 10MB, Max duration: 10 seconds
   
   4. ENVIRONMENT VARIABLES (.env - DO NOT COMMIT)
      DISCORD_CLIENT_ID=your_client_id_here
      DISCORD_CLIENT_SECRET=your_client_secret_here (backend only!)
      DISCORD_BOT_TOKEN=your_bot_token_here (backend only!)
      DISCORD_WEBHOOK_ID=webhook_id_here
      DISCORD_WEBHOOK_TOKEN=webhook_token_here
      API_BASE_URL=https://your-api.com
      UPLOAD_CDN_URL=https://cdn.your-site.com
   
   5. OAUTH2 CALLBACK (Backend handler)
      Route: POST /oauth/callback
      Receive: { code: string }
      Exchange code for token via Discord API
      Store in session/DB
      Redirect user back to client with session token
   
   6. WEBHOOK FOR TICKETS (Replace POST /api/ticket)
      Send to Discord webhook when ticket submitted
      Embed format: { title, description, fields, color, timestamp }
      Fields: [{ name: 'Prize', value: 'Item name' }, { name: 'Cost', value: 'coins' }]
      
========================================*/

// ===== LOGGER UTILITY =====
// Dual output: console (colored) + dev panel (DOM)
const logger = (() => {
    const logEntry = (level, message) => {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}]`;
        
        // Console output con colori
        const colors = {
            info: 'color: #00d4ff; font-weight: bold',
            warn: 'color: #ffcc00; font-weight: bold',
            error: 'color: #ff6b6b; font-weight: bold'
        };
        
        console.log(`%c${prefix} ${message}`, colors[level] || colors.info);
        
        // DOM panel output
        const logPanel = document.getElementById('devLog');
        if (logPanel) {
            const entry = document.createElement('div');
            entry.className = `dev-log-entry ${level}`;
            entry.textContent = `${prefix} ${message}`;
            logPanel.appendChild(entry);
            logPanel.scrollTop = logPanel.scrollHeight;
        }
    };
    
    return {
        info: (msg) => logEntry('info', msg),
        warn: (msg) => logEntry('warn', msg),
        error: (msg) => logEntry('error', msg)
    };
})();

// ===== DEBUG MODE =====
// Attiva con tasto D o parametro ?debug=1
const debugMode = (() => {
    const enableDebug = () => {
        document.body.classList.add('debug');
        document.getElementById('devPanel')?.classList.add('active');
        document.getElementById('debugOverlay')?.classList.add('active');
        logger.info('🐛 Debug mode ENABLED');
    };
    
    const disableDebug = () => {
        document.body.classList.remove('debug');
        document.getElementById('devPanel')?.classList.remove('active');
        document.getElementById('debugOverlay')?.classList.remove('active');
        logger.info('🐛 Debug mode DISABLED');
    };
    
    // Controlla URL param ?debug=1
    if (new URLSearchParams(window.location.search).has('debug')) {
        enableDebug();
    }
    
    // Keyboard listener (tasto D)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' || e.key === 'D') {
            const isDebugOn = document.body.classList.contains('debug');
            isDebugOn ? disableDebug() : enableDebug();
        }
    });
    
    return { enableDebug, disableDebug };
})();

// ===== STORAGE UTILITY =====
// Gestisce localStorage con namespace 'oh_' (OceanHub)
const storageManager = {
    set: (key, value) => {
        try {
            localStorage.setItem(`oh_${key}`, JSON.stringify(value));
        } catch (e) {
            logger.error(`Storage error: ${e.message}`);
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(`oh_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            logger.error(`Storage read error: ${e.message}`);
            return defaultValue;
        }
    },
    remove: (key) => {
        localStorage.removeItem(`oh_${key}`);
    }
};

// ===== MOCK API =====
// Simula endpoint Discord + Bot webhook con latenza realistica
const mockAPI = {
    // User wallet state (session + localStorage)
    wallet: {
        userId: 'user_' + Math.random().toString(36).substr(2, 9),
        balance: storageManager.get('wallet', 1250),
        lastUpdated: new Date().toISOString()
    },
    
    // Shop items (MOD role included)
    shopItems: [
        {
            id: 'role_supporter',
            name: 'Ruolo Supporter',
            icon: '<i class="fas fa-crown"></i>',
            description: 'Badge esclusivo + colore custom nel server',
            cost: 500,
            category: 'role',
            metadata: { roleId: '123456789', color: '#00d4ff' }
        },
        {
            id: 'custom_nickname',
            name: 'Nickname Personalizzato',
            icon: '<i class="fas fa-pen"></i>',
            description: 'Cambia il tuo nickname con colore neon',
            cost: 250,
            category: 'custom',
            metadata: { allowedLength: 32 }
        },
        {
            id: 'role_vip',
            name: 'Ruolo VIP',
            icon: '<i class="fas fa-gem"></i>',
            description: 'Accesso a canali privati VIP',
            cost: 1000,
            category: 'role',
            metadata: { roleId: '987654321', perks: ['private-channels', 'voice-priority'] }
        },
        {
            id: 'private_voice',
            name: 'Privè (Vocale Privata)',
            icon: '<i class="fas fa-microphone"></i>',
            description: 'Vocale privata personale. Richiede ruolo custom. Regole: 5h/settimana, no NSFW/gore',
            cost: 1500,
            category: 'custom',
            metadata: { 
                requiresCustomRole: true,
                rules: [
                    '5 ore di vocale a settimana obbligatorie',
                    'Se eliminata, richiedibile dopo 2 settimane via ticket HIGH STAFF',
                    'Dopo 2 cancellazioni in 3 mesi non più ricreabile',
                    'Vietati contenuti NSFW e gore'
                ]
            }
        },
        {
            id: 'custom_role',
            name: 'Ruolo Custom',
            icon: '<i class="fas fa-star"></i>',
            description: 'Ruolo personalizzato con nome e colore custom. Regole: 150 msg/settimana',
            cost: 800,
            category: 'role',
            metadata: { 
                customizable: true,
                rules: [
                    'Il proprietario deve fare 150 messaggi a settimana',
                    'Se eliminato, richiedibile dopo 2 settimane via ticket HIGH STAFF',
                    'Dopo 2 cancellazioni in 3 mesi non più ricreabile'
                ]
            }
        }
    ],
    
    // Simula ruoli Discord (da mappare con veri ruoli)
    userRoles: [
        { id: 'role_member', name: 'Membro', color: '#5865f2', position: 1 },
        { id: 'role_supporter', name: 'Supporter', color: '#00d4ff', position: 2 }
    ],
    
    // Fetch shop items con latenza simulata
    fetchShop: async (filter = 'all') => {
        try {
            // Simula latenza 500-1000ms
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
            
            // Simula fallimento 10% probabilità
            if (Math.random() < 0.1) {
                throw new Error('API Error: Failed to fetch shop');
            }
            
            const items = filter === 'all' 
                ? mockAPI.shopItems 
                : mockAPI.shopItems.filter(item => item.category === filter);
            
            logger.info(`✅ Shop loaded: ${items.length} items`);
            return { success: true, data: items };
        } catch (error) {
            logger.error(`❌ Shop fetch failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    },
    
    // Fetch wallet balance
    fetchWallet: async () => {
        try {
            // Simula latenza 300-800ms
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
            
            // Simula fallimento 5% probabilità
            if (Math.random() < 0.05) {
                throw new Error('Wallet service unavailable');
            }
            
            logger.info(`💰 Wallet updated: ${mockAPI.wallet.balance} coins`);
            return { success: true, data: mockAPI.wallet };
        } catch (error) {
            logger.error(`❌ Wallet fetch failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    },
    
    // Fetch Discord roles (mock)
    // PRODUZIONE: Usare bot token + endpoint GET /guilds/{guild_id}/members/@me
    // Headers: { Authorization: 'Bearer BOT_TOKEN' }
    fetchRoles: async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 300));
            
            if (Math.random() < 0.08) {
                throw new Error('Guild roles API error');
            }
            
            logger.info(`🎖️ Roles synced: ${mockAPI.userRoles.length} ruoli`);
            return { success: true, data: mockAPI.userRoles };
        } catch (error) {
            logger.error(`❌ Roles fetch failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    },
    
    // Submit ticket form (incluso role assignment)
    // PRODUZIONE: Inviare a /api/ticket con POST:
    // Body: { userId, prizeId, cost, notes, roleId?, bannerUrl?, soundUrl? }
    // Headers: { Authorization: 'Bearer USER_TOKEN' }
    // Per assign-role: POST /api/assign-role
    // Body: { userId, guildId, roleId }
    // Headers: { Authorization: 'Bearer BOT_TOKEN' }
    submitTicket: async (formData) => {
        try {
            await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
            
            // Controlla saldo sufficiente
            if (formData.cost > mockAPI.wallet.balance) {
                throw new Error('Saldo insufficiente');
            }
            
            // Simula fallimento 3%
            if (Math.random() < 0.03) {
                throw new Error('Ticket submission failed');
            }
            
            // Detrai coins
            mockAPI.wallet.balance -= formData.cost;
            mockAPI.wallet.lastUpdated = new Date().toISOString();
            
            // Salva wallet in localStorage
            storageManager.set('wallet', mockAPI.wallet.balance);
            
            // Genera ticket ID
            const ticketId = 'TICKET-' + Date.now().toString(36).toUpperCase();
            
            // Log acquisto
            logger.info(`🎫 Ticket submitted: ${ticketId} (${formData.itemName})`);
            
            return { 
                success: true, 
                data: { 
                    ticketId, 
                    newBalance: mockAPI.wallet.balance,
                    status: 'pending'
                } 
            };
        } catch (error) {
            logger.error(`❌ Ticket submit failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
};

// ===== OAUTH2 DISCORD DEMO =====
// Placeholder per OAuth2 flow
// Sostituisci YOUR_CLIENT_ID e your-site con valori reali
const discordOAuth = (() => {
    const CLIENT_ID = 'YOUR_CLIENT_ID'; // ← Sostituisci con vero client_id da Discord Dev Portal
    const REDIRECT_URI = 'https://your-site/oauth'; // ← Sostituisci con vero callback URL
    
    // SETUP REALE OAuth2:
    // 1. Vai a https://discord.com/developers/applications
    // 2. Crea New Application
    // 3. Copia CLIENT_ID
    // 4. OAuth2 → General → Aggiungi Redirect URL (es: https://tuodominio.com/oauth)
    // 5. Sostituisci CLIENT_ID e REDIRECT_URI nei valori sotto
    // 6. Backend riceve ?code= e lo scambia con token via POST a:
    //    https://discord.com/api/oauth2/token
    //    Headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    //    Body: { client_id, client_secret, code, grant_type, redirect_uri }
    
    const generateAuthURL = () => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'identify guilds'
        });
        return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
    };
    
    const handleOAuthCallback = () => {
        // Simula OAuth success se parametro ?oauth=success
        if (new URLSearchParams(window.location.search).has('oauth')) {
            logger.info('🔐 OAuth callback ricevuto');
            updateUserStatus('connected', {
                username: 'OceanLover#1234',
                id: '123456789',
                avatar: '🌊'
            });
        }
    };
    
    return { generateAuthURL, handleOAuthCallback };
})();

// ===== RANKS MANAGER =====
// Gestisce visualizzazione ruoli Discord
const ranksManager = (() => {
    let userConnected = false;
    
    const updateUserStatus = (status, userData = null) => {
        userConnected = status === 'connected';
        const syncBtn = document.getElementById('syncRolesBtn');
        
        if (syncBtn) {
            syncBtn.disabled = !userConnected;
            if (userConnected) {
                syncBtn.style.cursor = 'pointer';
                logger.info(`✅ Discord connected: ${userData?.username}`);
            }
        }
    };
    
    const syncRoles = async () => {
        if (!userConnected) {
            logger.warn('⚠️ Not connected to Discord');
            return;
        }
        
        const syncBtn = document.getElementById('syncRolesBtn');
        if (syncBtn) syncBtn.disabled = true;
        
        const result = await mockAPI.fetchRoles();
        
        if (result.success) {
            renderRoles(result.data);
            logger.info('🎖️ Roles displayed');
        } else {
            logger.error(`❌ Role sync failed: ${result.error}`);
        }
        
        if (syncBtn) syncBtn.disabled = !userConnected;
    };
    
    const renderRoles = (roles) => {
        const container = document.getElementById('discordRanksContainer');
        if (!container) return;
        
        container.innerHTML = '';
        roles.forEach(role => {
            const badge = document.createElement('div');
            badge.className = 'rank-badge';
            badge.style.borderColor = role.color;
            badge.innerHTML = `<span style="color: ${role.color}">${role.name}</span>`;
            container.appendChild(badge);
        });
    };
    
    return { updateUserStatus, syncRoles };
})();

// ===== BANNER MANAGER =====
// Gestisce upload e preview banner personalizzato
const bannerManager = (() => {
    let bannerData = storageManager.get('banner', null);
    
    const setupBannerUpload = () => {
        const upload = document.getElementById('bannerUpload');
        const previewBtn = document.getElementById('bannerPreviewBtn');
        const applyBtn = document.getElementById('bannerApplyBtn');
        const preview = document.getElementById('bannerPreview');
        const img = document.getElementById('bannerImg');
        
        if (!upload) return;
        
        upload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Controlla tipo
            if (!file.type.startsWith('image/')) {
                logger.error('❌ File non è un\'immagine');
                return;
            }
            
            // Controlla size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                logger.error('❌ Immagine troppo grande (max 5MB)');
                return;
            }
            
            // Leggi file
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                img.src = dataUrl;
                preview.style.display = 'block';
                previewBtn.disabled = false;
                
                // Abilita apply
                applyBtn.onclick = () => {
                    bannerData = {
                        url: dataUrl,
                        name: file.name,
                        size: file.size,
                        appliedAt: new Date().toISOString()
                    };
                    storageManager.set('banner', bannerData);
                    logger.info(`✅ Banner applied: ${file.name}`);
                    
                    // Feedback
                    applyBtn.textContent = '✅ Applicato';
                    setTimeout(() => {
                        applyBtn.textContent = 'Applica Banner';
                    }, 2000);
                };
            };
            reader.readAsDataURL(file);
            logger.info(`📸 Banner preview loaded: ${file.name}`);
        });
        
        // Preview button
        previewBtn.addEventListener('click', () => {
            if (preview.style.display === 'block') {
                preview.style.display = 'none';
                previewBtn.textContent = '👁️ Anteprima';
            } else {
                preview.style.display = 'block';
                previewBtn.textContent = '👁️ Nascondi';
            }
        });
    };
    
    return { setupBannerUpload };
})();

// ===== AUDIO MANAGER =====
// Gestisce effetti audio personalizzati + mute toggle
const audioManager = (() => {
    let audioData = storageManager.get('audio', null);
    let isMuted = storageManager.get('audioMuted', false);
    
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const shouldPlayAudio = () => {
        return !isMuted && !prefersReducedMotion;
    };
    
    const setupAudioControls = () => {
        const player = document.getElementById('audioPlayer');
        const presetSelect = document.getElementById('audioPresetSelect');
        const playBtn = document.getElementById('audioPlayBtn');
        const uploadInput = document.getElementById('audioUpload');
        const uploadPlayBtn = document.getElementById('audioUploadPlayBtn');
        const muteToggle = document.getElementById('muteToggle');
        
        if (!player) return;
        
        // Preset audio demo (non includere file reali - placeholder)
        const presets = {
            chime: { name: 'Chime', duration: 1 },
            pop: { name: 'Pop', duration: 0.5 },
            ding: { name: 'Ding', duration: 0.8 }
        };
        
        // Preset select
        presetSelect.addEventListener('change', (e) => {
            const preset = e.target.value;
            playBtn.disabled = !preset;
            if (preset) {
                logger.info(`🔊 Preset selected: ${presets[preset].name}`);
            }
        });
        
        // Play preset
        playBtn.addEventListener('click', () => {
            const preset = presetSelect.value;
            if (!preset) return;
            
            if (shouldPlayAudio()) {
                playAudioFeedback();
                logger.info(`▶️ Playing preset: ${presets[preset].name}`);
            } else {
                logger.info(`🔇 Audio muted or reduced motion enabled`);
            }
        });
        
        // File upload
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // Controlla tipo
            if (!['audio/mpeg', 'audio/ogg', 'audio/wav'].includes(file.type)) {
                logger.error('❌ Tipo audio non supportato (mp3, ogg, wav)');
                return;
            }
            
            // Controlla size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                logger.error('❌ Audio troppo grande (max 10MB)');
                return;
            }
            
            // Leggi file
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                player.src = dataUrl;
                uploadPlayBtn.disabled = false;
                
                audioData = {
                    url: dataUrl,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString()
                };
                storageManager.set('audio', audioData);
                logger.info(`🎵 Audio uploaded: ${file.name}`);
            };
            reader.readAsDataURL(file);
        });
        
        // Play uploaded audio
        uploadPlayBtn.addEventListener('click', () => {
            if (shouldPlayAudio()) {
                player.play().catch(e => logger.error(`❌ Play error: ${e.message}`));
                logger.info('▶️ Playing custom audio');
            } else {
                logger.info(`🔇 Audio muted or reduced motion enabled`);
            }
        });
        
        // Mute toggle
        muteToggle.addEventListener('change', (e) => {
            isMuted = e.target.checked;
            storageManager.set('audioMuted', isMuted);
            logger.info(`🔇 Audio ${isMuted ? 'muted' : 'unmuted'}`);
        });
        
        // Load mute state
        muteToggle.checked = isMuted;
    };
    
    const playAudioFeedback = () => {
        // Crea oscillatore per tone (demo senza file audio)
        if (!window.AudioContext && !window.webkitAudioContext) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // Hz
        oscillator.type = 'sine';
        
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    };
    
    return { setupAudioControls, shouldPlayAudio, playAudioFeedback };
})();

// ===== SHOP MANAGER =====
const shopManager = (() => {
    let currentFilter = 'all';
    let currentItems = [];
    
    const loadShop = async (filter = 'all') => {
        currentFilter = filter;
        const shopGrid = document.getElementById('shopGrid');
        if (!shopGrid) return;
        
        // Mostra loading state
        shopGrid.innerHTML = '<div style="color: var(--text-secondary); padding: 2rem; text-align: center;">Caricamento...</div>';
        
        const result = await mockAPI.fetchShop(filter);
        
        if (result.success) {
            currentItems = result.data;
            shopGrid.innerHTML = '';
            currentItems.forEach((item, index) => {
                renderShopItem(item, index);
            });
        } else {
            shopGrid.innerHTML = `<div style="color: #ff6b6b; padding: 2rem; text-align: center;">❌ Errore: ${result.error}</div>`;
        }
    };
    
    const renderShopItem = (item, index) => {
        const shopGrid = document.getElementById('shopGrid');
        const card = document.createElement('div');
        card.className = 'shop-item';
        
        // Staggered animation delay
        card.style.animationDelay = `${index * 50}ms`;
        
        card.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <h3 class="shop-item-name">${item.name}</h3>
            <p class="shop-item-desc">${item.description}</p>
            <div class="shop-item-price neon-price-tag"><i class="fas fa-coins"></i> ${item.cost} coins</div>
            <button class="shop-item-btn" data-item-id="${item.id}" aria-label="Riscatta ${item.name}">
                <i class="fas fa-gift"></i> Riscatta
            </button>
        `;
        
        // Listener per apertura modal
        card.querySelector('button').addEventListener('click', () => {
            ticketManager.openModal(item);
            logger.info(`🛒 Purchase attempt: ${item.name}`);
        });
        
        shopGrid.appendChild(card);
    };
    
    const setupFilters = () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const filter = e.target.dataset.filter;
                loadShop(filter);
            });
        });
    };
    
    return { loadShop, renderShopItem, setupFilters };
})();

// ===== TICKET MANAGER =====
const ticketManager = (() => {
    let selectedItem = null;
    
    const openModal = (item) => {
        selectedItem = item;
        const modal = document.getElementById('ticketModal');
        const prizeInput = document.getElementById('ticketPrize');
        const costInput = document.getElementById('ticketCost');
        const form = document.getElementById('ticketForm');
        const result = document.getElementById('ticketResult');
        
        if (!modal) return;
        
        prizeInput.value = item.name;
        costInput.value = item.cost;
        form.style.display = 'block';
        result.style.display = 'none';
        
        modal.classList.add('active');
        
        // Focus management: auto-focus prima input
        setTimeout(() => {
            const firstInput = form.querySelector('input, textarea, select');
            if (firstInput) firstInput.focus();
            logger.info(`📋 Modal opened: ${item.name}`);
        }, 100);
    };
    
    const closeModal = () => {
        const modal = document.getElementById('ticketModal');
        if (modal) {
            modal.classList.remove('active');
            logger.info('📋 Modal closed');
        }
        selectedItem = null;
    };
    
    const validateForm = () => {
        const termsCheckbox = document.getElementById('ticketTerms');
        return termsCheckbox.checked;
    };
    
    const submitForm = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            logger.error('❌ Accetta i termini prima di procedere');
            return;
        }
        
        if (!selectedItem) {
            logger.error('❌ Nessun premio selezionato');
            return;
        }
        
        const form = document.getElementById('ticketForm');
        const result = document.getElementById('ticketResult');
        const notes = document.getElementById('ticketNotes').value;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Disable submit
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Elaborazione...';
        
        // Chiama API
        const formData = {
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            cost: selectedItem.cost,
            notes: notes,
            type: selectedItem.category,
            roleId: selectedItem.metadata?.roleId
        };
        
        const apiResult = await mockAPI.submitTicket(formData);
        
        form.style.display = 'none';
        
        if (apiResult.success) {
            const data = apiResult.data;
            result.innerHTML = `
                <div class="ticket-success">
                    <h3>✅ Ticket Inviato!</h3>
                    <p>ID Ticket: <strong>${data.ticketId}</strong></p>
                    <p>Nuovo Saldo: <span class="balance-update" id="balanceUpdate">${data.newBalance}</span> coins</p>
                    <p style="font-size: 0.9em; color: var(--text-secondary);">Lo staff ti contatterà a breve</p>
                </div>
            `;
            
            // Play audio feedback se abilitato
            if (audioManager.shouldPlayAudio()) {
                audioManager.playAudioFeedback();
            }
            
            // Anima balance update
            updateWalletDisplay(data.newBalance);
            
            // Auto-close dopo 5 sec
            setTimeout(() => {
                closeModal();
                form.style.display = 'block';
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Invia Richiesta';
            }, 5000);
        } else {
            result.innerHTML = `
                <div class="ticket-error">
                    <h3>❌ Errore</h3>
                    <p>${apiResult.error}</p>
                </div>
            `;
            
            // Restore button
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Invia Richiesta';
            }, 2000);
        }
        
        result.style.display = 'block';
    };
    
    const setupListeners = () => {
        const modal = document.getElementById('ticketModal');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelTicket');
        const form = document.getElementById('ticketForm');
        
        if (!modal) return;
        
        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        // Cancel button
        if (cancelBtn) {
            cancelBtn.addEventListener('click', closeModal);
        }
        
        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Form submit
        if (form) {
            form.addEventListener('submit', submitForm);
        }
    };
    
    return { openModal, closeModal, setupListeners };
})();

// ===== WALLET & BALANCE =====
const walletManager = {
    updateBalance: async () => {
        const result = await mockAPI.fetchWallet();
        if (result.success) {
            updateWalletDisplay(result.data.balance);
        }
    }
};

function updateWalletDisplay(balance) {
    const balanceEl = document.getElementById('walletBalance');
    if (!balanceEl) return;
    
    const oldBalance = parseInt(balanceEl.textContent);
    const newBalance = balance;
    
    if (oldBalance !== newBalance) {
        // Anima cambio
        balanceEl.classList.add('balance-changing');
        
        // Numero che cambia
        let current = oldBalance;
        const step = (newBalance - oldBalance) / 10;
        const interval = setInterval(() => {
            current += step;
            if ((step > 0 && current >= newBalance) || (step < 0 && current <= newBalance)) {
                balanceEl.textContent = newBalance;
                clearInterval(interval);
                balanceEl.classList.remove('balance-changing');
                logger.info(`💰 Balance updated: ${newBalance} coins`);
            } else {
                balanceEl.textContent = Math.round(current);
            }
        }, 30);
        
        // Update localStorage
        storageManager.set('wallet', newBalance);
        mockAPI.wallet.balance = newBalance;
    }
}

// ===== USER STATUS UPDATE =====
function updateUserStatus(status, userData = null) {
    ranksManager.updateUserStatus(status, userData);
}

// ===== SCROLL ANIMATIONS =====
// Fade-in + slide-up su sezioni con IntersectionObserver
const setupScrollAnimations = () => {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
};

// ===== WAVE SWAY ANIMATION =====
// Usa requestAnimationFrame per muovere elementi .wave-sway con una sinusoide.
// Rispetta prefers-reduced-motion.
// Rationale: requestAnimationFrame permette animazione fluida e sincronizzata al frame.
const setupWaveSway = () => {
    // esci subito se non ci sono elementi o l'utente chiede riduzione movimento
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const waveEls = Array.from(document.querySelectorAll('.wave-section .wave-sway'));
    
    if (!waveEls.length || prefersReduced) {
        // fallback: aggiungi classe CSS per movimento lento se JS disabilitato
        waveEls.forEach(el => el.classList.add('css-fallback'));
        return;
    }

    // config: ampiezza e velocità controllabili
    const baseAmp = 6;     // px - ampiezza
    const baseSpeed = 1.0; // velocità base (rad/s)
    const stagger = 0.14;  // offset per elemento (genera effetto onda)

    let start = null;
    let animationId = null;

    function loop(ts) {
        if (!start) start = ts;
        const t = (ts - start) / 1000; // seconds
        
        waveEls.forEach((el, i) => {
            const speed = baseSpeed + i * 0.06;
            const amp = baseAmp + (i % 3) * 1.5;
            const x = Math.sin(t * speed + i * stagger) * amp;
            
            // applica transform
            el.style.transform = `translateX(${x.toFixed(2)}px)`;
            
            // toggle glow classe quando movimento > soglia per effetto visivo
            if (Math.abs(x) > 4) {
                el.classList.add('sway-glow');
            } else {
                el.classList.remove('sway-glow');
            }
        });
        
        animationId = requestAnimationFrame(loop);
    }

    // start animation quando la sezione entra in viewport (evita lavori inutili)
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animationId = requestAnimationFrame(loop);
                obs.disconnect();
            }
        });
    }, { threshold: 0.15 });

    const section = document.querySelector('.wave-section');
    if (section) io.observe(section);

    // cleanup on unload
    window.addEventListener('pagehide', () => {
        if (animationId) cancelAnimationFrame(animationId);
        waveEls.forEach(el => el.style.transform = '');
    });
    
    logger.info('🌊 Wave sway animation initialized');
};

// ===== COOKIE MODAL MANAGER =====
const cookieManager = {
    init() {
        const modal = document.getElementById('cookieModal');
        const toggleBtn = document.getElementById('toggleDetails');
        const detailsContent = document.getElementById('detailsContent');
        const acceptBtn = document.getElementById('acceptCookies');
        const closeBtn = document.getElementById('closeCookieModal');
        const body = document.body;

        if (!modal || !body) return;

        const blockSite = () => body.classList.add('cookie-blocked');
        const unblockSite = () => body.classList.remove('cookie-blocked');

        const showModal = () => {
            blockSite();
            modal.style.display = 'flex';
        };
        
        // Check if user already accepted
        if (!localStorage.getItem('oh_cookies_accepted')) {
            setTimeout(showModal, 800);
        } else {
            unblockSite();
            modal.style.display = 'none';
        }
        
        // Toggle details
        toggleBtn?.addEventListener('click', () => {
            toggleBtn.classList.toggle('active');
            detailsContent.classList.toggle('active');
        });
        
        // Accept cookies
        const acceptCookies = () => {
            localStorage.setItem('oh_cookies_accepted', 'true');
            localStorage.setItem('oh_cookies_date', new Date().toISOString());
            modal.style.display = 'none';
            unblockSite();
            logger.info('✅ Cookies accepted');
        };
        
        acceptBtn?.addEventListener('click', acceptCookies);
        closeBtn?.addEventListener('click', acceptCookies);
        
        // Close on backdrop click
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) acceptCookies();
        });
    }
};

// ===== EVENT LISTENERS SETUP =====
document.addEventListener('DOMContentLoaded', async () => {
    logger.info('🚀 OceanHub loaded');
    
    // Initialize cookie modal
    cookieManager.init();
    
    // Dev panel buttons
    document.getElementById('closeDevPanel')?.addEventListener('click', () => {
        document.getElementById('devPanel')?.classList.remove('active');
    });
    
    document.getElementById('clearDevLog')?.addEventListener('click', () => {
        const panel = document.getElementById('devLog');
        if (panel) panel.innerHTML = '';
        logger.info('🗑️ Dev log cleared');
    });
    
    // Discord Connect buttons
    const discordConnectBtn = document.getElementById('discordConnectBtn');
    const oauthDiscordBtn = document.getElementById('oauthDiscordBtn');
    
    if (discordConnectBtn) {
        discordConnectBtn.addEventListener('click', () => {
            const url = discordOAuth.generateAuthURL();
            logger.info(`🔐 OAuth URL: ${url}`);
            // In produzione: window.location.href = url;
            // Per demo: aggiungere ?oauth=success al parametro
            logger.warn('💡 Demo mode: Use ?oauth=success to simulate OAuth');
        });
    }
    
    if (oauthDiscordBtn) {
        oauthDiscordBtn.addEventListener('click', () => {
            const url = discordOAuth.generateAuthURL();
            logger.info(`🔐 Starting OAuth flow`);
            // window.location.href = url;
            logger.warn('💡 Demo mode: Use ?oauth=success');
        });
    }
    
    // Wallet check button
    document.getElementById('btnCheckWallet')?.addEventListener('click', () => {
        walletManager.updateBalance();
    });
    
    // Sync roles button
    document.getElementById('syncRolesBtn')?.addEventListener('click', () => {
        ranksManager.syncRoles();
    });
    
    // Setup managers
    shopManager.setupFilters();
    shopManager.loadShop('all');
    walletManager.updateBalance();
    ticketManager.setupListeners();
    bannerManager.setupBannerUpload();
    audioManager.setupAudioControls();
    setupScrollAnimations();
    setupWaveSway();
    
    // Check OAuth callback
    discordOAuth.handleOAuthCallback();
    
    logger.info('✅ All systems ready');
});
