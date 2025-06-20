import React from 'react';
import './NavigationBar.css';

const NavigationBar = ({ activeOption, onOptionSelect }) => {
  return (
    <div className="navigation-bar">
      <div className="nav-item" onClick={() => onOptionSelect('text')}>
        <i className={`fas fa-file-alt ${activeOption === 'text' ? 'active' : ''}`}></i>
        <span>Texte</span>
      </div>
      <div className="nav-item" onClick={() => onOptionSelect('mail')}>
        <i className={`fas fa-envelope ${activeOption === 'mail' ? 'active' : ''}`}></i>
        <span>Mail</span>
      </div>
      <div className="nav-item" onClick={() => onOptionSelect('pdf')}>
        <i className={`fas fa-file-pdf ${activeOption === 'pdf' ? 'active' : ''}`}></i>
        <span>PDF</span>
      </div>
    </div>
  );
};

export default NavigationBar; 