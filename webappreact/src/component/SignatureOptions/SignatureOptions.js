import React from 'react';
import './SignatureOptions.css';

const SignatureOptions = ({ onOptionSelect, activeOption }) => {
  const options = [
    { id: 'text', icon: '📝', label: 'Texte', description: 'Signer un message texte' },
    { id: 'mail', icon: '📧', label: 'Mail', description: 'Signer un email Gmail' },
    { id: 'pdf', icon: '📄', label: 'PDF', description: 'Signer un document PDF' }
  ];

  return (
    <div className="signature-options">
      <h3>Choisissez votre type de signature :</h3>
      <div className="options-bar">
        {options.map((option) => (
          <div
            key={option.id}
            className={`option-card ${activeOption === option.id ? 'active' : ''}`}
            onClick={() => onOptionSelect(option.id)}
          >
            <div className="option-icon">{option.icon}</div>
            <div className="option-label">{option.label}</div>
            <div className="option-description">{option.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignatureOptions; 