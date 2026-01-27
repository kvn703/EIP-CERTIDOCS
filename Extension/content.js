chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentGenerate") {
        let resolved = false;

        // ✅ GMAIL
        try {
            const divs = document.querySelectorAll("div.Am.aiL.Al.editable.LW-avf.tS-tW");
            if (divs.length) {
                const content = normalizeMessage(divs[divs.length - 1].innerText);

                // Tentative de récupération de l'expéditeur (l'utilisateur courant sur Gmail)
                let sender = "";
                // Méthode 1: Via le titre de la page (ex: "Boîte de réception - user@gmail.com - Gmail")
                const titleMatch = document.title.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
                if (titleMatch) {
                    sender = titleMatch[1];
                }

                console.log("✅ Gmail trouvé !");
                console.log("📝 [GÉNÉRATION] Contenu à signer :\n" + "From: " + sender + "\n\n" + content);
                sendResponse({ content: content, sender: sender });
                resolved = true;
                return true;
            }
        } catch (error) {
            console.warn("❌ Gmail div introuvable");
        }

        // ✅ OUTLOOK
        function tryGetOutlookContent() {
            if (resolved) return true; // on a déjà répondu (évite double réponse)

            const outlookDivs = document.querySelectorAll('div[contenteditable="true"][role="textbox"]');
            for (const el of outlookDivs) {
                const aria = el.getAttribute("aria-label") || "";
                if (
                    aria.toLowerCase().includes("corps du message") ||
                    aria.toLowerCase().includes("message body")
                ) {
                    let content = normalizeMessage(el.innerText || "");

                    // Tentative de récupération de l'expéditeur pour Outlook (Utilisateur connecté)
                    let sender = "";

                    // 1. CIBLAGE PRÉCIS OUTLOOK (Génération)
                    const profileBtn = document.getElementById("O365_MainLink_Me");

                    if (profileBtn) {
                        const attrs = profileBtn.getAttributeNames().reduce((acc, name) => {
                            acc[name] = profileBtn.getAttribute(name);
                            return acc;
                        }, {});

                        // Tentative d'extraction standard
                        const txt = (attrs['aria-label'] || "") + " " + (attrs['title'] || "");
                        const emailMatch = txt.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
                        if (emailMatch) sender = emailMatch[1];
                    }

                    // 2. SCANNER D'ATTRIBUTS PAGE_WIDE (Images & Liens)
                    if (!sender) {
                        console.log("🔍 [DEBUG] Recherche d'email dans les ressources de la page (Images/Liens)...");
                        const resources = document.querySelectorAll('img, a, div[style*="background"]');
                        for (const el of resources) {
                            let val = el.getAttribute("src") || el.getAttribute("href") || el.getAttribute("style") || "";
                            try { val = decodeURIComponent(val); } catch (e) { }

                            if (val.includes("@")) {
                                const match = val.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
                                if (match) {
                                    const candidate = match[1].toLowerCase();
                                    // Filtrer les URLs techniques
                                    if (!candidate.includes("noreply") && !candidate.includes("officedocument") && !candidate.includes("microsoft")) {
                                        console.log("🎯 Email potentiel trouvé dans ressource :", candidate, "Source:", val.substring(0, 50) + "...");
                                        sender = candidate;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    /* FIN DU SCANNING */
                    console.log("✅ Outlook trouvé !");
                    console.log("📝 [GÉNÉRATION] Contenu à signer :\n" + "From: " + sender + "\n\n" + content);
                    sendResponse({ content: content, sender: sender });
                    resolved = true;
                    return true;
                }
            }
            return false;
        }

        if (tryGetOutlookContent()) return true;

        // ⏳ Attente DOM Outlook
        const observer = new MutationObserver(() => {
            if (tryGetOutlookContent()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        sendResponse({ content: "Aucune div trouvée" });
        return true;
    }
});

function normalizeMessage(content) {
    return content
        .replace(/\r\n/g, "\n")            // CRLF to LF
        .replace(/\n{2,}/g, "\n")          // multiple line breaks → single
        .replace(/[ \t]{2,}/g, " ")        // multiple spaces → one
        .replace(/\u200B/g, "")            // zero-width space
        .replace(/\u00A0/g, " ")           // non-breaking space
        .replace(/\s+$/, "")               // trailing whitespace
        .replace(/^\s+/, "")               // leading whitespace
        .normalize("NFC");
}

async function extractTextFromImage(imageUrl) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let binaryText = "";
            for (let i = 0; i < data.length; i += 4) {
                binaryText += (data[i] & 1).toString();
                if (binaryText.endsWith("00000000")) break;
            }

            const chars = binaryText.match(/.{8}/g).map(byte => String.fromCharCode(parseInt(byte, 2)));
            resolve(chars.join('').replace(/\x00+$/, ''));
        };

        img.onerror = () => reject("Erreur de chargement de l'image");
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getDivContentVerify") {
        console.log("[getDivContentVerify] Début récupération...");

        try {
            let content = "", src = "";

            const gmailDiv = document.querySelector("div.ii.gt");
            if (gmailDiv) {
                // On filtre sur le premier <div dir="ltr"> à l'intérieur de gmailDiv
                const mainDiv = gmailDiv.querySelector('div[dir="ltr"]');
                if (mainDiv) {
                    content = mainDiv.innerText || "";
                    const img = mainDiv.querySelector("img");
                    if (img) src = img.getAttribute("src") || "";
                } else {
                    content = gmailDiv.innerText || "";
                    const img = gmailDiv.querySelector("img");
                    if (img) src = img.getAttribute("src") || "";
                }
            }

            if (!content) {
                const rpsDiv = document.querySelector('div[class^="rps_"]');
                if (rpsDiv) {
                    for (const el of rpsDiv.querySelectorAll('x_elementToProof')) {
                        const img = el.querySelector('img');
                        if (img) { src = img.getAttribute('src') || ""; break; }
                        if (el.innerText.trim()) content += el.innerText.trim() + "\n";
                    }
                    content = content.trim();
                    content = normalizeMessage(content);
                }
            }

            if (!content && !src) {
                const img = document.querySelector('img.Do8Zj');
                if (img) {
                    src = img.getAttribute("src") || "";
                    const parent = img.closest('div[class^="rps_"], div[role="document"], div.x_WordSection1');
                    if (parent) content = parent.innerText.trim();
                }
            }

            if (!content) {
                console.warn("[getDivContentVerify] Aucun contenu trouvé.");
                sendResponse({ content: "Aucune div trouvée", signatureId: "" });
                return;
            }

            // Tentative de récupération de l'expéditeur (mode vérification, email reçu)
            let sender = "";

            // --- STRATÉGIE GMAIL ---
            const senderSpan = document.querySelector("span.gD");
            if (senderSpan) {
                sender = senderSpan.getAttribute("email");
            }

            // --- STRATÉGIE OUTLOOK (Vérification) ---
            if (!sender) {
                console.log("🔍 [DEBUG] Recherche approfondie Outlook...");

                // Scan large des aria-labels et titles contenant des emails
                const candidates = [];
                const allNodes = document.querySelectorAll('*');

                for (const node of allNodes) {
                    const label = node.getAttribute("aria-label");
                    if (label && label.includes("@")) {
                        const match = label.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
                        if (match) candidates.push({ src: "aria-label", val: match[1], el: node });
                    }
                    const title = node.getAttribute("title");
                    if (title && title.includes("@")) {
                        const match = title.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
                        if (match) candidates.push({ src: "title", val: match[1], el: node });
                    }
                }

                if (candidates.length > 0) {
                    console.log("🔍 Candidats trouvés :", candidates);
                    // On prend le premier candidat comme heuristique pour l'instant
                    sender = candidates[0].val;
                } else {
                    console.log("⚠️ Aucun email trouvé dans le DOM.");
                }
            }

            if (!sender) {
                // Fallback: chercher un élément contenant un email dans le header du message
                // C'est un peu "bourrin" mais ça peut marcher si la structure change
                const headerDivs = document.querySelectorAll('div[class*="g_"]'); // Classes Outlook changent souvent, mais on peut essayer de scanner le haut
                // Scan global limité aux éléments visibles contenant '@'
                const emailRef = document.body.innerText.match(/<([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)>/);
                if (emailRef) {
                    // sender = emailRef[1]; // Trop risqué, peut prendre n'importe quoi
                }
            }

            // Fallback Title (déjà présent mais insuffisant)
            if (!sender) {
                const titleMatch = document.title.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
                if (titleMatch) {
                    sender = titleMatch[1];
                }
            }

            console.log("✉️ Expéditeur (détecté pour vérif) :", sender);
            console.log("📝 [VÉRIFICATION] Contenu à vérifier :\n" + "From: " + sender + "\n\n" + content);

            // check if content includes "Vous n'obtenez pas souvent d'e-mail à partir de chamajegogame@gmail.com. Pourquoi c'est important" with chamajecogame@gmail.com a variable
            if (content.includes("Vous n'obtenez pas souvent d'e-mail à partir de") && content.includes("@")) {
                const index = content.indexOf("\n");
                if (index !== -1) {
                    content = content.substring(index + 1).trim();
                }
            }

            content = content.replace(/Télécharger\nAjouter à Drive\nEnregistrer dans Photos\n?/g, "")
                .replace(/Analyse antivirus en cours...\nAjouter à Drive\nEnregistrer dans Photos\n?/g, "");

            if (src) {
                extractTextFromImage(src).then(text => {
                    console.log("✅ Signature extraite :", text);
                    content = normalizeMessage(content);
                    sendResponse({ content: content, signatureId: text, sender: sender });
                }).catch(() => {
                    console.error("[getDivContentVerify] Erreur extraction image");
                    sendResponse({ content: content, signatureId: "", sender: sender });
                });
            } else {
                console.warn("[getDivContentVerify] Pas d'image trouvée.");
                sendResponse({ content: content, signatureId: "" });
            }

            return true;
        } catch (e) {
            console.error("[getDivContentVerify] Exception :", e);
            sendResponse({ content: "Erreur récupération", signatureId: "" });
        }
    }
});

// Nouveau listener : Écouter les messages de la page React pour récupérer le mail
window.addEventListener('message', (event) => {
    // Vérifier que le message vient de la page React
    if (event.data && event.data.type === 'requestMailContentForVerify' && event.data.source === 'verify-page') {
        const requestId = event.data.requestId;

        // Vérifier que chrome.runtime est disponible
        if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) {
            window.postMessage({
                type: 'mailContentResponse',
                requestId: requestId,
                error: "Extension Chrome non disponible"
            }, '*');
            return;
        }

        try {
            // Transmettre la demande au background script qui peut chercher les onglets
            chrome.runtime.sendMessage(
                {
                    action: 'getMailContentForVerify',
                    requestId: requestId
                },
                (response) => {
                    // Vérifier les erreurs Chrome
                    if (chrome.runtime.lastError) {
                        const errorMsg = chrome.runtime.lastError.message || "Erreur de communication avec le background script";
                        window.postMessage({
                            type: 'mailContentResponse',
                            requestId: requestId,
                            error: errorMsg
                        }, '*');
                        return;
                    }

                    // Transmettre la réponse du background script à la page React
                    if (response) {
                        console.log("📝 [VÉRIFICATION VIA REACT] Réponse reçue du background:\nHashtag:", response.content, "\nSignatureID:", response.signatureId);

                        window.postMessage({
                            type: 'mailContentResponse',
                            requestId: requestId,
                            content: response.content,
                            signatureId: response.signatureId,
                            error: response.error
                        }, '*');
                    } else {
                        window.postMessage({
                            type: 'mailContentResponse',
                            requestId: requestId,
                            error: "Aucune réponse du background script"
                        }, '*');
                    }
                }
            );
        } catch (error) {
            // Gérer les erreurs de manière silencieuse
            console.log('[Content Script] Erreur lors de l\'envoi du message au background:', error);
            window.postMessage({
                type: 'mailContentResponse',
                requestId: requestId,
                error: error.message || "Erreur inconnue"
            }, '*');
        }
    }
});