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

**Ce que c'est :** Une petite application qui s'intègre dans votre navigateur Chrome.

**Ce qu'elle fait :**
- Détecte automatiquement le contenu de vos emails dans Gmail ou Outlook
- Permet de générer une preuve d'authenticité directement depuis votre boîte mail
- Facilite la vérification des emails reçus

**Pourquoi c'est utile :** Vous n'avez pas besoin de copier-coller le contenu manuellement. L'extension fait tout automatiquement !

### 2. 🌐 Application Web (Interface principale)

**Ce que c'est :** Un site web moderne et intuitif accessible depuis n'importe quel navigateur.

**Ce qu'elle fait :**
- Permet de générer des preuves pour différents types de documents (emails, PDFs, images, texte)
- Permet de vérifier l'authenticité de documents reçus
- Gère la connexion à votre portefeuille crypto
- Affiche les résultats de vérification de manière claire

**Pourquoi c'est utile :** C'est votre "tableau de bord" pour toutes les opérations d'authentification.

### 3. ⛓️ Smart Contract (Sur la blockchain Ethereum)

**Ce que c'est :** Un programme informatique stocké sur la blockchain qui fonctionne comme un "notaire numérique".

**Ce qu'il fait :**
- Stocke de manière permanente et infalsifiable les preuves d'authenticité
- Vérifie que les signatures correspondent bien aux documents
- Contrôle qui peut vérifier quels documents (destinataires autorisés)
- Garantit que chaque preuve est unique et ne peut pas être réutilisée

**Pourquoi c'est utile :** La blockchain est décentralisée et publique, ce qui signifie qu'aucune organisation ne peut modifier ou supprimer vos preuves. C'est comme un registre public inviolable.

### 4. 💼 Portefeuille Crypto (Wallet)

**Ce que c'est :** Votre identité numérique sur la blockchain (comme MetaMask, Rainbow, Trust Wallet, etc.).

**Ce qu'il fait :**
- Vous identifie de manière unique sur la blockchain
- Signe cryptographiquement vos documents
- Permet de payer les frais de transaction (minimes)

**Pourquoi c'est utile :** C'est votre "carte d'identité numérique" qui prouve que c'est bien vous qui avez créé la preuve.

---

## 🔄 Le processus complet en 2 étapes

### Étape 1 : Génération d'une preuve d'authenticité

**Scénario :** Vous voulez prouver qu'un email important est authentique.

1. **Vous composez votre email** dans Gmail ou Outlook
2. **Vous ouvrez l'extension CertiDocs** et cliquez sur "Générer une preuve"
3. **L'extension détecte automatiquement** le contenu de votre email
4. **Vous ajoutez les destinataires autorisés** (les personnes qui pourront vérifier cette preuve)
5. **Vous confirmez la transaction** dans votre portefeuille crypto
6. **Le système calcule l'empreinte** de votre email
7. **Votre portefeuille signe cryptographiquement** cette empreinte
8. **La preuve est enregistrée sur la blockchain** (transaction publique et vérifiable)
9. **Vous recevez une preuve** (un code unique) que vous pouvez partager avec vos destinataires

**Résultat :** Vous avez maintenant une preuve cryptographique que votre email est authentique et n'a pas été modifié.

### Étape 2 : Vérification d'une preuve

**Scénario :** Vous recevez un email avec une preuve CertiDocs et voulez vérifier son authenticité.

1. **Vous recevez l'email** avec sa preuve d'authenticité
2. **Vous ouvrez l'extension CertiDocs** ou l'application web
3. **Vous cliquez sur "Vérifier"**
4. **L'extension détecte automatiquement** le contenu de l'email reçu
5. **Vous collez ou uploadez la preuve** fournie par l'expéditeur
6. **Le système calcule l'empreinte** de l'email reçu
7. **Le système interroge la blockchain** pour vérifier la preuve
8. **Vous recevez un résultat clair** :
   - ✅ **Valide** : Le document est authentique et n'a pas été modifié
   - ❌ **Invalide** : Le document a été modifié ou la preuve ne correspond pas

**Résultat :** Vous savez avec certitude si le document est authentique ou non.

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

**Fonctionnalité spéciale :** Détection automatique du contenu
- L'extension détecte automatiquement le texte de votre email
- Vous n'avez pas besoin de copier-coller manuellement
- La preuve inclut l'expéditeur pour éviter les confusions

**Cas d'usage :** Contrats par email, confirmations importantes, communications officielles

### 📄 Documents PDF

**Fonctionnalité spéciale :** Hash du fichier complet
- Chaque PDF est traité comme un fichier unique
- Même une modification mineure invalide la preuve
- La preuve peut être jointe au PDF ou partagée séparément

**Cas d'usage :** Contrats légaux, factures, certificats, documents officiels

### 🖼️ Images

**Fonctionnalité spéciale :** Stéganographie (preuve cachée dans l'image)
- La preuve peut être cachée directement dans les pixels de l'image
- L'image reste visuellement identique
- La preuve peut être extraite automatiquement lors de la vérification

**Cas d'usage :** Photos de documents, captures d'écran importantes, images de contrats

### 📝 Texte brut

**Fonctionnalité spéciale :** Format libre
- Vous pouvez signer n'importe quel texte
- Utile pour les messages courts ou les déclarations
- La preuve peut être retournée comme texte ou image

**Cas d'usage :** Déclarations courtes, messages importants, références professionnelles

---

## 💡 Cas d'usage concrets

### Cas d'usage 1 : Contrat d'emploi par email

**Situation :** Vous recevez une offre d'emploi par email et voulez vous assurer qu'elle n'a pas été modifiée.

**Avec CertiDocs :**
1. L'employeur génère une preuve pour l'email contenant l'offre
2. Il vous envoie l'email avec la preuve
3. Vous vérifiez l'authenticité avec CertiDocs
4. ✅ Vous savez que l'offre est authentique et n'a pas été modifiée

**Avantage :** Vous pouvez faire confiance à l'offre sans risquer qu'elle soit modifiée après envoi.

### Cas d'usage 2 : Facture PDF

**Situation :** Vous envoyez une facture PDF importante et voulez prouver son authenticité.

**Avec CertiDocs :**
1. Vous uploadez votre facture PDF dans CertiDocs
2. Vous générez une preuve d'authenticité
3. Vous partagez la facture et la preuve avec votre client
4. Votre client vérifie l'authenticité de la facture

**Avantage :** Votre client peut être sûr que la facture n'a pas été modifiée et qu'elle provient bien de vous.

### Cas d'usage 3 : Photo de document officiel

**Situation :** Vous prenez une photo d'un document officiel et voulez prouver qu'elle n'a pas été retouchée.

**Avec CertiDocs :**
1. Vous uploadez la photo dans CertiDocs
2. Vous générez une preuve (qui peut être cachée dans l'image)
3. Vous partagez la photo avec la preuve intégrée
4. Le destinataire vérifie l'authenticité

**Avantage :** La preuve est directement dans l'image, ce qui facilite le partage et la vérification.

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

1. **Installer l'extension Chrome** CertiDocs
2. **Se connecter à l'application web** CertiDocs
3. **Connecter votre portefeuille** via WalletConnect
4. **Commencer à utiliser** CertiDocs !

### Première utilisation

1. **Générer une preuve :**
   - Ouvrez un email dans Gmail/Outlook
   - Cliquez sur l'extension CertiDocs
   - Suivez les instructions pour générer une preuve

2. **Vérifier une preuve :**
   - Recevez un document avec une preuve CertiDocs
   - Ouvrez l'application web ou l'extension
   - Collez la preuve et vérifiez l'authenticité

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

---

## 🎓 Glossaire simplifié

- **Blockchain :** Un registre public et décentralisé où les informations sont stockées de manière permanente
- **Empreinte (Hash) :** Un code unique calculé à partir du contenu d'un document. Si le document change, l'empreinte change aussi
- **Preuve d'authenticité :** Un code unique qui prouve qu'un document est authentique et n'a pas été modifié
- **Portefeuille crypto (Wallet) :** Une application qui stocke vos clés cryptographiques et vous identifie sur la blockchain
- **Signature cryptographique :** Une méthode mathématique pour prouver que vous avez créé ou approuvé quelque chose
- **Smart Contract :** Un programme informatique sur la blockchain qui exécute automatiquement des règles prédéfinies
- **Stéganographie :** Technique pour cacher des informations dans une image sans modifier son apparence visuelle

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

Tout cela de manière simple, sécurisée et décentralisée.

---

*Dernière mise à jour : Janvier 2026*
