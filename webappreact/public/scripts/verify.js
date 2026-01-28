// Script encapsulé pour éviter les redéclarations lors de navigations multiples
(function() {
    // Variables globales stockées sur window (toujours initialiser si pas présent)
    if (!window.__verifyVars) {
        window.__verifyVars = {
            signer: null,
            contract: null,
            contractAddress: "0x6515cc2007BF39BF74bc561d054D228325223A2A",
            abi: [
                "function verifySignature(bytes32, address, bytes32) external view returns (bool)",
            ],
            currentTab: 0,
            currentSignatureFile: null,
            currentPDFFile: null,
            currentImageFile: null
        };
    }

    // Helper pour synchroniser le wallet - accessible globalement
    window.__syncWalletForVerify = async function() {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                if (accounts && accounts.length > 0) {
                    window.__verifyVars.signer = await provider.getSigner();
                    window.__verifyVars.contract = new ethers.Contract(
                        window.__verifyVars.contractAddress, 
                        window.__verifyVars.abi, 
                        window.__verifyVars.signer
                    );
                    console.log('[verify.js] Wallet synchronisé avec succès');
                    return true;
                }
            } catch (error) {
                console.log('[verify.js] Erreur lors de la synchronisation du wallet:', error);
            }
        }
        return false;
    };

    // Si le script a déjà été initialisé, ne pas réexécuter les event listeners
    if (window.__verifyScriptInitialized) {
        // Mais on synchronise quand même le wallet au cas où
        window.__syncWalletForVerify();
        return;
    }
    window.__verifyScriptInitialized = true;

    // Alias locaux pour la compatibilité
    var signer = window.__verifyVars.signer;
    var contract = window.__verifyVars.contract;
    var contractAddress = window.__verifyVars.contractAddress;
    var abi = window.__verifyVars.abi;
    var currentTab = window.__verifyVars.currentTab;
    var currentSignatureFile = window.__verifyVars.currentSignatureFile;
    var currentPDFFile = window.__verifyVars.currentPDFFile;
    var currentImageFile = window.__verifyVars.currentImageFile;

    // Récupérer les paramètres URL
    var urlParams = new URLSearchParams(window.location.search);
    var messageHashVar = urlParams.get("messageHash");
    var signatureIdVar = urlParams.get("signatureId");

// Events walletConnected/walletDisconnected (gérés par React/appkit)
window.addEventListener('walletConnected', async () => {
    console.log('[verify.js] Event walletConnected reçu');
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        window.__verifyVars.signer = await provider.getSigner();
        signer = window.__verifyVars.signer;
        const address = await signer.getAddress();
        window.__verifyVars.contract = new ethers.Contract(contractAddress, abi, signer);
        contract = window.__verifyVars.contract;
        console.log('[verify.js] Wallet connecté:', address);
        updateUI(address);
    } catch (error) {
        console.error('[verify.js] Erreur lors de la connexion wallet:', error);
    }
});

window.addEventListener('walletDisconnected', () => {
    console.log('[verify.js] Event walletDisconnected reçu');
    window.__verifyVars.signer = null;
    window.__verifyVars.contract = null;
    signer = null;
    contract = null;
    updateUI(null);
});

// Helpers UI (copié/adapté de script.js)
function createAddressSpan(address, addressShort) {
    const addressSpan = document.createElement("span");
    addressSpan.innerText = "Connecté : " + addressShort;
    addressSpan.title = address;
    addressSpan.classList.add("address-span");
    addressSpan.addEventListener("mouseover", () => {
        addressSpan.innerText = address;
    });
    addressSpan.addEventListener("mouseout", () => {
        addressSpan.innerText = "Connecté : " + addressShort;
    });
    return addressSpan;
}

function createCopyButton(address) {
    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.title = "Copier l'adresse";
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(address);
        copyButton.classList.add("icon-transition-out");
        setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-check-circle"></i>';
            copyButton.classList.remove("icon-transition-out");
            copyButton.classList.add("icon-transition-in");
            setTimeout(() => {
                copyButton.classList.remove("icon-transition-in");
            }, 200);
        }, 200);
        setTimeout(() => {
            copyButton.classList.add("icon-transition-out-reverse");
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.classList.remove("icon-transition-out-reverse");
                copyButton.classList.add("icon-transition-in-reverse");
                setTimeout(() => {
                    copyButton.classList.remove("icon-transition-in-reverse");
                }, 200);
            }, 200);
        }, 2000);
    });
    return copyButton;
}

function updateUI(address) {
    const accountElement = document.getElementById("account");
    if (!accountElement) return;
    accountElement.innerHTML = "";
    if (address) {
        let addressShort = address.substring(0, 6) + "..." + address.substring(address.length - 4);
        const addressSpan = createAddressSpan(address, addressShort);
        const copyButton = createCopyButton(address);
        accountElement.appendChild(addressSpan);
        accountElement.appendChild(copyButton);
    }
}

// Fonction pour créer une belle alerte
function showBeautifulAlert(message, type = 'error') {
    // Supprimer les alertes existantes
    const existingAlerts = document.querySelectorAll('.beautiful-alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `beautiful-alert ${type}`;
    alertDiv.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">
                ${type === 'error' ? '!' : type === 'success' ? '✓' : '!'}
            </div>
            <div class="alert-message">${message}</div>
            <button class="alert-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Styles pour l'alerte
    const style = document.createElement('style');
    style.textContent = `
        .beautiful-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .beautiful-alert.error {
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        }
        
        .beautiful-alert.success {
            background: linear-gradient(135deg, #51cf66, #40c057);
        }
        
        .beautiful-alert.warning {
            background: linear-gradient(135deg, #ffd43b, #fcc419);
        }
        
        .alert-content {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            border-radius: 12px;
            color: white;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            min-width: 300px;
        }
        
        .alert-icon {
            font-size: 20px;
            flex-shrink: 0;
        }
        
        .alert-message {
            flex: 1;
            font-size: 14px;
            font-weight: 600;
            line-height: 1.4;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }
        
        .alert-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(alertDiv);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}


// Vérification de la preuve (exemple)
async function verifySignature() {
    // IMPORTANT: Récupérer les valeurs actuelles depuis window.__verifyVars
    // pour éviter les problèmes après navigation entre pages
    var signer = window.__verifyVars.signer;
    
    // Si signer est null, essayer de synchroniser le wallet
    if (!signer && typeof window.__syncWalletForVerify === 'function') {
        console.log('[verify.js] Signer non trouvé, tentative de synchronisation...');
        await window.__syncWalletForVerify();
        signer = window.__verifyVars.signer;
    }

    var contract = window.__verifyVars.contract;
    var currentTab = window.__verifyVars.currentTab;
    var currentSignatureFile = window.__verifyVars.currentSignatureFile;
    var currentPDFFile = window.__verifyVars.currentPDFFile;
    var currentImageFile = window.__verifyVars.currentImageFile;
    var contractAddress = window.__verifyVars.contractAddress;
    var abi = window.__verifyVars.abi;

    // Vérifier si l'utilisateur est connecté
    isString = document.getElementById("signatureCheckbox").checked;
    window.dispatchEvent(new CustomEvent('Error', { detail: 'Vérification de la preuve' }));
    if (!signer) {
        const verify_element = document.getElementById("verify");
        if (verify_element) {
            verify_element.innerText = "❌ Erreur : Veuillez d'abord connecter votre wallet pour vérifier une preuve";
        }
        showBeautifulAlert('Veuillez d\'abord connecter votre wallet pour vérifier une preuve', 'error');
        return;
    }

    if (currentTab === 0) {
        let signatureId = document.getElementById("signatureId").value.trim();
        
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : L'ID de preuve est invalide !";
            }
            // showBeautifulAlert("L'ID de preuve est invalide !", 'error'); // Commenté : message déjà affiché ailleurs
            return;
        }

        let message = document.getElementById("messageInput").value.trim();
        if (message === "") {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Le message ne peut pas être vide !";
            }
            // showBeautifulAlert("Le message ne peut pas être vide !", 'error'); // Commenté : message déjà affiché ailleurs
            return;
        }

        // IMPORTANT: Normaliser le message pour garantir qu'il est au bon format
        // Le message venant de background.js est déjà hashé avec ethers.utils.keccak256
        // qui génère toujours un hash au format 0x + 64 caractères hex
        // Mais il peut y avoir des espaces ou des caractères invisibles
        
        // Nettoyer le message de tous les espaces et caractères invisibles
        message = message.replace(/\s/g, '');
        
        // Vérifier si le message est déjà un hash (format 0x + 64 caractères hex)
        if (/^0x[a-fA-F0-9]{64}$/.test(message)) {
            // Le message est déjà un hash, l'utiliser directement
            messageHash = message;
        } else if (/^[a-fA-F0-9]{64}$/.test(message)) {
            // Le message est un hash sans le préfixe 0x, l'ajouter
            messageHash = '0x' + message;
        } else {
            // Le message est le contenu brut, le hasher
            // Utiliser la même méthode que background.js pour garantir la cohérence
            messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        }
        const userAddress = await signer.getAddress();
        
        const verify_element = document.getElementById("verify");
        if (verify_element) {
            verify_element.innerText = "Vérification en cours...";
        }
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = isValid
                    ? "✅ Empreinte VALIDE"
                    : "❌ Empreinte NON VALIDE";
            }
        } catch (error) {
            if (!error.message.includes("could not decode result data")) {
                alert(error.message);
            }
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur lors de la vérification.";
            }
        }
    } else if (currentTab === 3) {
        if (!currentSignatureFile && !isString) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Veuillez d'abord sélectionner un fichier de preuve";
            }
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier de preuve', 'error');
            return;
        }
        let signatureId;
        if (isString) {
            const signature_id_element = document.getElementById("signatureIdString");
            if (!signature_id_element) {
                const verify_element = document.getElementById("verify");
                if (verify_element) {
                    verify_element.innerText = "❌ Erreur : L'élément signatureIdString est introuvable";
                }
                showBeautifulAlert('L\'élément signatureIdString est introuvable', 'error');
                return;
            }
            signatureId = signature_id_element.value.trim();
        } else {
            signatureId = await extractTextFromFileImage(currentSignatureFile).catch((error) => {
                showBeautifulAlert('Erreur lors de l\'extraction de la preuve depuis l\'image', 'error');
            });
        }
        if (!signatureId) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur lors de l'extraction de la preuve depuis l'image";
            }
            showBeautifulAlert('Erreur lors de l\'extraction de la preuve depuis l\'image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : L'ID de preuve est invalide !";
            }
            // showBeautifulAlert("L'ID de preuve est invalide !", 'error'); // Commenté : message déjà affiché ailleurs
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        const message_element = document.getElementById("texte2");
        if (!message_element) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : L'élément texte2 est introuvable";
            }
            showBeautifulAlert('L\'élément texte2 est introuvable', 'error');
            return;
        }
        const message = message_element.value.trim();
        if (message === "") {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Le message ne peut pas être vide !";
            }
            // showBeautifulAlert("Le message ne peut pas être vide !", 'error'); // Commenté : message déjà affiché ailleurs
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        const userAddress = await signer.getAddress();
        
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            
            document.getElementById("verify").innerText = isValid
                ? "✅ Empreinte VALIDE"
                : "❌ Empreinte NON VALIDE";
        }
        catch (error) {
            if (!error.message.includes("could not decode result data")) {
                showBeautifulAlert(error.message, 'error');
            }
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification.";
        }
    } else if (currentTab === 1) {
        if (!currentPDFFile) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Veuillez d'abord sélectionner un fichier PDF";
            }
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier PDF', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        if (!currentSignatureFile && !isString) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Veuillez d'abord sélectionner un fichier de preuve";
            }
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier de preuve', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        let signatureId;
        if (isString) {
            const signature_id_element = document.getElementById("signatureIdString");
            if (!signature_id_element) {
                const verify_element = document.getElementById("verify");
                if (verify_element) {
                    verify_element.innerText = "❌ Erreur : L'élément signatureIdString est introuvable";
                }
                showBeautifulAlert('L\'élément signatureIdString est introuvable', 'error');
                return;
            }
            signatureId = signature_id_element.value.trim();
        } else {
            signatureId = await extractTextFromFileImage(currentSignatureFile).catch((error) => {
                showBeautifulAlert('Erreur lors de l\'extraction de la preuve depuis l\'image', 'error');
            });
        }
        if (!signatureId) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur lors de l'extraction de la preuve depuis l'image";
            }
            showBeautifulAlert('Erreur lors de l\'extraction de la preuve depuis l\'image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : L'ID de preuve est invalide !";
            }
            // showBeautifulAlert("L'ID de preuve est invalide !", 'error'); // Commenté : message déjà affiché ailleurs
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        const fileBuffer = await readFileAsArrayBuffer(currentPDFFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        const userAddress = await signer.getAddress();
        
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            
            document.getElementById("verify").innerText = isValid
                ? "✅ Empreinte VALIDE"
                : "❌ Empreinte NON VALIDE";
        }
        catch (error) {
            if (!error.message.includes("could not decode result data")) {
                showBeautifulAlert(error.message, 'error');
            }
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification.";
        }
    } else if (currentTab === 2) {
        if (!currentImageFile) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Veuillez d'abord sélectionner un fichier image";
            }
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        if (!currentSignatureFile && !isString) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : Veuillez d'abord sélectionner un fichier de preuve";
            }
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier de preuve', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        let signatureId;
        if (isString) {
            const signature_id_element = document.getElementById("signatureIdString");
            if (!signature_id_element) {
                const verify_element = document.getElementById("verify");
                if (verify_element) {
                    verify_element.innerText = "❌ Erreur : L'élément signatureIdString est introuvable";
                }
                showBeautifulAlert('L\'élément signatureIdString est introuvable', 'error');
                return;
            }
            signatureId = signature_id_element.value.trim();
        } else {
            signatureId = await extractTextFromFileImage(currentSignatureFile).catch((error) => {
                showBeautifulAlert('Erreur lors de l\'extraction de la preuve depuis l\'image', 'error');
            });
        }
        if (!signatureId) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur lors de l'extraction de la preuve depuis l'image";
            }
            showBeautifulAlert('Erreur lors de l\'extraction de la preuve depuis l\'image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            const verify_element = document.getElementById("verify");
            if (verify_element) {
                verify_element.innerText = "❌ Erreur : L'ID de preuve est invalide !";
            }
            // showBeautifulAlert("L'ID de preuve est invalide !", 'error'); // Commenté : message déjà affiché ailleurs
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la preuve depuis l\'image' }));
            return;
        }

        const fileBuffer = await readFileAsArrayBuffer(currentImageFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        const userAddress = await signer.getAddress();
        
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            
            document.getElementById("verify").innerText = isValid
                ? "✅ Empreinte VALIDE"
                : "❌ Empreinte NON VALIDE";
        }
        catch (error) {
            if (!error.message.includes("could not decode result data")) {
                showBeautifulAlert(error.message, 'error');
            }
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification.";
        }
    } else {
        const verify_element = document.getElementById("verify");
        if (verify_element) {
            verify_element.innerText = "❌ Erreur : Veuillez sélectionner un onglet valide pour vérifier la signature";
        }
        showBeautifulAlert('Veuillez sélectionner un onglet valide pour vérifier la signature', 'error');
    }
}

async function extractTextFromFileImage(file) {
    if (!(file instanceof File)) {
        throw new Error("L'argument doit être un objet File.");
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = URL.createObjectURL(file);
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

window.addEventListener('signatureFileChanged', (event) => {
    // extract the signatureId from the signatureFile id element
    const signatureFile = event.detail;
    window.__verifyVars.currentSignatureFile = signatureFile;
    currentSignatureFile = signatureFile; // Synchroniser l'alias
});

window.addEventListener('pdfFileChanged', (event) => {
    // extract the PDF file from the event detail
    const pdfFile = event.detail;
    window.__verifyVars.currentPDFFile = pdfFile;
    currentPDFFile = pdfFile; // Synchroniser l'alias
});

window.addEventListener('tabChanged', (event) => {
    window.__verifyVars.currentTab = event.detail;
    currentTab = event.detail; // Synchroniser l'alias
});

window.addEventListener('imageFileChanged', (event) => {
    // extract the image file from the event detail
    const imageFile = event.detail;
    window.__verifyVars.currentImageFile = imageFile;
    currentImageFile = imageFile; // Synchroniser l'alias
});

// Rendre la fonction accessible globalement
window.verifySignature = verifySignature;

// Attache l'event click sur le bouton de vérification après chargement du DOM
// Utiliser un délai pour s'assurer que le DOM est chargé
function attachVerifyButton() {
    const verifyButton = document.getElementById("verifySignature");
    if (verifyButton) {
        // Ne pas ajouter d'event listener si React gère déjà le onClick
        // La fonction est maintenant accessible via window.verifySignature
    } else {
        // Réessayer après un court délai si le bouton n'existe pas encore
        setTimeout(attachVerifyButton, 100);
    }
}

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachVerifyButton);
} else {
    attachVerifyButton();
}

})(); // Fin de l'IIFE