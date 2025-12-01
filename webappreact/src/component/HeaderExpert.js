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
      // Erreur silencieuse
    }
  };

  return (
    <header className="header-expert">
      <div className="header-left">
        <div className="logo-modern">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldGradientModern" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9584ff" />
                <stop offset="100%" stopColor="#7fffa7" />
              </linearGradient>
            </defs>
            <path d="M24 8L40 14V24C40 34 24 40 24 40C24 40 8 34 8 24V14L24 8Z" 
                  fill="url(#shieldGradientModern)" 
                  stroke="rgba(255, 255, 255, 0.2)" 
                  strokeWidth="1.5" />
          </svg>
        </div>
        <div className="header-title-modern">
          <h1 className="title-modern">CERTIDOCS</h1>
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