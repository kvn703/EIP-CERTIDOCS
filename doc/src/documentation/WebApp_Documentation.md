# Documentation Technique - Module WebApp React

Ce document détaille le fonctionnement et le rôle des composants et pages de l'application React.

## 1. App.js & Configuration

### `App.js`
**Rôle :** Point d'entrée de l'application.
- Configure les providers : `WagmiProvider` (connexion blockchain), `QueryClientProvider` (gestion état serveur), `Router` (navigation).
- Définit les routes principales : `/` (Génération) et `/verify` (Vérification).

### `config/appkit.js`
**Rôle :** Initialise le kit de connexion Reown (anciennement Web3Modal/WalletConnect).
- Configure les chaînes supportées (réseaux Ethereum).
- Crée l'objet `wagmiAdapter` utilisé par l'application pour interagir avec les wallets.

## 2. Pages Principales

### `pages/GeneratePage.js`
Page dédiée à la création de signatures certifiées.

**Gestion d'État (Hooks) :**
- `useAppKitAccount`: Gère l'état de connexion du wallet.
- `useState`: Gère les onglets (Mail/Texte/PDF/Image), le contenu à signer, et le statut de signature.

**Fonction : `handleSign`**
**Intérêt & Rôle :**
- Déclenche le processus de signature.
- Simule actuellement une signature (génération aléatoire) pour la démo, mais destinée à appeler le Smart Contract `storeSignature`.
- Déclenche l'animation de succès (`launchConfetti`).

**Fonction : `useEffect` (Récupération DOM)**
**Intérêt & Rôle :**
- Tente de lire une div cachée (`confirmationMessage`) qui aurait pu être remplie par l'extension lors de l'ouverture de la fenêtre, permettant de pré-remplir le message à signer.

### `pages/VerifyPage.js`
Page dédiée à la vérification des signatures.

**Fonction : `useEffect` (URL Params)**
**Intérêt & Rôle :**
- Au chargement, analyse l'URL (`window.location.search`) pour extraire `signatureId` et `messageHash` envoyés par l'extension.
- Pré-remplit les champs et lance potentiellement la vérification automatique.

**Fonction : `checkVerificationResult`**
**Intérêt & Rôle :**
- Observe le DOM pour détecter les résultats insérés par des composants tiers ou des mises à jour d'état différées.
- Met à jour l'état `verificationResult` (success/error) pour afficher l'animation correspondante.

**Fonction : `handleVerifyClick`**
**Intérêt & Rôle :**
- Lance le processus de vérification explicite lorsque l'utilisateur clique sur le bouton.
- Active l'état `isVerifying` qui déclenche l'affichage du composant `VerificationAnimation`.

## 3. Composants Techniques

### `component/SignatureVerificationPage.jsx` & `SignatureVerifier.jsx`
Ces composants gèrent l'interface utilisateur (UI) sophistiquée de la vérification.

**Fonctionnalité Clé :**
- Utilisation de `framer-motion` pour des animations fluides.
- **Checklist Animée :** Affiche étape par étape (Analyse, Blockchain, Validation...) pour rassurer l'utilisateur sur le sérieux du processus.
- **États Visuels :** Gère les états de chargement (spinner), succès (vert) et erreur (rouge/secousse).

### `component/VerificationAnimation.js`
**Rôle :** Affiche une animation séquentielle détaillée pendant la vérification.
- Simule les étapes techniques (Analyse signature -> Vérification blockchain -> Validation crypto) via des timeouts.
- Renforce la perception de "travail" et de sécurité de l'application.

### `component/MailSection.js`
**Rôle :** Feedback visuel lors de la récupération du mail.
- Affiche un spinner "Récupération en cours" puis un check vert "Contenu récupéré".
- Permet à l'utilisateur de savoir que l'extension a bien communiqué avec la WebApp.

### `component/PdfPage/` & `ImagePage/`
**Rôle :** Composants de Drag & Drop pour fichiers.
- `PDFSection.js` / `ImageSection.js`: Gèrent le dépôt de fichiers et l'envoi de l'événement `onChange`.
- Permettent de signer/vérifier des documents autres que du texte brut.

### `component/HeaderExpert.js`
**Rôle :** En-tête "Premium" de l'application.
- Contient le logo animé SVG.
- Définit l'identité visuelle de "Certidocs".

### `component/LoaderExpert2025.js`
**Rôle :** Écran de chargement initial ou de transition.
- Affiche des étapes textuelles ("Optimisation des données", "Génération...") pour faire patienter l'utilisateur.

## 4. Composants Utilitaires (UI Kit)

### `Tabs.js`
**Rôle :** Système de navigation par onglets (Mail / Texte / PDF / Image).
- Simple composant de présentation acceptant une liste d'objets `tabs`.

### `SignatureCard.js`
**Rôle :** Affiche la signature générée.
- Bouton de copie avec feedback visuel.
- Incitation à coller la signature dans le mail.

### `CustomTextInput` / `CustomText` / `ButtonCustom`
**Rôle :** Wrappers de composants HTML standards.
- Assurent une cohérence de style (CSS Modules) à travers toute l'application.
