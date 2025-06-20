importScripts("./lib/ethers.umd.min.js");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openSignatureWindow" || request.action === "openVerificationWindow") {
        const windowId = chrome.windows.WINDOW_ID_CURRENT;
        chrome.windows.get(windowId, (window) => {
            const windowWidth = 800;
            const windowHeight = 700;
            const screenWidth = window.width;
            const screenHeight = window.height;
            const left = Math.round((screenWidth - windowWidth) / 2) + window.left;
            const top = Math.round((screenHeight - windowHeight) / 2) + window.top;
            
            // Fermer les popups existants
            chrome.windows.getAll((windows) => {
                windows.forEach((window) => {
                    if (window.type === "popup") {
                        chrome.windows.remove(window.id);
                    }
                });
            });

            // Déterminer l'URL selon l'action
            let url = "http://localhost:3000/";
            if (request.action === "openVerificationWindow") {
                url = "http://localhost:3000/verify";
            }

            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) {
                    // Si aucun onglet actif, ouvrir directement
                    chrome.windows.create({
                        url: url,
                        type: "popup",
                        width: windowWidth,
                        height: windowHeight,
                        left: left,
                        top: top
                    });
                    return;
                }

                // Déterminer quelle action de contenu appeler
                const contentAction = request.action === "openSignatureWindow" ? "getDivContentGenerate" : "getDivContentVerify";
                
                chrome.tabs.sendMessage(tabs[0].id, { action: contentAction }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Erreur:", chrome.runtime.lastError);
                        // En cas d'erreur, ouvrir directement
                        chrome.windows.create({
                            url: url,
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                        return;
                    }

                    console.log("Contenu de la div:", response?.content);
                    
                    if (!response || response.content === "Aucune div trouvée") {
                        chrome.windows.create({
                            url: url,
                            type: "popup",
                            width: windowWidth,
                            height: windowHeight,
                            left: left,
                            top: top
                        });
                    } else {
                        const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(response.content));
                        let finalUrl = url + "?messageHash=" + hash;
                        
                        if (request.action === "openVerificationWindow" && response.signatureId) {
                            finalUrl += "&signatureId=" + response.signatureId;
                        }
                        
                        chrome.windows.create({
                            url: finalUrl,
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
        
        // Retourner true pour indiquer que la réponse sera asynchrone
        return true;
    }
});
