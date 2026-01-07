# Documentation Technique - Module Extension Navigateur

Ce document détaille le fonctionnement et le rôle des scripts composant l'extension navigateur (Chrome/Brave/Edge).

## 1. background.js

Ce fichier agit comme le contrôleur principal de l'extension. Il s'exécute en arrière-plan et gère les événements globaux.

### Listener : `chrome.runtime.onMessage` ("openSignatureWindow")
**Intérêt & Rôle :**
- Répond à la demande d'ouverture de la fenêtre de signature (depuis le popup).
- **Positionnement de Fenêtre :** Calcule les coordonnées pour centrer la fenêtre popup qui s'ouvrira (`chrome.windows.create`), offrant une meilleure expérience utilisateur.
- **Communication Inter-Onglet :** Interroge l'onglet actif (`chrome.tabs.query`) pour demander le contenu du mail via `chrome.tabs.sendMessage` avec l'action `getDivContentGenerate`.
- **Hashage :** Si du contenu est trouvé, il calcule le hash du contenu via `ethers.utils.keccak256` avant d'ouvrir la fenêtre. Cela sécurise le processus en ne passant que le hash à l'application web.
- **Ouverture :** Ouvre l'URL de génération (`getGenerateUrl`) avec le hash en paramètre d'URL.

### Listener : `chrome.runtime.onMessage` ("openVerificationWindow")
**Intérêt & Rôle :**
- Similaire au précédent mais pour la vérification.
- Demande le contenu et l'`signatureId` via l'action `getDivContentVerify`.
- Ouvre l'URL de vérification (`getVerifyUrl`) pré-remplie avec le hash du message et l'ID de signature trouvé.

## 2. content.js

Ce script est injecté dans le contexte de la page web visitée (ex: Gmail, Outlook). Il est capable de lire le DOM.

### Listener Principal (`getDivContentGenerate`)
**Intérêt & Rôle :**
- **Détection Gmail :** Cherche les `div` spécifiques de composition de mail Gmail (`div.Am.aiL.Al.editable...`).
- **Détection Outlook :** Cherche les `div` éditables avec `role="textbox"` et des labels "Corps du message". Utilise un `MutationObserver` pour attendre le chargement dynamique d'Outlook si nécessaire.
- **Normalisation :** Appelle `normalizeMessage` pour nettoyer le texte (suppression des espaces superflus, normalisation Unicode) afin d'assurer que le hash sera identique lors de la vérification.

### Listener Secondaire (`getDivContentVerify`)
**Intérêt & Rôle :**
- **Extraction Intelligente :** Cherche le contenu du mail reçu (Gmail/Outlook) en filtrant les éléments parasites (boutons "Télécharger", "Mettre dans Drive", etc.).
- **Recherche de Signature :** Cherche une image (`<img>`) qui pourrait contenir une signature stéganographiée.
- **Stéganographie :** Appelle `extractTextFromImage` pour récupérer l'ID de signature caché dans les pixels de l'image (LSB - Least Significant Bit).
- **Retour :** Renvoie le contenu nettoyé et l'`signatureId` extrait au script de background.

### Fonction : `extractTextFromImage(imageUrl)`
**Intérêt & Rôle :**
- Charge l'image dans un `canvas` HTML5 caché.
- Lit les données brutes des pixels (`ctx.getImageData`).
- Extrait les bits de poids faible (LSB) de chaque canal de couleur pour reconstituer le texte binaire caché (l'ID de signature).
- C'est cette fonction qui permet de lier visuellement une "image de signature" à un identifiant blockchain invisible à l'œil nu.

### Fonction : `normalizeMessage(content)`
**Intérêt & Rôle :**
- Cruciale pour la certification. Un simple espace ou saut de ligne différent change le hash cryptographique.
- Cette fonction standardise le texte (remplace les multiples espaces par un seul, gère les sauts de ligne Windows/Unix) pour garantir la reproductibilité du hash.

## 3. popup.js

Script léger gérant l'interface de la petite bulle (popup) de l'extension.

### Event Listeners ("click")
**Intérêt & Rôle :**
- Connecte les boutons "Générer" et "Vérifier" de l'interface HTML aux actions du `background.js` via `chrome.runtime.sendMessage`.
- Sert de passerelle simple entre l'utilisateur et la logique complexe du background.

## 4. config.js

Fichier de configuration centralisé.

### Objet : `CONFIG`
**Intérêt & Rôle :**
- Définit les URLs de l'application web (Localhost vs Production/Dappling).
- Permet de basculer facilement entre le mode développement et production via un booléen `isDevelopment`.
- Les fonctions `getGenerateUrl` et `getVerifyUrl` construisent les liens dynamiques avec les paramètres GET (hash, signatureId).
