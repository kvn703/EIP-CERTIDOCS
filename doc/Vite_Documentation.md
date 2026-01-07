# Documentation Complète du Projet EIP-CERTIDOCS (Vite.js & React)

Cette documentation détaille de manière exhaustive et compréhensible l'ensemble des fonctions et composants présents dans ce projet, qui est désormais configuré pour utiliser **Vite.js** comme bundler (remplaçant Create React App pour de meilleures performances).

Le projet est divisé en trois parties principales :
1.  **WebApp (React + Vite)** : L'interface utilisateur ultra-rapide pour générer et vérifier des signatures (`webappreact`).
2.  **Extension** : Une extension de navigateur pour interagir avec les emails (`Extension`).
3.  **Contract** : Les Smart Contracts Ethereum pour la gestion des signatures (`Contract`).

---

## 1. WebApp (React + Vite) - Dossier `webappreact`

Ce dossier contient l'application React moderne propulsée par Vite.

### Fichiers de Configuration et Racine

#### Fichier : `vite.config.js`
Configuration centrale de Vite.
*   **Fonction `defineConfig({...})`**
    *   **Plugins** : Utilise `@vitejs/plugin-react` pour supporter JSX et Fast Refresh.
    *   **Server** : Configure le serveur de développement sur le port 3000 (`port: 3000`) et ouvre automatiquement le navigateur (`open: true`).
    *   **Resolve** : Définit des alias (ex: `@` pointe vers `./src`).
    *   **Build** : Configure le dossier de sortie vers `build` (pour compatibilité avec les scripts de déploiement existants).

#### Fichier : `index.html` (Racine du projet)
Point d'entrée HTML standard pour Vite.
*   **Script Module** : `<script type="module" src="/src/index.js"></script>`
    *   **Description** : Charge l'application React comme un module ES natif, ce qui permet à Vite de servir les fichiers instantanément sans bundling complet en développement.

#### Fichier : `src/index.js`
Point d'entrée de l'application React.
*   **Fonction principale** : Initialise le rendu de l'application dans l'élément DOM avec l'id `root`. Utilise `ReactDOM.createRoot` et enveloppe l'application dans `React.StrictMode`.

#### Fichier : `src/App.js`
Composant racine de l'application.
*   **Fonction `App()`**
    *   **Description** : Configure les fournisseurs de contexte globaux (`WagmiProvider`, `QueryClientProvider`) et le routage (`Router`).
    *   **Retourne** : L'arborescence des composants avec les routes définies (`/` pour la génération, `/verify` pour la vérification).

#### Fichier : `src/config/appkit.js`
Configuration pour Reown AppKit et Wagmi (connexion wallet).
*   **Objet `wagmiAdapter`** : Instance configurée pour gérer la connexion aux différents réseaux blockchain (Mainnet, Arbitrum, Sepolia, Polygon Amoy, etc.).
*   **Fonction `createAppKit({...})`** : Initialise le modal de connexion Wallet avec les options spécifiées (email activé, métadonnées, réseaux).

#### Fichier : `src/config/web3.config.js`
Configuration centralisée pour Web3.
*   **Fonction `getWeb3Config(network)`**
    *   **Paramètres** : `network` (chaîne de caractères, ex: 'mainnet').
    *   **Description** : Récupère la configuration spécifique pour un réseau donné (RPC, ID de chaîne).
    *   **Retourne** : Un objet de configuration ou la configuration mainnet par défaut.
*   **Fonction `isDapplingEnabled()`**
    *   **Description** : Vérifie si le déploiement Dappling est activé via les variables d'environnement (supporté par Vite via `import.meta.env` ou `process.env` avec compatibilité).
    *   **Retourne** : Un booléen (`true` ou `false`).

### Scripts NPM (package.json)
*   `npm start` : Lance `vite` (Serveur de développement ultra-rapide).
*   `npm run build` : Lance `vite build` (Production build optimisé).
*   `npm run preview` : Lance `vite preview` (Prévisualisation locale du build de production).

### Pages

#### Fichier : `src/pages/GeneratePage.js`
Page principale pour créer et signer des documents/messages.
*   **Composant `GeneratePage`**
    *   **État (State)** : Gère de nombreuses variables comme la connexion wallet (`isConnected`, `address`), l'onglet actif (`activeTab`), le contenu du message (`mailMessage`, `texteValue`), les fichiers (`pdfFile`, `imageFile`) et l'état de signature (`signed`, `signature`).
    *   **Fonction `handleCopy()`** : Copie l'adresse du wallet dans le presse-papier, affiche une infobulle et lance des confettis.
    *   **Fonction `handleSign()`** : Simule la création d'une signature (génère un hash aléatoire pour l'exemple) et déclenche l'animation de succès.
    *   **Fonction `launchConfetti()`** : Déclenche une animation visuelle de confettis.
    *   **Fonction `handleDisconnect()`** : Déconnecte le wallet utilisateur et vide le cache local.
    *   **Fonction `setActiveTab(index)`** : Change l'onglet actif (Mail, Texte, PDF, Image) et émet un événement personnalisé.

#### Fichier : `src/pages/VerifyPage.js`
Page pour vérifier l'authenticité d'une signature.
*   **Composant `VerifyPage`**
    *   **Description** : Permet à l'utilisateur de vérifier une signature provenant d'un mail, d'un texte, d'un PDF ou d'une image.
    *   **Logique de vérification** : Surveille les paramètres d'URL (`signatureId`, `messageHash`) pour lancer une vérification automatique.
    *   **Fonction `checkVerificationResult`** (dans `useEffect`) : Surveille le DOM (élément `#verify`) pour détecter le résultat de la vérification (succès ou erreur) et mettre à jour l'interface.
    *   **Fonction `handleVerifyClick()`** : Lance le processus de vérification visuelle (animation) si les données nécessaires sont présentes.

### Composants (src/component)

#### Fichier : `src/component/SignatureVerificationPage.jsx`
Composant d'animation de la check-list de vérification.
*   **Composant `SignatureVerificationPage`**
    *   **Props** : `checklistSteps` (étapes à afficher), `loaderTexts` (textes de chargement), `onVerify` (fonction de vérification).
    *   **Description** : Affiche une liste d'étapes qui se cochent progressivement avant de permettre l'action finale. Gère les états de chargement, succès et erreur avec des animations fluides (Framer Motion).

#### Fichier : `src/component/SignatureVerifier.jsx`
Autre variante de vérificateur de signature avec interface moderne.
*   **Composant `SignatureVerifier`**
    *   **Description** : Présente un formulaire pour saisir l'ID de signature et le message. Fournit un retour visuel (secousse en cas d'erreur, toasts de notification).

#### Fichier : `src/component/VerificationAnimation.js`
Composant affichant l'animation de progression de la vérification.
*   **Composant `VerificationAnimation`**
    *   **Props** : `isVerifying` (booléen), `result` ('success' ou 'error').
    *   **Description** : Affiche une série d'étapes (Analyse, Blockchain, Cryptographie) avec une barre de progression, puis affiche le résultat final avec une icône animée.

#### Fichier : `src/component/MailSection.js`
Section affichant l'état de récupération du contenu d'un email.
*   **Composant `MailSection`**
    *   **Description** : Simule une "récupération" du contenu avec un loader spinner, puis affiche un message de succès lorsque le contenu est prêt.

#### Fichier : `src/component/PdfPage/PDFSection.js` et `ImageSection.js`
Zones de dépôt (Drag & Drop) pour fichiers.
*   **Composant `PDFSection` / `ImageSection`**
    *   **Fonction `handleDrop(e)`** : Gère le dépôt d'un fichier, vérifie son type (PDF ou Image) et met à jour l'état.
    *   **Fonction `handleFileChange(e)`** : Gère la sélection de fichier via le navigateur de fichiers classique.
    *   **Fonction `handleRemove()`** : Supprime le fichier sélectionné et réinitialise le champ.

#### Fichier : `src/component/Tabs.js`
Gestionnaire d'onglets navigation.
*   **Composant `Tabs`**
    *   **Description** : Affiche une liste de boutons pour chaque onglet et rend le contenu de l'onglet actif.

#### Fichier : `src/component/SignatureCard.js`
Carte affichant la signature générée.
*   **Composant `SignatureCard`**
    *   **Fonction `handleCopy()`** : Copie la signature dans le presse-papier et change l'icône temporairement pour indiquer le succès.

#### Fichier : `src/component/VerifyButton.js`
Bouton d'action interactif pour la vérification.
*   **Composant `VerifyButton`**
    *   **Description** : Un bouton riche avec états (pressé, survolé, chargement, succès, erreur) et effets visuels (ripple effect).

#### Autres Composants Utilitaires
*   **`ButtonCustom`** : Wrapper simple autour de l'élément `<button>`.
*   **`Container`** : Wrapper de mise en page pour centrer le contenu.
*   **`CustomText`** : Affiche un texte avec une icône.
*   **`CustomTextInput`** : Wrapper pour `<textarea>`.
*   **`HeaderExpert`** : En-tête avec logo animé et titre.
*   **`LoaderExpert2025`** : Écran de chargement plein écran avec étapes textuelles.
*   **`LoaderSignature`** : Petit indicateur de chargement circulaire qui se transforme en coche verte.

---

## 2. Extension - Dossier `Extension`

L'extension permet d'interagir avec les pages web (Gmail, Outlook) pour extraire du contenu à signer ou vérifier.

#### Fichier : `background.js`
Le cerveau de l'extension qui tourne en arrière-plan.
*   **Écouteur `chrome.runtime.onMessage` ("openSignatureWindow")**
    *   **Action** : Ouvre une fenêtre popup centrée pour la **génération** de signature.
    *   **Détail** : Interroge l'onglet actif pour récupérer le contenu (via `getDivContentGenerate`), calcule un hash de ce contenu, et ouvre l'URL de génération avec ce hash en paramètre.
*   **Écouteur `chrome.runtime.onMessage` ("openVerificationWindow")**
    *   **Action** : Ouvre une fenêtre popup centrée pour la **vérification**.
    *   **Détail** : Récupère le contenu et l'ID de signature (via `getDivContentVerify`) et ouvre l'URL de vérification.

#### Fichier : `content.js`
Script injecté dans les pages web pour lire le DOM.
*   **Écouteur pour "getDivContentGenerate"**
    *   **Fonction** : Cherche le corps du mail en rédaction dans Gmail (`div.Am.aiL...`) ou Outlook.
    *   **Retourne** : Le texte du contenu normalisé.
*   **Écouteur pour "getDivContentVerify"**
    *   **Fonction** : Cherche le contenu d'un mail reçu. Essaie plusieurs sélecteurs pour Gmail et Outlook.
    *   **Détail** : Tente aussi d'extraire une signature cachée dans une image (stéganographie ou pixel data) via `extractTextFromImage` si une image source est trouvée.
*   **Fonction `normalizeMessage(content)`**
    *   **Description** : Nettoie le texte (remplace les sauts de ligne multiples, les espaces insécables, trim) pour assurer un hashage cohérent.
*   **Fonction `extractTextFromImage(imageUrl)`**
    *   **Description** : Charge une image sur un canvas invisible et lit les données binaires des pixels (LSB - Least Significant Bit) pour extraire un texte caché (l'ID de signature).

#### Fichier : `popup.js`
Logique de la petite fenêtre qui s'ouvre quand on clique sur l'icône de l'extension.
*   **Events** : Ajoute des écouteurs sur les boutons "Générer" et "Vérifier" pour envoyer les messages correspondants au `background.js`.

#### Fichier : `config.js`
Configuration des URLs.
*   **Objet `CONFIG`** : Définit les URLs de base pour le développement (`localhost`) et la production (`dappling.network`).
*   **Fonctions `getGenerateUrl` / `getVerifyUrl`** : Construisent les URLs complètes avec les paramètres de requête (query params) appropriés.

---

## 3. Contract - Dossier `Contract`

Partie Blockchain gérant le registre des signatures.

#### Fichier : `contracts/SignatureRegistry.sol`
Smart Contract Solidity.
*   **Structure `SignatureData`** : Stocke le signataire, le hash du message, l'expiration et les destinataires autorisés.
*   **Fonction `storeSignature(...)`**
    *   **Paramètres** : Hash du message, expiration, destinataires, signature cryptographique, timestamp.
    *   **Action** : Vérifie que celui qui envoie la transaction est bien le signataire (via `recoverSigner`). Génère un ID unique pour la signature et stocke les données sur la blockchain. Émet un événement `SignatureStored`.
*   **Fonction `verifySignature(...)`**
    *   **Paramètres** : ID de signature, adresse du destinataire (pour vérification d'autorisation), hash du message original.
    *   **Retourne** : Un booléen de validité, et les adresses/hashs pour vérification.
    *   **Logique** : Vérifie si la signature existe, si elle n'est pas expirée, si le message correspond, et si le destinataire est autorisé (si une liste est définie).
*   **Fonction `recoverSigner(...)`** (Interne)
    *   **Description** : Utilise `ecrecover` pour retrouver l'adresse Ethereum publique à partir d'un hash de message et d'une signature (v, r, s).

#### Fichier : `scripts/deploy.js`
Script de déploiement (Hardhat).
*   **Fonction `main()`** : Récupère la "factory" du contrat, déploie une instance du contrat `SignatureRegistry`, attend la confirmation du déploiement ("waitForDeployment") et affiche l'adresse du contrat déployé.
