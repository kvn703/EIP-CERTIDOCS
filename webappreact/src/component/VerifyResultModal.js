import React, { useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaCopy, FaWallet } from 'react-icons/fa';
import { useAppKitAccount } from "@reown/appkit/react";
import './VerifyResultModal.css';

const VerifyResultModal = ({ 
  isOpen, 
  onClose, 
  result, // 'success' ou 'error'
  signatureId,
  message,
  activeTab
}) => {
  const { address } = useAppKitAccount();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCopy = (text, label) => {
    if (text) {
      navigator.clipboard.writeText(text);
      // Vous pouvez ajouter un toast ici si nécessaire
    }
  };

  const shortAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isOpen) return null;

  const isSuccess = result === 'success';

  return (
    <div className="verify-result-modal-overlay" onClick={onClose}>
      <div 
        className="verify-result-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="verify-modal-title"
      >
        <button
          className="verify-result-modal-close"
          onClick={onClose}
          aria-label="Fermer la modal"
        >
          <FaTimes />
        </button>
        
        <div className="verify-result-modal-header">
          <div className={`verify-result-modal-icon-container ${isSuccess ? 'success' : 'error'}`}>
            {isSuccess ? (
              <FaCheckCircle className="verify-result-modal-icon" />
            ) : (
              <FaTimesCircle className="verify-result-modal-icon" />
            )}
            <div className="verify-result-modal-pulse-ring"></div>
          </div>
          <h2 id="verify-modal-title" className="verify-result-modal-title">
            {isSuccess ? 'Empreinte Validée !' : 'Empreinte Invalide'}
          </h2>
          <p className="verify-result-modal-subtitle">
            {isSuccess
              ? 'Votre empreinte électronique est authentique et valide.'
              : 'La signature ne correspond pas ou l\'ID est incorrect.'
            }
          </p>
        </div>

        <div className="verify-result-modal-body">
          {/* Détails de vérification */}
          <div className="verify-result-details-card">
            <div className="verify-result-detail-item">
              <span className="verify-detail-label">Statut :</span>
              <span className={`verify-detail-value ${isSuccess ? 'success' : 'error'}`}>
                {isSuccess ? 'Authentique' : 'Non authentique'}
              </span>
            </div>
            
            {signatureId && (
              <div className="verify-result-detail-item">
                <span className="verify-detail-label">Empreinte ID :</span>
                <div className="verify-detail-value-with-copy">
                  <span className="verify-detail-value">{shortAddress(signatureId)}</span>
                  <button
                    className="verify-copy-button"
                    onClick={() => handleCopy(signatureId, 'Empreinte ID')}
                    aria-label="Copier l'empreinte ID"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="verify-result-detail-item">
                <span className="verify-detail-label">Message vérifié :</span>
                <div className="verify-detail-value-with-copy">
                  <span className="verify-detail-value message-preview">
                    {message.length > 50 ? `${message.slice(0, 50)}...` : message}
                  </span>
                  <button
                    className="verify-copy-button"
                    onClick={() => handleCopy(message, 'Message')}
                    aria-label="Copier le message"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}

            {address && (
              <div className="verify-result-detail-item">
                <span className="verify-detail-label">Wallet utilisé :</span>
                <div className="verify-detail-value-with-copy">
                  <div className="verify-wallet-info">
                    <FaWallet className="verify-wallet-icon" />
                    <span className="verify-detail-value">{shortAddress(address)}</span>
                  </div>
                  <button
                    className="verify-copy-button"
                    onClick={() => handleCopy(address, 'Adresse wallet')}
                    aria-label="Copier l'adresse wallet"
                  >
                    <FaCopy />
                  </button>
                </div>
              </div>
            )}

            <div className="verify-result-detail-item">
              <span className="verify-detail-label">Timestamp :</span>
              <span className="verify-detail-value">{new Date().toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="verify-result-modal-footer">
          <button
            className="verify-result-modal-button-primary"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyResultModal;




