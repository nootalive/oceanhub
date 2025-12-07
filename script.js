/*========================================
   OCEANHUB - Script
   Discord Integration + OAuth2 Demo
   Modal + Shop + Wallet Management
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

// ===== MOCK API =====
// Simula endpoint Discord + Bot webhook con latenza realistica
const mockAPI = {
    // User wallet state (session-only)
    wallet: {
        userId: 'user_' + Math.random().toString(36).substr(2, 9),
        balance: 1250,
        lastUpdated: new Date().toISOString()
    },
    
    // Shop items con 6 premi demo
    shopItems: [
        {
            id: 'role_supporter',
            name: '⭐ Ruolo Supporter',
            icon: '👑',
            description: 'Badge esclusivo + colore custom nel server',
            cost: 500,
            category: 'role',
            metadata: { roleId: '123456789', color: '#00d4ff' }
        },
        {
            id: 'custom_nickname',
            name: '✨ Nickname Personalizzato',
            icon: '📝',
            description: 'Cambia il tuo nickname con colore neon',
            cost: 250,
            category: 'custom',
            metadata: { allowedLength: 32 }
        },
        {
            id: 'role_vip',
            name: '💎 Ruolo VIP',
            icon: '💎',
            description: 'Accesso a canali privati VIP',
            cost: 1000,
            category: 'role',
            metadata: { roleId: '987654321', perks: ['private-channels', 'voice-priority'] }
        },
        {
            id: 'profile_banner',
            name: '🎨 Banner Profilo Personalizzato',
            icon: '🖼️',
            description: 'Upload immagine custom per il tuo profilo',
            cost: 400,
            category: 'custom',
            metadata: { maxFileSize: 5242880 }
        },
        {
            id: 'role_moderator',
            name: '🛡️ Ruolo Moderator',
            icon: '🔱',
            description: 'Diventa moderatore del server',
            cost: 2000,
            category: 'role',
            metadata: { roleId: '111222333', permissions: ['manage_messages', 'kick_members'] }
        },
        {
            id: 'custom_sound',
            name: '🎵 Effetto Audio Custom',
            icon: '🔊',
            description: 'Personalizza il tuo suono di entrata VC',
            cost: 350,
            category: 'custom',
            metadata: { maxDuration: 10 }
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
    // In produzione: usare bot token + endpoint /guilds/{guild_id}/members/@me
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
    
    // Submit ticket form
    // In produzione: inviare a /api/ticket con POST body:
    // { userId, prizeId, cost, notes, timestamp }
    // oppure webhook Discord: POST https://discord.com/api/webhooks/{webhook_id}/{token}
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
            
            // Genera ticket ID (in produzione: ricevere da server)
            const ticketId = 'TICKET-' + Date.now().toString(36).toUpperCase();
            
            logger.info(`🎫 Ticket submitted: ${ticketId}`);
            return { 
                success: true, 
                data: { 
                    ticketId, 
                    newBalance: mockAPI.wallet.balance,
                    status: 'pending' // In produzione: webhooks notificano staff
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
    const CLIENT_ID = 'YOUR_CLIENT_ID'; // ← Sostituisci con vero client_id
    const REDIRECT_URI = 'https://your-site/oauth'; // ← Sostituisci con vero callback
    
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
            <div class="shop-item-price">💰 ${item.cost} coins</div>
            <button class="shop-item-btn" data-item-id="${item.id}">
                🎁 Riscatta
            </button>
        `;
        
        // Listener per apertura modal
        card.querySelector('button').addEventListener('click', () => {
            ticketManager.openModal(item);
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
        const result = document.getElementById('ticketResult');
        
        // Riempi form con dati item
        document.getElementById('ticketPrize').value = item.name;
        document.getElementById('ticketCost').value = item.cost;
        document.getElementById('ticketNotes').value = '';
        document.getElementById('ticketTerms').checked = false;
        
        // Nascondi result
        result.style.display = 'none';
        result.innerHTML = '';
        
        modal.classList.add('active');
        
        // Focus trap: focus sul primo input
        setTimeout(() => {
            document.getElementById('ticketNotes').focus();
        }, 100);
        
        logger.info(`🎫 Modal aperto per: ${item.name}`);
    };
    
    const closeModal = () => {
        const modal = document.getElementById('ticketModal');
        modal.classList.remove('active');
        selectedItem = null;
        logger.info('🎫 Modal chiuso');
    };
    
    const validateForm = () => {
        const notes = document.getElementById('ticketNotes').value;
        const terms = document.getElementById('ticketTerms').checked;
        
        if (!terms) {
            alert('⚠️ Accetta i termini per continuare');
            return false;
        }
        
        if (!selectedItem) {
            alert('⚠️ Nessun premio selezionato');
            return false;
        }
        
        return true;
    };
    
    const submitForm = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const form = document.getElementById('ticketForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Disabilita bottone durante submit
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Invio...';
        
        const formData = {
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            cost: selectedItem.cost,
            notes: document.getElementById('ticketNotes').value,
            timestamp: new Date().toISOString()
        };
        
        try {
            const result = await mockAPI.submitTicket(formData);
            
            if (result.success) {
                // Mostra success message
                const resultDiv = document.getElementById('ticketResult');
                resultDiv.className = 'ticket-result success';
                resultDiv.innerHTML = `
                    <h3>✅ Richiesta Inviata!</h3>
                    <p><strong>Ticket ID:</strong> ${result.data.ticketId}</p>
                    <p><strong>Status:</strong> In sospeso - Lo staff prenderà in carico</p>
                    <p><strong>Nuovo saldo:</strong> ${result.data.newBalance} coins</p>
                `;
                resultDiv.style.display = 'block';
                
                // Reset form
                form.style.display = 'none';
                
                // Aggiorna wallet display
                walletManager.loadWallet();
                
                // Auto-chiudi dopo 5 secondi
                setTimeout(() => {
                    closeModal();
                    form.style.display = 'flex'; // Ripristina per prossima volta
                }, 5000);
                
                logger.info(`🎫 Ticket success: ${result.data.ticketId}`);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            const resultDiv = document.getElementById('ticketResult');
            resultDiv.className = 'ticket-result error';
            resultDiv.innerHTML = `
                <h3>❌ Errore Invio</h3>
                <p>${error.message}</p>
            `;
            resultDiv.style.display = 'block';
            logger.error(`Ticket error: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Invia Richiesta';
        }
    };
    
    // Setup listeners
    const init = () => {
        document.getElementById('closeModal')?.addEventListener('click', closeModal);
        document.getElementById('cancelTicket')?.addEventListener('click', closeModal);
        document.getElementById('ticketForm')?.addEventListener('submit', submitForm);
        
        // Chiudi con Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    };
    
    return { openModal, closeModal, validateForm, submitForm, init };
})();

// ===== WALLET MANAGER =====
const walletManager = (() => {
    const loadWallet = async () => {
        const result = await mockAPI.fetchWallet();
        
        if (result.success) {
            const balanceEl = document.getElementById('walletBalance');
            if (balanceEl) {
                balanceEl.textContent = result.data.balance;
            }
        } else {
            logger.warn(`Wallet load failed: ${result.error}`);
        }
    };
    
    const setupWalletButton = () => {
        document.getElementById('btnCheckWallet')?.addEventListener('click', loadWallet);
    };
    
    return { loadWallet, setupWalletButton };
})();

// ===== RANKS MANAGER =====
// Mostra ruoli Discord sincronizzati dal server
const ranksManager = (() => {
    let isConnected = false;
    
    const updateUserStatus = (status, userData = null) => {
        isConnected = status === 'connected';
        const btn = document.getElementById('syncRolesBtn');
        
        if (isConnected) {
            btn.disabled = false;
            logger.info(`✅ Discord connected: ${userData.username}`);
        } else {
            btn.disabled = true;
            document.getElementById('discordRanksContainer').innerHTML = 
                '<div class="rank-placeholder">Connetti Discord per vedere i tuoi ruoli</div>';
        }
    };
    
    const syncRoles = async () => {
        const container = document.getElementById('discordRanksContainer');
        container.innerHTML = '<div class="rank-placeholder">Sincronizzazione...</div>';
        
        const result = await mockAPI.fetchRoles();
        
        if (result.success) {
            container.innerHTML = '';
            result.data.forEach(role => {
                const badge = document.createElement('div');
                badge.className = 'rank-badge';
                badge.style.borderColor = role.color;
                badge.style.color = role.color;
                badge.textContent = role.name;
                container.appendChild(badge);
            });
            logger.info(`✅ ${result.data.length} ruoli sincronizzati`);
        } else {
            container.innerHTML = `<div class="rank-placeholder">❌ Errore: ${result.error}</div>`;
        }
    };
    
    const setupSyncButton = () => {
        document.getElementById('syncRolesBtn')?.addEventListener('click', syncRoles);
    };
    
    return { updateUserStatus, syncRoles, setupSyncButton };
})();

// Make updateUserStatus global for OAuth callback
window.updateUserStatus = ranksManager.updateUserStatus;

// ===== DISCORD CONNECT BUTTON =====
const setupDiscordConnect = () => {
    const btn = document.getElementById('discordConnectBtn');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        // Genera OAuth URL con placeholder
        const authUrl = discordOAuth.generateAuthURL();
        
        // In produzione: window.location.href = authUrl
        // Per demo: mostra placeholder con istruzioni
        logger.warn('🔐 OAuth2 Placeholder. In produzione:');
        logger.info(`URL: ${authUrl}`);
        logger.info('Sostituisci YOUR_CLIENT_ID con vero Discord Application ID');
        
        // Per test demo: simula success con parametro
        if (confirm('👉 Per demo: vuoi simulare il login con ?oauth=success?')) {
            window.location.href = window.location.pathname + '?oauth=success';
        }
    });
};

// ===== NAVIGATION =====
const navigation = (() => {
    const setupSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    };
    
    const updateActiveLinks = () => {
        // Aggiorna nav links based on scroll position
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const navLink = document.querySelector(`a[href="#${section.id}"]`);
                
                if (navLink && rect.top <= 100 && rect.bottom >= 100) {
                    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        });
    };
    
    return { setupSmoothScroll, updateActiveLinks };
})();

// ===== INTERSECTION OBSERVER =====
// Anima card quando scrollano in view
const setupIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
};

// ===== SCROLL TO TOP BUTTON =====
const setupScrollTopButton = () => {
    const button = document.createElement('button');
    button.id = 'scrollTopBtn';
    button.innerHTML = '⬆️';
    button.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--neon-blue), var(--ocean-blue));
        border: 1px solid rgba(0, 212, 255, 0.5);
        border-radius: var(--radius-xl);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all var(--transition-normal);
        pointer-events: none;
        z-index: 999;
        box-shadow: var(--glow-md);
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

// ===== DEV PANEL CONTROLS =====
const setupDevPanel = () => {
    document.getElementById('closeDevPanel')?.addEventListener('click', () => {
        document.getElementById('devPanel')?.classList.remove('active');
    });
    
    document.getElementById('clearDevLog')?.addEventListener('click', () => {
        const logPanel = document.getElementById('devLog');
        if (logPanel) {
            logPanel.innerHTML = '';
            logger.info('Log cleared');
        }
    });
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
    logger.info('🌊 OceanHub Site - Initialization started');
    
    // Setup all managers
    shopManager.setupFilters();
    await shopManager.loadShop();
    
    walletManager.setupWalletButton();
    await walletManager.loadWallet();
    
    ranksManager.setupSyncButton();
    
    ticketManager.init();
    
    setupDiscordConnect();
    setupScrollTopButton();
    setupDevPanel();
    
    navigation.setupSmoothScroll();
    navigation.updateActiveLinks();
    
    setupIntersectionObserver();
    
    // Handle OAuth callback
    discordOAuth.handleOAuthCallback();
    
    logger.info('✅ OceanHub Site - Ready!');
});
