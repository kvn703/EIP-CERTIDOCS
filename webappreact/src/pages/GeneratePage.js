// src/pages/GeneratePage.js
import React, { useEffect, useState } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import "../CSS/modern2025.css";
import "../CSS/generateLayout.css";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import { useAppKitAccount, useDisconnect, modal } from "@reown/appkit/react";
import MailSection from '../component/MailSection';
import TexteSection from '../component/TexteSection';
import Tabs from '../component/Tabs';
import '../component/Tabs.css';
import { FaWallet, FaSignOutAlt, FaCog, FaRegCopy, FaEye, FaInbox, FaEdit, FaFileAlt, FaCamera } from "react-icons/fa";
import confetti from "canvas-confetti";
import PDFSection from '../component/PdfPage/PDFSection';
import ImageSection from '../component/PdfPage/ImageSection';
import SignatureCard from '../component/SignatureCard';
import HeaderExpert from '../component/HeaderExpert';
import Timeline from '../component/Timeline';
import StickyButton from '../component/StickyButton';
import ResultModal from '../component/ResultModal';
import FormatToggle from '../component/FormatToggle';

const GeneratePage = () => {
    const [expiration, setExpiration] = useState("3600");
    const { isConnected, address } = useAppKitAccount();
    const { disconnect } = useDisconnect();
    const [activeTab, _setActiveTab] = useState(0);
    const [mailMessage, setMailMessage] = useState("");
    const [texteValue, setTexteValue] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [copyStatus, setCopyStatus] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [signed, setSigned] = useState(false);
    const [signature, setSignature] = useState("");
    const [pdfFile, _setPdfFile] = useState(null);
    const [imageFile, _setImageFile] = useState(null);
    // Format par défaut : false = PNG (image), true = Textuel
    // null = aucun format choisi (optionnel, utilise le défaut du système)
    const [IsString, setIsString] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const [buttonEnabledState, setButtonEnabledState] = useState(false); // État React pour forcer le re-render

    useEffect(() => {
        if (isConnected) {
            window.dispatchEvent(new Event('walletConnected'));
        }
    }, [isConnected]);

    const setPdfFile = (file) => {
        _setPdfFile(file);
        window.dispatchEvent(new CustomEvent('pdfFileSelected', { detail: file }));
    };

    const setActiveTab = (index) => {
        _setActiveTab(index);
        if (index === 0) {
            setIsString(null); // Reset IsString when switching to Mail tab (format non applicable)
        } else {
            // Pour les autres tabs, réinitialiser à null (optionnel) au lieu de false
            setIsString(null);
        }
        window.dispatchEvent(new CustomEvent('tabChanged', { detail: index }));
    };

    const setImageFile = (file) => {
        _setImageFile(file);
        window.dispatchEvent(new CustomEvent('imageFileSelected', { detail: file }));
    };

    useEffect(() => {
        // Ici, tu dois mettre la logique qui récupère le message de confirmation
        // Par exemple, depuis une API, un state global, etc.
        // Pour l'exemple, on check si le message de confirmation est dans le DOM
        const confirmationDiv = document.getElementById("confirmationMessage");
        if (confirmationDiv && confirmationDiv.style.display !== "none") {
            setMailMessage("Votre message a bien été récupéré.");
            setActiveTab(0); // Onglet Mail par défaut
        } else {
            setMailMessage("");
            setActiveTab(1); // Onglet Texte par défaut
        }
    }, []);

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
            // On notifie aussi script.js (pour reset UI côté vanilla)
            window.dispatchEvent(new Event('walletDisconnected'));
        } catch (error) {
            console.error("Erreur pendant la déconnexion :", error);
        }
    };

    const launchConfetti = () => {
        confetti({
            particleCount: 32,
            spread: 60,
            origin: { y: 0.3 },
            colors: ["#9584ff", "#b8aaff", "#edeafd", "#7fffa7"],
            scalar: 0.7,
            ticks: 60,
            zIndex: 1000,
        });
    };

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopyStatus("copied");
            setShowTooltip(true);
            launchConfetti();
            setTimeout(() => {
                setCopyStatus("");
                setShowTooltip(false);
            }, 1200);
        }
    };

    function isProbablyHash(str) {
        return (
            (str && str.length > 32 && /^[a-f0-9]+$/i.test(str)) ||
            (str && str.length > 32 && /^[A-Za-z0-9+/=]+$/.test(str) && !str.includes(' '))
        );
    }



    const tabs = [
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaInbox style={{ fontSize: '16px' }} />
                    <span>Mail</span>
                </div>
            ),
            content: <MailSection message={mailMessage} isConnected={isConnected} active={activeTab === 0} />,
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaEdit style={{ fontSize: '16px' }} />
                    <span>Texte</span>
                </div>
            ),
            content: <TexteSection value={texteValue} onChange={e => setTexteValue(e.target.value)} />,
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaFileAlt style={{ fontSize: '16px' }} />
                    <span>PDF</span>
                </div>
            ),
            content: <PDFSection value={pdfFile} onChange={setPdfFile} />,
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCamera style={{ fontSize: '16px' }} />
                    <span>Image</span>
                </div>
            ),
            content: <ImageSection value={imageFile} onChange={setImageFile} />,
        },
    ];

    useEffect(() => {
        if (signed) {
            // Animation terminée, pas de scroll
        }
    }, [signed]);

    // Scroll reveal effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    // Notifier script.js que le bouton est prêt
    useEffect(() => {
        const signBtn = document.getElementById("signMessage");
        if (signBtn) {
            // Émettre un événement pour que script.js attache l'event listener
            window.dispatchEvent(new CustomEvent('signMessageButtonReady', { 
                detail: { button: signBtn } 
            }));
        }
    }, []); // S'exécute une fois au montage du composant

    // Détecter si le contenu dépasse pour afficher le bouton sticky
    useEffect(() => {
        const checkContentHeight = () => {
            const container = document.querySelector('.container.perspective-container');
            if (container) {
                const containerHeight = container.scrollHeight;
                const viewportHeight = window.innerHeight;
                // Afficher le bouton sticky seulement si le contenu dépasse de plus de 100px
                setShowStickyButton(containerHeight > viewportHeight - 100);
            }
        };

        checkContentHeight();
        
        // Réexécuter lors du resize et après un délai pour laisser le temps au contenu de se charger
        window.addEventListener('resize', checkContentHeight);
        const timeout = setTimeout(checkContentHeight, 500);
        
        // Observer les changements dans le container
        const container = document.querySelector('.container.perspective-container');
        if (container) {
            const observer = new MutationObserver(checkContentHeight);
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: true
            });
            return () => {
                window.removeEventListener('resize', checkContentHeight);
                clearTimeout(timeout);
                observer.disconnect();
            };
        }
        
        return () => {
            window.removeEventListener('resize', checkContentHeight);
            clearTimeout(timeout);
        };
    }, [texteValue, mailMessage, pdfFile, imageFile, activeTab]);

    // Écouter les changements du DOM pour détecter la signature générée par script.js
    useEffect(() => {
        const checkForSignature = () => {
            const statusEl = document.getElementById("status");
            const signatureIdEl = statusEl?.querySelector(".signature-id");
            
            if (signatureIdEl) {
                const signatureId = signatureIdEl.getAttribute("title") || signatureIdEl.textContent;
                if (signatureId && !signed) {
                    setSignature(signatureId);
                    setSigned(true);
                    setIsGenerating(false);
                    setIsSuccess(true);
                    setIsModalOpen(true);
                    // Reset success state après 3 secondes
                    setTimeout(() => setIsSuccess(false), 3000);
                }
            }
        };

        // Vérifier immédiatement
        checkForSignature();

        // Observer les changements dans le DOM
        const observer = new MutationObserver(() => {
            checkForSignature();
        });

        const statusEl = document.getElementById("status");
        if (statusEl) {
            observer.observe(statusEl, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }

        // Écouter les événements personnalisés
        const handleSignatureGenerated = (event) => {
            if (event.detail?.signatureId) {
                setSignature(event.detail.signatureId);
                setSigned(true);
                setIsGenerating(false);
                setIsSuccess(true);
                setIsModalOpen(true);
                setTimeout(() => setIsSuccess(false), 3000);
            }
        };

        window.addEventListener('signatureGenerated', handleSignatureGenerated);

        return () => {
            observer.disconnect();
            window.removeEventListener('signatureGenerated', handleSignatureGenerated);
        };
    }, [signed]);

    // Détecter quand la génération commence (quand le bouton est cliqué)
    useEffect(() => {
        const handleButtonClick = () => {
            setIsGenerating(true);
            setIsSuccess(false);
        };

        const signBtn = document.getElementById("signMessage");
        if (signBtn) {
            signBtn.addEventListener('click', handleButtonClick);
        }

        return () => {
            if (signBtn) {
                signBtn.removeEventListener('click', handleButtonClick);
            }
        };
    }, []);

    // État pour forcer la mise à jour de la timeline
    const [currentStep, setCurrentStep] = useState(1);

    // Calcul et mise à jour de l'étape actuelle pour la timeline
    useEffect(() => {
        const calculateStep = () => {
            // Vérifier aussi dans le DOM au cas où les états React ne sont pas à jour
            const statusEl = document.getElementById("status");
            const hasSignatureInDOM = statusEl?.querySelector(".signature-id") !== null;
            const signatureCard = document.querySelector('[aria-label*="Empreinte"]');
            
            // Étape 3 : Empreinte générée
            if ((signed && signature) || hasSignatureInDOM || signatureCard) {
                setCurrentStep(3);
                return;
            }
            
            // Étape 2 : Contenu saisi (vérifier tous les inputs possibles)
            const hasTextContent = texteValue && texteValue.trim().length > 0;
            const hasMailContent = mailMessage && mailMessage.trim().length > 0;
            const hasPdfContent = pdfFile !== null;
            const hasImageContent = imageFile !== null;
            const recipientsInput = document.getElementById("recipientsInput");
            const hasRecipients = recipientsInput && recipientsInput.value && recipientsInput.value.trim().length > 0;
            
            if (hasTextContent || hasMailContent || hasPdfContent || hasImageContent || hasRecipients) {
                setCurrentStep(2);
                return;
            }
            
            // Étape 1 : Génération (début)
            setCurrentStep(1);
        };

        calculateStep();
        
        // Réexécuter périodiquement pour capturer les changements du DOM
        const interval = setInterval(calculateStep, 300);
        
        return () => clearInterval(interval);
    }, [signed, signature, texteValue, mailMessage, pdfFile, imageFile, activeTab]);

    // Fonction pour déterminer si le bouton peut être activé
    // IMPORTANT: Cette fonction ne dépend PAS de IsString (format choisi)
    // Le format (Image/Textuel) est optionnel et ne bloque pas l'activation du bouton
    const isButtonEnabled = () => {
        // Le wallet doit être connecté
        if (!isConnected) {
            console.log("❌ Bouton désactivé: Wallet non connecté");
            return false;
        }

        // Vérifier les destinataires (requis pour tous les onglets)
        const recipientsInput = document.getElementById("recipientsInput");
        const hasRecipients = recipientsInput && recipientsInput.value && recipientsInput.value.trim().length > 0;
        if (!hasRecipients) {
            console.log("❌ Bouton désactivé: Pas de destinataires");
            return false;
        }

        // Vérifier selon l'onglet actif (indépendamment du format IsString)
        if (activeTab === 0) {
            // Onglet Mail - besoin de mailMessage
            const enabled = !!mailMessage && mailMessage.trim().length > 0;
            if (!enabled) console.log("❌ Bouton désactivé: Pas de message mail");
            return enabled;
        } else if (activeTab === 1) {
            // Onglet Texte - vérifier à la fois texteValue (React) et messageInput (DOM)
            // Le bouton fonctionne indépendamment du format (Image ou Textuel)
            const messageInput = document.getElementById("messageInput");
            const hasMessageInDOM = messageInput && messageInput.value && messageInput.value.trim().length > 0;
            const hasMessageInState = !!texteValue && texteValue.trim().length > 0;
            const enabled = hasMessageInState || hasMessageInDOM;
            if (!enabled) {
                console.log("❌ Bouton désactivé: Pas de message texte", { hasMessageInState, hasMessageInDOM, IsString });
            } else {
                console.log("✅ Bouton activé: Message texte présent", { hasMessageInState, hasMessageInDOM, IsString });
            }
            return enabled;
        } else if (activeTab === 2) {
            // Onglet PDF - besoin de pdfFile (indépendamment du format)
            const enabled = pdfFile !== null;
            if (!enabled) console.log("❌ Bouton désactivé: Pas de fichier PDF");
            return enabled;
        } else if (activeTab === 3) {
            // Onglet Image - besoin de imageFile (indépendamment du format)
            // Le bouton doit être disponible dès qu'un fichier image est sélectionné
            const enabled = imageFile !== null;
            if (!enabled) console.log("❌ Bouton désactivé: Pas de fichier image");
            return enabled;
        }
        
        console.log("❌ Bouton désactivé: Aucun onglet valide");
        return false;
    };

    // Mettre à jour le bouton caché quand les conditions changent
    useEffect(() => {
        const updateButtonState = () => {
            const signBtn = document.getElementById("signMessage");
            if (signBtn) {
                // Vérifier les destinataires
                const recipientsInput = document.getElementById("recipientsInput");
                const hasRecipients = recipientsInput && recipientsInput.value && recipientsInput.value.trim().length > 0;
                
                // Vérifier le message selon l'onglet
                const messageInput = document.getElementById("messageInput");
                const hasMessage = messageInput && messageInput.value && messageInput.value.trim().length > 0;
                
                // IMPORTANT: Le format (IsString) est OPTIONNEL et ne doit PAS bloquer l'activation du bouton
                // Synchroniser la checkbox avec IsString (indépendamment du format, le bouton doit fonctionner)
                // Si IsString est null (optionnel), on utilise false (Image) par défaut
                const checkbox = document.getElementById("signatureCheckbox");
                if (checkbox) {
                    // La checkbox doit être checked seulement si IsString est explicitement true (Textuel)
                    // Si IsString est null ou false, la checkbox est unchecked (Image par défaut)
                    checkbox.checked = IsString === true;
                    console.log("📋 Checkbox synchronisée:", { IsString, checked: checkbox.checked, activeTab });
                }
                
                // Calculer si le bouton doit être activé (SANS vérifier IsString)
                let enabled = false;
                if (isConnected && hasRecipients) {
                    if (activeTab === 0) {
                        // Onglet Mail
                        enabled = !!mailMessage && mailMessage.trim().length > 0;
                    } else if (activeTab === 1) {
                        // Onglet Texte - vérifier à la fois texteValue (React) et messageInput (DOM)
                        // Le bouton fonctionne indépendamment du format (Image ou Textuel)
                        // IsString n'est PAS vérifié ici - le format est optionnel
                        enabled = (!!texteValue && texteValue.trim().length > 0) || hasMessage;
                    } else if (activeTab === 2) {
                        // Onglet PDF - disponible dès qu'un fichier est sélectionné (indépendamment du format)
                        enabled = pdfFile !== null;
                    } else if (activeTab === 3) {
                        // Onglet Image - disponible immédiatement dès qu'un fichier est sélectionné
                        // Fonctionne pour Image ET Textuel, pas besoin d'attendre de validation
                        enabled = imageFile !== null;
                    }
                }
                
                console.log("🔘 État du bouton:", { 
                    enabled, 
                    isConnected, 
                    hasRecipients, 
                    activeTab, 
                    IsString, 
                    texteValue: !!texteValue, 
                    hasMessage,
                    pdfFile: !!pdfFile,
                    imageFile: !!imageFile 
                });
                
                signBtn.disabled = !enabled;
                
                // Mettre à jour aussi l'état React pour le bouton sticky
                setButtonEnabledState(enabled);
            }
        };

        // Mettre à jour immédiatement
        updateButtonState();

        // Écouter les changements dans les champs
        const recipientsInput = document.getElementById("recipientsInput");
        const messageInput = document.getElementById("messageInput");
        
        if (recipientsInput) {
            recipientsInput.addEventListener('input', updateButtonState);
            recipientsInput.addEventListener('change', updateButtonState);
        }
        
        if (messageInput) {
            messageInput.addEventListener('input', updateButtonState);
            messageInput.addEventListener('change', updateButtonState);
        }

        // Écouter les événements de sélection de fichier image
        const handleImageFileSelected = () => {
            // Mettre à jour immédiatement quand un fichier image est sélectionné
            setTimeout(updateButtonState, 0);
        };
        window.addEventListener('imageFileSelected', handleImageFileSelected);

        // Réexécuter périodiquement pour capturer les changements (intervalle réduit pour réactivité)
        const interval = setInterval(updateButtonState, 100);

        return () => {
            if (recipientsInput) {
                recipientsInput.removeEventListener('input', updateButtonState);
                recipientsInput.removeEventListener('change', updateButtonState);
            }
            if (messageInput) {
                messageInput.removeEventListener('input', updateButtonState);
                messageInput.removeEventListener('change', updateButtonState);
            }
            window.removeEventListener('imageFileSelected', handleImageFileSelected);
            clearInterval(interval);
        };
    }, [isConnected, texteValue, mailMessage, pdfFile, imageFile, activeTab]); // IsString retiré des dépendances car le format est optionnel

    // Forcer la mise à jour du bouton sticky quand les conditions changent (sans dépendre de IsString)
    useEffect(() => {
        // Mettre à jour l'état React pour forcer le re-render du bouton sticky
        // Le format (IsString) ne doit pas affecter l'activation du bouton
        const updateButtonEnabledState = () => {
            const enabled = isButtonEnabled();
            setButtonEnabledState(enabled);
            console.log("🔄 Mise à jour état bouton sticky:", { enabled, IsString, activeTab });
        };
        
        // Mettre à jour immédiatement
        updateButtonEnabledState();
        
        // Mettre à jour périodiquement pour capturer les changements
        const interval = setInterval(updateButtonEnabledState, 200);
        
        return () => clearInterval(interval);
    }, [isConnected, texteValue, mailMessage, pdfFile, imageFile, activeTab]); // IsString délibérément omis

    return (
        <>
            <HeaderExpert />
            <div className="generate-page-wrapper">
                <div className="generate-container perspective-container">

                    {/* Timeline - Parcours utilisateur */}
                    <div className="generate-timeline-section">
                        <Timeline currentStep={currentStep} />
                    </div>

                    {/* Sélection du type de contenu */}
                    <div className="generate-tabs-section">
                        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
                    </div>

                    {/* Layout horizontal pour utiliser la largeur */}
                    <div className="generate-modern-inputs">
                        {/* Saisie du contenu (conditionnel selon l'onglet) */}
                        {!mailMessage && activeTab === 1 && (
                            <div className="modern-input-card modern-input-card-primary">
                                <div className="modern-input-icon">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="modern-input-content">
                                    <label className="modern-input-label" htmlFor="messageInput">
                                        Votre message
                                    </label>
                                    <div className="modern-input-wrapper">
                                        <CustomTextInput
                                            id="messageInput"
                                            rows="3"
                                            placeholder="Saisissez votre message..."
                                            value={texteValue}
                                            onChange={(e) => setTexteValue(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div id="confirmationMessage" style={{ display: 'none' }}></div>

                        {/* Séparateur visuel élégant */}
                        {!mailMessage && activeTab === 1 && (
                            <div className="modern-input-divider">
                                <div className="modern-input-divider-line"></div>
                                <div className="modern-input-divider-dot"></div>
                                <div className="modern-input-divider-line"></div>
                            </div>
                        )}

                        {/* Configuration - Destinataires */}
                        <div className="modern-input-card modern-input-card-secondary">
                            <div className="modern-input-icon">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div className="modern-input-content">
                                <label className="modern-input-label" htmlFor="recipientsInput">
                                    Destinataires autorisés
                                </label>
                                <div className="modern-input-wrapper">
                                    <CustomTextInput 
                                        id="recipientsInput" 
                                        placeholder="0x1234..., 0x5678..." 
                                    />
                                </div>
                                <p className="modern-input-hint info-tooltip">
                                    <span>Séparées par des virgules</span>
                                    <span className="info-tooltip-content">Format attendu : 0x1234..., 0x5678..., etc.</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Options - Format d'empreinte (optionnel, pour tous les onglets sauf Mail) */}
                    {activeTab !== 0 && (
                        <>
                            <div className="generate-options-card">
                                <div className="format-toggle-optional-label">
                                    <span>Format d'empreinte</span>
                                    <span className="format-toggle-optional-hint">(optionnel)</span>
                                </div>
                                <FormatToggle 
                                    value={IsString === null ? false : IsString} 
                                    onChange={(value) => {
                                        setIsString(value);
                                    }} 
                                />
                                {/* Checkbox cachée pour script.js - synchronisée avec IsString */}
                                <input
                                    type="checkbox"
                                    id="signatureCheckbox"
                                    checked={IsString === true}
                                    onChange={() => {}}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            
                            {/* Bouton Sticky - Placé juste en dessous du FormatToggle, en dehors du conteneur */}
                            {(() => {
                                const buttonEnabled = isButtonEnabled();
                                console.log("🎨 Rendu bouton sticky:", { 
                                    buttonEnabled, 
                                    disabled: !buttonEnabled,
                                    isConnected, 
                                    activeTab, 
                                    IsString,
                                    texteValue: !!texteValue,
                                    mailMessage: !!mailMessage,
                                    pdfFile: !!pdfFile,
                                    imageFile: !!imageFile
                                });
                                return null;
                            })()}
                            <StickyButton
                                onClick={async () => {
                                    // IMPORTANT: Le format (IsString) est OPTIONNEL - ne pas vérifier ici
                                    // Vérifier que le bouton peut être activé (sans dépendre de IsString)
                                    const buttonEnabled = isButtonEnabled();
                                    console.log("🔍 Vérification avant clic:", { 
                                        buttonEnabled, 
                                        isConnected, 
                                        activeTab, 
                                        IsString,
                                        texteValue: !!texteValue,
                                        mailMessage: !!mailMessage,
                                        pdfFile: !!pdfFile,
                                        imageFile: !!imageFile
                                    });
                                    
                                    if (!buttonEnabled) {
                                        console.warn("❌ Bouton désactivé - conditions non remplies (format non requis)");
                                        return;
                                    }
                                    
                                    console.log("🖱️ Clic sur le bouton sticky - Génération d'empreinte...");
                                    
                                    // S'assurer que la checkbox est correctement synchronisée (même si IsString est null)
                                    const checkbox = document.getElementById("signatureCheckbox");
                                    if (checkbox) {
                                        // Si IsString est null, utiliser false (Image) par défaut
                                        checkbox.checked = IsString === true;
                                        console.log("📋 Checkbox mise à jour avant signature:", { IsString, checked: checkbox.checked });
                                    }
                                    
                                    // Activer le bouton caché avant de cliquer
                                    const signBtn = document.getElementById("signMessage");
                                    if (signBtn) {
                                        // Forcer l'activation du bouton (le format est optionnel)
                                        signBtn.disabled = false;
                                        
                                        // Marquer comme en cours de génération AVANT le clic
                                        setIsGenerating(true);
                                        
                                        // Vérifier si la fonction signMessage existe globalement
                                        if (typeof window.signMessage === 'function') {
                                            console.log("✅ Appel direct de signMessage()");
                                            try {
                                                await window.signMessage();
                                            } catch (error) {
                                                console.error("❌ Erreur lors de l'appel de signMessage:", error);
                                                setIsGenerating(false);
                                            }
                                        } else {
                                            // Fallback : cliquer sur le bouton caché
                                            console.log("📌 Utilisation du clic sur le bouton caché");
                                            signBtn.click();
                                        }
                                    } else {
                                        console.error("❌ Bouton signMessage introuvable dans le DOM");
                                        setIsGenerating(false);
                                    }
                                }}
                                disabled={!buttonEnabledState}
                                isLoading={isGenerating}
                                isSuccess={isSuccess}
                            />
                        </>
                    )}

                    {/* Bouton de génération (caché, utilisé par script.js) */}
                    <button
                        id="signMessage"
                        className="button-3d gpu-accelerated interaction-debounce scroll-reveal transform-3d-hover micro-interaction"
                        disabled={!isButtonEnabled()}
                        style={{ 
                            display: 'none', // Caché mais toujours dans le DOM pour script.js
                        }}
                    >
                        GÉNÉRER EMPREINTE
                    </button>


                    {/* Ancienne modale supprimée - maintenant dans ResultModal */}
                    <p id="status" className="gpu-accelerated" style={{ display: 'none' }}></p>
                    <div id="copyMessage" className="gpu-accelerated" style={{ display: 'none' }}></div>
                </div>
            </div>

            {/* Modal pour afficher le résultat */}
            <ResultModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                signature={signature}
                onCopy={launchConfetti}
                isString={IsString}
                activeTab={activeTab}
            />
        </>
    );
};

export default GeneratePage;
