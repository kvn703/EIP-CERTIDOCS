importScripts("./lib/ethers.umd.min.js");

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openSignatureWindow" || request.action === "openVerificationWindow") {
        const windowId = chrome.windows.WINDOW_ID_CURRENT;
        chrome.windows.get(windowId, (window) => {
            const windowWidth = 500;
            const windowHeight = 575;
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
            // Choix de l'URL selon le type et l'action
            let url = "http://localhost:8080/";
            if (request.type === "pdf") {
                url = request.action === "openSignatureWindow" ? "http://localhost:8080/signPDF" : "http://localhost:8080/verifyPDF";
            }
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length === 0) return;

                chrome.tabs.sendMessage(tabs[0].id, { action: "getDivContentGenerate" }, (response) => {
                    // if (chrome.runtime.lastError) {
                    //     console.error("Erreur:", chrome.runtime.lastError);
                    //     return;
                    // }


                    console.log("Contenu de la div:", response.content);
                    if (response.content === "Aucune div trouvée") {
                        chrome.windows.create({
                            url: url,
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
                            url: url + "?messageHash=" + hash,
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
            const windowHeight = 575;
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
                    console.log("Contenu de la div:", response.content);
                    console.log("SignatureId:", response.signatureId);
                    let url = "http://localhost:8080/verify";
                    if (request.type === "pdf") {
                        url = "http://localhost:8080/verifyPDF";
                    }
                    if (response.content === "Aucune div trouvée") {
                        chrome.windows.create({
                            url: url, // Remplace par l'URL que tu veux
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
                            url: url + "?messageHash=" + hash + "&signatureId=" + response.signatureId, // Remplace par l'URL que tu veux
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
