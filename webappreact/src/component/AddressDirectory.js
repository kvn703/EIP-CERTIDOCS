import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaPlus, FaAddressBook } from 'react-icons/fa';
import { 
  getAddressDirectory, 
  searchAddressDirectory, 
  addAddressToDirectory,
  removeAddressFromDirectory,
  normalizeAddress,
  isAddressInDirectory,
  isLabelInDirectory
} from '../utils/addressDirectory';
import './AddressDirectory.css';

const AddressDirectory = ({ isOpen, onClose, addressToAdd = null, onAddressAdded }) => {
  const { t } = useTranslation();
  const [directory, setDirectory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAddress, setNewAddress] = useState(addressToAdd || '');
  const [newLabel, setNewLabel] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(null);
  const [error, setError] = useState('');
  const [isScrollable, setIsScrollable] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadDirectory();
      if (addressToAdd) {
        setNewAddress(addressToAdd);
        setShowAddForm(true);
      }
    } else {
      // Réinitialiser le formulaire quand la modal se ferme
      setNewAddress('');
      setNewLabel('');
      setSearchQuery('');
      setShowAddForm(false);
      setError('');
    }
  }, [isOpen, addressToAdd]);

  const loadDirectory = () => {
    const entries = searchQuery 
      ? searchAddressDirectory(searchQuery)
      : getAddressDirectory();
    setDirectory(entries);
  };

  useEffect(() => {
    loadDirectory();
  }, [searchQuery]);

  // Vérifier si la liste est scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (listRef.current) {
        const isScroll = listRef.current.scrollHeight > listRef.current.clientHeight;
        setIsScrollable(isScroll);
      }
    };
    
    checkScrollable();
    // Vérifier à nouveau après un court délai pour s'assurer que le DOM est mis à jour
    const timeoutId = setTimeout(checkScrollable, 100);
    
    return () => clearTimeout(timeoutId);
  }, [directory, showAddForm]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCopyAddress = async (address) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const handleAddAddress = () => {
    setError('');
    
    // Vérifier que l'adresse est valide
    if (!newAddress || normalizeAddress(newAddress).length < 42) {
      setError(t('address_directory_invalid_address'));
      return;
    }

    // Vérifier que le label est renseigné
    if (!newLabel.trim()) {
      setError(t('address_directory_label_required'));
      return;
    }

    const normalizedAddress = normalizeAddress(newAddress);
    const trimmedLabel = newLabel.trim();

    // Vérifier que l'adresse n'est pas déjà dans l'annuaire
    if (isAddressInDirectory(normalizedAddress)) {
      setError(t('address_directory_address_already_exists'));
      return;
    }

    // Vérifier que le label n'est pas déjà dans l'annuaire
    if (isLabelInDirectory(trimmedLabel)) {
      setError(t('address_directory_label_already_exists'));
      return;
    }

    const result = addAddressToDirectory(normalizedAddress, trimmedLabel);
    
    if (result.success) {
      setNewAddress('');
      setNewLabel('');
      setShowAddForm(false);
      loadDirectory();
      if (onAddressAdded) {
        onAddressAdded(result.entry);
      }
    } else {
      setError(result.error || t('address_directory_add_error'));
    }
  };

  const handleRemoveAddress = (address) => {
    if (window.confirm(t('address_directory_confirm_delete'))) {
      removeAddressFromDirectory(address);
      loadDirectory();
    }
  };

  const shortAddress = (address) => {
    if (!address) return '';
    if (address.length > 20) {
      return `${address.slice(0, 10)}...${address.slice(-8)}`;
    }
    return address;
  };

  if (!isOpen) return null;

  return (
    <div className="address-directory-overlay" onClick={onClose}>
      <div
        className="address-directory-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="address-directory-title"
      >
        <div className="address-directory-header">
          <div className="address-directory-icon-container">
            <FaAddressBook className="address-directory-icon" />
          </div>
          <h2 id="address-directory-title" className="address-directory-title">
            {t('address_directory_title')}
          </h2>
          <i
            className="fas fa-times address-directory-close"
            onClick={onClose}
            aria-label={t('close')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClose();
              }
            }}
          ></i>
        </div>

        <div className="address-directory-body">
          {/* Barre de recherche */}
          <div className="address-directory-search-container">
            <div className="address-directory-search-wrapper">
              <input
                type="text"
                className="address-directory-search-input"
                placeholder={t('address_directory_search_placeholder')}
                value={searchQuery}
                onChange={handleSearch}
              />
              <FaSearch className="address-directory-search-icon" />
            </div>
          </div>

          {/* Bouton Ajouter */}
          {!showAddForm && (
            <button
              className="address-directory-add-button"
              onClick={() => {
                setShowAddForm(true);
                setError('');
              }}
            >
              <FaPlus />
              {t('address_directory_add_new')}
            </button>
          )}

          {/* Formulaire d'ajout */}
          <div className={`address-directory-add-form-wrapper ${showAddForm ? 'is-open' : 'is-closed'}`}>
            {showAddForm && (
              <div className="address-directory-add-form">
                <div className="address-directory-form-header">
                  <h3 className="address-directory-form-title">
                    <i className="fas fa-plus-circle"></i>
                    {t('address_directory_add_entry')}
                  </h3>
                </div>
                
                <div className="address-directory-form-content">
                  <div className="address-directory-form-field">
                    <div className="address-directory-input-wrapper">
                      <input
                        type="text"
                        className="address-directory-form-input"
                        placeholder="0x..."
                        value={newAddress}
                        onChange={(e) => {
                          setNewAddress(e.target.value);
                          setError('');
                        }}
                        autoFocus
                      />
                    </div>
                    {newAddress && normalizeAddress(newAddress).length >= 42 ? (
                      <i className="fas fa-check-circle address-directory-input-valid"></i>
                    ) : (
                      <i className="fas fa-wallet address-directory-input-icon"></i>
                    )}
                  </div>

                  <div className="address-directory-form-field">
                    <div className="address-directory-input-wrapper">
                      <input
                        type="text"
                        className="address-directory-form-input"
                        placeholder={t('address_directory_label_placeholder')}
                        value={newLabel}
                        onChange={(e) => {
                          setNewLabel(e.target.value);
                          setError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddAddress();
                          }
                        }}
                      />
                    </div>
                    {newLabel.trim() ? (
                      <i className="fas fa-check-circle address-directory-input-valid"></i>
                    ) : (
                      <i className="fas fa-tag address-directory-input-icon"></i>
                    )}
                  </div>

                  {error && (
                    <div className="address-directory-error">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </div>
                  )}
                </div>

                <div className="address-directory-form-actions">
                  <button
                    className="address-directory-form-button address-directory-form-button-primary"
                    onClick={handleAddAddress}
                    disabled={!newAddress || !newLabel.trim() || normalizeAddress(newAddress).length < 42}
                  >
                    <i className="fas fa-plus"></i>
                    {t('address_directory_add')}
                  </button>
                  <button
                    className="address-directory-form-button address-directory-form-button-secondary"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewAddress('');
                      setNewLabel('');
                      setError('');
                    }}
                  >
                    <i className="fas fa-times"></i>
                    {t('address_directory_cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Liste des adresses */}
          <div 
            ref={listRef}
            className={`address-directory-list ${isScrollable ? 'is-scrollable' : ''}`}
          >
            {directory.length === 0 ? (
              <div className="address-directory-empty">
                {searchQuery 
                  ? t('address_directory_no_results')
                  : t('address_directory_empty')
                }
              </div>
            ) : (
              directory.map((entry, index) => {
                const truncatedLabel = entry.label.length > 25 
                  ? entry.label.substring(0, 25) + '...' 
                  : entry.label;
                
                return (
                  <div key={index} className="address-directory-entry">
                    <div className="address-directory-entry-content">
                      <span className="address-directory-entry-label" title={entry.label}>
                        {truncatedLabel}
                      </span>
                      <span className="address-directory-entry-separator">•</span>
                      <span className="address-directory-entry-address">
                        {shortAddress(entry.address)}
                      </span>
                    </div>
                    <div className="address-directory-entry-actions">
                      <i
                        className={`fas fa-copy address-directory-copy-icon ${
                          copiedAddress === entry.address ? 'copied' : ''
                        }`}
                        onClick={() => handleCopyAddress(entry.address)}
                        aria-label={t('address_directory_copy')}
                        title={t('address_directory_copy')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCopyAddress(entry.address);
                          }
                        }}
                      ></i>
                      {copiedAddress === entry.address && (
                        <span className="address-directory-copy-feedback">
                          {t('copied')}
                        </span>
                      )}
                      <i
                        className="fas fa-times address-directory-remove-icon"
                        onClick={() => handleRemoveAddress(entry.address)}
                        aria-label={t('address_directory_delete')}
                        title={t('address_directory_delete')}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRemoveAddress(entry.address);
                          }
                        }}
                      ></i>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDirectory;
