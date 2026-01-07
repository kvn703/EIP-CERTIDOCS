import React from 'react';

const ExtensionDoc = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Extension Navigateur</h2>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>Chrome / Edge</span>
            </div>
            <p>
                L'extension agit comme un pont entre le client de messagerie (Gmail, Outlook) et l'application Web. Elle injecte des scripts pour extraire le contenu des emails et ouvre des popups sécurisées pour la signature.
            </p>

            <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>1. Scripts Principaux</h3>

            {/* background.js */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>background.js (Service Worker)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Script d'arrière-plan permanent qui gère l'orchestration des fenêtres.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>chrome.runtime.onMessage("openSignatureWindow")</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Action :</strong> Ouvre la popup de génération.<br />
                                <strong>Logique :</strong>
                                1. Calcule la position centrale pour la popup.<br />
                                2. Envoie un message `getDivContentGenerate` à l'onglet actif pour récupérer le contenu.<br />
                                3. Hash le contenu reçu via `ethers.utils.keccak256`.<br />
                                4. Ouvre une nouvelle fenêtre (`chrome.windows.create`) pointant vers `getGenerateUrl(hash)`.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>chrome.runtime.onMessage("openVerificationWindow")</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Action :</strong> Ouvre la popup de vérification.<br />
                                <strong>Logique :</strong>
                                1. Envoie `getDivContentVerify` à l'onglet actif.<br />
                                2. Reçoit le contenu et potentiellement un `signatureId` extrait d'une image.<br />
                                3. Hash le contenu récupéré.<br />
                                4. Ouvre la fenêtre de vérification avec `signatureId` et `messageHash` en paramètres d'URL.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* content.js */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>content.js (Content Script)</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Script injecté dans la page Web (Gmail, Outlook) pour lire le DOM.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>listener("getDivContentGenerate")</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Extrait le brouillon en cours de rédaction.<br />
                                <strong>Logique :</strong> Cherche les sélecteurs spécifiques Gmail (`div.Am.aiL...`) et Outlook (`role="textbox"`). Appelle `normalizeMessage` avant de renvoyer le texte. Utilise `MutationObserver` si le DOM Outlook n'est pas encore prêt.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>listener("getDivContentVerify")</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Extrait le mail reçu pour vérification.<br />
                                <strong>Logique :</strong>
                                1. Cherche le contenu dans `div.ii.gt` (Gmail) ou `div[class^="rps_"]` (Outlook).<br />
                                2. Tente de détecter une image contenant une signature cachée (Stéganographie) via `extractTextFromImage`.<br />
                                3. Nettoie le texte des mentions inutiles (ex: "Analyse antivirus...").
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>normalizeMessage(content)</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Standardise le texte pour le hachage.<br />
                                <strong>Logique :</strong> Remplace les retours chariot CRLF par LF, fusionne les espaces multiples, supprime les espaces insécables et trim le tout.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>extractTextFromImage(imageUrl)</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Analyse stéganographique.<br />
                                <strong>Logique :</strong> Charge l'image dans un `canvas` invisible. Lit les données pixels (`ctx.getImageData`). Extrait le LSB (Least Significant Bit) de chaque canal pour reconstruire une chaîne binaire, puis ASCII, correspondant à l'ID de signature caché.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* popup.js */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>popup.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Script UI de la petite fenêtre d'extension.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}>Attache simplement des écouteurs `click` sur les boutons `#generate` et `#verify` pour envoyer des messages au `background.js`.</li>
                </ul>
            </div>

            {/* config.js */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>config.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Gestion des environnements.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>getActiveConfig()</code> : Retourne la conf `dev` ou `prod` selon un flag boolean.</li>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>getGenerateUrl / getVerifyUrl</code> : Helpers pour construire les URLs cibles avec Query Params.</li>
                </ul>
            </div>

        </div>
    );
};

export default ExtensionDoc;
