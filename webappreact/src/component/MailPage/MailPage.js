import React, { useState } from "react";
import "../../CSS/signature-forms.css";
import "./MailPage.css";
import CustomText from "../CustomText";

const MailPage = ({ gmailAvailable }) => {
  return (
    <div className="signature-form">
      <div className="gmail-integration">
        {gmailAvailable ? (
          <div className="gmail-success-state">
            <div className="gmail-success-header">
              <div className="success-badge">
                <i className="fas fa-check-circle"></i>
                <span>Email Gmail récupéré avec succès</span>
              </div>
            </div>
            
            <div className="gmail-content">
              <h3>📧 Signature d'email Gmail</h3>
              <p className="gmail-status-message">
                <i className="fas fa-link"></i>
                Votre email Gmail a bien été récupéré et est prêt à être signé !
              </p>
              
              <div className="gmail-actions">
                <button className="gmail-action-btn primary">
                  <i className="fas fa-signature"></i>
                  Signer l'email actuel
                </button>
                <button className="gmail-action-btn secondary">
                  <i className="fas fa-highlighter"></i>
                  Signer la sélection
                </button>
                <button className="gmail-action-btn secondary">
                  <i className="fas fa-cog"></i>
                  Configurer la signature automatique
                </button>
              </div>

              <div className="gmail-features">
                <div className="feature-highlight">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <strong>Authentification blockchain</strong>
                    <span>Vos signatures sont sécurisées et vérifiables</span>
                  </div>
                </div>
                <div className="feature-highlight">
                  <i className="fas fa-clock"></i>
                  <div>
                    <strong>Horodatage automatique</strong>
                    <span>Chaque signature est horodatée précisément</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="gmail-error-state">
            <div className="gmail-error-header">
              <div className="error-badge">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Erreur de détection Gmail</span>
              </div>
            </div>
            
            <div className="gmail-content">
              <h3>📧 Signature d'email Gmail</h3>
              <p className="gmail-status-message error">
                <i className="fas fa-times-circle"></i>
                Impossible de détecter Gmail. Veuillez vérifier que Gmail est ouvert dans un autre onglet.
              </p>
              
              <div className="gmail-instructions">
                <h4>Comment résoudre le problème :</h4>
                <ol>
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
                </ol>
              </div>

              <button className="gmail-action-btn primary" onClick={() => window.location.reload()}>
                <i className="fas fa-redo"></i>
                Réessayer la détection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailPage; 