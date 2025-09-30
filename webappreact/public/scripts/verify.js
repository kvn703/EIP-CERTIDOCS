// Si signer n'est pas déjà défini, on le déclare
if (typeof signer === "undefined") {
    var signer = null;
}
// Si contract n'est pas déjà défini, on le déclare
if (typeof contract === "undefined") {
    var contract = null;
}
if (typeof contractAddress === "undefined") {
    var contractAddress = "0x6515cc2007BF39BF74bc561d054D228325223A2A";
}
if (typeof abi === "undefined") {
    var abi = [
        "function verifySignature(bytes32, address, bytes32) external view returns (bool)",
    ];
}
if (typeof urlParams === "undefined") {
    var urlParams = new URLSearchParams(window.location.search);
}
if (typeof messageHashVar === "undefined") {
    var messageHashVar = urlParams.get("messageHash");
}
if (typeof signatureIdVar === "undefined") {
    var signatureIdVar = urlParams.get("signatureId");
}

if (messageHashVar) {
    document.getElementById("messageInput").value = messageHashVar;
}
if (signatureIdVar) {
    document.getElementById("signatureId").value = signatureIdVar.split("[CERTIDOCS]")[1];
}

let currentTab = 0; // 0: mail, 1: text, 2: PDF, 3: image
let currentSignatureFile = null; // Pour stocker le fichier de signature sélectionné
let currentPDFFile = null; // Pour stocker le fichier PDF sélectionné
let currentImageFile = null; // Pour stocker le fichier image sélectionné

// Helpers
async function initSignerAndContractIfPossible() {
    try {
        if (signer && contract) return true;
        if (!window.ethereum || !window.ethers) return false;
        const provider = new window.ethers.BrowserProvider(window.ethereum);
        // Vérifie si un compte est déjà autorisé
        const accounts = await provider.send("eth_accounts", []);
        if (!accounts || accounts.length === 0) return false;
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        contract = new window.ethers.Contract(contractAddress, abi, signer);
        updateUI(address);
        return true;
    } catch (e) {
        console.warn("initSignerAndContractIfPossible:", e);
        return false;
    }
}

// Sync avec React/appkit
window.addEventListener('walletConnected', async () => {
    try {
        const provider = new window.ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        contract = new window.ethers.Contract(contractAddress, abi, signer);
        console.log(address)
        updateUI(address);
    } catch (e) {
        console.error("walletConnected handler error:", e);
    }
});

window.addEventListener('walletDisconnected', () => {
    signer = null;
    contract = null;
    updateUI(null);
});

// Tentative d'initialisation au chargement, utile si l'utilisateur est déjà connecté AVANT l'ouverture de la page
window.addEventListener('load', () => {
    initSignerAndContractIfPossible();
});

// Ecouter les changements de compte/réseau pour garder signer/contract à jour
if (window.ethereum) {
    window.ethereum.on && window.ethereum.on('accountsChanged', async () => {
        await initSignerAndContractIfPossible();
    });
    window.ethereum.on && window.ethereum.on('chainChanged', async () => {
        await initSignerAndContractIfPossible();
    });
}

// Helpers UI (copié/adapté de script.js)
function createAddressSpan(address, addressShort) {
    const addressSpan = document.createElement("span");
    addressSpan.innerText = "🟢 Connecté : " + addressShort;
    addressSpan.title = address;
    addressSpan.classList.add("address-span");
    addressSpan.addEventListener("mouseover", () => {
        addressSpan.innerText = address;
    });
    addressSpan.addEventListener("mouseout", () => {
        addressSpan.innerText = "🟢 Connecté : " + addressShort;
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
        <div class="beautiful-alert-content">
            <span class="beautiful-alert-icon">${type === 'error' ? '❌' : '✅'}</span>
            <span class="beautiful-alert-message">${message}</span>
        </div>
        <button class="beautiful-alert-close">✖</button>
    `;

    document.body.appendChild(alertDiv);

    const closeButton = alertDiv.querySelector('.beautiful-alert-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => alertDiv.remove());
    }

    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 10);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 4000);
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}


// Vérification de la signature (exemple)
async function verifySignature() {
    // Fallback: tente d'initialiser signer/contract si non prêts
    if (!signer || !contract) {
        const ready = await initSignerAndContractIfPossible();
        if (!ready) {
            showBeautifulAlert('🔐 Veuillez d\'abord connecter votre wallet pour vérifier une signature', 'error');
            return;
        }
    }

    // Vérifier si l'utilisateur est connecté
    isString = document.getElementById("signatureCheckbox").checked;
    window.dispatchEvent(new CustomEvent('Error', { detail: 'Vérification de la signature' }));

    if (currentTab === 0) {
        const signatureId = document.getElementById("signatureId").value.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            alert("❌ L'ID de signature est invalide !");
            return;
        }

        const message = document.getElementById("messageInput").value.trim();
        console.log("Message à vérifier :", message);
        if (message === "") {
            alert("❌ Le message ne peut pas être vide !");
            return;
        }

        messageHash = message;
        const userAddress = await signer.getAddress();
        console.log("Hash du message :", messageHash);
        document.getElementById("verify").innerText = "⏳ Vérification en cours...";
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            document.getElementById("verify").innerText = isValid
                ? "✅ Signature VALIDE !"
                : "❌ Signature NON VALIDE.";
            console.log(isValid);
        } catch (error) {
            // Ne pas afficher d'alerte pour l'erreur de décodage
            if (!error.message.includes("could not decode result data")) {
                alert(error.message);
            }
            console.error(error);
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification (voir console).";
        }
    } else if (currentTab === 1) {
        if (!currentSignatureFile && !isString) {
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier de signature', 'error');
            return;
        }
        let signatureId;
        if (isString) {
            signatureId = document.getElementById("signatureIdString").value.trim();
            console.log("signatureIdString:", signatureId);
        } else {
            signatureId = await extractTextFromFileImage(currentSignatureFile).catch((error) => {
                console.error("Error extracting signatureId:", error);
                showBeautifulAlert('Erreur lors de l\'extraction de la signature depuis l\'image', 'error');
            });
        }
        if (!signatureId) {
            showBeautifulAlert('Erreur lors de l\'extraction de la signature depuis l\'image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            showBeautifulAlert("L'ID de signature est invalide !", 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        const message = document.getElementById("texte2").value.trim();
        console.log("TEXTE à vérifier :", message);
        if (message === "") {
            showBeautifulAlert("Le message ne peut pas être vide !", 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
        const userAddress = await signer.getAddress();
        console.log("Hash du message :", messageHash);
        // document.getElementById("verify").innerText = "⏳ Vérification en cours...";
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            document.getElementById("verify").innerText = isValid
                ? "✅ Signature VALIDE !"
                : "❌ Signature NON VALIDE.";
            console.log(isValid);
        }
        catch (error) {
            // Ne pas afficher d'alerte pour l'erreur de décodage
            if (!error.message.includes("could not decode result data")) {
                showBeautifulAlert(error.message, 'error');
            }
            console.error(error);
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification.";
        }
    } else if (currentTab === 2) {
        if (!currentPDFFile) {
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier PDF', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        if (!currentSignatureFile && !isString) {
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier de signature', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        let signatureId;
        if (isString) {
            signatureId = document.getElementById("signatureIdString").value.trim();
        } else {
            signatureId = await extractTextFromFileImage(currentSignatureFile).catch((error) => {
                console.error("Error extracting signatureId:", error);
                showBeautifulAlert('Erreur lors de l\'extraction de la signature depuis l\'image', 'error');
            });
        }
        if (!signatureId) {
            showBeautifulAlert('Erreur lors de l\'extraction de la signature depuis l\'image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            showBeautifulAlert("L'ID de signature est invalide !", 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        const fileBuffer = await readFileAsArrayBuffer(currentPDFFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        const userAddress = await signer.getAddress();
        console.log("Hash du PDF :", messageHash);
        // document.getElementById("verify").innerText = "⏳ Vérification en cours...";
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            document.getElementById("verify").innerText = isValid
                ? "✅ Signature VALIDE !"
                : "❌ Signature NON VALIDE.";
            console.log(isValid);
        }
        catch (error) {
            // Ne pas afficher d'alerte pour l'erreur de décodage
            if (!error.message.includes("could not decode result data")) {
                showBeautifulAlert(error.message, 'error');
            }
            console.error(error);
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification.";
        }
    } else if (currentTab === 3) {
        if (!currentImageFile) {
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        if (!currentSignatureFile && !isString) {
            showBeautifulAlert('Veuillez d\'abord sélectionner un fichier de signature', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        let signatureId;
        if (isString) {
            signatureId = document.getElementById("signatureIdString").value.trim();
        } else {
            signatureId = await extractTextFromFileImage(currentSignatureFile).catch((error) => {
                console.error("Error extracting signatureId:", error);
                showBeautifulAlert('Erreur lors de l\'extraction de la signature depuis l\'image', 'error');
            });
        }
        if (!signatureId) {
            showBeautifulAlert('Erreur lors de l\'extraction de la signature depuis l\'image', 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }
        // remove the [CERTIDOCS] prefix if it exists and trim
        if (signatureId.startsWith("[CERTIDOCS]")) {
            signatureId = signatureId.replace("[CERTIDOCS]", "");
        }
        signatureId = signatureId.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            showBeautifulAlert("L'ID de signature est invalide !", 'error');
            window.dispatchEvent(new CustomEvent('Error', { detail: 'Erreur lors de l\'extraction de la signature depuis l\'image' }));
            return;
        }

        const fileBuffer = await readFileAsArrayBuffer(currentImageFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        const userAddress = await signer.getAddress();
        console.log("Hash de l'image :", messageHash);
        // document.getElementById("verify").innerText = "⏳ Vérification en cours...";
        try {
            const isValid = await contract.verifySignature(
                signatureId,
                userAddress,
                messageHash
            );
            document.getElementById("verify").innerText = isValid
                ? "✅ Signature VALIDE !"
                : "❌ Signature NON VALIDE.";
            console.log(isValid);
        }
        catch (error) {
            // Ne pas afficher d'alerte pour l'erreur de décodage
            if (!error.message.includes("could not decode result data")) {
                showBeautifulAlert(error.message, 'error');
            }
            console.error(error);
            document.getElementById("verify").innerText =
                "❌ Erreur lors de la vérification.";
        }
    } else {
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
    currentSignatureFile = signatureFile;
});

window.addEventListener('pdfFileChanged', (event) => {
    // extract the PDF file from the event detail
    const pdfFile = event.detail;
    currentPDFFile = pdfFile;
    console.log("PDF file selected:", pdfFile);
});

window.addEventListener('tabChanged', (event) => {
    console.log("Tab changed to:", event.detail);
    currentTab = event.detail;
});

window.addEventListener('imageFileChanged', (event) => {
    // extract the image file from the event detail
    const imageFile = event.detail;
    currentImageFile = imageFile;
    console.log("Image file selected:", imageFile);
});

// Attache l'event click sur le bouton de vérification après chargement du DOM
document
    .getElementById("verifySignature")
    .addEventListener("click", verifySignature);