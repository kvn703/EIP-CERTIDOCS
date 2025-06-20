import React from 'react';
import './NavigationBar.css';

const NavigationBar = ({ activeOption, onOptionSelect }) => {
  return (
    <div className="navigation-bar">
      <div 
        className={`nav-item ${activeOption === 'text' ? 'active' : ''}`} 
        onClick={() => onOptionSelect('text')}
      >
        <i className="fas fa-file-alt"></i>
        <span>Texte</span>
      </div>
      <div 
        className={`nav-item ${activeOption === 'mail' ? 'active' : ''}`} 
        onClick={() => onOptionSelect('mail')}
      >
        <i className="fas fa-envelope"></i>
        <span>Mail</span>
      </div>
      <div 
        className={`nav-item ${activeOption === 'pdf' ? 'active' : ''}`} 
        onClick={() => onOptionSelect('pdf')}
      >
        <i className="fas fa-file-pdf"></i>
        <span>PDF</span>
      </div>
    </div>
  );
};

export default NavigationBar; 