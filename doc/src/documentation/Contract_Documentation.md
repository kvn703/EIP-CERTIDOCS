# Documentation Technique - Module Smart Contract

Ce document détaille le fonctionnement, le rôle et l'intérêt de chaque fichier et fonction présents dans le dossier `Contract`.

## 1. SignatureRegistry.sol

Ce contrat intelligent (Smart Contract) est le cœur du système de certification. Il permet d'enregistrer et de vérifier des signatures numériques sur la blockchain Ethereum (ou compatible EVM). Il agit comme un registre immuable et décentralisé.

### Structure de Données : `SignatureData`
```solidity
struct SignatureData {
    address signer;
    bytes32 messageHash;
    uint256 expiration;
    address[] authorizedRecipients;
}
```
**Rôle :** Définit la structure d'une signature enregistrée.
- `signer`: L'adresse du portefeuille qui a signé le message.
- `messageHash`: L'empreinte cryptographique (hash) du message, garantissant l'intégrité sans stocker le contenu confidentiel.
- `expiration`: Timestamp après lequel la signature n'est plus valide.
- `authorizedRecipients`: Liste des adresses autorisées à vérifier cette signature (si restreint).

### Fonction : `storeSignature`
```solidity
function storeSignature(
    bytes32 _messageHash,
    uint256 _expiration,
    address[] memory _authorizedRecipients,
    bytes memory _signature,
    uint256 _timestamp
) external
```
**Intérêt & Rôle :**
Cette fonction est le point d'entrée pour **enregistrer une nouvelle signature/certification**.
1.  **Récupération du Signataire :** Elle appelle `recoverSigner` pour s'assurer que l'appelant (`msg.sender`) est bien celui qui a signé le message. C'est une sécurité critique pour éviter l'usurpation.
2.  **Génération d'ID unique :** Elle crée un identifiant unique (`signatureId`) basé sur le signataire, le hash du message et le timestamp.
3.  **Stockage :** Elle enregistre les données dans le mapping `signatures`.
4.  **Événement :** Elle émet `SignatureStored` pour notifier les applications externes (comme la WebApp) qu'une signature a été créée avec succès.

### Fonction : `verifySignature`
```solidity
function verifySignature(
    bytes32 _signatureId,
    address _recipient,
    bytes32 _messageHash
) external view returns (bool, address, address, bytes32, bytes32)
```
**Intérêt & Rôle :**
Cette fonction permet de **vérifier la validité d'une signature** sans modifier l'état de la blockchain (fonction `view`, gratuite en gaz si appelée hors transaction).
1.  **Contrôle d'accès :** Vérifie si l'adresse `_recipient` (celui qui demande la vérification) est dans la liste des destinataires autorisés (`authorizedRecipients`).
2.  **Validation d'intégrité :** Vérifie que le hash du message fourni correspond à celui enregistré.
3.  **Vérification temporelle :** Vérifie que la signature n'a pas expiré (`block.timestamp <= data.expiration`).
4.  **Retour :** Renvoie un booléen de validité ainsi que les métadonnées (signataire, hash) pour affichage côté client.

### Fonction : `recoverSigner` (Interne)
```solidity
function recoverSigner(bytes32 _messageHash, bytes memory _signature) internal pure returns (address)
```
**Intérêt & Rôle :**
Fonction utilitaire cryptographique.
- Elle décompose la signature brute (bytes) en composants `r`, `s`, `v` (paramètres de courbe elliptique ECDSA).
- Elle reconstruit le hash selon le standard "Ethereum Signed Message" (`\x19Ethereum Signed Message:\n32...`) pour assurer la compatibilité avec les portefeuilles comme MetaMask.
- Elle utilise `ecrecover` pour retrouver l'adresse publique ayant signé le hash.

---

## 2. scripts/deploy.js

Ce script est utilisé par l'outil de développement **Hardhat** pour déployer le contrat sur un réseau blockchain.

### Fonction : `main`
**Intérêt & Rôle :**
- **Initialisation :** Récupère l'usine de contrats (`getContractFactory`) pour `SignatureRegistry`.
- **Déploiement :** Envoie la transaction de création du contrat (`deploy()`).
- **Attente :** Attend que la transaction soit minée et confirmée (`waitForDeployment`).
- **Confirmation :** Affiche l'adresse finale du contrat déployé, nécessaire pour configurer le frontend et l'extension.
