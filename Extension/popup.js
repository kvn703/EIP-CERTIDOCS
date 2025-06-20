const mainButtons = document.getElementById("main-buttons");
const typeChoice = document.getElementById("type-choice");
const textBtn = document.getElementById("text");
const mailBtn = document.getElementById("mail");
const pdfBtn = document.getElementById("pdf");
let currentAction = null;

document.getElementById("generate").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openSignatureWindow" });
    setTimeout(() => {
        window.close();
    }, 100);
});

document.getElementById("verify").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openVerificationWindow" });
    setTimeout(() => {
        window.close();
    }, 100);
});

document.getElementById("text").addEventListener("click", () => {
    if (currentAction === "generate") {
        chrome.runtime.sendMessage({ action: "openSignatureWindow", type: "text" });
    } else if (currentAction === "verify") {
        chrome.runtime.sendMessage({ action: "openVerificationWindow", type: "text" });
    }
    setTimeout(() => {
        window.close();
    }, 100);
});

document.getElementById("mail").addEventListener("click", () => {
    if (currentAction === "generate") {
        chrome.runtime.sendMessage({ action: "openSignatureWindow", type: "mail" });
    } else if (currentAction === "verify") {
        chrome.runtime.sendMessage({ action: "openVerificationWindow", type: "mail" });
    }
    setTimeout(() => {
        window.close();
    }, 100);
});

document.getElementById("pdf").addEventListener("click", () => {
    if (currentAction === "generate") {
        chrome.runtime.sendMessage({ action: "openSignatureWindow", type: "pdf" });
    } else if (currentAction === "verify") {
        chrome.runtime.sendMessage({ action: "openVerificationWindow", type: "pdf" });
    }
    setTimeout(() => {
        window.close();
    }, 100);
});
