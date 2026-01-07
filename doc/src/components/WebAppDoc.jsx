import React from 'react';

const WebAppDoc = () => {
    return (
        <div>
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Interface Utilisateur WebApp</h2>
                <span style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>React + Vite</span>
            </div>
            <p>
                L'application Web (`webappreact`) est le cœur de l'interaction utilisateur. Elle permet la génération de preuves de signature et leur vérification
                via l'interaction avec le Smart Contract et les wallets Web3.
            </p>

            <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>1. Pages Principales</h3>

            {/* GeneratePage */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>src/pages/GeneratePage.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Le composant <code>GeneratePage</code> gère l'interface de création de signature. Il orchestre la connexion wallet, la sélection du type de contenu (Mail, Texte, PDF, Image) et l'appel à la signature.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <h5 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Fonctions & Logique :</h5>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>handleSign()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Déclenche le processus de signature.<br />
                                <strong>Logique :</strong> Réinitialise `signed` et `signature`. Simule actuellement une signature hashée (ex: `0x...`) et déclenche l'animation de confettis.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>handleCopy()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Copie l'adresse du wallet utilisateur.<br />
                                <strong>Logique :</strong> Utilise `navigator.clipboard.writeText`, met à jour le statut visuel (`setCopyStatus`) et lance des confettis. Gère le timeout pour remettre le statut à zéro.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>handleDisconnect()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Déconnecte l'utilisateur.<br />
                                <strong>Logique :</strong> Appelle `disconnect()` de Wagmi, vide le `localStorage`, et émet l'événement `walletDisconnected` pour nettoyer l'interface globale.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>setActiveTab(index)</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Change l'onglet actif (Mail, Texte, PDF, Image).<br />
                                <strong>Logique :</strong> Met à jour le state `activeTab`, gère une réinitialisation de `IsString` si on revient à l'onglet Mail, et émet un événement `tabChanged` pour synchronisation externe.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>setPdfFile(file) / setImageFile(file)</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Gère la sélection de fichiers.<br />
                                <strong>Logique :</strong> Met à jour le state local et émet un événement DOM personnalisé (`pdfFileSelected` / `imageFileSelected`).
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>launchConfetti()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Effect visuel de célébration.<br />
                                <strong>Logique :</strong> Utilise la librairie `canvas-confetti` avec des paramètres personnalisés (couleurs, nombre de particules).
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>useEffect [Initial Load]</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Détecte un message pré-rempli.<br />
                                <strong>Logique :</strong> Vérifie si l'élément DOM `confirmationMessage` est visible et contient du texte pour activer automatiquement l'onglet Mail.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* VerifyPage */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>src/pages/VerifyPage.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Le composant <code>VerifyPage</code> permet de valider l'authenticité d'une signature. Il supporte la récupération automatique de preuves via URL ou la saisie manuelle.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <h5 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Fonctions & Logique :</h5>
                    <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>handleVerifyClick()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Démarre la vérification UI.<br />
                                <strong>Logique :</strong> Vérifie la présence de `signatureId` et `message`. Active l'état `isVerifying` qui déclenche l'animation de vérification (`VerificationAnimation`). Masque `showContentRecovered`.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>useEffect [URL Parameters]</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Hydratation depuis l'URL.<br />
                                <strong>Logique :</strong> Parse `window.location.search` pour extraire `signatureId` et `messageHash`. Si trouvés, pré-remplit les states et active l'onglet Mail. Sinon, bascule sur l'onglet Texte.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>checkVerificationResult()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Détecte le résultat (Succès/Échec).<br />
                                <strong>Logique :</strong> Scanne l'élément DOM invisible `#verify` toutes les 500ms. Si le texte contient "VALIDE" ou "NON VALIDE", met à jour `verificationResult`. C'est une méthode de pont entre le JS vanilla potentiellement injecté et React.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>handleReloadMailContent()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Force le rechargement pour récupérer le mail.<br />
                                <strong>Logique :</strong> Affiche un overlay de chargement et appelle `document.location.reload()` pour relancer l'extraction de contenu par l'extension.
                            </div>
                        </li>
                        <li style={{ marginBottom: '0.8rem' }}>
                            <code style={{ color: '#60a5fa' }}>handleVerificationComplete()</code>
                            <div style={{ paddingLeft: '1rem', marginTop: '0.2rem' }}>
                                <strong>Rôle :</strong> Callback de fin d'animation.<br />
                                <strong>Logique :</strong> Réinitialise `isVerifying` et `verificationResult` sans réafficher le message de récupération initial.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>2. Composants UI (src/component)</h3>

            {/* SignatureVerificationPage.jsx */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>SignatureVerificationPage.jsx</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Animation complexe étape par étape de la vérification.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>useEffect [Animation]</code> : Gère le timing d'apparition des coches (steps) et la progression de la barre.</li>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>handleVerify()</code> : Simule un délai asynchrone pour l'UX, puis appelle la prop `onVerify` si fournie.</li>
                </ul>
            </div>

            {/* SignatureVerifier.jsx */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>SignatureVerifier.jsx</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Formulaire moderne avec validation visuelle et animations Framer Motion.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>handleVerify()</code> : Valide que l'ID commence par '0x' et que le message n'est pas vide. Gère les états visuels `loading`, `success`, `error`.</li>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>useEffect [Shake]</code> : Gère l'animation de secousse en cas d'erreur.</li>
                </ul>
            </div>

            {/* VerificationAnimation.js */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>VerificationAnimation.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Affiche une séquence d'étapes (Analyse, Blockchain, Crypto, Résultat) avec des icônes colorées.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>useEffect [Timer]</code> : Incrémente l'étape `step` toutes les 800ms tant que `isVerifying` est vrai.</li>
                </ul>
            </div>

            {/* MailSection.js */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>MailSection.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Simulateur de récupération de mail.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>useEffect</code> : Si un message est propsé et que l'utilisateur est connecté, lance un timer de 2s (`isLoading`) avant d'afficher le succès (`isDone`).</li>
                </ul>
            </div>

            {/* PdfPage (PDFSection & ImageSection) */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>src/component/PdfPage/</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Contient les composants de gestion de fichiers (PDF et Images).
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.8rem' }}>
                        <strong>PDFSection.js & ImageSection.js</strong><br />
                        Composants de Drag & Drop.<br />
                        <code style={{ color: '#60a5fa' }}>handleDrop(e)</code> : Intercepte l'événement drop, vérifie le type MIME et propage le fichier.<br />
                        <code style={{ color: '#60a5fa' }}>handleFileChange(e)</code> : Gestion de l'input file standard.
                    </li>
                </ul>
            </div>

            {/* HeaderExpert */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>HeaderExpert.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    En-tête de l'application avec animations SVG et titre.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}>Contient une animation SVG complexe (bouclier avec lueur radiale) et le titre "CERTIDOCS".</li>
                </ul>
            </div>

            {/* SignatureCard */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>SignatureCard.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Affiche la signature générée et permet sa copie.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><code style={{ color: '#60a5fa' }}>handleCopy()</code> : Utilise `navigator.clipboard.writeText` pour copier la signature et gère l'état visuel de confirmation (icône check).</li>
                </ul>
            </div>

            {/* VerifyButton */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>VerifyButton.js</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Bouton interactif multi-états pour la vérification.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}>
                        Gère les états : <strong>Disabled</strong>, <strong>Verifying</strong> (spinner), <strong>Success</strong> (vert), <strong>Error</strong> (rouge).<br />
                        Intègre des effets visuels de survol (glow) et de click (ripple).
                    </li>
                </ul>
            </div>

            {/* Loaders */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>Loaders</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Composants de feedback visuel de chargement.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.4rem' }}><strong>LoaderExpert2025.js</strong> : Loader moderne pour les chargements globaux.</li>
                    <li style={{ marginBottom: '0.4rem' }}><strong>LoaderSignature.js</strong> : Loader spécifique pour les actions de signature.</li>
                </ul>
            </div>

            <h3 style={{ fontSize: '1.3rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>3. Configuration (src/config)</h3>

            {/* Config Files */}
            <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', color: '#a78bfa' }}>src/config/*</h4>
                <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.8rem' }}>
                        <strong>appkit.js</strong><br />
                        <code style={{ color: '#60a5fa' }}>createAppKit(&#123;...&#125;)</code> : Initialise le SDK Reown pour la connexion wallet.<br />
                        <code style={{ color: '#60a5fa' }}>wagmiAdapter</code> : Configure le client Wagmi multi-chaînes (Mainnet, Polygon, Arbitrum, etc.).
                    </li>
                    <li style={{ marginBottom: '0.8rem' }}>
                        <strong>web3.config.js</strong><br />
                        <code style={{ color: '#60a5fa' }}>getWeb3Config(network)</code> : Retourne la configuration RPC/Explorer pour un réseau donné.<br />
                        <code style={{ color: '#60a5fa' }}>web3Config</code> : Objet contenant les constantes (ChainID, RPC URLs) pour Mainnet, Testnet, WalletConnect.
                    </li>
                </ul>
            </div>

        </div>
    );
};

export default WebAppDoc;
