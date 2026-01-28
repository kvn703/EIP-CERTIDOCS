import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTimesCircle, FaCopy, FaWallet, FaClock, FaAddressBook, FaPlus, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { useAppKitAccount } from "@reown/appkit/react";
import { normalizeAddress, isAddressInDirectory } from '../utils/addressDirectory';
import AddressDirectory from './AddressDirectory';
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
  const [addressInput, setAddressInput] = useState('');
  const [addressesMatch, setAddressesMatch] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [shouldAddAddress, setShouldAddAddress] = useState(false);

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
        if (isDirectoryOpen) {
          setIsDirectoryOpen(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, isDirectoryOpen]);

  // Réinitialiser l'input quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setAddressInput('');
      setAddressesMatch(false);
      setIsDirectoryOpen(false);
    }
  }, [isOpen]);

  // Vérifier si les adresses correspondent
  useEffect(() => {
    if (!address || !addressInput) {
      setAddressesMatch(false);
      return;
    }

    const normalizedInput = normalizeAddress(addressInput);
    const normalizedAddress = normalizeAddress(address);
    const isValidFormat = normalizedInput.length >= 42;
    const match = isValidFormat && normalizedInput === normalizedAddress;
    setAddressesMatch(match);
  }, [address, addressInput]);

  // Vérifier si l'adresse est valide mais ne correspond pas
  const isValidAddressFormat = addressInput && normalizeAddress(addressInput).length >= 42;
  const addressesDoNotMatch = isValidAddressFormat && address && normalizeAddress(addressInput) !== normalizeAddress(address);

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
            {address && (
              <>
                <div className="verify-result-detail-item">
                  <span className="verify-detail-label">
                    <FaWallet className="verify-detail-label-icon" />
                    {t('wallet_used')}
                  </span>
                  <div className="verify-detail-value-with-copy">
                    <span className="verify-detail-value">{short_address(address)}</span>
                    <div style={{ position: 'relative' }}>
                      <i
                        className={`fas fa-copy verify-copy-icon ${copiedStates.address ? 'copied' : ''}`}
                        onClick={() => handleCopy(address, 'Adresse wallet', 'address')}
                        aria-label="Copier l'adresse wallet"
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCopy(address, 'Adresse wallet', 'address');
                          }
                        }}
                      ></i>
                      {copiedStates.address && (
                        <div className="verify-copy-feedback">
                          ✓ {t('copied')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section Annuaire */}
                <div className="verify-result-detail-item verify-address-directory-section">
                  <span className="verify-detail-label">
                    <FaShieldAlt className="verify-detail-label-icon" />
                    CHECK USED WALLET
                  </span>
                  
                  {/* Affichage minimaliste de correspondance */}
                  {addressesMatch && (
                    <div className="verify-address-status verify-address-status-match">
                      <FaCheckCircle />
                      <span>{t('address_directory_addresses_match')}</span>
                    </div>
                  )}
                  
                  {addressesDoNotMatch && (
                    <div className="verify-address-status verify-address-status-mismatch">
                      <FaTimesCircle />
                      <span>{t('address_directory_addresses_do_not_match')}</span>
                    </div>
                  )}
                  
                  <div className="verify-address-input-wrapper">
                    <input
                      type="text"
                      className={`verify-address-input ${
                        addressesMatch 
                          ? 'address-match' 
                          : addressesDoNotMatch 
                          ? 'address-mismatch' 
                          : !addressInput || addressInput.trim() === ''
                          ? 'address-empty'
                          : ''
                      }`}
                      placeholder={t('address_directory_input_placeholder')}
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      onPaste={(e) => {
                        const pastedText = e.clipboardData.getData('text');
                        setTimeout(() => {
                          setAddressInput(pastedText);
                        }, 0);
                      }}
                    />
                    <div className="verify-directory-buttons-wrapper">
                      <button
                        className="verify-directory-button"
                        onClick={() => {
                          setShouldAddAddress(false);
                          setIsDirectoryOpen(true);
                        }}
                        title={t('address_directory_open')}
                      >
                        <FaAddressBook />
                        {t('address_directory_open')}
                      </button>
                      <button
                        className={`verify-directory-button verify-add-button ${
                          addressesMatch && !isAddressInDirectory(address) ? '' : 'disabled'
                        }`}
                        onClick={() => {
                          if (addressesMatch && !isAddressInDirectory(address)) {
                            setShouldAddAddress(true);
                            setIsDirectoryOpen(true);
                          }
                        }}
                        disabled={!addressesMatch || isAddressInDirectory(address)}
                        title={
                          addressesMatch && isAddressInDirectory(address)
                            ? t('address_directory_already_exists')
                            : addressesMatch
                            ? t('address_directory_add_to_directory')
                            : t('address_directory_add_to_directory')
                        }
                      >
                        {addressesMatch && isAddressInDirectory(address) ? (
                          <>
                            <FaCheck />
                            Address in directory
                          </>
                        ) : (
                          <>
                            <FaPlus />
                            Add address
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
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

      {/* Modal Annuaire */}
      <AddressDirectory
        isOpen={isDirectoryOpen}
        onClose={() => {
          setIsDirectoryOpen(false);
          setShouldAddAddress(false);
        }}
        addressToAdd={shouldAddAddress && addressesMatch ? address : null}
        onAddressAdded={() => {
          setIsDirectoryOpen(false);
          setShouldAddAddress(false);
        }}
      />
    </div>
  );
};

export default VerifyResultModal;




