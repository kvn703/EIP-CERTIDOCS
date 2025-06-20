import React from 'react';
import '../CSS/particles.css';

const Particles = () => {
  return (
    <div className="particles-container">
      {/* Particules principales */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      
      {/* Particules secondaires */}
      <div className="particle-secondary"></div>
      <div className="particle-secondary"></div>
      <div className="particle-secondary"></div>
      <div className="particle-secondary"></div>
      <div className="particle-secondary"></div>
      
      {/* Particules tertiaires */}
      <div className="particle-tertiary"></div>
      <div className="particle-tertiary"></div>
      <div className="particle-tertiary"></div>
      <div className="particle-tertiary"></div>
      <div className="particle-tertiary"></div>
      
      {/* Effets de lumière */}
      <div className="light-effect"></div>
      <div className="light-effect"></div>
    </div>
  );
};

export default Particles; 