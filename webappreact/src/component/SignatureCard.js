import React, { useState } from 'react';
import { FaDownload, FaCopy, FaCheck } from 'react-icons/fa';
import styles from './SignatureCard.module.css';

export default function SignatureCard({ signature, onCopy, isString, activeTab, pdfFile, imageFile }) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    if (!signature) return;
    
    if (activeTab === 0) {
      try {
        const base_url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000'
          : 'https://eip-certidocs-jy6jwy.dappling.network';
        
        const image_url = `${base_url}/EMAIL_PROOF.png`;
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
          : 'https://eip-certidocs-jy6jwy.dappling.network';
        
        const image_url =
          activeTab === 0 ? `${base_url}/EMAIL_PROOF.png` :
          activeTab === 1 ? `${base_url}/PDF_PROOF.png` :
          activeTab === 2 ? `${base_url}/IMAGE_PROOF.png` :
          `${base_url}/TEXT_PROOF.png`;

        // Générer le nom de fichier selon le format
        let filename;
        if (activeTab === 0) {
          // Email
          filename = "[PROOF]Email.png";
        } else if (activeTab === 1) {
          // PDF - utiliser le nom du fichier PDF
          if (pdfFile && pdfFile.name) {
            const originalName = pdfFile.name.replace(/\.pdf$/i, '');
            filename = `[PROOF]${originalName}.png`;
          } else {
            filename = "[PROOF]Document.pdf.png";
          }
        } else if (activeTab === 2) {
          // Image - utiliser le nom du fichier image
          if (imageFile && imageFile.name) {
            const originalName = imageFile.name.replace(/\.(png|jpg|jpeg)$/i, '');
            filename = `[PROOF]${originalName}.png`;
          } else {
            filename = "[PROOF]Image.png";
          }
        } else {
          // Texte
          filename = "[PROOF]Text.png";
        }

        const blob = await window.hideTextInImageReturnBlob(image_url, "[CERTIDOCS]" + signature);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
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

  const fullSignature = signature ? `[CERTIDOCS]${signature}` : '';
  const display_signature = signature ? `[CERTIDOCS]${signature.slice(0,16)}...${signature.slice(-14)}` : '';
  
  const value_class_name = styles.value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }} aria-label="Empreinte générée">
      <div 
        className={value_class_name}
        title={fullSignature}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {display_signature}
        {showTooltip && signature && (
          <div className={styles.valueTooltip}>
            {fullSignature}
          </div>
        )}
      </div>
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
                <FaCheck style={{ color: 'inherit', fill: 'currentColor' }} />
          ) : (
                <FaCopy style={{ color: 'inherit', fill: 'currentColor' }} />
          )}
        </span>
      </button>
          {copied && (
            <div className={styles.copyFeedback}>
              ✓ Copié !
            </div>
          )}
        </div>
        
        <button
          className={`${styles.downloadBtn} ${downloading ? styles.downloading : ''} ${isString === true ? styles.disabled : ''}`}
          onClick={handleDownload}
          disabled={downloading || isString === true}
          aria-label={isString === true ? "Téléchargement non disponible pour les preuves texte" : "Télécharger la preuve PNG"}
          type="button"
          tabIndex={isString === true ? -1 : 0}
        >
          <span className={styles.btnIcon} aria-hidden="true" style={{ zIndex: 1000, position: 'relative', color: 'inherit' }}>
            <FaDownload style={{ color: 'inherit', fill: 'currentColor' }} />
          </span>
        </button>
      </div>
      
      {isString !== true && (
        <span className={styles.helpText} style={{ textAlign: 'center', display: 'block', width: '100%', marginTop: '8px' }}>
          Transmettez le document et la preuve à la personne souhaitant vérifier l'authenticité
        </span>
      )}
      {isString === true && (
        <span className={styles.helpText} style={{ textAlign: 'center', display: 'block', width: '100%', marginTop: '8px' }}>
          Transmettez l'empreinte avec votre document pour vérification
      </span>
      )}
    </div>
  );
} 