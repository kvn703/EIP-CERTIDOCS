import React from 'react';
import { FaImage, FaFont } from 'react-icons/fa';
import './FormatToggle.css';

const FormatToggle = ({ value = false, onChange }) => {
  // value peut être null (optionnel), false (Image) ou true (Textuel)
  // Par défaut, on affiche Image comme actif si value est null ou false
  const isImageActive = value === null || value === false;
  const isTextuelActive = value === true;
  
  return (
    <div className="format-toggle-container">
      <div className="format-toggle-switch">
        <button
          type="button"
          className={`format-toggle-option ${isImageActive ? 'active' : ''}`}
          onClick={() => onChange(false)}
          aria-label="Format Image"
        >
          <FaImage className="format-toggle-icon" />
          <span>Image</span>
        </button>
        <button
          type="button"
          className={`format-toggle-option ${isTextuelActive ? 'active' : ''}`}
          onClick={() => onChange(true)}
          aria-label="Format textuel"
        >
          <FaFont className="format-toggle-icon" />
          <span>Textuel</span>
        </button>
      </div>
    </div>
  );
};

export default FormatToggle;

