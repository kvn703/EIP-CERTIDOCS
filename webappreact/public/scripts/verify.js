// Si signer n'est pas déjà défini, on le déclare
if (typeof signer === "undefined") {
    var signer = null;
}
// Si contract n'est pas déjà défini, on le déclare
if (typeof contract === "undefined") {
    var contract = null;
}
if (typeof contractAddress === "undefined") {
    var contractAddress = "0x7b63B543Ee68aa8C9faaAB12Ba73827F6973378f";
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

async function connectMetaMask() {
    if (typeof window.ethereum === "undefined") {
        alert("❌ MetaMask non détecté !");
        return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);

    // Vérifie si MetaMask est déjà connecté
    const accounts = await provider.send("eth_accounts", []);
    if (accounts.length > 0) {
        signer = await provider.getSigner();
        const address = await signer.getAddress();
        updateUI(address); // Met à jour l'interface avec l'adresse
    } else {
        alert("🔴 Aucun compte connecté à MetaMask !");
    }

    contract = new ethers.Contract(contractAddress, abi, signer);
    document.getElementById("signMessage").disabled = true;
}

function updateUI(address) {
    let addressShort = address.substring(0, 6) + "..." + address.substring(address.length - 4);
    const accountElement = document.getElementById("account");
    accountElement.innerHTML = `
        <div style="display: flex; align-items: center; font-size: 0.9em;">
        </div>
    `;

    const addressSpan = createAddressSpan(address, addressShort);
    accountElement.querySelector("div").appendChild(addressSpan);

    const copyButton = createCopyButton(address);
    accountElement.querySelector("div").appendChild(copyButton);
}

function createAddressSpan(address, addressShort) {
    const addressSpan = document.createElement("span");
    addressSpan.innerText = "🟢 Connecté : " + addressShort;
    addressSpan.title = address;
    addressSpan.classList.add("address-span");
    addressSpan.style.width = "310px";

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
    copyButton.style.fontWeight = "bold";
    copyButton.style.display = "flex";
    copyButton.style.alignItems = "center";
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

async function verifySignature() {
    try {
        const signatureId = document.getElementById("signatureId").value.trim();
        if (!/^0x[a-fA-F0-9]{64}$/.test(signatureId)) {
            alert("❌ L'ID de signature est invalide !");
            return;
        }

        const message = document.getElementById("messageInput").value.trim();
        if (!message || message.length < 3) {
            alert("❌ Le message est vide ou trop court !");
            return;
        }

        if (!signer || !contract) {
            alert("❌ MetaMask ou contrat non initialisé !");
            return;
        }

        const userAddress = await signer.getAddress();
        messageHash = message;

        document.getElementById("verify").innerText = "⏳ Vérification en cours...";
        const isValid = await contract.verifySignature(
            signatureId,
            userAddress,
            messageHash
        );

        document.getElementById("verify").innerText = isValid
            ? "✅ Signature VALIDE !"
            : "❌ Signature NON VALIDE.";
    } catch (error) {
        console.error(error);
        alert("❌ Une erreur est survenue pendant la vérification.");
        document.getElementById("verify").innerText = "❌ Erreur lors de la vérification.";
    }
}

async function checkMetaMaskConnection() {
    try {
        if (typeof window.ethereum === "undefined") {
            document.getElementById("account").innerText = "❌ MetaMask non détecté !";
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);

        if (accounts.length > 0) {
            signer = await provider.getSigner();
            const address = await signer.getAddress();
            contract = new ethers.Contract(contractAddress, abi, signer);
            updateUI(address);
        } else {
            document.getElementById("account").innerText = "🔴 MetaMask non connecté !";
        }
    } catch (err) {
        alert("❌ Erreur lors de la détection de MetaMask.");
        console.error(err);
    }
}

window.addEventListener("load", checkMetaMaskConnection);
document
    .getElementById("verifySignature")
    .addEventListener("click", verifySignature);
document.addEventListener("DOMContentLoaded", connectMetaMask);