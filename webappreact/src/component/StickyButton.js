import React from 'react';
import { FaSpinner, FaCheckCircle, FaFingerprint, FaTimesCircle } from 'react-icons/fa';
import './StickyButton.css';

const StickyButton = ({ 
  onClick, 
  disabled, 
  isLoading = false, 
  isSuccess = false,
  isError = false,
  loadingText = "Génération en cours...",
  successText = "Empreinte générée !",
  errorText = "Erreur",
  children = "GÉNÉRER EMPREINTE"
}) => {
  return (
    <div className="sticky-button-container">
      <button
        className={`sticky-button ${isLoading ? 'loading' : ''} ${isSuccess ? 'success' : ''} ${isError ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled || isLoading}
        aria-label={isLoading ? loadingText : isError ? errorText : children}
      >
        <div className="sticky-button-content">
          {isLoading ? (
            <>
              <FaSpinner className="sticky-button-icon spinning" />
              <span>{loadingText}</span>
            </>
          ) : isSuccess ? (
            <>
              <FaCheckCircle className="sticky-button-icon" />
              <span>{successText}</span>
            </>
          ) : isError ? (
            <>
              <FaTimesCircle className="sticky-button-icon" />
              <span>{errorText}</span>
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



