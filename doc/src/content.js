export const contractDoc = `
# Documentation Technique - Module Smart Contract

## 1. SignatureRegistry.sol

Ce contrat intelligent (Smart Contract) est le cœur du système de certification. Il permet d'enregistrer et de vérifier des signatures numériques sur la blockchain Ethereum (ou compatible EVM).

### Structure de Données : \`SignatureData\`
**Rôle :** Définit la structure d'une signature enregistrée.
- \`signer\`: L'adresse du portefeuille qui a signé le message.
- \`messageHash\`: L'empreinte cryptographique (hash) du message.
- \`expiration\`: Timestamp après lequel la signature n'est plus valide.
- \`authorizedRecipients\`: Liste des adresses autorisées à vérifier cette signature.

### Fonctions Publiques
- **\`storeSignature\`**
  - **Identité** : Valide le signataire via \`recoverSigner\`.
  - **Stockage** : Crée un ID unique (hash) et enregistre les données.
  - **Event** : Émet \`SignatureStored\`.
  - **Args** : \`_messageHash\`, \`_expiration\`, \`_authorizedRecipients\`, \`_signature\`, \`_timestamp\`.

- **\`verifySignature\`**
  - **Lecture** : Fonction \`view\` gratuite.
  - **Vérifications** : Destinataire autorisé ? Hash valide ? Signature non expirée ?
  - **Retour** : \`bool isValid\`, \`address signer\`, et métadonnées.

### Fonctions Internes
- **\`recoverSigner\`**
  - **Crypto** : Utilise \`ecrecover\` pour retrouver l'adresse publique depuis la signature ECDSA (r, s, v).
  - **Compatibilité** : Ajoute le préfixe EIP-191 "Ethereum Signed Message".

## 2. scripts/deploy.js
- **\`main\`** : Script d'orchestration Hardhat. Déploie le contrat et affiche son adresse finale pour la configuration.
`;

export const extensionDoc = `
# Documentation Technique - Extension Navigateur

## 1. background.js
Orchestrateur (Service Worker).
- **\`chrome.runtime.onMessage("openSignatureWindow")\`** : Calcule le centrage de fenêtre, hash le contenu, et ouvre la popup de génération.
- **\`chrome.runtime.onMessage("openVerificationWindow")\`** : Ouvre la popup de vérification avec l'ID signature pré-rempli.

## 2. content.js
Script injecté (Content Script).
- **\`getDivContentGenerate\`** : Expose le contenu du mail au background script.
- **\`tryGetOutlookContent\`** : Logique spécifique pour extraire le texte des divs dynamiques d'Outlook.
- **\`normalizeMessage\`** : Nettoyage crucial (trim, sauts de ligne) pour garantir l'idempotence des hashs.
- **\`getDivContentVerify\`** : Analyse le DOM pour trouver une preuve de signature.
- **\`extractTextFromImage\`** : **Stéganographie**. Lit les pixels d'une image (Canvas API) pour extraire un ID caché dans les bits de poids faible (LSB).

## 3. popup.js
- **Listeners UI** : Connecte les boutons HTML aux actions du background script via \`sendMessage\`.

## 4. config.js
- **\`getActiveConfig\`** : Bascule entre les URLs localhost et production (Dappling).
- **\`getGenerateUrl\`** / **\`getVerifyUrl\`** : Constructeurs d'URL avec paramètres Query Strings.
`;

export const webappDoc = `
# Documentation Technique - WebApp React

## 1. Connexion Wallet (AppKit / Reown)

L'intégration repose sur deux piliers : la configuration (via \`createAppKit\`) et l'utilisation (via les Hooks).

### Configuration : \`config/appkit.js\`

#### \`WagmiAdapter\`
**Rôle :** Pont entre l'application React et la couche blockchain bas niveau (Wagmi/Viem).
\`\`\`javascript
const wagmiAdapter = new WagmiAdapter({
    networks,       // Liste des chaines (Polygon, Mainnet...)
    projectId,      // ID de projet Reown Cloud
    ssr: true       // Support du Server-Side Rendering
});
\`\`\`

#### \`createAppKit\`
**Rôle :** Initialise le singleton de la modale de connexion.
- **\`adapters\`** : Fournit l'instance de WagmiAdapter créée juste avant.
- **\`enableEmail\`** : \`true\` active la connexion "Email Wallet" (custodial).
- **\`features.connectMethodsOrder\`** : Définit la priorité d'affichage (\`['wallet', 'email']\`).
- **\`metadata\`** : Définit le nom et l'icône de l'app qui apparaitront dans le wallet de l'utilisateur lors de la demande de connexion.

### Utilisation : \`Hooks React\`

#### \`useAppKitAccount()\`
**Rôle :** Hook principal pour lire l'état du compte courant.
**Retourne :**
- \`isConnected\` *(bool)* : Vrai si une session est active.
- \`address\` *(string)* : L'adresse publique (0x...) de l'utilisateur.
- \`status\` *(string)* : État détaillé ('connected', 'disconnected', 'connecting').

#### \`modal.open()\`
**Rôle :** Déclencheur UI.
- Appelle cette fonction (souvent sur un \`onClick\`) pour ouvrir la modale de connexion native de Reown.
- Gère automatiquement le flux (QR Code, Deep Link mobile, ou connexion extension navigateur).

#### \`useDisconnect()\`
**Rôle :** Fonctions de déconnexion.
- Retourne une méthode \`disconnect()\` qui nettoie le stockage local et ferme la session WalletConnect.

## 2. Composants Principaux & Hooks
### Pages
#### \`GeneratePage.js\`
- **\`handleSign\`** : Simule la transaction blockchain et l'animation de succès.
- **\`handleCopy\`** : Presse-papier et feedback visuel.
- **\`launchConfetti\`** : Animation de célébration.
- **\`isProbablyHash\`** : Validation basique des chaînes hexadécimales.

#### \`VerifyPage.js\`
- **\`checkVerificationResult\`** : Polling pour détecter la validation visuelle.
- **\`handleVerifyClick\`** : Lance l'animation de vérification.

### Composants UI
- **\`SignatureVerificationPage\` / \`SignatureVerifier\`** :
  - **\`shortAddress\`** : Formattage d'adresse (0x12...34).
  - **\`checklistSteps\`** : Définition des étapes visuelles de vérification.
- **\`VerificationAnimation\`** :
  - Orchestre les étapes (Analyse -> Blockchain -> Crypto -> Résultat).
- **\`MailSection\`** :
  - Affiche l'état de récupération du mail (Spinner -> Check).
- **\`PDFSection\` / \`ImageSection\`** :
  - **\`handleDrop\`** : Gestion native du Drag & Drop HTML5.
- **\`HeaderExpert\`** : En-tête avec SVG animé.
- **\`LoaderExpert2025\`** : Écran de chargement avec étapes textuelles progressives.

## 3. Utilitaires
- **\`Tabs\`** : Navigation par onglets.
- **\`SignatureCard\`** : Affichage et copie de la signature finale.
- **\`getWeb3Config\`** : Configuration dynamique des RPC.
`;
