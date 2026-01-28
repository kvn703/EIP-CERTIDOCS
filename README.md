# CertiDocs - Authentification de Documents par Blockchain

## 📖 Qu'est-ce que CertiDocs ?

**CertiDocs** est une solution innovante qui permet de garantir l'authenticité et l'intégrité de vos documents numériques en utilisant la technologie blockchain. Imaginez un système de "sceau électronique" infalsifiable qui prouve qu'un document n'a pas été modifié et qu'il provient bien de la personne qui prétend l'avoir créé.

### Le problème que nous résolvons

Dans notre monde numérique, il est facile de modifier un document sans laisser de trace. Comment pouvez-vous être sûr qu'un email important n'a pas été altéré ? Comment prouver qu'un contrat PDF est authentique ? CertiDocs répond à ces questions en créant une preuve cryptographique immuable liée à chaque document.

---

## 🎯 Comment ça fonctionne ? (Explication simple)

### Concept de base : L'empreinte digitale numérique

Imaginez que chaque document a une "empreinte digitale" unique, comme vos empreintes digitales physiques. Si vous modifiez ne serait-ce qu'une lettre dans le document, son empreinte change complètement. CertiDocs :

1. **Calcule cette empreinte** pour votre document
2. **Crée une signature cryptographique** liée à votre identité (via votre portefeuille crypto)
3. **Enregistre cette preuve sur la blockchain** (un registre public et infalsifiable)
4. **Permet à n'importe qui de vérifier** que le document correspond bien à la preuve enregistrée

### Analogie avec le monde réel

C'est comme si vous :
- **Signiez un document** avec un stylo spécial qui crée une encre indélébile
- **Déposiez une copie** dans un coffre-fort public transparent (la blockchain)
- **Permettiez à quiconque** de comparer le document avec la copie dans le coffre-fort pour vérifier son authenticité

---

## 🏗️ Les composants du système

CertiDocs est composé de **4 éléments principaux** qui travaillent ensemble :

### 1. 📧 Extension Chrome (Pour Gmail et Outlook)

**Ce que c'est :** Une petite application qui s'intègre dans votre navigateur Chrome et apparaît comme une icône dans la barre d'outils.

**Ce qu'elle fait :**
- **Détection automatique du contenu** : Analyse intelligemment les pages Gmail et Outlook pour extraire le texte de vos emails sans que vous ayez à le copier manuellement
- **Génération de preuves** : Permet de créer une empreinte blockchain directement depuis votre boîte mail en un clic
- **Vérification rapide** : Facilite la vérification des emails reçus en détectant automatiquement leur contenu
- **Interface bilingue** : Disponible en français et en anglais avec un simple bouton de basculement
- **Compatibilité multi-plateforme** : Fonctionne avec Gmail (web) et Outlook (web)

**Fonctionnalités détaillées :**

#### Installation de l'extension
1. Téléchargez le package de l'extension depuis la section releases
2. Ouvrez Chrome et naviguez vers `chrome://extensions/`
3. Activez le "Mode développeur" en haut à droite
4. Cliquez sur "Charger l'extension non empaquetée"
5. Sélectionnez le dossier contenant l'extension
6. L'icône CertiDocs apparaît dans votre barre d'outils

#### Utilisation de l'extension
1. **Pour générer une preuve** :
   - Ouvrez Gmail ou Outlook et composez votre email
   - Cliquez sur l'icône CertiDocs dans la barre d'outils
   - Sélectionnez l'onglet "Créer une empreinte"
   - Cliquez sur "Générer l'empreinte"
   - L'extension ouvre automatiquement l'application web avec le contenu pré-rempli

2. **Pour vérifier une preuve** :
   - Ouvrez l'email que vous voulez vérifier dans Gmail ou Outlook
   - Cliquez sur l'icône CertiDocs
   - Sélectionnez l'onglet "Vérifier une empreinte"
   - Cliquez sur "Vérifier l'empreinte"
   - L'extension ouvre l'application web avec le contenu détecté automatiquement

**Pourquoi c'est utile :** Vous n'avez pas besoin de copier-coller le contenu manuellement. L'extension fait tout automatiquement ! Elle détecte intelligemment le texte de votre email, normalise les espaces et caractères spéciaux, et pré-remplit l'application web pour vous faire gagner du temps.

### 2. 🌐 Application Web (Interface principale)

**Ce que c'est :** Un site web moderne et intuitif accessible depuis n'importe quel navigateur, conçu avec React pour une expérience utilisateur fluide.

**Ce qu'elle fait :**
- **Génération de preuves** : Permet de créer des empreintes blockchain pour différents types de documents (emails, PDFs, images, texte)
- **Vérification d'authenticité** : Vérifie l'intégrité et l'authenticité de documents reçus avec des résultats visuels clairs
- **Gestion de portefeuille** : Intègre WalletConnect pour connecter facilement votre portefeuille crypto
- **Affichage des résultats** : Présente les résultats de vérification de manière claire avec des animations et des indicateurs visuels
- **Annuaire d'adresses** : Intègre un carnet d'adresses personnel pour gérer vos contacts fréquents
- **Interface multilingue** : Disponible en français et en anglais
- **Thème sombre/clair** : Support du mode sombre pour le confort visuel

**Fonctionnalités détaillées :**

#### Page de génération
- **Onglets multiples** : Interface par onglets pour choisir le type de document (Email, PDF, Image, Texte)
- **Upload de fichiers** : Glisser-déposer ou sélection de fichiers pour PDFs et images
- **Gestion des destinataires** : Saisie d'adresses Ethereum avec validation automatique et support de l'annuaire
- **Format de signature** : Choix entre signature textuelle (string) ou image (PNG)
- **Timeline de progression** : Indicateur visuel des étapes (Contenu → Destinataires → Empreinte)
- **Résultat visuel** : Affichage de la preuve générée avec options de copie

#### Page de vérification
- **Saisie de la preuve** : Champ pour coller l'ID de signature (signatureId)
- **Détection automatique** : Pour les emails, détection automatique du contenu depuis l'extension
- **Upload de fichiers** : Pour PDFs et images, upload du fichier à vérifier
- **Animation de vérification** : Indicateur visuel pendant le processus de vérification
- **Résultats détaillés** : Affichage complet avec :
  - Statut de vérification (✅ Valide / ❌ Invalide)
  - Adresse du signataire
  - Hash du document
  - Timestamp de création
  - Option d'ajout à l'annuaire

#### Interface utilisateur
- **En-tête moderne** : Navigation entre génération et vérification, connexion wallet, accès à l'annuaire
- **Design responsive** : Interface adaptée aux écrans desktop et mobile
- **Animations fluides** : Transitions et animations pour une expérience agréable
- **Feedback visuel** : Confirmations visuelles pour toutes les actions (copie, ajout, suppression)

**Pourquoi c'est utile :** C'est votre "tableau de bord" centralisé pour toutes les opérations d'authentification. Vous pouvez tout faire depuis une seule interface : générer des preuves, vérifier des documents, gérer vos contacts, et suivre vos transactions blockchain.

### 3. ⛓️ Smart Contract (Sur la blockchain Ethereum)

**Ce que c'est :** Un programme informatique stocké sur la blockchain Ethereum qui fonctionne comme un "notaire numérique" décentralisé. Il s'agit d'un contrat intelligent (smart contract) nommé `SignatureRegistry`.

**Ce qu'il fait :**
- **Stockage permanent** : Enregistre de manière permanente et infalsifiable les preuves d'authenticité sur la blockchain
- **Vérification cryptographique** : Vérifie que les signatures correspondent bien aux documents en comparant les hash
- **Contrôle d'accès** : Gère une liste de destinataires autorisés pour chaque preuve, limitant qui peut vérifier quels documents
- **Unicité garantie** : Garantit que chaque preuve est unique grâce à un identifiant unique (signatureId) généré lors de l'enregistrement
- **Expiration** : Supporte une date d'expiration pour chaque preuve (par défaut 1 an)
- **Traçabilité** : Enregistre le timestamp de création pour chaque preuve

**Fonctionnalités techniques détaillées :**

#### Fonction principale : `storeSignature`
Cette fonction enregistre une nouvelle preuve sur la blockchain avec les paramètres suivants :
- **messageHash** : L'empreinte cryptographique du document (hash Keccak256)
- **expiration** : Timestamp Unix d'expiration de la preuve
- **authorizedRecipients** : Liste des adresses Ethereum autorisées à vérifier cette preuve
- **signature** : La signature cryptographique créée par le portefeuille du signataire
- **timestamp** : Le moment de création de la preuve

#### Fonction de vérification : `verifySignature`
Cette fonction vérifie si une preuve est valide en :
- Vérifiant que la preuve existe dans le registre
- Comparant le hash fourni avec celui stocké
- Vérifiant que l'appelant est dans la liste des destinataires autorisés
- Vérifiant que la preuve n'a pas expiré
- Vérifiant que la signature correspond bien à l'adresse du signataire

#### Événements émis
Le contrat émet des événements pour chaque action importante :
- **SignatureStored** : Émis lorsqu'une nouvelle preuve est enregistrée (contient le signatureId unique)
- Ces événements permettent de suivre toutes les transactions sur la blockchain

**Pourquoi c'est utile :** La blockchain est décentralisée et publique, ce qui signifie qu'aucune organisation ne peut modifier ou supprimer vos preuves. C'est comme un registre public inviolable. Le smart contract garantit que les règles sont appliquées automatiquement et de manière transparente, sans besoin d'intermédiaire de confiance.

### 4. 💼 Portefeuille Crypto (Wallet)

**Ce que c'est :** Votre identité numérique sur la blockchain. Un portefeuille crypto est une application qui stocke vos clés cryptographiques privées et vous permet d'interagir avec la blockchain Ethereum.

**Ce qu'il fait :**
- **Identification unique** : Vous identifie de manière unique sur la blockchain via votre adresse Ethereum (0x...)
- **Signature cryptographique** : Signe cryptographiquement vos documents en utilisant votre clé privée (jamais exposée)
- **Gestion des transactions** : Permet de payer les frais de transaction (gas fees) nécessaires pour enregistrer les preuves sur la blockchain
- **Connexion sécurisée** : Utilise WalletConnect pour une connexion sécurisée sans exposer vos clés privées

**Fonctionnalités détaillées :**

#### Types de portefeuilles supportés
CertiDocs utilise **WalletConnect** pour supporter une large gamme de portefeuilles :
- **Portefeuilles mobiles** : MetaMask Mobile, Rainbow, Trust Wallet, Coinbase Wallet, etc.
- **Portefeuilles desktop** : MetaMask Extension, Rainbow Extension, etc.
- **Portefeuilles matériels** : Ledger, Trezor (via MetaMask)
- **Portefeuilles web** : Tous les portefeuilles compatibles WalletConnect

#### Processus de connexion
1. **Démarrage** : Cliquez sur "Connecter le portefeuille" dans l'application web
2. **QR Code** : Un QR code s'affiche pour les portefeuilles mobiles
3. **Scan** : Scannez le QR code avec votre application de portefeuille mobile
4. **Approbation** : Approuvez la connexion dans votre portefeuille
5. **Confirmation** : Votre adresse s'affiche dans l'application, vous êtes connecté !

#### Processus de signature
1. **Demande de signature** : Lorsque vous générez une preuve, votre portefeuille vous demande d'approuver la signature
2. **Revue** : Vous pouvez voir les détails de la transaction (hash du document, destinataires, frais)
3. **Approbation** : Vous approuvez la transaction dans votre portefeuille
4. **Exécution** : La transaction est envoyée sur la blockchain et la preuve est enregistrée

#### Sécurité
- **Clés privées** : Vos clés privées ne quittent jamais votre portefeuille
- **WalletConnect** : Utilise un protocole sécurisé pour la communication entre l'application et votre portefeuille
- **Pas de stockage** : CertiDocs ne stocke jamais vos clés privées ou mots de passe
- **Déconnexion** : Vous pouvez vous déconnecter à tout moment depuis l'interface

**Pourquoi c'est utile :** C'est votre "carte d'identité numérique" qui prouve que c'est bien vous qui avez créé la preuve. Sans votre portefeuille et votre clé privée, personne ne peut créer de preuve en votre nom. C'est la garantie ultime de l'authenticité de vos signatures.

---

## 📇 L'Annuaire d'Adresses

### Qu'est-ce que l'annuaire ?

L'**annuaire d'adresses** est votre carnet d'adresses personnel intégré à CertiDocs. Il vous permet de stocker des adresses Ethereum avec des labels personnalisés (comme "Client Dupont", "Service compta", "Partenaire XYZ") directement dans votre navigateur.

**Avantage principal :** Plus besoin de retenir ou de copier-coller les longues chaînes d'adresses Ethereum (0x...). Vous pouvez simplement utiliser des labels mémorables !

### Comment fonctionne l'annuaire ?

L'annuaire est stocké localement dans votre navigateur (localStorage), ce qui signifie :
- ✅ **Vos données restent privées** : Elles ne quittent jamais votre navigateur
- ✅ **Rapide et accessible** : Disponible instantanément sans connexion réseau
- ✅ **Personnel** : Chaque utilisateur a son propre annuaire
- ⚠️ **Spécifique au navigateur** : Si vous changez de navigateur ou supprimez les données, l'annuaire sera perdu (pensez à exporter vos adresses importantes)

### Fonctionnalités de l'annuaire

#### 1. **Ajouter des adresses manuellement**
- Ouvrez l'annuaire depuis l'en-tête de l'application
- Cliquez sur "Ajouter une adresse"
- Entrez l'adresse Ethereum (0x...) et un label descriptif
- L'adresse est automatiquement normalisée et vérifiée

#### 2. **Ajouter depuis une vérification**
- Après avoir vérifié une signature, si l'adresse du signataire correspond à celle que vous avez vérifiée
- Un bouton "Ajouter à l'annuaire" apparaît automatiquement
- L'adresse est pré-remplie, il vous suffit d'ajouter un label

#### 3. **Rechercher dans l'annuaire**
- Utilisez la barre de recherche pour trouver une adresse par :
  - Son label (ex: "Client Dupont")
  - Son adresse (ex: "0x123...")
- La recherche est instantanée et fonctionne en temps réel

#### 4. **Copier des adresses**
- Cliquez sur l'icône de copie à côté de n'importe quelle adresse
- L'adresse complète est copiée dans votre presse-papiers
- Un feedback visuel confirme la copie

#### 5. **Supprimer des entrées**
- Cliquez sur l'icône de suppression pour retirer une adresse de l'annuaire
- Une confirmation est demandée avant suppression

### Quand utiliser l'annuaire ?

#### 📍 **Moment 1 : Après une vérification réussie**

**Scénario :** Vous venez de vérifier une signature et l'adresse du signataire correspond à votre vérification.

**Action :** 
- Le système vous propose automatiquement d'ajouter cette adresse à l'annuaire
- Cliquez sur "Ajouter à l'annuaire"
- Donnez un label mémorable (ex: "Fournisseur ABC", "Client important")
- L'adresse est sauvegardée pour une utilisation future

**Avantage :** La prochaine fois que vous verrez cette adresse, vous saurez immédiatement qui c'est grâce au label.

#### 📍 **Moment 2 : Lors de la génération de preuves**

**Scénario :** Vous générez une preuve et devez spécifier des destinataires autorisés.

**Action :**
- Ouvrez l'annuaire depuis l'en-tête
- Recherchez ou sélectionnez les adresses des destinataires depuis votre annuaire
- Copiez les adresses pour les utiliser comme destinataires autorisés

**Avantage :** Plus besoin de chercher ou de retaper les adresses longues. Vous pouvez rapidement sélectionner vos contacts fréquents.

#### 📍 **Moment 3 : Vérification rapide d'identité**

**Scénario :** Vous recevez un document signé et voulez vérifier rapidement qui l'a signé.

**Action :**
- Ouvrez l'annuaire depuis l'en-tête
- Collez l'adresse du signataire dans la barre de recherche
- Si l'adresse est dans votre annuaire, vous verrez immédiatement le label associé

**Avantage :** Vous savez instantanément si vous avez déjà interagi avec cette adresse et qui elle représente.

#### 📍 **Moment 4 : Gestion de vos contacts fréquents**

**Scénario :** Vous travaillez régulièrement avec les mêmes personnes/organisations.

**Action :**
- Ajoutez toutes vos adresses fréquentes dans l'annuaire avec des labels clairs
- Organisez-les par catégorie dans les labels (ex: "Client - Nom", "Partenaire - Nom")

**Avantage :** Vous créez votre propre base de données de contacts de confiance pour CertiDocs.

### Comment accéder à l'annuaire ?

1. **Depuis l'en-tête de l'application** :
   - Cliquez sur l'icône de carnet d'adresses (📇) dans le coin supérieur droit
   - L'annuaire s'ouvre dans une fenêtre modale

2. **Depuis la page de vérification** :
   - Après avoir vérifié une signature, utilisez le bouton "Ouvrir l'annuaire" dans la section "CHECK USED WALLET"
   - Vous pouvez également ajouter directement l'adresse vérifiée si elle correspond

### Bonnes pratiques pour l'annuaire

✅ **Utilisez des labels descriptifs** : "Client Dupont" plutôt que "Client1"  
✅ **Organisez par catégorie** : "Client - Nom", "Partenaire - Nom", "Service - Nom"  
✅ **Vérifiez avant d'ajouter** : Assurez-vous que l'adresse est correcte avant de l'ajouter  
✅ **Mettez à jour régulièrement** : Supprimez les adresses que vous n'utilisez plus  
✅ **Ajoutez après vérification** : C'est le meilleur moment pour s'assurer que l'adresse est valide

### Limitations et notes importantes

⚠️ **Stockage local uniquement** : L'annuaire est stocké dans votre navigateur. Si vous supprimez les données du navigateur, l'annuaire sera perdu.

⚠️ **Spécifique au navigateur** : L'annuaire n'est pas synchronisé entre différents navigateurs ou appareils.

⚠️ **Pas de synchronisation cloud** : Pour l'instant, l'annuaire n'est pas sauvegardé dans le cloud. Pensez à noter vos adresses importantes ailleurs si nécessaire.

💡 **Astuce** : Pour sauvegarder vos adresses importantes, vous pouvez les exporter manuellement en les copiant depuis l'annuaire.

---

## 🔄 Le processus complet en 2 étapes

### Étape 1 : Génération d'une preuve d'authenticité

**Scénario :** Vous voulez prouver qu'un email important est authentique.

#### Processus détaillé :

1. **Préparation du document** :
   - **Pour un email** : Composez votre email dans Gmail ou Outlook
   - **Pour un PDF** : Préparez votre fichier PDF
   - **Pour une image** : Préparez votre fichier image
   - **Pour du texte** : Rédigez votre texte dans l'interface

2. **Ouverture de l'extension ou de l'application** :
   - **Via l'extension** : Cliquez sur l'icône CertiDocs dans Chrome, sélectionnez "Créer une empreinte"
   - **Via l'application web** : Ouvrez l'application web et naviguez vers la page de génération

3. **Sélection du type de document** :
   - Choisissez l'onglet correspondant (Email, PDF, Image, ou Texte)
   - L'extension détecte automatiquement le contenu pour les emails
   - Pour les fichiers, uploadez-les via glisser-déposer ou sélection

4. **Ajout des destinataires autorisés** :
   - Saisissez les adresses Ethereum des personnes autorisées à vérifier cette preuve
   - Séparez plusieurs adresses par des virgules
   - 💡 **Astuce** : Utilisez l'annuaire pour sélectionner rapidement vos contacts fréquents
   - Le système valide automatiquement le format des adresses

5. **Choix du format de signature** (optionnel) :
   - Sélectionnez si vous voulez recevoir la preuve en format texte ou image (PNG)
   - Par défaut, le format est image

6. **Vérification des informations** :
   - Revoyez le contenu à signer
   - Vérifiez les destinataires autorisés
   - Assurez-vous que tout est correct

7. **Génération de l'empreinte** :
   - Cliquez sur "Générer l'empreinte" ou "Signer"
   - Le système calcule le hash cryptographique (Keccak256) du document
   - Une timeline visuelle montre la progression

8. **Approbation dans votre portefeuille** :
   - Votre portefeuille s'ouvre automatiquement (ou vous recevez une notification)
   - Revoyez les détails de la transaction :
     - Hash du document
     - Liste des destinataires autorisés
     - Frais de transaction (gas fees)
   - Approuvez la transaction dans votre portefeuille

9. **Signature cryptographique** :
   - Votre portefeuille signe cryptographiquement le hash avec votre clé privée
   - La signature est créée sans exposer votre clé privée

10. **Enregistrement sur la blockchain** :
    - La transaction est envoyée sur la blockchain Ethereum
    - Le smart contract enregistre la preuve avec :
      - Le hash du document
      - Votre signature
      - La liste des destinataires autorisés
      - Le timestamp de création
      - La date d'expiration (par défaut 1 an)
    - Un identifiant unique (signatureId) est généré

11. **Réception de la preuve** :
    - Vous recevez la preuve sous forme d'identifiant unique (signatureId)
    - Si vous avez choisi le format image, une image PNG est générée
    - La preuve s'affiche dans une modal avec options de copie
    - Vous pouvez partager cette preuve avec vos destinataires

**Résultat :** Vous avez maintenant une preuve cryptographique que votre document est authentique et n'a pas été modifié. Cette preuve est stockée de manière permanente sur la blockchain et peut être vérifiée par les destinataires autorisés.

### Étape 2 : Vérification d'une preuve

**Scénario :** Vous recevez un email avec une preuve CertiDocs et voulez vérifier son authenticité.

#### Processus détaillé :

1. **Réception du document** :
   - Vous recevez le document (email, PDF, image, texte) avec sa preuve d'authenticité
   - La preuve est généralement un identifiant unique (signatureId) qui ressemble à "0x1234...5678"
   - Pour les images avec stéganographie, la preuve peut être intégrée dans l'image elle-même

2. **Ouverture de l'outil de vérification** :
   - **Via l'extension** : Ouvrez l'email dans Gmail/Outlook, cliquez sur l'icône CertiDocs, sélectionnez "Vérifier une empreinte"
   - **Via l'application web** : Ouvrez l'application web et naviguez vers la page de vérification

3. **Sélection du type de document** :
   - Choisissez l'onglet correspondant au type de document reçu
   - L'extension détecte automatiquement le contenu pour les emails
   - Pour les fichiers, uploadez le fichier reçu

4. **Saisie de la preuve** :
   - Collez l'identifiant de signature (signatureId) fourni par l'expéditeur
   - Le champ accepte les identifiants complets ou partiels
   - Pour les images avec stéganographie, la preuve peut être extraite automatiquement

5. **Lancement de la vérification** :
   - Cliquez sur "Vérifier" ou "Vérifier l'empreinte"
   - Une animation de chargement s'affiche pendant le processus
   - Une timeline visuelle montre les étapes de vérification

6. **Calcul de l'empreinte du document reçu** :
   - Le système calcule le hash cryptographique (Keccak256) du document que vous avez reçu
   - Pour les emails : hash du contenu + expéditeur
   - Pour les PDFs/Images : hash du fichier binaire complet
   - Pour le texte : hash du texte UTF-8

7. **Interrogation de la blockchain** :
   - Le système interroge le smart contract sur la blockchain Ethereum
   - Il récupère les informations de la preuve enregistrée :
     - Le hash original du document
     - L'adresse du signataire
     - La liste des destinataires autorisés
     - Le timestamp de création
     - Le statut d'expiration

8. **Vérifications effectuées** :
   - ✅ **Correspondance du hash** : Le hash du document reçu correspond-il au hash enregistré ?
   - ✅ **Destinataire autorisé** : Votre adresse est-elle dans la liste des destinataires autorisés ?
   - ✅ **Preuve non expirée** : La preuve n'a-t-elle pas dépassé sa date d'expiration ?
   - ✅ **Signature valide** : La signature cryptographique correspond-elle bien à l'adresse du signataire ?

9. **Résultat de la vérification** :
   - **✅ Valide** : Toutes les vérifications passent
     - Le document est authentique et n'a pas été modifié
     - L'identité du signataire est confirmée
     - Un message de succès s'affiche avec les détails
   - **❌ Invalide** : Une ou plusieurs vérifications échouent
     - Le document a été modifié OU
     - La preuve ne correspond pas OU
     - Vous n'êtes pas autorisé à vérifier OU
     - La preuve a expiré
     - Un message d'erreur détaillé s'affiche

10. **Affichage des détails** :
    - Une modal s'ouvre avec les informations complètes :
      - Statut de vérification (Valide/Invalide)
      - Adresse du signataire (avec option de copie)
      - Hash du document
      - Timestamp de création
      - Date d'expiration
    - Section "CHECK USED WALLET" pour vérifier l'adresse du signataire

11. **Option d'ajout à l'annuaire** :
    - Si la vérification est valide et que l'adresse correspond
    - Un bouton "Ajouter à l'annuaire" apparaît
    - 💡 **Astuce** : Cliquez pour sauvegarder l'adresse du signataire avec un label personnalisé
    - Cela facilite les vérifications futures avec cette personne

**Résultat :** Vous savez avec certitude si le document est authentique ou non. Si valide, vous avez la garantie que :
- Le document n'a pas été modifié depuis sa signature
- L'identité du signataire est vérifiée
- La preuve est valide et non expirée
- Vous pouvez faire confiance au document

Vous pouvez également sauvegarder l'identité du signataire dans votre annuaire pour une utilisation future.

---

## 🛡️ Les protections de sécurité

CertiDocs protège contre plusieurs types d'attaques courantes :

### Protection contre la modification

**Le problème :** Quelqu'un modifie votre document après que vous l'ayez signé.

**La solution :** Si le document est modifié, son empreinte change. Lors de la vérification, le système détecte que l'empreinte ne correspond plus et signale que le document a été altéré.

**Exemple concret :** Si vous signez un contrat qui dit "1000€" et que quelqu'un le modifie en "10000€", la vérification échouera car l'empreinte sera différente.

### Protection contre l'usurpation d'identité

**Le problème :** Quelqu'un prétend avoir créé un document à votre place.

**La solution :** Chaque preuve est liée à l'adresse crypto de son créateur. Il est impossible de créer une preuve au nom de quelqu'un d'autre sans posséder sa clé privée (comme son mot de passe secret).

**Exemple concret :** Si quelqu'un essaie de signer un document en prétendant être vous, le système vérifiera l'identité réelle et révélera que ce n'est pas vous.

### Protection contre la réutilisation de preuve

**Le problème :** Quelqu'un réutilise une preuve valide sur un document différent.

**La solution :** Chaque preuve est unique et liée à un document spécifique. Une preuve valide pour un document ne fonctionnera pas pour un autre document.

**Exemple concret :** Si vous créez une preuve pour un contrat A, cette preuve ne fonctionnera pas pour un contrat B, même si quelqu'un essaie de la réutiliser.

### Contrôle des destinataires autorisés

**Le problème :** Vous voulez limiter qui peut vérifier vos documents.

**La solution :** Lors de la génération d'une preuve, vous spécifiez une liste de destinataires autorisés. Seuls ces destinataires pourront vérifier la preuve.

**Exemple concret :** Vous créez une preuve pour un document confidentiel et autorisez uniquement votre avocat et votre comptable. Si quelqu'un d'autre essaie de vérifier, cela échouera.

---

## 📄 Types de documents supportés

CertiDocs fonctionne avec plusieurs types de documents :

### 📧 Emails (Gmail et Outlook)

**Fonctionnalité spéciale :** Détection automatique du contenu avec extraction intelligente

**Comment ça fonctionne :**
- **Détection automatique** : L'extension analyse la page Gmail ou Outlook pour trouver automatiquement le contenu de votre email
- **Extraction de l'expéditeur** : Récupère automatiquement votre adresse email depuis votre session pour l'inclure dans la preuve
- **Normalisation du texte** : Nettoie automatiquement le texte (supprime les espaces multiples, normalise les sauts de ligne)
- **Pas de copier-coller** : Vous n'avez pas besoin de copier-coller manuellement le contenu

**Processus technique :**
1. L'extension identifie les éléments DOM spécifiques à Gmail ou Outlook
2. Extrait le texte brut de l'email en cours de composition ou de lecture
3. Normalise le texte (supprime les caractères invisibles, uniformise les espaces)
4. Récupère l'adresse email de l'expéditeur depuis les métadonnées de la page
5. Combine l'expéditeur et le contenu pour créer un hash unique

**Avantages :**
- ✅ Gain de temps : Pas besoin de copier-coller
- ✅ Précision : Évite les erreurs de copie manuelle
- ✅ Sécurité : L'expéditeur est inclus dans la preuve pour éviter les confusions
- ✅ Traçabilité : On sait toujours qui a envoyé l'email

**Cas d'usage :** Contrats par email, confirmations importantes, communications officielles, offres d'emploi, accords commerciaux

### 📄 Documents PDF

**Fonctionnalité spéciale :** Hash du fichier complet avec validation stricte

**Comment ça fonctionne :**
- **Upload du fichier** : Vous uploadez votre fichier PDF via glisser-déposer ou sélection de fichier
- **Calcul du hash** : Le système calcule un hash cryptographique (Keccak256) de l'intégralité du fichier binaire
- **Sensibilité totale** : Même une modification d'un seul octet change complètement le hash
- **Stockage de la preuve** : La preuve (signatureId) peut être partagée séparément ou jointe au PDF

**Processus technique :**
1. Le fichier PDF est lu comme un ArrayBuffer (données binaires brutes)
2. Un hash Keccak256 est calculé sur l'intégralité des octets du fichier
3. Ce hash est signé cryptographiquement par votre portefeuille
4. La signature est enregistrée sur la blockchain avec le hash
5. Vous recevez un identifiant unique (signatureId) qui sert de preuve

**Avantages :**
- ✅ Intégrité garantie : Toute modification est détectée immédiatement
- ✅ Format standard : Fonctionne avec tous les PDFs, peu importe leur contenu
- ✅ Preuve séparée : La preuve peut être partagée indépendamment du document
- ✅ Vérification rapide : Upload du PDF + signatureId = vérification instantanée

**Limitations :**
- ⚠️ Taille des fichiers : Les très gros fichiers peuvent prendre plus de temps à traiter
- ⚠️ Métadonnées incluses : Les modifications de métadonnées (auteur, date de modification) invalident aussi la preuve

**Cas d'usage :** Contrats légaux, factures, certificats, documents officiels, rapports importants, devis commerciaux

### 🖼️ Images

**Fonctionnalité spéciale :** Stéganographie (preuve cachée dans l'image) avec hash cryptographique

**Comment ça fonctionne :**
- **Upload de l'image** : Vous uploadez votre image (JPG, PNG, etc.) via glisser-déposer ou sélection
- **Calcul du hash** : Le système calcule un hash cryptographique de l'intégralité du fichier image
- **Stéganographie optionnelle** : La preuve peut être cachée directement dans les pixels de l'image en modifiant les bits les moins significatifs
- **Extraction automatique** : Lors de la vérification, la preuve peut être extraite automatiquement depuis l'image si elle y a été cachée

**Processus technique :**
1. Le fichier image est lu comme un ArrayBuffer (données binaires brutes)
2. Un hash Keccak256 est calculé sur l'intégralité des octets du fichier
3. Ce hash est signé cryptographiquement par votre portefeuille
4. **Option stéganographie** : Les bits les moins significatifs des pixels peuvent être modifiés pour cacher la preuve
5. L'image modifiée reste visuellement identique (les changements sont imperceptibles à l'œil nu)
6. La signature est enregistrée sur la blockchain avec le hash

**Avantages :**
- ✅ Preuve intégrée : La preuve peut être directement dans l'image
- ✅ Partage simplifié : Un seul fichier à partager (l'image avec la preuve)
- ✅ Visuellement identique : L'image reste identique à l'original
- ✅ Détection de modification : Toute altération de l'image invalide la preuve

**Limitations :**
- ⚠️ Compression : La compression JPEG peut altérer les données cachées
- ⚠️ Formats supportés : Fonctionne mieux avec PNG (sans perte) qu'avec JPEG (avec perte)
- ⚠️ Taille des images : Les très grandes images peuvent prendre plus de temps à traiter

**Cas d'usage :** Photos de documents, captures d'écran importantes, images de contrats, photos de certificats, preuves visuelles

### 📝 Texte brut

**Fonctionnalité spéciale :** Format libre avec choix du format de sortie

**Comment ça fonctionne :**
- **Saisie libre** : Vous pouvez saisir ou coller n'importe quel texte dans un champ dédié
- **Hash du texte** : Le système calcule un hash Keccak256 du texte en UTF-8
- **Choix du format** : Vous pouvez choisir de recevoir la preuve sous forme de texte (string) ou d'image (PNG)
- **Validation** : Le texte ne peut pas être vide et doit contenir au moins un caractère

**Processus technique :**
1. Le texte saisi est converti en UTF-8 (encodage standard)
2. Un hash Keccak256 est calculé sur les octets UTF-8 du texte
3. Ce hash est signé cryptographiquement par votre portefeuille
4. La signature est enregistrée sur la blockchain avec le hash
5. Vous recevez la preuve dans le format choisi :
   - **Format texte** : Un identifiant textuel (signatureId) que vous pouvez copier
   - **Format image** : Une image PNG contenant la preuve visuellement

**Avantages :**
- ✅ Flexibilité totale : Aucune restriction sur le contenu du texte
- ✅ Format de sortie : Choix entre texte ou image selon vos besoins
- ✅ Rapidité : Traitement instantané pour les textes courts
- ✅ Simplicité : Pas besoin de fichier, juste du texte

**Limitations :**
- ⚠️ Taille du texte : Les très longs textes peuvent prendre plus de temps à traiter
- ⚠️ Espaces et formatage : Les espaces multiples sont normalisés, le formatage peut être perdu

**Cas d'usage :** Déclarations courtes, messages importants, références professionnelles, accords verbaux, engagements écrits

---

## 💡 Cas d'usage concrets

### Cas d'usage 1 : Contrat d'emploi par email

**Situation :** Vous recevez une offre d'emploi par email et voulez vous assurer qu'elle n'a pas été modifiée.

**Avec CertiDocs :**
1. L'employeur génère une preuve pour l'email contenant l'offre
2. Il vous envoie l'email avec la preuve
3. Vous vérifiez l'authenticité avec CertiDocs
4. ✅ Vous savez que l'offre est authentique et n'a pas été modifiée
5. 💡 **Bonus** : Vous ajoutez l'adresse de l'employeur dans votre annuaire avec le label "Employeur - [Nom de l'entreprise]"

**Avantage :** Vous pouvez faire confiance à l'offre sans risquer qu'elle soit modifiée après envoi, et vous gardez une trace de l'identité de l'employeur.

### Cas d'usage 2 : Facture PDF

**Situation :** Vous envoyez une facture PDF importante et voulez prouver son authenticité.

**Avec CertiDocs :**
1. Vous uploadez votre facture PDF dans CertiDocs
2. Vous générez une preuve d'authenticité
3. Vous partagez la facture et la preuve avec votre client
4. Votre client vérifie l'authenticité de la facture
5. 💡 **Bonus** : Votre client ajoute votre adresse dans son annuaire pour les futures factures

**Avantage :** Votre client peut être sûr que la facture n'a pas été modifiée et qu'elle provient bien de vous. Il peut aussi facilement vous identifier lors des prochaines transactions.

### Cas d'usage 3 : Photo de document officiel

**Situation :** Vous prenez une photo d'un document officiel et voulez prouver qu'elle n'a pas été retouchée.

**Avec CertiDocs :**
1. Vous uploadez la photo dans CertiDocs
2. Vous générez une preuve (qui peut être cachée dans l'image)
3. Vous partagez la photo avec la preuve intégrée
4. Le destinataire vérifie l'authenticité
5. 💡 **Bonus** : Le destinataire peut ajouter votre adresse dans son annuaire pour vérifier rapidement vos futurs documents

**Avantage :** La preuve est directement dans l'image, ce qui facilite le partage et la vérification. L'annuaire permet de créer une relation de confiance réutilisable.

---

## 🔐 Comment la blockchain garantit la sécurité

### Qu'est-ce que la blockchain ?

La blockchain est comme un **registre public** où toutes les transactions sont enregistrées de manière permanente et vérifiable. Personne ne peut modifier ou supprimer ce qui y est écrit.

### Pourquoi c'est sécurisé ?

1. **Décentralisation :** Les données ne sont pas stockées sur un seul serveur mais sur des milliers d'ordinateurs à travers le monde
2. **Immutabilité :** Une fois qu'une preuve est enregistrée, elle ne peut jamais être modifiée ou supprimée
3. **Transparence :** Toutes les vérifications sont publiques et auditables
4. **Cryptographie :** Les signatures utilisent des mathématiques avancées impossibles à falsifier

### Analogie simple

Imaginez un livre géant dans une bibliothèque publique :
- **Chaque page** représente une transaction
- **Le livre est ouvert** à tous pour consultation
- **Personne ne peut** arracher ou modifier une page
- **Chaque page est liée** à la précédente, donc si vous modifiez une page, toutes les suivantes deviennent invalides

---

## 🚀 Comment commencer

### Prérequis

1. **Un navigateur Chrome** (pour l'extension)
2. **Un portefeuille crypto** (MetaMask, Rainbow, Trust Wallet, etc.)
3. **Un peu de crypto-monnaie** pour payer les frais de transaction (très minimes, quelques centimes)

### Installation

#### Étape 1 : Installer l'extension Chrome

1. **Télécharger le package** :
   - Téléchargez le package de l'extension depuis la section releases du projet
   - Décompressez le fichier si nécessaire

2. **Charger l'extension dans Chrome** :
   - Ouvrez Chrome et naviguez vers `chrome://extensions/`
   - Activez le "Mode développeur" en cliquant sur le bouton en haut à droite
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `Extension` contenant les fichiers :
     - `manifest.json`
     - `background.js`
     - `popup.html`
     - `popup.js`
     - `content.js`
     - `CSS/style.css`
     - `lib/ethers.umd.min.js`
     - `config.js`

3. **Vérifier l'installation** :
   - L'icône CertiDocs devrait apparaître dans votre barre d'outils Chrome
   - Cliquez sur l'icône pour ouvrir le popup et vérifier que tout fonctionne

#### Étape 2 : Accéder à l'application web

1. **Ouvrir l'application** :
   - Naviguez vers l'URL de l'application web CertiDocs
   - L'application s'ouvre dans votre navigateur

2. **Première visite** :
   - Un tutoriel interactif peut s'afficher pour vous guider
   - Vous pouvez le fermer et le rouvrir plus tard depuis l'en-tête

#### Étape 3 : Connecter votre portefeuille

1. **Cliquer sur "Connecter le portefeuille"** :
   - Le bouton se trouve dans l'en-tête de l'application
   - Un modal WalletConnect s'ouvre

2. **Choisir votre portefeuille** :
   - **Pour portefeuilles mobiles** : Scannez le QR code avec l'application de votre portefeuille
   - **Pour portefeuilles desktop** : Cliquez sur votre portefeuille dans la liste (ex: MetaMask)

3. **Approuver la connexion** :
   - Dans votre portefeuille, approuvez la demande de connexion
   - Votre adresse Ethereum s'affiche dans l'en-tête de l'application

4. **Vérifier la connexion** :
   - Vous devriez voir votre adresse (raccourcie) dans l'en-tête
   - Vous pouvez maintenant générer et vérifier des preuves

#### Étape 4 : Préparer votre portefeuille

1. **Avoir des fonds** :
   - Assurez-vous d'avoir un peu de crypto-monnaie (ETH) dans votre portefeuille
   - Les frais de transaction sont minimes (quelques centimes d'euro)
   - Vous pouvez obtenir de l'ETH depuis un exchange ou un service comme Coinbase, Binance, etc.

2. **Choisir le réseau** :
   - CertiDocs fonctionne sur le réseau Ethereum (mainnet ou testnet selon la configuration)
   - Assurez-vous que votre portefeuille est connecté au bon réseau

#### Étape 5 : Commencer à utiliser CertiDocs

Vous êtes maintenant prêt ! Vous pouvez :
- Générer des preuves pour vos documents
- Vérifier l'authenticité de documents reçus
- Utiliser l'annuaire pour gérer vos contacts
- Explorer toutes les fonctionnalités de CertiDocs

### Première utilisation

1. **Générer une preuve :**
   - Ouvrez un email dans Gmail/Outlook
   - Cliquez sur l'extension CertiDocs
   - Suivez les instructions pour générer une preuve

2. **Vérifier une preuve :**
   - Recevez un document avec une preuve CertiDocs
   - Ouvrez l'application web ou l'extension
   - Collez la preuve et vérifiez l'authenticité
   - 💡 **Astuce** : Ajoutez l'adresse du signataire dans votre annuaire pour une utilisation future

3. **Créer votre annuaire :**
   - Après quelques vérifications, commencez à remplir votre annuaire
   - Ajoutez les adresses des personnes avec qui vous travaillez régulièrement
   - Utilisez des labels clairs et descriptifs

---

## ❓ Questions fréquentes

### Combien ça coûte ?

Les frais sont minimes (quelques centimes d'euro par transaction). Vous payez uniquement les frais de la blockchain Ethereum, pas de frais d'abonnement.

### Mes documents sont-ils publics ?

Non ! Seules les **preuves cryptographiques** (des codes) sont stockées sur la blockchain, pas le contenu de vos documents. Le contenu reste privé.

### Que se passe-t-il si je perds ma preuve ?

Si vous perdez la preuve, vous ne pourrez plus prouver l'authenticité du document. C'est pourquoi il est important de la sauvegarder soigneusement. Cependant, la preuve reste toujours sur la blockchain et peut être retrouvée si vous avez l'identifiant.

### Puis-je utiliser CertiDocs sans comprendre la blockchain ?

Absolument ! CertiDocs est conçu pour être simple à utiliser. Vous n'avez pas besoin de comprendre les détails techniques de la blockchain pour l'utiliser efficacement.

### Est-ce que ça fonctionne avec tous les types de documents ?

CertiDocs fonctionne actuellement avec :
- Emails (Gmail et Outlook)
- Documents PDF
- Images (JPG, PNG, etc.)
- Texte brut

D'autres formats pourront être ajoutés à l'avenir.

### Que se passe-t-il si quelqu'un modifie mon document après que j'aie créé la preuve ?

La vérification échouera ! Le système détectera que l'empreinte du document modifié ne correspond plus à l'empreinte enregistrée dans la preuve.

### L'annuaire est-il sécurisé ?

Oui ! L'annuaire est stocké localement dans votre navigateur. Vos adresses ne quittent jamais votre ordinateur et ne sont pas envoyées sur internet. Cependant, si vous supprimez les données de votre navigateur, l'annuaire sera perdu.

### Puis-je synchroniser mon annuaire entre plusieurs appareils ?

Pour l'instant, l'annuaire est spécifique à chaque navigateur et appareil. Il n'y a pas de synchronisation automatique. Si vous voulez utiliser le même annuaire sur plusieurs appareils, vous devrez ajouter les adresses manuellement sur chaque appareil.

### Que se passe-t-il si j'ajoute une mauvaise adresse dans l'annuaire ?

Vous pouvez toujours supprimer une adresse de l'annuaire en cliquant sur l'icône de suppression. Assurez-vous de vérifier l'adresse avant de l'ajouter, surtout lors de l'ajout manuel.

---

## 🎓 Glossaire simplifié

- **Blockchain :** Un registre public et décentralisé où les informations sont stockées de manière permanente
- **Empreinte (Hash) :** Un code unique calculé à partir du contenu d'un document. Si le document change, l'empreinte change aussi
- **Preuve d'authenticité :** Un code unique qui prouve qu'un document est authentique et n'a pas été modifié
- **Portefeuille crypto (Wallet) :** Une application qui stocke vos clés cryptographiques et vous identifie sur la blockchain
- **Signature cryptographique :** Une méthode mathématique pour prouver que vous avez créé ou approuvé quelque chose
- **Smart Contract :** Un programme informatique sur la blockchain qui exécute automatiquement des règles prédéfinies
- **Stéganographie :** Technique pour cacher des informations dans une image sans modifier son apparence visuelle
- **Annuaire d'adresses :** Un carnet d'adresses personnel stocké localement dans votre navigateur pour associer des labels aux adresses Ethereum
- **Label :** Un nom personnalisé que vous donnez à une adresse Ethereum dans votre annuaire (ex: "Client Dupont")

---

## 📞 Support et ressources

Pour plus d'informations, consultez :
- La documentation technique (pour les développeurs)
- Les scénarios de démonstration
- Le code source du projet

---

## 🎯 En résumé

**CertiDocs** est votre solution pour garantir l'authenticité de vos documents numériques. Grâce à la blockchain, vous pouvez :

✅ **Prouver** qu'un document n'a pas été modifié  
✅ **Vérifier** l'identité de l'auteur d'un document  
✅ **Protéger** vos documents contre la falsification  
✅ **Partager** des documents avec confiance  
✅ **Organiser** vos contacts avec l'annuaire d'adresses

Tout cela de manière simple, sécurisée et décentralisée.

---

*Dernière mise à jour : Janvier 2026*
