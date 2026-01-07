import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { contractDoc, extensionDoc, webappDoc } from './content';

function App() {
  // Par défaut sur 'home' pour accueillir l'utilisateur
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return `
# Bienvenue sur la Documentation Technique EIP-CERTIDOCS

Ce portail centralise l'ensemble de la documentation technique du projet Certidocs.
Il est divisé en trois modules principaux interconnectés :

## 1. Smart Contract 🔐
Le cœur de la sécurité.
- **Rôle** : Enregistrement immuable des preuves de signature sur la blockchain.
- **Technologies** : Solidity, Hardhat.
- **Fonctions Clés** : \`storeSignature\`, \`verifySignature\`.

## 2. Extension Navigateur 🧩
Le pont vers l'utilisateur.
- **Rôle** : Interface entre la boîte mail (Gmail/Outlook) et la blockchain.
- **Technologies** : Chrome Extension API, Content Scripts, Stéganographie.
- **Fonctions Clés** : Extraction DOM, Injection de script, Communication inter-fenêtres.

## 3. WebApp React 💻
L'interface de gestion.
- **Rôle** : Dashboard pour générer et vérifier les signatures.
- **Technologies** : React, Vite, Framer Motion, Wagmi/Reown.
- **Fonctions Clés** : Connexion Wallet, UI/UX Premium, Animations de vérification.

---
*Sélectionnez un module dans le menu ci-dessus pour accéder aux détails techniques exhaustifs.*
        `;
      case 'contract': return contractDoc;
      case 'extension': return extensionDoc;
      case 'webapp': return webappDoc;
      default: return contractDoc;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
            <h1>CERTIDOCS <span style={{ fontSize: '0.6em', opacity: 0.7, fontWeight: 400 }}>Documentation</span></h1>
          </div>

          <nav className="nav-tabs">
            <button
              className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Accueil
            </button>
            <button
              className={`tab-btn ${activeTab === 'contract' ? 'active' : ''}`}
              onClick={() => setActiveTab('contract')}
            >
              Smart Contract
            </button>
            <button
              className={`tab-btn ${activeTab === 'extension' ? 'active' : ''}`}
              onClick={() => setActiveTab('extension')}
            >
              Extension
            </button>
            <button
              className={`tab-btn ${activeTab === 'webapp' ? 'active' : ''}`}
              onClick={() => setActiveTab('webapp')}
            >
              WebApp React
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <article className="doc-card">
          <ReactMarkdown>{renderContent()}</ReactMarkdown>
        </article>
      </main>
    </div>
  );
}

export default App;
