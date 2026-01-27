// Translations
const translations = {
    en: {
        // Tabs
        create_fingerprint: "Create Fingerprint",
        verify_fingerprint: "Verify Fingerprint",
        
        // Generate tab
        create_blockchain_fingerprint: "Create Blockchain Fingerprint",
        create_description: "Generate an immutable proof for your emails, PDF documents, images, or text. The fingerprint is stored on the blockchain to guarantee authenticity.",
        generate_fingerprint: "Generate Fingerprint",
        
        // Verify tab
        verify_fingerprint_title: "Verify Fingerprint",
        verify_description: "Verify the integrity and authenticity of signed content. The system confirms that the fingerprint matches the original content.",
        verify_fingerprint_button: "Verify Fingerprint",
        
        // Footer
        compatible_with: "Compatible with Gmail, Outlook, PDF & Images"
    },
    fr: {
        // Tabs
        create_fingerprint: "Créer une empreinte",
        verify_fingerprint: "Vérifier une empreinte",
        
        // Generate tab
        create_blockchain_fingerprint: "Créer une empreinte blockchain",
        create_description: "Générez une preuve immuable pour vos emails, documents PDF, images ou texte. L'empreinte est stockée sur la blockchain pour garantir l'authenticité.",
        generate_fingerprint: "Générer l'empreinte",
        
        // Verify tab
        verify_fingerprint_title: "Vérifier une empreinte",
        verify_description: "Vérifiez l'intégrité et l'authenticité d'un contenu signé. Le système confirme que l'empreinte correspond au contenu original.",
        verify_fingerprint_button: "Vérifier l'empreinte",
        
        // Footer
        compatible_with: "Compatible avec Gmail, Outlook, PDF & Images"
    }
};

// Language management
let currentLang = localStorage.getItem('certidocs_lang') || 'fr';

function updateLanguageDisplay() {
    const langToggle = document.getElementById('langToggle');
    const langCode = langToggle.querySelector('.lang-code');
    langCode.textContent = currentLang.toUpperCase();
    langToggle.title = currentLang === 'fr' ? "Switch to English" : "Passer en Français";
}

function translatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // Update language display
    updateLanguageDisplay();
    
    // Save language preference
    localStorage.setItem('certidocs_lang', currentLang);
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language
    translatePage();
    
    // Language toggle
    document.getElementById('langToggle').addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        translatePage();
    });
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Initialize first tab as active
    const activeTab = localStorage.getItem('certidocs_active_tab') || 'generate';
    switchTab(activeTab);
    
    // Add click listeners to tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
            localStorage.setItem('certidocs_active_tab', tabId);
        });
    });
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Update tab buttons
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update tab contents
        tabContents.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // Action buttons
    document.getElementById("generate").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openSignatureWindow" });
    });
    
    document.getElementById("verify").addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "openVerificationWindow" });
    });
});
