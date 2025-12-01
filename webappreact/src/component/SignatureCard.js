import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import styles from './SignatureCard.module.css';

export default function SignatureCard({ signature, onCopy, isString, activeTab }) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isReducing, setIsReducing] = useState(false);

  const handleCopy = () => {
    if (!signature) return;
    navigator.clipboard.writeText("[CERTIDOCS]" + signature);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!signature || downloading) return;
    
    setDownloading(true);
    
    try {
      // Utiliser la fonction globale de script.js si disponible
      if (typeof window.hideTextInImageReturnBlob === 'function') {
        // Déterminer l'URL de l'image selon l'onglet
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000'
          : 'https://certidocsweb-xnvzbr.dappling.network';
        
        const imageUrl =
          activeTab === 0 ? `${baseUrl}/EMAIL_SIGNATURE.png` :
          activeTab === 1 ? `${baseUrl}/TEXT_SIGNATURE.png` :
          activeTab === 2 ? `${baseUrl}/PDF_SIGNATURE.png` :
          `${baseUrl}/IMAGE_SIGNATURE.png`;

        const blob = await window.hideTextInImageReturnBlob(imageUrl, "[CERTIDOCS]" + signature);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "signature.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // Téléchargement réussi
      } else {
        // Fonction non disponible
      }
    } catch (error) {
      // Erreur silencieuse
    } finally {
      setDownloading(false);
    }
  };

  const displaySignature = showFull ? signature : (signature ? `${signature.slice(0,8)}...${signature.slice(-4)}` : '');
  
  // Classe conditionnelle pour l'affichage complet ou la réduction
  const valueClassName = isReducing
    ? `${styles.value} ${styles.valueReducing}`
    : showFull 
      ? `${styles.value} ${styles.valueFull}` 
      : styles.value;

  return (
    <section className={styles.card} aria-label="Empreinte générée">
      <div className={styles.contentWrap}>
        <div className={styles.label}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Votre empreinte
        </div>
        <div className={styles.rowCompact}>
          <div 
            className={valueClassName}
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
              aria-label="Voir l'empreinte complète"
              type="button"
            >
              Voir complet
            </button>
          )}
          {showFull && (
            <button
              className={styles.viewFullBtn}
              onClick={() => {
                setIsReducing(true);
                // Attendre que l'animation se joue avant de changer showFull
                setTimeout(() => {
                  setShowFull(false);
                  // Nettoyer l'état après l'animation
                  setTimeout(() => setIsReducing(false), 1100);
                }, 50);
              }}
              aria-label="Réduire l'empreinte"
              type="button"
            >
              Réduire
            </button>
          )}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: '8px' }}>
            <div style={{ position: 'relative' }}>
              <button
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={handleCopy}
                aria-label={copied ? 'Empreinte copiée !' : "Copier l'empreinte"}
                type="button"
                tabIndex={0}
              >
                <span className={styles.btnIcon} aria-hidden="true" style={{ zIndex: 1000, position: 'relative', color: 'inherit' }}>
                  {copied ? (
                    <svg viewBox="0 0 24 24" className={styles.checkSvg} style={{ color: 'inherit', fill: 'currentColor' }}>
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
                    <svg viewBox="0 0 24 24" className={styles.clipboardSvg} style={{ color: 'inherit', fill: 'currentColor' }}>
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
            
            {/* Bouton de téléchargement - seulement pour le format Image (isString !== true) */}
            {isString !== true && (
              <button
                className={`${styles.downloadBtn} ${downloading ? styles.downloading : ''}`}
                onClick={handleDownload}
                disabled={downloading}
                aria-label="Télécharger la signature PNG"
                type="button"
                tabIndex={0}
              >
                <span className={styles.btnIcon} aria-hidden="true" style={{ zIndex: 1000, position: 'relative', color: 'inherit' }}>
                  <FaDownload style={{ color: 'inherit', fill: 'currentColor' }} />
                </span>
              </button>
            )}
          </div>
          
          {/* Texte d'aide - différent selon le format */}
          {isString !== true && (
            <span className={styles.helpText} style={{ textAlign: 'center', display: 'block', width: '100%', marginTop: '8px' }}>
              Téléchargez l'empreinte image pour l'intégrer dans vos documents
            </span>
          )}
          {isString === true && (
            <span className={styles.helpText} style={{ textAlign: 'center', display: 'block', width: '100%', marginTop: '8px' }}>
              Veuillez copier et coller l'empreinte dans votre mail
            </span>
          )}
        </div>
      </div>
    </section>
  );
} 