import React, { useState } from 'react';
import styles from './SignatureCard.module.css';

export default function SignatureCard({ signature, onCopy }) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopy = () => {
    if (!signature) return;
    navigator.clipboard.writeText(signature);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const displaySignature = showFull ? signature : (signature ? `${signature.slice(0,8)}...${signature.slice(-4)}` : '');

  return (
    <section className={styles.card} aria-label="Signature générée">
      <div className={styles.contentWrap}>
        <div className={styles.label}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Votre signature
        </div>
        <div className={styles.rowCompact}>
          <div 
            className={styles.value} 
            title={signature}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {displaySignature}
            {showTooltip && signature && (
              <div className={styles.valueTooltip}>
                {signature}
              </div>
            )}
          </div>
          {!showFull && signature && signature.length > 12 && (
            <button
              className={styles.viewFullBtn}
              onClick={() => setShowFull(true)}
              aria-label="Voir la signature complète"
              type="button"
            >
              Voir complet
            </button>
          )}
          {showFull && (
            <button
              className={styles.viewFullBtn}
              onClick={() => setShowFull(false)}
              aria-label="Réduire la signature"
              type="button"
            >
              Réduire
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <button
              className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
              onClick={handleCopy}
              aria-label={copied ? 'Signature copiée !' : 'Copier la signature'}
              type="button"
              tabIndex={0}
            >
              <span className={styles.btnIcon} aria-hidden="true">
                {copied ? (
                  <svg viewBox="0 0 24 24" className={styles.checkSvg}>
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
                  <svg viewBox="0 0 24 24" className={styles.clipboardSvg}>
                    <rect x="7" y="4" width="10" height="16" rx="3" fill="currentColor" opacity="0.2"/>
                    <rect x="9" y="2" width="6" height="4" rx="2" fill="currentColor" opacity="0.4"/>
                    <rect x="9" y="8" width="6" height="2" rx="1" fill="currentColor" opacity="0.6"/>
                  </svg>
                )}
              </span>
            </button>
            {copied && (
              <div className={styles.copyFeedback}>
                ✓ Copié !
              </div>
            )}
          </div>
          <span className={styles.helpText}>
            Veuillez copier et coller la signature dans votre mail.
          </span>
        </div>
      </div>
    </section>
  );
} 