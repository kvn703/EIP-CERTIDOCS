import React, { useState, useEffect } from 'react';
import './GmailDetector.css';

const GmailDetector = ({ onGmailDetected, onNoGmail }) => {
  const [isDetecting, setIsDetecting] = useState(true);
  const [gmailDetected, setGmailDetected] = useState(false);
  const [detectionStep, setDetectionStep] = useState(0);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Simulation de la détection avec étapes progressives
    const detectGmail = async () => {
      const steps = [
        { message: "🔍 Initialisation de la détection...", delay: 800 },
        { message: "📧 Recherche d'onglets Gmail...", delay: 1200 },
        { message: "🔗 Vérification de la connexion...", delay: 1000 },
        { message: "✅ Analyse du contenu...", delay: 1500 }
      ];

      for (let i = 0; i < steps.length; i++) {
        setDetectionStep(i);
        await new Promise(resolve => setTimeout(resolve, steps[i].delay));
      }

      // Simulation : 70% de chance de détecter Gmail
      const hasGmail = Math.random() > 0.3;
      
      setIsDetecting(false);
      setGmailDetected(hasGmail);
      
      if (hasGmail) {
        onGmailDetected();
      } else {
        onNoGmail();
        // Afficher l'erreur après un délai
        setTimeout(() => setShowError(true), 500);
      }
    };

    detectGmail();
  }, [onGmailDetected, onNoGmail]);

  const retryDetection = () => {
    setIsDetecting(true);
    setGmailDetected(false);
    setDetectionStep(0);
    setShowError(false);
    
    // Relancer la détection
    setTimeout(() => {
      const hasGmail = Math.random() > 0.3;
      setIsDetecting(false);
      setGmailDetected(hasGmail);
      
      if (hasGmail) {
        onGmailDetected();
      } else {
        onNoGmail();
        setTimeout(() => setShowError(true), 500);
      }
    }, 2000);
  };

  if (isDetecting) {
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
  }

  return (
    <div className="gmail-detector modern">
      {gmailDetected ? (
        <div className="gmail-detected success-animation">
          <div className="success-animation-container">
            <div className="success-circle">
              <i className="fas fa-check"></i>
            </div>
            <div className="success-ripple"></div>
          </div>
          
          <div className="detection-content">
            <h3 className="success-title">
              <i className="fas fa-envelope-open"></i>
              Gmail détecté avec succès !
            </h3>
            <p className="success-message">
              Nous avons trouvé Gmail ouvert dans un autre onglet.
            </p>
            <div className="success-features">
              <div className="feature-item">
                <i className="fas fa-signature"></i>
                <span>Signature d'emails en un clic</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-shield-alt"></i>
                <span>Authentification blockchain</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <span>Horodatage automatique</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="gmail-not-detected">
          <div className="error-animation-container">
            <div className="error-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="error-pulse"></div>
          </div>
          
          <div className="detection-content">
            <h3 className="error-title">
              <i className="fas fa-envelope-slash"></i>
              Aucun Gmail détecté
            </h3>
            <p className="error-message">
              Nous n'avons pas trouvé Gmail ouvert dans vos onglets.
            </p>
            
            {showError && (
              <div className="error-details slide-in">
                <div className="error-card">
                  <h4>Pour utiliser la signature Gmail :</h4>
                  <ul>
                    <li>
                      <i className="fas fa-external-link-alt"></i>
                      Ouvrez Gmail dans un nouvel onglet
                    </li>
                    <li>
                      <i className="fas fa-edit"></i>
                      Rédigez ou ouvrez un email à signer
                    </li>
                    <li>
                      <i className="fas fa-refresh"></i>
                      Revenez ici et cliquez sur "Réessayer"
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            <div className="action-buttons">
              <button className="retry-btn" onClick={retryDetection}>
                <i className="fas fa-redo"></i>
                Réessayer la détection
              </button>
              <button className="manual-btn" onClick={() => onNoGmail()}>
                <i className="fas fa-keyboard"></i>
                Utiliser l'option Texte
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GmailDetector; 