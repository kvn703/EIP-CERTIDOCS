// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
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
