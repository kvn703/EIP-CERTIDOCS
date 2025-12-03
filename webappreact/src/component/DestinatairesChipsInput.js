import React, { useState, useRef } from 'react';
import { FaWallet, FaTimes } from 'react-icons/fa';
import './DestinatairesChipsInput.css';

export default function DestinatairesChipsInput({ value = [], onChange, placeholder = 'Adresse1, Adresse2...' }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef();

  // Validation d'adresse wallet Ethereum
  const isValidWalletAddress = (address) => {
    const trimmed = address.trim();
    // Format: 0x suivi de 40 caractères hexadécimaux (42 caractères au total)
    return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
  };

  const handleInput = (e) => {
    const newValue = e.target.value;
    setInput(newValue);
    
    // Validation en temps réel (seulement si l'utilisateur a commencé à taper)
    if (newValue.trim().length > 0) {
      if (newValue.trim().length >= 2 && !newValue.trim().startsWith('0x')) {
        setError('L\'adresse doit commencer par 0x');
      } else if (newValue.trim().length > 2 && !isValidWalletAddress(newValue.trim()) && newValue.trim().length >= 42) {
        setError('Adresse invalide. Format attendu: 0x suivi de 40 caractères hexadécimaux');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  const addChip = (chip) => {
    const trimmed = chip.trim().toLowerCase(); // Normaliser en minuscules
    
    // Vérifier que l'adresse est valide
    if (!isValidWalletAddress(trimmed)) {
      setError('Adresse invalide. Format attendu: 0x suivi de 40 caractères hexadécimaux');
      return;
    }
    
    // Vérifier que l'adresse n'est pas déjà dans la liste (comparaison en minuscules)
    const normalizedValues = value.map(v => v.toLowerCase());
    if (normalizedValues.includes(trimmed)) {
      setError('Cette adresse est déjà ajoutée');
      return;
    }
    
    // Ajouter l'adresse
    onChange([...value, trimmed]);
    setInput('');
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      if (input.trim()) addChip(input);
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      // Supprime le dernier chip si input vide
      onChange(value.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    if (pasted.includes(',')) {
      e.preventDefault();
      const addresses = pasted.split(',').map(addr => addr.trim().toLowerCase()).filter(addr => addr.length > 0);
      const normalizedValues = value.map(v => v.toLowerCase());
      const validAddresses = addresses.filter(addr => 
        isValidWalletAddress(addr) && !normalizedValues.includes(addr)
      );
      if (validAddresses.length > 0) {
        onChange([...value, ...validAddresses]);
      } else if (addresses.length > 0) {
        setError('Aucune adresse valide trouvée dans le collage');
      }
    }
  };

  const removeChip = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="chips-input-root">
      <FaWallet className="chips-input-icon" />
      <div className="chips-list">
        {value.map((chip, idx) => (
          <span className="chip" key={chip+idx} title={chip}>
            {chip.length > 12 ? chip.slice(0, 6) + '...' + chip.slice(-4) : chip}
            <button type="button" className="chip-remove" onClick={() => removeChip(idx)} aria-label="Supprimer">
              <FaTimes />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={`chips-input ${error ? 'chips-input-error' : ''}`}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : ''}
          aria-label="Ajouter un destinataire"
          aria-invalid={error ? 'true' : 'false'}
        />
      </div>
      {error && (
        <div className="chips-input-error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
} 