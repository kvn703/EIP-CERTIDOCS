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
        "function storeSignature(bytes32, uint256, address[], bytes, uint256) external",
    ];
}

// Configuration de l'URL de base selon l'environnement
const baseUrl = (() => {
    // Détection de l'environnement basée sur l'URL actuelle
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Environnement de développement
        return 'http://localhost:3000';
    } else {
        // Environnement de production
        return 'https://certidocsweb-xnvzbr.dappling.network';
    }
})();

let currentTab = 0; // 0 = mail, 1 = Texte, 2 = PDF, 3 = Image
let currentPDFFile = null;
let currentImageFile = null;

window.addEventListener('walletConnected', async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    const address = await signer.getAddress();
    contract = new ethers.Contract(contractAddress, abi, signer);

    updateUI(address);
    document.getElementById("signMessage").disabled = false;
});

window.addEventListener('walletDisconnected', () => {
    signer = null;
    contract = null;
    updateUI(null);
    document.getElementById("signMessage").disabled = true;
});

async function hideTextInImageReturnBlob(imageUrl, text) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Évite les problèmes de CORS
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
            // Convertir le texte en binaire
            const binaryText = text.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join('') + '00000000'; // Ajouter un marqueur de fin
            // Cacher les données dans les pixels
            for (let i = 0; i < binaryText.length; i++) {
                if (i * 4 < data.length) {
                    data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryText[i], 2);
                } else {
                    break;
                }
            }
            ctx.putImageData(imageData, 0, 0);
            // Copier l'image modifiée dans un blob
            canvas.toBlob(blob => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject("Erreur lors de la création du blob");
                }
            }, "image/png");
        };
        img.onerror = () => reject("Erreur de chargement de l'image");
    });
}

async function hideTextInImage(imageUrl, text) {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Évite les problèmes de CORS
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

            // Convertir le texte en binaire
            const binaryText = text.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join('') + '00000000'; // Ajouter un marqueur de fin

            // Cacher les données dans les pixels
            for (let i = 0; i < binaryText.length; i++) {
                if (i * 4 < data.length) {
                    data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binaryText[i], 2);
                } else {
                    break;
                }
            }
            ctx.putImageData(imageData, 0, 0);

            // Copier l'image modifiée dans le presse-papiers
            canvas.toBlob(blob => {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]).then(() => resolve("Image copiée dans le presse-papiers"))
                    .catch(reject);
            }, "image/png");
        };

        img.onerror = () => reject("Erreur de chargement de l'image");
    });
}

// retrieve the variable inside url wich is formatted like https://certidocsweb-xnvzbr.dappling.network/?messageHash=0x1234567890
if (typeof urlParams === "undefined") {
    var urlParams = new URLSearchParams(window.location.search);
}
if (typeof messageHash === "undefined") {
    var messageHash = urlParams.get("messageHash");
}

if (messageHash) {
    document.getElementById("messageInput").value = messageHash;
    document.getElementById("messageInput").style.display = "none";
    document.getElementById("confirmationMessage").style.display = "block";
} else {
    document.getElementById("confirmationMessage").style.display = "none";
}

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
        // alert("🎉 Adresse copiée !");
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
    const accountContainer = document.getElementById("account");
    if (!accountContainer) return;

    accountContainer.innerHTML = "";

    if (address) {
        let addressShort = address.substring(0, 6) + "..." + address.substring(address.length - 4);
        const addressSpan = createAddressSpan(address, addressShort);
        const copyButton = createCopyButton(address);
        accountContainer.appendChild(addressSpan);
        accountContainer.appendChild(copyButton);

        // Affiche le bouton "signer"
        const signBtn = document.getElementById("signMessage");
        if (signBtn) signBtn.disabled = false;

    } else {
        // Si déconnecté → on vide simplement l'UI (pas de bouton "connecter MetaMask")
        const signBtn = document.getElementById("signMessage");
        if (signBtn) signBtn.disabled = true;
    }
}

function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}


async function signMessage() {
    let messageHash;
    let message;
    let signature;
    let authorizedRecipients = [];
    let isString = false;
    isString = document.getElementById("signatureCheckbox").checked;
    if (currentTab === 0 || currentTab === 1) {
        message = document.getElementById("messageInput").value.trim();
        if (message === "") {
            alert("❌ Le message ne peut pas être vide !");
            return;
        }

        const recipientsInput = document
            .getElementById("recipientsInput")
            .value.trim();
        if (recipientsInput === "") {
            alert("❌ Veuillez entrer au moins une adresse de destinataire !");
            return;
        }

        authorizedRecipients = recipientsInput
            .split(",")
            .map((addr) => addr.trim().toLowerCase());

        if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
            alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
            return;
        }
        if (!ethers.isBytesLike(message)) {
            // hash message using keccak256
            const hash = ethers.keccak256(ethers.toUtf8Bytes(message));
            messageHash = hash;
        } else {
            // if message is already a bytes-like value, use it directly
            messageHash = message;
        }

        signature = await signer.signMessage(ethers.getBytes(messageHash));
    } else if (currentTab === 2) {
        if (!currentPDFFile) {
            alert("❌ Veuillez sélectionner un fichier PDF avant de signer !");
            return;
        }
        const recipientsInput = document
            .getElementById("recipientsInput")
            .value.trim();
        if (recipientsInput === "") {
            alert("❌ Veuillez entrer au moins une adresse de destinataire !");
            return;
        }
        authorizedRecipients = recipientsInput
            .split(",")
            .map((addr) => addr.trim().toLowerCase());
        if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
            alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
            return;
        }
        // Hash du fichier PDF
        const fileBuffer = await readFileAsArrayBuffer(currentPDFFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        signature = await signer.signMessage(ethers.getBytes(messageHash));
    } else if (currentTab === 3) {
        if (!currentImageFile) {
            alert("❌ Veuillez sélectionner un fichier image avant de signer !");
            return;
        }
        const recipientsInput = document
            .getElementById("recipientsInput")
            .value.trim();
        if (recipientsInput === "") {
            alert("❌ Veuillez entrer au moins une adresse de destinataire !");
            return;
        }
        authorizedRecipients = recipientsInput
            .split(",")
            .map((addr) => addr.trim().toLowerCase());
        if (!authorizedRecipients.every((addr) => /^0x[a-fA-F0-9]{40}$/.test(addr))) {
            alert("❌ Une ou plusieurs adresses de destinataires sont invalides !");
            return;
        }
        // Hash du fichier image
        const fileBuffer = await readFileAsArrayBuffer(currentImageFile);
        messageHash = ethers.keccak256(new Uint8Array(fileBuffer));
        signature = await signer.signMessage(ethers.getBytes(messageHash));
    } else {
        return;
    }
    if (!messageHash || !signature) {
        return;
    }

    // const expirationSelect = document.getElementById("expirationSelect");
    // const expiration = Math.floor(Date.now() / 1000) + parseInt(expirationSelect.value);
    const expiration = Math.floor(Date.now() / 1000) + 31536000

    // Ancienne interface supprimée - on utilise maintenant ResultModal
    const statusEl = document.getElementById("status");
    if (statusEl) {
        statusEl.style.display = "none";
    }

    requestAnimationFrame(async () => {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const tx = await contract.storeSignature(
                messageHash,
                expiration,
                authorizedRecipients,
                signature,
                timestamp
            );
            const receipt = await tx.wait();
            let signatureId = null;

            for (const log of receipt.logs) {
                if (log.topics.length > 1) {
                    signatureId = log.topics[1];
                    break;
                }
            }

            if (!signatureId) {
                return;
            }

            let signatureIdString = "";
            for (let i = 0; i < 6; i++) {
                signatureIdString += signatureId[i];
            }
            signatureIdString += "...";
            for (let i = signatureId.length - 4; i < signatureId.length; i++) {
                signatureIdString += signatureId[i];
            }

            // Ancienne interface supprimée - on utilise maintenant ResultModal
            // La signature est gérée par React via l'événement signatureGenerated
            const status = document.getElementById("status");
            if (status) {
                status.style.display = "none";
                status.innerHTML = "";
            }
            
            // Déclencher l'événement pour React (ResultModal)
            window.dispatchEvent(new CustomEvent('signatureGenerated', {
                detail: { signatureId, signatureIdString }
            }));
        } catch (error) {
            const statusEl = document.getElementById("status");
            if (statusEl) {
                statusEl.style.display = "none";
            }
            // L'erreur sera gérée par React si nécessaire
        }
    });
}

window.addEventListener('pdfFileSelected', (event) => {
    // extract the PDF file from the event detail
    const pdfFile = event.detail;
    currentPDFFile = pdfFile;
});

window.addEventListener('tabChanged', (event) => {
    const tabIDX = event.detail;
    currentTab = tabIDX;
});

window.addEventListener('imageFileSelected', (event) => {
    const imageFile = event.detail;
    currentImageFile = imageFile;
});

// Fonction pour attacher l'event listener de manière robuste
function attachSignMessageListener() {
    const signBtn = document.getElementById("signMessage");
    if (signBtn) {
        // Retirer l'ancien listener s'il existe pour éviter les doublons
        signBtn.removeEventListener("click", signMessage);
        signBtn.addEventListener("click", signMessage);
        return true;
    }
    return false;
}

// Écouter l'événement émis par React quand le bouton est prêt
window.addEventListener('signMessageButtonReady', (event) => {
    attachSignMessageListener();
});

// Essayer d'attacher immédiatement (au cas où le bouton existe déjà)
if (!attachSignMessageListener()) {
    // Si le bouton n'existe pas encore, utiliser MutationObserver
    const observer = new MutationObserver((mutations, obs) => {
        if (attachSignMessageListener()) {
            obs.disconnect(); // Arrêter d'observer une fois attaché
        }
    });
    
    // Observer les changements dans le body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Timeout de sécurité (au cas où)
    setTimeout(() => {
        observer.disconnect();
        attachSignMessageListener();
    }, 5000);
}

// Réattacher quand le wallet se connecte (au cas où le bouton est recréé)
window.addEventListener('walletConnected', () => {
    setTimeout(attachSignMessageListener, 100);
});

// Exposer la fonction signMessage globalement pour pouvoir l'appeler depuis React
window.signMessage = signMessage;

// Exposer la fonction hideTextInImageReturnBlob globalement pour le téléchargement
window.hideTextInImageReturnBlob = hideTextInImageReturnBlob;

// document.addEventListener("DOMContentLoaded", connectMetaMask);