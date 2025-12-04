import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import SignatureCard from './SignatureCard';
import './ResultModal.css';

const ResultModal = ({ isOpen, onClose, signature, onCopy, isString, activeTab }) => {
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

  if (!isOpen) return null;

  return (
    <div className="result-modal-overlay" onClick={onClose}>
      <div 
        className="result-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="result-modal-header">
          <div className="result-modal-success-icon">
            <FaCheckCircle />
          </div>
          <h2 id="modal-title" className="result-modal-title">
            Empreinte générée avec succès !
          </h2>
          <p className="result-modal-subtitle">
            Votre empreinte électronique est prête à être utilisée
          </p>
        </div>

        <div className="result-modal-body">
          {signature && (
            <SignatureCard 
              signature={signature} 
              onCopy={onCopy}
              isString={isString}
              activeTab={activeTab}
            />
          )}
        </div>

        <div className="result-modal-footer">
          <button
            className="result-modal-button-secondary"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;



