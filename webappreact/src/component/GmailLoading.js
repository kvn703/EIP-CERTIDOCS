import React, { useState, useEffect } from 'react';
import '../CSS/GmailDetector.css';

const GmailLoading = ({ onFinish }) => {
  const [detectionStep, setDetectionStep] = useState(0);

  useEffect(() => {
    const steps = [
      { message: "🔍 Initialisation de la détection...", delay: 800 },
      { message: "📧 Recherche d'onglets Gmail...", delay: 1200 },
      { message: "🔗 Vérification de la connexion...", delay: 1000 },
      { message: "✅ Analyse du contenu...", delay: 1500 }
    ];

    let currentStep = 0;
    function nextStep() {
      if (currentStep < steps.length - 1) {
        setTimeout(() => {
          setDetectionStep(++currentStep);
          nextStep();
        }, steps[currentStep].delay);
      } else if (onFinish) {
        setTimeout(onFinish, steps[currentStep].delay);
      }
    }
    nextStep();
    // eslint-disable-next-line
  }, [onFinish]);

  const steps = [
    "🔍 Initialisation de la détection...",
    "📧 Recherche d'onglets Gmail...",
    "🔗 Vérification de la connexion...",
    "✅ Analyse du contenu..."
  ];

  return (
    <div className="gmail-detector modern">
      <div className="detection-loading">
        <div className="detection-animation">
          <div className="pulse-ring"></div>
          <div className="detection-icon">
            <i className="fas fa-search"></i>
          </div>
        </div>
        <div className="detection-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`detection-step ${index <= detectionStep ? 'active' : ''}`}
            >
              <div className="step-indicator">
                {index < detectionStep ? (
                  <i className="fas fa-check"></i>
                ) : index === detectionStep ? (
                  <div className="step-spinner"></div>
                ) : (
                  <i className="fas fa-circle"></i>
                )}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GmailLoading; 