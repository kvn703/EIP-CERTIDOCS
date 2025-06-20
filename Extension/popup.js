const mainButtons = document.getElementById("main-buttons");
const typeChoice = document.getElementById("type-choice");
const mailBtn = document.getElementById("mail");
const pdfBtn = document.getElementById("pdf");
let currentAction = null;

document.getElementById("generate").addEventListener("click", () => {
    currentAction = "generate";
    mainButtons.style.display = "none";
    typeChoice.style.display = "flex";
    mailBtn.textContent = "Signature d'un mail";
    pdfBtn.textContent = "Signature d'un PDF";
});

document.getElementById("verify").addEventListener("click", () => {
    currentAction = "verify";
    mainButtons.style.display = "none";
    typeChoice.style.display = "flex";
    mailBtn.textContent = "Vérification d'un mail";
    pdfBtn.textContent = "Vérification d'un PDF";
});

document.getElementById("mail").addEventListener("click", () => {
    if (currentAction === "generate") {
        chrome.runtime.sendMessage({ action: "openSignatureWindow", type: "mail" });
    } else if (currentAction === "verify") {
        chrome.runtime.sendMessage({ action: "openVerificationWindow", type: "mail" });
    }
    window.close();
});

document.getElementById("pdf").addEventListener("click", () => {
    if (currentAction === "generate") {
        chrome.runtime.sendMessage({ action: "openSignatureWindow", type: "pdf" });
    } else if (currentAction === "verify") {
        chrome.runtime.sendMessage({ action: "openVerificationWindow", type: "pdf" });
    }
    window.close();
});
