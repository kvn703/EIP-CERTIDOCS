import React, { useState, useRef } from 'react';
import { FaUser, FaTimes } from 'react-icons/fa';
import './DestinatairesChipsInput.css';

export default function DestinatairesChipsInput({ value = [], onChange, placeholder = 'Adresse1, Adresse2...' }) {
  const [input, setInput] = useState('');
  const inputRef = useRef();

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const addChip = (chip) => {
    const trimmed = chip.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
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
      pasted.split(',').forEach(addr => addChip(addr));
    }
  };

  const removeChip = (idx) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  return (
    <div className="chips-input-root">
      <FaUser className="chips-input-icon" />
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
          className="chips-input"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : ''}
          aria-label="Ajouter un destinataire"
        />
      </div>
    </div>
  );
} 