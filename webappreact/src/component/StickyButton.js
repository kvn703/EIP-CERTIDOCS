import React from 'react';
import { FaSpinner, FaCheckCircle, FaFingerprint } from 'react-icons/fa';
import './StickyButton.css';

const StickyButton = ({ 
  onClick, 
  disabled, 
  isLoading = false, 
  isSuccess = false,
  children = "GÉNÉRER EMPREINTE"
}) => {
  return (
    <div className="sticky-button-container">
      <button
        className={`sticky-button ${isLoading ? 'loading' : ''} ${isSuccess ? 'success' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled || isLoading}
        aria-label={isLoading ? 'Génération en cours...' : children}
      >
        <div className="sticky-button-content">
          {isLoading ? (
            <>
              <FaSpinner className="sticky-button-icon spinning" />
              <span>Génération en cours...</span>
            </>
          ) : isSuccess ? (
            <>
              <FaCheckCircle className="sticky-button-icon" />
              <span>Empreinte générée !</span>
            </>
          ) : (
            <>
              <FaFingerprint className="sticky-button-icon" />
              <span>{children}</span>
            </>
          )}
        </div>
        {isLoading && <div className="sticky-button-progress"></div>}
      </button>
    </div>
  );
};

export default StickyButton;



