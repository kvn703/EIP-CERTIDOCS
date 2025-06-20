import React, { useState, useEffect } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import "../CSS/signature-forms.css";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import SignatureOptions from "../component/SignatureOptions/SignatureOptions";
import GmailDetector from "../component/GmailDetector/GmailDetector";
import NavigationBar from "../component/NavigationBar/NavigationBar";
import { useAppKitAccount, useDisconnect, modal } from "@reown/appkit/react";

const HomePage = () => {
  const [expiration, setExpiration] = useState("3600");
  const [activeOption, setActiveOption] = useState('text');
  const [gmailAvailable, setGmailAvailable] = useState(false);
  const [showSignatureForm, setShowSignatureForm] = useState(true);
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) {
      window.dispatchEvent(new Event('walletConnected'));
    }
  }, [isConnected]);

  const handleOpenModal = () => {
    if (!modal) {
      console.error("modal est undefined. Appel à createAppKit manquant ?");
      return;
    }
    modal.open();
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();      
      localStorage.clear();
      console.log("Déconnecté et cache vidé.");
      window.dispatchEvent(new Event('walletDisconnected'));
    } catch (error) {
      console.error("Erreur pendant la déconnexion :", error);
    }
  };

  const handleGmailDetected = () => {
    console.log("Gmail détecté - Changement vers mail");
    setGmailAvailable(true);
    setActiveOption('mail'); // Change automatiquement vers mail
  };

  const handleNoGmail = () => {
    console.log("Gmail non détecté - Reste sur texte");
    setGmailAvailable(false);
    // Ne change pas l'option active si l'utilisateur a déjà choisi quelque chose
    if (activeOption === 'mail') {
      setActiveOption('text');
    }
  };

  const handleOptionSelect = (option) => {
    console.log("Option sélectionnée:", option);
    setActiveOption(option);
    setShowSignatureForm(true);
  };

  const renderSignatureForm = () => {
    console.log("Rendu avec activeOption:", activeOption, "Gmail disponible:", gmailAvailable);
    
    switch (activeOption) {
      case 'text':
        return (
          <div className="signature-form">
            <div className="text-success-state">
              <div className="text-success-header">
                <div className="success-badge">
                  <i className="fas fa-check-circle"></i>
                  <span>Prêt pour la signature de texte</span>
                </div>
              </div>
              
              <div className="text-content">
                <h3>📝 Signature de message texte</h3>
                <p className="text-status-message">
                  <i className="fas fa-info-circle"></i>
                  Votre message texte a bien été récupéré et est prêt à être signé.
                </p>
                
                <CustomText className="fas fa-pen" Text="Message à signer électroniquement :" />
                <CustomTextInput id="messageInput" rows="4" placeholder="Saisissez votre message..." />
                
                <CustomText className="fas fa-clock clock-icon" Text="Temps d'expiration :" />
                <select id="expirationSelect" value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                  <option value="3600">1 heure</option>
                  <option value="7200">2 heures</option>
                  <option value="10800">3 heures</option>
                  <option value="86400">1 jour</option>
                  <option value="604800">1 semaine</option>
                </select>

                <CustomText className="fas fa-user" Text="Destinataires autorisés :" />
                <CustomTextInput id="recipientsInput" placeholder="Adresse1, Adresse2, ..." />
                <p style={{ fontSize: "12px", fontStyle: "italic" }}>Séparées par des virgules</p>

                <button id="signMessage" className="gmail-action-btn primary">
                  <i className="fas fa-signature"></i>
                  🖊️ Signer et stocker sur la blockchain
                </button>
              </div>
            </div>
          </div>
        );

      case 'mail':
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

                    <CustomText className="fas fa-clock clock-icon" Text="Temps d'expiration :" />
                    <select id="expirationSelect" value={expiration} onChange={(e) => setExpiration(e.target.value)}>
                      <option value="3600">1 heure</option>
                      <option value="7200">2 heures</option>
                      <option value="10800">3 heures</option>
                      <option value="86400">1 jour</option>
                      <option value="604800">1 semaine</option>
                    </select>
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

      case 'pdf':
        return (
          <div className="signature-form">
            <div className="pdf-integration">
              <h3>📄 Signature de document PDF</h3>
              <p>Fonctionnalité PDF - Disponible prochainement</p>
              
              <div className="pdf-placeholder">
                <div className="pdf-icon">📄</div>
                <p>La signature de documents PDF sera bientôt disponible !</p>
                <p>Cette fonctionnalité vous permettra de signer vos documents PDF directement.</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="signature-form">
            <p>Sélectionnez une option dans la barre de navigation ci-dessus.</p>
          </div>
        );
    }
  };

  return (
    <Container>
      <CustomText className="" Text="CertiDocs - Signature Électronique" />
      <p id="account"></p>
      
      <div style={{ padding: 10, marginBottom: 20 }}>
        <h2>Connexion Wallet</h2>
        {isConnected ? (
          <>
            <button onClick={handleDisconnect}>Déconnecter</button>
            <button onClick={() => modal.open()}>Gérer mon wallet</button>
          </>
        ) : (
          <button onClick={handleOpenModal}>Connecter le Wallet</button>
        )}
      </div>

      {/* Barre de navigation avec icônes Font Awesome */}
      <NavigationBar 
        activeOption={activeOption}
        onOptionSelect={handleOptionSelect}
      />

      {/* Détection Gmail */}
      <GmailDetector 
        onGmailDetected={handleGmailDetected}
        onNoGmail={handleNoGmail}
      />

      {/* Options de signature */}
      <SignatureOptions 
        onOptionSelect={handleOptionSelect}
        activeOption={activeOption}
      />

      {/* Formulaire de signature selon l'option sélectionnée */}
      {renderSignatureForm()}

      <p id="status"></p>
      <div id="copyMessage"></div>
    </Container>
  );
};

export default HomePage; 