import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimesCircle, FaCopy, FaWallet, FaClock, FaShieldAlt } from 'react-icons/fa';
import { useAppKitAccount } from "@reown/appkit/react";
import './VerifyResultModal.css';

const VerifyResultModal = ({
  isOpen,
  onClose,
  result,
  signatureId,
  message,
  activeTab
}) => {
  const { t } = useTranslation();
  const { address } = useAppKitAccount();
  const [copiedStates, setCopiedStates] = useState({
    address: false
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('verify-modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('verify-modal-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('verify-modal-open');
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

  const handleCopy = async (text, label, key) => {
    if (!text) return;

    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const short_address = (addr) => {
    if (!addr) return '';
    if (addr.startsWith('[CERTIDOCS]')) {
      const clean_addr = addr.replace('[CERTIDOCS]', '');
      if (clean_addr.length > 20) {
        return `${clean_addr.slice(0, 12)}...${clean_addr.slice(-8)}`;
      }
      return clean_addr;
    }
    if (addr.length > 20) {
      return `${addr.slice(0, 12)}...${addr.slice(-8)}`;
    }
    return addr;
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
            {isSuccess ? t('fingerprint_validated') : t('fingerprint_invalid')}
          </h2>
          <p className="verify-result-modal-subtitle">
            {isSuccess
              ? t('fingerprint_authentic_desc')
              : t('fingerprint_invalid_desc')
            }
          </p>
        </div>

        <div className="verify-result-modal-body">
          <div className="verify-result-details-card">
            <div className="verify-result-detail-item">
              <span className="verify-detail-label">
                <FaShieldAlt className="verify-detail-label-icon" />
                {t('status')}
              </span>
              <span className={`verify-detail-value ${isSuccess ? 'success' : 'error'}`}>
                {isSuccess ? t('authentic') : t('not_authentic')}
              </span>
            </div>

            {address && (
              <div className="verify-result-detail-item">
                <span className="verify-detail-label">
                  <FaWallet className="verify-detail-label-icon" />
                  {t('wallet_used')}
                </span>
                <div className="verify-detail-value-with-copy">
                  <span className="verify-detail-value">{short_address(address)}</span>
                  <div style={{ position: 'relative' }}>
                    <button
                      className={`verify-copy-button ${copiedStates.address ? 'copied' : ''}`}
                      onClick={() => handleCopy(address, 'Adresse wallet', 'address')}
                      aria-label="Copier l'adresse wallet"
                    >
                      <FaCopy />
                    </button>
                    {copiedStates.address && (
                      <div className="verify-copy-feedback">
                        ✓ {t('copied')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="verify-result-detail-item">
              <span className="verify-detail-label">
                <FaClock className="verify-detail-label-icon" />
                {t('timestamp')}
              </span>
              <span className="verify-detail-value">{new Date().toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </div>

        <div className="verify-result-modal-footer">
          <button
            className="verify-result-modal-button-primary"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyResultModal;




