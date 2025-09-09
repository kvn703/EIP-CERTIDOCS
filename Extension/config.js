// Configuration pour les environnements de développement et de production
const CONFIG = {
    // Basculer manuellement entre dev (true) et prod (false)
    isDevelopment: false,

    // URLs de développement
    dev: {
        baseUrl: "http://localhost:3002",
        generateUrl: "http://localhost:3002/",
        verifyUrl: "http://localhost:3002/verify"
    },

    // URLs de production
    prod: {
        baseUrl: "https://certidocsweb-xnvzbr.dappling.network",
        generateUrl: "https://certidocsweb-xnvzbr.dappling.network/",
        verifyUrl: "https://certidocsweb-xnvzbr.dappling.network/verify"
    }
};

function getActiveConfig() {
    return CONFIG.isDevelopment ? CONFIG.dev : CONFIG.prod;
}

function getGenerateUrl(messageHash) {
    const cfg = getActiveConfig();
    if (messageHash) {
        return `${cfg.generateUrl}?messageHash=${messageHash}`;
    }
    return cfg.generateUrl;
}

function getVerifyUrl(messageHash, signatureId) {
    const cfg = getActiveConfig();
    let url = cfg.verifyUrl;
    const params = [];
    if (messageHash) params.push(`messageHash=${messageHash}`);
    if (signatureId) params.push(`signatureId=${signatureId}`);
    if (params.length > 0) url += `?${params.join("&")}`;
    return url;
}


