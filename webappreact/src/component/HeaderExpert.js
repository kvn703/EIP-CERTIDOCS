import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../CSS/modern2025.css';
import './HeaderExpert.css';
import { useAppKitAccount, useDisconnect, modal } from '@reown/appkit/react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../context/OnboardingContext';

const HeaderExpert = ({ showProgress = false, currentStep = 0, steps = [] }) => {
  const { t } = useTranslation();
  const { isConnected, address } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { openOnboarding } = useOnboarding();
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isGeneratePage = location.pathname === '/';
  const isVerifyPage = location.pathname === '/verify';

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
      {/* Boutons en haut à gauche : Thème + Portefeuille */}
      <div className="header-left">
        <ThemeToggle />
        {isConnected && address ? (
          <div className="wallet-actions-group">
            <button
              className="wallet-btn-header"
              onClick={handleOpenModal}
              title={t('wallet_management') || 'Gérer le portefeuille'}
            >
              <i className="fas fa-wallet"></i>
              <span className="wallet-address">
                {address.slice(0, 4)}...{address.slice(-3)}
              </span>
            </button>
            <i
              className={`fas ${copied ? 'fa-check' : 'fa-copy'} wallet-copy-icon`}
              onClick={handleCopy}
              title={t('copy_address')}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
        ) : (
          <button 
            className="wallet-btn-header connect-btn-header" 
            onClick={handleOpenModal}
            title={t('connect_wallet') || t('connect') || 'Connecter un portefeuille'}
          >
            <i className="fas fa-plug"></i>
            <span className="connect-text">{t('connect_wallet') || t('connect')}</span>
          </button>
        )}
      </div>

      {/* Bouton en haut à droite : Langue */}
      <div className="header-right">
        <LanguageToggle />
      </div>

      {/* Logo et titre */}
      <div className="logo-icon">
        <i className="fas fa-shield-alt"></i>
      </div>
      <h1>CERTIDOCS</h1>

      {/* Navigation entre Générer et Vérifier */}
      <div className="header-navigation">
        <button
          className={`header-nav-btn ${isGeneratePage ? 'active' : ''}`}
          onClick={() => navigate('/')}
          aria-label={t('page_generate')}
          title={t('generate_fingerprint')}
        >
          <i className="fas fa-fingerprint"></i>
          <span>{t('generate')}</span>
        </button>
        <button
          className={`header-nav-btn ${isVerifyPage ? 'active' : ''}`}
          onClick={() => navigate('/verify')}
          aria-label={t('page_verify')}
          title={t('verify_fingerprint')}
        >
          <i className="fas fa-search"></i>
          <span>{t('verify')}</span>
        </button>
      </div>

      {/* Icône tutoriel en bas à droite */}
      <button
        className="header-tutorial-btn"
        onClick={openOnboarding}
        title={t('tutorial_welcome_title') || 'Voir le tutoriel'}
        aria-label={t('tutorial_welcome_title') || 'Voir le tutoriel'}
      >
        <i className="fas fa-question-circle"></i>
      </button>

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
              className={`progress-step-2025 ${index < currentStep ? 'completed' :
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