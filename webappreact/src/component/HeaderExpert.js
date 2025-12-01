import React, { useState } from 'react';
import './HeaderExpert.css';
import '../CSS/modern2025.css';
import { FaWallet, FaRegCopy, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAppKitAccount, useDisconnect, modal } from '@reown/appkit/react';

const HeaderExpert = ({ showProgress = false, currentStep = 0, steps = [] }) => {
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleOpenModal = () => {
    if (modal) {
      modal.open();
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      localStorage.clear();
      window.dispatchEvent(new Event('walletDisconnected'));
    } catch (error) {
      console.error("Erreur pendant la déconnexion :", error);
    }
  };

  return (
    <header className="header-expert">
      <div className="header-left">
        <div className="logo-anim">
          {/* Logo SVG animé - Bouclier avec bleu qui remplit tout */}
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e0ff" stopOpacity="1">
                  <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#4dabf7" stopOpacity="1">
                  <animate attributeName="stop-opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#9584ff" stopOpacity="1">
                  <animate attributeName="stop-opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#00e0ff" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#9584ff" stopOpacity="0.1" />
              </radialGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="url(#glow)" />
            {/* Bouclier rempli avec le gradient bleu */}
            <path d="M24 8L40 14V24C40 34 24 40 24 40C24 40 8 34 8 24V14L24 8Z" 
                  fill="url(#shieldGradient)" 
                  stroke="#fff" 
                  strokeWidth="1.5"
                  opacity="0.95">
              <animate attributeName="opacity" values="0.9;1;0.9" dur="2.5s" repeatCount="indefinite" />
            </path>
            {/* Contour animé pour l'effet de brillance */}
            <path d="M24 8L40 14V24C40 34 24 40 24 40C24 40 8 34 8 24V14L24 8Z" 
                  fill="none" 
                  stroke="#00e0ff" 
                  strokeWidth="2" 
                  opacity="0.6">
              <animate attributeName="stroke-dasharray" values="0,100;60,100;0,100" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <div className="header-title">
          <h1>
            <span className="gradient-text">CERTIDOCS</span>
            <span className="shine"></span>
          </h1>
        </div>
      </div>
      <div className="header-actions">
        {isConnected && address ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <button
                className={`wallet-copy-btn-header ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                title="Copier mon adresse"
                tabIndex={0}
              >
                <span className="wallet-address-text">
                  {address.slice(0, 4)}...{address.slice(-3)}
                </span>
                <span className="wallet-copy-icon">
                  {copied ? (
                    <svg viewBox="0 0 24 24" className="check-icon">
                      <path 
                        d="M5 13l4 4L19 7" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        fill="none"
                      />
                    </svg>
                  ) : (
                    <FaRegCopy />
                  )}
                </span>
              </button>
              {copied && (
                <div className="wallet-copy-feedback">
                  ✓ Copié !
                </div>
              )}
            </div>
            <button 
              className="header-action-btn-compact" 
              onClick={() => modal.open()}
              title="Paramètres"
              aria-label="Paramètres"
            >
              <FaCog />
            </button>
            <button 
              className="header-action-btn-compact header-action-btn-danger" 
              onClick={handleDisconnect}
              title="Déconnecter"
              aria-label="Déconnecter"
            >
              <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <button className="connect-btn-compact" onClick={handleOpenModal}>
            <FaWallet /> <span>Connecter</span>
          </button>
        )}
      </div>
      
      {/* Indicateur de progression optionnel */}
      {showProgress && steps.length > 0 && (
        <div className="progress-indicator-2025">
          <div className="progress-line-2025"></div>
          <div 
            className="progress-line-filled-2025" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`progress-step-2025 ${
                index < currentStep ? 'completed' : 
                index === currentStep ? 'active' : 
                'pending'
              }`}
            >
              <div className="progress-step-circle-2025">
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className="progress-step-label-2025">{step}</div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default HeaderExpert; 