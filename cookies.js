/**
 * cookies.js - Cookie Consent Management
 * Gestisce il consenso GDPR con categorie Necessary, Analytics e Marketing
 * Salva preferenze in localStorage e blocca script fino al consenso
 */

// Cookie Configuration
const COOKIE_CONFIG = {
    cookieName: 'oceanhub_cookie_consent',
    cookieExpiry: 180, // giorni
    categories: {
        necessary: {
            name: 'Necessary',
            label: 'Cookie Necessari',
            description: 'Cookie essenziali per il funzionamento del sito. Sempre attivi.',
            required: true,
            enabled: true
        },
        analytics: {
            name: 'Analytics',
            label: 'Cookie Analitici',
            description: 'Ci aiutano a capire come i visitatori interagiscono con il sito.',
            required: false,
            enabled: false
        },
        marketing: {
            name: 'Marketing',
            label: 'Cookie Marketing',
            description: 'Usati per mostrare contenuti personalizzati e widget esterni.',
            required: false,
            enabled: false
        }
    }
};

// Cookie Manager Class
class CookieManager {
    constructor() {
        this.consentGiven = false;
        this.preferences = this.loadPreferences();
        this.init();
    }

    init() {
        // Check if consent already given
        if (this.preferences) {
            this.consentGiven = true;
            this.applyPreferences();
        } else {
            // Show cookie banner after small delay
            setTimeout(() => this.showBanner(), 1000);
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Cookie settings link in footer
        const settingsLink = document.getElementById('cookie-settings-link');
        if (settingsLink) {
            settingsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal();
            });
        }
    }

    showBanner() {
        // Create banner if doesn't exist
        if (!document.getElementById('cookie-banner')) {
            this.createBanner();
        }

        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => banner.remove(), 300);
        }
    }

    createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>Cookie e Privacy</h3>
                    <p>Utilizziamo cookie per migliorare la tua esperienza. Scegli quali cookie accettare. 
                    <a href="./cookie-policy.html">Leggi la Cookie Policy</a></p>
                </div>
                <div class="cookie-banner-actions">
                    <button class="btn btn-secondary" id="cookie-customize">Personalizza</button>
                    <button class="btn btn-primary" id="cookie-accept-all">Accetta Tutto</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
            this.acceptAll();
        });

        document.getElementById('cookie-customize')?.addEventListener('click', () => {
            this.showModal();
        });
    }

    showModal() {
        // Create modal if doesn't exist
        if (!document.getElementById('cookie-modal')) {
            this.createModal();
        }

        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.add('show');
            // Load current preferences into toggles
            this.updateModalToggles();
        }
    }

    hideModal() {
        const modal = document.getElementById('cookie-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'cookie-modal';
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h3>Impostazioni Cookie</h3>
                    <button class="cookie-modal-close" id="cookie-modal-close" aria-label="Chiudi">&times;</button>
                </div>

                <div class="cookie-categories">
                    ${Object.entries(COOKIE_CONFIG.categories).map(([key, cat]) => `
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <h4>${cat.label}</h4>
                                <label class="cookie-toggle">
                                    <input 
                                        type="checkbox" 
                                        id="cookie-${key}" 
                                        data-category="${key}"
                                        ${cat.required ? 'checked disabled' : ''}
                                    >
                                    <span class="cookie-toggle-slider"></span>
                                </label>
                            </div>
                            <p>${cat.description}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="cookie-modal-actions">
                    <button class="btn btn-secondary" id="cookie-save">Salva Preferenze</button>
                    <button class="btn btn-primary" id="cookie-accept-selected">Accetta Selezionati</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('cookie-save')?.addEventListener('click', () => {
            this.savePreferencesFromModal();
        });

        document.getElementById('cookie-accept-selected')?.addEventListener('click', () => {
            this.savePreferencesFromModal();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
    }

    updateModalToggles() {
        const prefs = this.preferences || {};
        Object.entries(COOKIE_CONFIG.categories).forEach(([key, cat]) => {
            const toggle = document.getElementById(`cookie-${key}`);
            if (toggle && !cat.required) {
                toggle.checked = prefs[key] || cat.enabled;
            }
        });
    }

    acceptAll() {
        const preferences = {};
        Object.keys(COOKIE_CONFIG.categories).forEach(key => {
            preferences[key] = true;
        });

        this.savePreferences(preferences);
        this.hideBanner();
        this.hideModal();
    }

    savePreferencesFromModal() {
        const preferences = {};
        Object.keys(COOKIE_CONFIG.categories).forEach(key => {
            const toggle = document.getElementById(`cookie-${key}`);
            preferences[key] = toggle ? toggle.checked : COOKIE_CONFIG.categories[key].enabled;
        });

        this.savePreferences(preferences);
        this.hideBanner();
        this.hideModal();
    }

    savePreferences(preferences) {
        // Save to localStorage
        localStorage.setItem(COOKIE_CONFIG.cookieName, JSON.stringify(preferences));

        // Save as cookie with expiry
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + COOKIE_CONFIG.cookieExpiry);
        document.cookie = `${COOKIE_CONFIG.cookieName}=${JSON.stringify(preferences)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;

        this.preferences = preferences;
        this.consentGiven = true;

        // Apply preferences immediately
        this.applyPreferences();

        console.log('Cookie preferences saved:', preferences);
    }

    loadPreferences() {
        // Try localStorage first
        const stored = localStorage.getItem(COOKIE_CONFIG.cookieName);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Failed to parse cookie preferences:', e);
            }
        }

        // Fallback to cookie
        const cookieMatch = document.cookie.match(new RegExp(`${COOKIE_CONFIG.cookieName}=([^;]+)`));
        if (cookieMatch) {
            try {
                return JSON.parse(cookieMatch[1]);
            } catch (e) {
                console.error('Failed to parse cookie from document.cookie:', e);
            }
        }

        return null;
    }

    applyPreferences() {
        if (!this.preferences) return;

        // Load Analytics if consented
        if (this.preferences.analytics) {
            this.loadAnalytics();
        }

        // Load Marketing widgets if consented
        if (this.preferences.marketing) {
            this.loadMarketingScripts();
        }

        // Dispatch event for other scripts to react
        window.dispatchEvent(new CustomEvent('cookieConsentGiven', {
            detail: this.preferences
        }));
    }

    loadAnalytics() {
        // Google Analytics (placeholder - replace with your tracking ID)
        if (window.gtag) {
            console.log('Google Analytics already loaded');
            return;
        }

        // Example GA4 implementation (uncomment and add your ID)
        /*
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX';
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
        window.gtag = gtag;
        */

        console.log('Analytics consent given - scripts would load here');
    }

    loadMarketingScripts() {
        // Load marketing widgets/embeds here
        console.log('Marketing consent given - external widgets would load here');

        // Example: Discord widget embed
        // const discordWidget = document.getElementById('discord-widget-container');
        // if (discordWidget) {
        //     discordWidget.innerHTML = '<iframe src="..." />';
        // }
    }

    // Utility method to check if category is consented
    hasConsent(category) {
        return this.consentGiven && this.preferences && this.preferences[category] === true;
    }

    // Utility to track events (only if analytics consented)
    trackEvent(eventName, eventParams = {}) {
        if (!this.hasConsent('analytics')) {
            console.log(`[No Analytics Consent] Event: ${eventName}`, eventParams);
            return;
        }

        if (window.gtag) {
            window.gtag('event', eventName, eventParams);
            console.log(`[Analytics] Event: ${eventName}`, eventParams);
        } else {
            console.log(`[Analytics Ready] Event: ${eventName}`, eventParams);
        }
    }
}

// Initialize Cookie Manager on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cookieManager = new CookieManager();
    });
} else {
    window.cookieManager = new CookieManager();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}
