import React from 'react';
import { FaImage, FaFont } from 'react-icons/fa';
import './FormatToggle.css';

const FormatToggle = ({ value = false, onChange }) => {
  // value peut être null (optionnel), false (Image) ou true (Textuel)
  // Par défaut, on affiche Image comme actif si value est null ou false
  const isImageActive = value === null || value === false;
  const isTextuelActive = value === true;
  
  const handleClick = (newValue) => {
    // Smooth transition
    const buttons = document.querySelectorAll('.format-toggle-option');
    buttons.forEach(btn => {
      btn.style.opacity = '0.5';
      btn.style.transform = 'scale(0.95)';
    });
    
    setTimeout(() => {
      onChange(newValue);
      setTimeout(() => {
        buttons.forEach(btn => {
          btn.style.opacity = '1';
          btn.style.transform = '';
        });
      }, 50);
    }, 200);
  };
  
  return (
    <div className="format-toggle-container">
      <div className="format-toggle-switch">
        <button
          type="button"
          className={`format-toggle-option ${isImageActive ? 'active' : ''}`}
          onClick={() => handleClick(false)}
          aria-label="Format Image"
        >
          <FaImage className="format-toggle-icon" />
          <span>Image</span>
        </button>
        <button
          type="button"
          className={`format-toggle-option ${isTextuelActive ? 'active' : ''}`}
          onClick={() => handleClick(true)}
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

