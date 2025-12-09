import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import styles from './SignatureCard.module.css';

export default function SignatureCard({ signature, onCopy, isString, activeTab }) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isReducing, setIsReducing] = useState(false);

  const handleCopy = async () => {
    if (!signature) return;
    
    if (activeTab === 0) {
      try {
        const base_url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000'
          : 'https://certidocsweb-xnvzbr.dappling.network';
        
        const image_url = `${base_url}/EMAIL_SIGNATURE.png`;
        const text_to_hide = "[CERTIDOCS]" + signature;
        
        if (typeof window.hideTextInImage === 'function') {
          await window.hideTextInImage(image_url, text_to_hide);
          setCopied(true);
          if (onCopy) onCopy();
          setTimeout(() => setCopied(false), 2000);
        } else if (typeof window.hideTextInImageReturnBlob === 'function') {
          const blob = await window.hideTextInImageReturnBlob(image_url, text_to_hide);
          
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopied(true);
            if (onCopy) onCopy();
            setTimeout(() => setCopied(false), 2000);
          } else {
            throw new Error('Blob non disponible');
          }
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = image_url;
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0);
              
              const image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = image_data.data;
              
              const binary_text = text_to_hide.split('').map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
              }).join('') + '00000000';
              
              for (let i = 0; i < binary_text.length; i++) {
                if (i * 4 < data.length) {
                  data[i * 4] = (data[i * 4] & 0xFE) | parseInt(binary_text[i], 2);
                } else {
                  break;
                }
              }
              ctx.putImageData(image_data, 0, 0);
              
              canvas.toBlob(async (blob) => {
                if (blob) {
                  try {
                    await navigator.clipboard.write([
                      new ClipboardItem({ "image/png": blob })
                    ]);
                    resolve();
                  } catch (err) {
                    reject(err);
                  }
                } else {
                  reject(new Error('Impossible de créer le blob'));
                }
              }, "image/png");
            };
            img.onerror = () => {
              reject(new Error("Erreur de chargement de l'image"));
            };
          });
          
          setCopied(true);
          if (onCopy) onCopy();
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (error) {
        navigator.clipboard.writeText("[CERTIDOCS]" + signature);
        setCopied(true);
        if (onCopy) onCopy();
        setTimeout(() => setCopied(false), 2000);
      }
    } else {
      navigator.clipboard.writeText("[CERTIDOCS]" + signature);
    setCopied(true);
    if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!signature || downloading) return;
    
    setDownloading(true);
    
    try {
      if (typeof window.hideTextInImageReturnBlob === 'function') {
        const base_url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000'
          : 'https://certidocsweb-xnvzbr.dappling.network';
        
        const image_url =
          activeTab === 0 ? `${base_url}/EMAIL_SIGNATURE.png` :
          activeTab === 1 ? `${base_url}/TEXT_SIGNATURE.png` :
          activeTab === 2 ? `${base_url}/PDF_SIGNATURE.png` :
          `${base_url}/IMAGE_SIGNATURE.png`;

        const blob = await window.hideTextInImageReturnBlob(image_url, "[CERTIDOCS]" + signature);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "signature.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
    } finally {
      setDownloading(false);
    }
  };

  const display_signature = showFull ? signature : (signature ? `${signature.slice(0,8)}...${signature.slice(-4)}` : '');
  
  const value_class_name = isReducing
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
            className={value_class_name}
            title={signature}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {display_signature}
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
                setTimeout(() => {
                  setShowFull(false);
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