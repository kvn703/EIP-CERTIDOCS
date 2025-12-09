importScripts("./lib/ethers.umd.min.js");
importScripts("./config.js");

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openSignatureWindow") {
        // get the window where the extension popup is open
        const windowId = chrome.windows.WINDOW_ID_CURRENT;
        // get the window's position
        chrome.windows.get(windowId, (window) => {
            // const left = window.left;
            // const top = window.top;
            const windowWidth = 500;
            const windowHeight = 988;
            const screenWidth = window.width;
            const screenHeight = window.height;


            const left = Math.round((screenWidth - windowWidth) / 2) + window.left;
            const top = Math.round((screenHeight - windowHeight) / 2) + window.top;
            // si une fenêtre est déjà ouverte, on la ferme pour en ouvrir une nouvelle
            chrome.windows.getAll((windows) => {
                windows.forEach((window) => {
                    if (window.type === "popup") {
                        chrome.windows.remove(window.id);
                    }
                });
            });
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return;
                chrome.tabs.sendMessage(tabs[0].id, { action: "getDivContentGenerate" }, (response) => {
                    // if (chrome.runtime.lastError) {
                    //     console.error("Erreur:", chrome.runtime.lastError);
                    //     return;
                    // }

                    if (!response || !response.content) {
                        chrome.windows.create({
                            url: getGenerateUrl(),
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                        return;
                    }
                    console.log("Contenu de la div:", response.content);
                    if (response.content === "Aucune div trouvée") {
                        chrome.windows.create({
                            url: getGenerateUrl(),
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                        return;
                    } else {
                        const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response.content));
                        chrome.windows.create({
                            url: getGenerateUrl(hash),
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                    }
                });
            });
        });
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openVerificationWindow") {
        const windowId = chrome.windows.WINDOW_ID_CURRENT;
        chrome.windows.get(windowId, (window) => {
            const windowWidth = 500;
            const windowHeight = 988;
            const screenWidth = window.width;
            const screenHeight = window.height;

            const left = Math.round((screenWidth - windowWidth) / 2) + window.left;
            const top = Math.round((screenHeight - windowHeight) / 2) + window.top;
            chrome.windows.getAll((windows) => {
                windows.forEach((window) => {
                    if (window.type === "popup") {
                        chrome.windows.remove(window.id);
                    }
                });
            });
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return;
                chrome.tabs.sendMessage(tabs[0].id, { action: "getDivContentVerify" }, (response) => {
                    if (!response || !response.content) {
                        chrome.windows.create({
                            url: getVerifyUrl(),
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                        return;
                    }
                    console.log("Contenu de la div:", response.content);
                    console.log("SignatureId:", response.signatureId);
                    if (response.content === "Aucune div trouvée") {
                        chrome.windows.create({
                            url: getVerifyUrl(),
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                        return;
                    } else {
                        const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response.content));
                        chrome.windows.create({
                            url: getVerifyUrl(hash, response.signatureId),
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                    }
                });
            });
        });
    }
});

// Nouveau handler : Récupération du mail pour la page React lors de la navigation
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMailContentForVerify") {
        // Chercher l'onglet Gmail (mail.google.com ou outlook.com)
        chrome.tabs.query({}, (tabs) => {
            let gmailTab = null;
            
            // Chercher d'abord dans l'onglet actif
            for (const tab of tabs) {
                if (tab.active && (tab.url && (tab.url.includes('mail.google.com') || tab.url.includes('outlook.com')))) {
                    gmailTab = tab;
                    break;
                }
            }
            
            // Si pas trouvé, chercher dans tous les onglets
            if (!gmailTab) {
                for (const tab of tabs) {
                    if (tab.url && (tab.url.includes('mail.google.com') || tab.url.includes('outlook.com'))) {
                        gmailTab = tab;
                        break;
                    }
                }
            }
            
            // Si toujours pas trouvé, utiliser l'onglet actif par défaut
            if (!gmailTab) {
                chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                    if (activeTabs.length > 0) {
                        gmailTab = activeTabs[0];
                    }
                    
                    if (gmailTab) {
                        chrome.tabs.sendMessage(gmailTab.id, { action: "getDivContentVerify" }, (response) => {
                            if (chrome.runtime.lastError) {
                                sendResponse({ content: null, signatureId: null, error: chrome.runtime.lastError.message });
                                return;
                            }
                            
                            if (!response || !response.content || response.content === "Aucune div trouvée") {
                                sendResponse({ content: null, signatureId: null });
                                return;
                            }
                            
                            // Calculer le hash comme dans openVerificationWindow
                            const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response.content));
                            sendResponse({ 
                                content: hash, 
                                signatureId: response.signatureId || null 
                            });
                        });
                    } else {
                        sendResponse({ content: null, signatureId: null, error: "Aucun onglet Gmail trouvé" });
                    }
                });
            } else {
                chrome.tabs.sendMessage(gmailTab.id, { action: "getDivContentVerify" }, (response) => {
                    if (chrome.runtime.lastError) {
                        sendResponse({ content: null, signatureId: null, error: chrome.runtime.lastError.message });
                        return;
                    }
                    
                    if (!response || !response.content || response.content === "Aucune div trouvée") {
                        sendResponse({ content: null, signatureId: null });
                        return;
                    }
                    
                    // Calculer le hash comme dans openVerificationWindow
                    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response.content));
                    sendResponse({ 
                        content: hash, 
                        signatureId: response.signatureId || null 
                    });
                });
            }
        });
        
        // Retourner true pour indiquer qu'on va répondre de manière asynchrone
        return true;
    }
});
