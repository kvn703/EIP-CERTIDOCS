import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimesCircle, FaCopy, FaWallet, FaFingerprint, FaEnvelope, FaClock, FaShieldAlt } from 'react-icons/fa';
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
    signatureId: false,
    message: false,
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

    if (activeTab === 0 && key === 'signatureId') {
      try {
        const base_url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:3000'
          : 'https://certidocsweb-xnvzbr.dappling.network';

        const image_url = `${base_url}/EMAIL_SIGNATURE.png`;
        const text_to_hide = "[CERTIDOCS]" + text;

        if (typeof window.hideTextInImage === 'function') {
          await window.hideTextInImage(image_url, text_to_hide);
          setCopiedStates(prev => ({ ...prev, [key]: true }));
          setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [key]: false }));
          }, 2000);
        } else if (typeof window.hideTextInImageReturnBlob === 'function') {
          const blob = await window.hideTextInImageReturnBlob(image_url, text_to_hide);

          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedStates(prev => ({ ...prev, [key]: true }));
            setTimeout(() => {
              setCopiedStates(prev => ({ ...prev, [key]: false }));
            }, 2000);
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

          setCopiedStates(prev => ({ ...prev, [key]: true }));
          setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [key]: false }));
          }, 2000);
        }
      } catch (error) {
        navigator.clipboard.writeText("[CERTIDOCS]" + text);
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, [key]: false }));
        }, 2000);
      }
    } else {
      navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    }
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

            {signatureId && (
              <div className="verify-result-detail-item">
                <span className="verify-detail-label">
                  <FaFingerprint className="verify-detail-label-icon verify-detail-label-icon-purple" />
                  {t('fingerprint_id')}
                </span>
                <div className="verify-detail-value-with-copy">
                  <span className="verify-detail-value verify-signature-id-value">{short_address(signatureId)}</span>
                  <div style={{ position: 'relative' }}>
                    <button
                      className={`verify-copy-button ${copiedStates.signatureId ? 'copied' : ''}`}
                      onClick={() => handleCopy(signatureId, 'Empreinte ID', 'signatureId')}
                      aria-label="Copier l'empreinte ID"
                    >
                      <FaCopy />
                    </button>
                    {copiedStates.signatureId && (
                      <div className="verify-copy-feedback">
                        ✓ {t('copied')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className="verify-result-detail-item">
                <span className="verify-detail-label">
                  <FaEnvelope className="verify-detail-label-icon" />
                  {t('verified_message')}
                </span>
                <div className="verify-detail-value-with-copy">
                  <span className="verify-detail-value message-preview">
                    {message.length > 50 ? `${message.slice(0, 50)}...` : message}
                  </span>
                  <div style={{ position: 'relative' }}>
                    <button
                      className={`verify-copy-button ${copiedStates.message ? 'copied' : ''}`}
                      onClick={() => handleCopy(message, 'Message', 'message')}
                      aria-label="Copier le message"
                    >
                      <FaCopy />
                    </button>
                    {copiedStates.message && (
                      <div className="verify-copy-feedback">
                        ✓ {t('copied')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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




