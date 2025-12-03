// src/pages/VerifyPage.js
// 🎨 PAGE VÉRIFICATION - DESIGN PROFESSIONNEL 2025
// Suit la TODO liste complète : VERIFY_PAGE_IMPROVEMENTS_2025.md

import React, { useState, useEffect, useRef } from "react";
import "../CSS/style.css";
import "../CSS/copyButton.css";
import "../CSS/adresse.css";
import "../CSS/verifyLayout.css";
import CustomTextInput from "../component/CustomTextInput";
import StickyButton from "../component/StickyButton";
import { useAppKitAccount } from "@reown/appkit/react";
import { FaInbox, FaEdit, FaFileAlt, FaCamera, FaCircle, FaCheckCircle } from "react-icons/fa";
import Tabs from "../component/Tabs";
import "../component/Tabs.css";
import PDFSection from "../component/PdfPage/PDFSection";
import ImageSection from "../component/PdfPage/ImageSection";
import VerificationAnimation from "../component/VerificationAnimation";
import HeaderExpert from "../component/HeaderExpert";
import Timeline from "../component/Timeline";
import FormatToggle from "../component/FormatToggle";
import VerifyResultModal from "../component/VerifyResultModal";

function VerifyPage() {
    // ============================================
    // ÉTATS - PHASE 1 & 2
    // ============================================
    const { isConnected } = useAppKitAccount();
    const [signatureId, setSignatureId] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, _setActiveTab] = useState(0);
    const [texte1, setTexte1] = useState("");
    const [texte2, setTexte2] = useState("");
    const [pdfFile, _setPdfFile] = useState(null);
    const [imageFile, _setImageFile] = useState(null);
    const [mailContentLost, setMailContentLost] = useState(false);
    const [hasVisitedOtherTab, setHasVisitedOtherTab] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [showContentRecovered, setShowContentRecovered] = useState(true);
    const [signatureFile, _setSignatureFile] = useState(null);
    const [IsString, setIsString] = useState(false);
    const [currentStep, setCurrentStep] = useState(1); // PHASE 1.2 : Étape actuelle pour Timeline
    const [isResultModalOpen, setIsResultModalOpen] = useState(false); // PHASE 4.1
    const resultProcessedRef = useRef(false); // Pour éviter de traiter le résultat plusieurs fois

    // ============================================
    // FONCTIONS UTILITAIRES
    // ============================================
    const setActiveTab = (tabIndex) => {
        _setActiveTab(tabIndex);
        if (tabIndex === 0) {
            setIsString(false); // Reset IsString when switching to Mail tab
        }
        window.dispatchEvent(new CustomEvent('tabChanged', { detail: tabIndex }));
    };

    const setSignatureFile = (file) => {
        _setSignatureFile(file);
        window.dispatchEvent(new CustomEvent('signatureFileChanged', { detail: file }));
    };

    const setPdfFile = (file) => {
        _setPdfFile(file);
        window.dispatchEvent(new CustomEvent('pdfFileChanged', { detail: file }));
    };

    const setImageFile = (file) => {
        _setImageFile(file);
        window.dispatchEvent(new CustomEvent('imageFileChanged', { detail: file }));
    };

    // ============================================
    // EFFECTS - PHASE 1.2 : Gestion de currentStep
    // ============================================
    useEffect(() => {
        if (isConnected) {
            window.dispatchEvent(new Event('walletConnected'));
            setCurrentStep(1); // CONNEXION complétée
        } else {
            setCurrentStep(1); // En attente de connexion
        }
    }, [isConnected]);

    // PHASE 1.2 : Calculer currentStep selon la progression
    useEffect(() => {
        if (!isConnected) {
            setCurrentStep(1); // CONNEXION
        } else if (isVerifying) {
            setCurrentStep(2); // VÉRIFICATION
        } else if (verificationResult) {
            setCurrentStep(3); // RÉSULTAT
        } else if (isConnected && (signatureId || signatureFile || texte1) && (message || texte2 || pdfFile || imageFile)) {
            setCurrentStep(2); // Prêt pour vérification
        } else if (isConnected) {
            setCurrentStep(1); // CONNEXION complétée, en attente de contenu
        }
    }, [isConnected, isVerifying, verificationResult, signatureId, signatureFile, texte1, message, texte2, pdfFile, imageFile]);

    // ============================================
    // RÉCUPÉRATION DES PARAMÈTRES URL - PHASE 5.2
    // ============================================
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const signatureIdParam = urlParams.get("signatureId");
        const messageParam = urlParams.get("messageHash");
        if (signatureIdParam && messageParam) {
            setSignatureId(signatureIdParam);
            setMessage(messageParam);
            setActiveTab(0); // Onglet Mail si paramètres présents
        } else {
            setActiveTab(1); // Switch to Texte tab if no parameters
        }
    }, []);

    // ============================================
    // GESTION DU CONTENU MAIL PERDU - PHASE 5.2
    // ============================================
    useEffect(() => {
        if (activeTab === 0 && hasVisitedOtherTab && (!signatureId || !message)) {
            setMailContentLost(true);
        } else {
            setMailContentLost(false);
        }
    }, [activeTab, signatureId, message, hasVisitedOtherTab]);

    useEffect(() => {
        if (activeTab !== 0) {
            setHasVisitedOtherTab(true);
        }
    }, [activeTab]);

    // ============================================
    // DÉTECTION DU RÉSULTAT DE VÉRIFICATION - PHASE 4
    // ============================================
    useEffect(() => {
        const checkVerificationResult = () => {
            const verifyElement = document.getElementById("verify");
            if (verifyElement && !resultProcessedRef.current) {
                const text = verifyElement.innerText;
                if (text.includes("✅ Empreinte VALIDE") || text.includes("✅ Signature VALIDE")) {
                    setVerificationResult('success');
                    setIsVerifying(false);
                    setIsResultModalOpen(true); // PHASE 4.1 : Ouvrir la modal
                    resultProcessedRef.current = true;
                    verifyElement.style.display = 'none';
                    verifyElement.innerText = '';
                } else if (text.includes("❌ Empreinte NON VALIDE") || text.includes("❌ Signature NON VALIDE") || text.includes("❌ Erreur")) {
                    setVerificationResult('error');
                    setIsVerifying(false);
                    setIsResultModalOpen(true); // PHASE 4.1 : Ouvrir la modal
                    resultProcessedRef.current = true;
                    verifyElement.style.display = 'none';
                    verifyElement.innerText = '';
                }
            }
        };

        const interval = setInterval(checkVerificationResult, 500);
        return () => clearInterval(interval);
    }, [resultProcessedRef]);

    // ============================================
    // HANDLERS - PHASE 3 & 4
    // ============================================
    const handleReloadMailContent = () => {
        setIsReloading(true);
        setTimeout(() => {
            document.location.reload();
        }, 100);
    };

    const handleVerificationComplete = () => {
        setVerificationResult(null);
        setIsVerifying(false);
    };

    // ============================================
    // PHASE 7.2 : Validation et Feedback
    // ============================================
    // Validation du format de signature
    const validateSignatureFormat = (sig) => {
        if (!sig) return { isValid: false, message: '' };
        const trimmed = sig.trim();
        // Supprimer le préfixe [CERTIDOCS] si présent
        const cleaned = trimmed.startsWith("[CERTIDOCS]") 
            ? trimmed.replace("[CERTIDOCS]", "").trim()
            : trimmed;
        // Vérifier le format hexadécimal (0x suivi de 64 caractères hex)
        const isValid = /^0x[a-fA-F0-9]{64}$/.test(cleaned);
        return {
            isValid,
            message: isValid ? '' : 'Format invalide. Doit être 0x suivi de 64 caractères hexadécimaux.'
        };
    };

    // État de validation pour chaque champ
    const [signatureValidation, setSignatureValidation] = useState({ isValid: null, message: '' });

    // PHASE 9.1 : Validation en temps réel avec debounce
    useEffect(() => {
        if (activeTab === 1 || activeTab === 2 || activeTab === 3) {
            if (IsString && texte1) {
                // Debounce de 300ms pour éviter trop de validations
                const timeoutId = setTimeout(() => {
                    const validation = validateSignatureFormat(texte1);
                    setSignatureValidation(validation);
                }, 300);
                return () => clearTimeout(timeoutId);
            } else {
                setSignatureValidation({ isValid: null, message: '' });
            }
        } else {
            setSignatureValidation({ isValid: null, message: '' });
        }
    }, [texte1, IsString, activeTab]);


    // PHASE 3.2 : Logique d'activation du bouton
    const isButtonEnabled = () => {
        if (!isConnected) return false;
        
        if (activeTab === 0) {
            // Onglet Mail
            return !!(signatureId && message);
        } else if (activeTab === 1) {
            // Onglet Texte
            const hasSignature = signatureFile || (IsString && texte1 && signatureValidation.isValid);
            return !!(texte2 && hasSignature);
        } else if (activeTab === 2) {
            // Onglet PDF
            const hasSignature = signatureFile || (IsString && texte1 && signatureValidation.isValid);
            return !!(pdfFile && hasSignature);
        } else if (activeTab === 3) {
            // Onglet Image
            const hasSignature = signatureFile || (IsString && texte1 && signatureValidation.isValid);
            return !!(imageFile && hasSignature);
        }
        return false;
    };

    // PHASE 3.3 : Intégration avec verify.js
    const handleVerifyClick = () => {
        // Validation selon l'onglet actif
        if (activeTab === 0) {
        if (!signatureId || !message) {
            setIsVerifying(false);
            setVerificationResult(null);
            setShowContentRecovered(false);
            return;
        }
        } else if (activeTab === 1) {
            if (!texte2 || (!signatureFile && !texte1)) {
                setIsVerifying(false);
                setVerificationResult(null);
                return;
            }
        } else if (activeTab === 2) {
            if (!pdfFile || (!signatureFile && !texte1)) {
                setIsVerifying(false);
                setVerificationResult(null);
                return;
            }
        } else if (activeTab === 3) {
            if (!imageFile || (!signatureFile && !texte1)) {
                setIsVerifying(false);
                setVerificationResult(null);
                return;
            }
        }
        
        resultProcessedRef.current = false; // Reset pour permettre un nouveau traitement
        setShowContentRecovered(false);
        setIsVerifying(true);
        setVerificationResult(null);
        
        // Appeler la fonction de vérification de verify.js
        if (typeof window.verifySignature === 'function') {
            window.verifySignature();
        } else {
            setTimeout(() => {
                if (typeof window.verifySignature === 'function') {
                    window.verifySignature();
                }
            }, 100);
        }
    };

    // PHASE 4.1 : Fermeture de la modal
    const handleCloseModal = () => {
        setIsResultModalOpen(false);
        resultProcessedRef.current = false; // Reset pour permettre un nouveau traitement
    };

    // ============================================
    // ÉTAT DE RECHARGEMENT - PHASE 7.1
    // ============================================
    if (isReloading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    padding: '40px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                    maxWidth: '400px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#333',
                        marginBottom: '12px'
                    }}>
                        Rechargement en cours...
                    </div>
                    <div style={{
                        fontSize: '16px',
                        color: '#666',
                        lineHeight: '1.5'
                    }}>
                        Récupération du contenu mail
                    </div>
                    <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
                </div>
            </div>
        );
    }

    // ============================================
    // DÉFINITION DES ONGLETS - PHASE 2 & 5
    // ============================================
    const tabs = [
        {
            // PHASE 5.1 : Onglet Mail avec icône
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaInbox style={{ fontSize: '16px' }} />
                    <span>Mail</span>
                </div>
            ),
            content: (
                <>
                    {/* PHASE 4.2 : Animation de vérification */}
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && signatureId && message}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {(!isVerifying || !verificationResult) && (
                        <>
                            {/* PHASE 7.1 : Message de récupération automatique */}
                            {signatureId && message && showContentRecovered && (
                                <div className="verify-modern-inputs" style={{ marginBottom: '4px' }}>
                                    <div className="verify-modern-input-card verify-modern-input-card-primary">
                                        <div className="modern-input-icon">
                                            <FaCheckCircle style={{ width: '28px', height: '28px', color: '#7fffa7' }} />
                                        </div>
                                        <div className="modern-input-content">
                                            <label className="modern-input-label">
                                                ✅ Contenu récupéré avec succès
                                            </label>
                                            <p style={{ fontSize: '13px', color: 'var(--text-muted, #8d8ba7)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                                                Empreinte et message extraits de votre boîte mail.
                                            </p>
                                        </div>
                                    </div>
                            </div>
                        )}

                            {/* PHASE 7.1 : Message si contenu perdu */}
                            {mailContentLost && (
                                <div className="verify-modern-inputs" style={{ marginBottom: '4px' }}>
                                    <div className="verify-modern-input-card" style={{ borderColor: 'rgba(149, 132, 255, 0.4)', background: 'linear-gradient(135deg, rgba(240, 234, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' }}>
                                        <div className="modern-input-icon" style={{ background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.25) 0%, rgba(184, 170, 255, 0.18) 100%)' }}>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '28px', height: '28px' }}>
                                                <path d="M12 9V13M12 17H12.01M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                    </div>
                                        <div className="modern-input-content">
                                            <label className="modern-input-label">
                                                Contenu du mail perdu ou introuvable
                                            </label>
                            <button
                                                onClick={handleReloadMailContent}
                                                style={{
                                                    backgroundColor: '#9584ff',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '12px 24px',
                                                    fontSize: '14px',
                                                    fontWeight: '700',
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    marginTop: '12px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                                RECHARGER LE CONTENU DU MAIL
                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PHASE 2.3 : Affichage du contenu récupéré */}
                            {(signatureId || message) && (
                                <div className="verify-modern-inputs">
                                    {signatureId && (
                                        <div className="verify-modern-input-card verify-modern-input-card-primary">
                                            <div className="modern-input-icon">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <div className="modern-input-content">
                                                <label className="modern-input-label">
                                                    Empreinte ID
                                                </label>
                                                <div className="modern-input-wrapper">
                                                    <CustomTextInput
                                                        id="signatureId"
                                                        placeholder="0x..."
                                                        value={signatureId}
                                                        onChange={e => setSignatureId(e.target.value)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {message && (
                                        <div className="verify-modern-input-card verify-modern-input-card-secondary">
                                            <div className="modern-input-icon">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <div className="modern-input-content">
                                                <label className="modern-input-label">
                                                    Message signé
                                                </label>
                                                <div className="modern-input-wrapper">
                                                    <CustomTextInput
                                                        id="messageInput"
                                                        rows={3}
                                                        placeholder="Message..."
                                                        value={message}
                                                        onChange={e => setMessage(e.target.value)}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Champs cachés pour verify.js */}
                            <div style={{ display: 'none' }}>
                                <CustomTextInput
                                    id="signatureId"
                                    placeholder="0x..."
                                    value={signatureId}
                                    onChange={e => setSignatureId(e.target.value)}
                                />
                                <CustomTextInput
                                    id="messageInput"
                                    rows={4}
                                    placeholder="Écris le message ici..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                />
                            </div>
                            <p id="verify" style={{ display: 'none' }}></p>
                        </>
                    )}
                </>
            ),
        },
        {
            // PHASE 5.1 : Onglet Texte avec icône
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaEdit style={{ fontSize: '16px' }} />
                    <span>Texte</span>
                </div>
            ),
            content: (
                <>
                    {/* PHASE 4.2 : Animation de vérification */}
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && (signatureFile || texte1) && texte2}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {(!isVerifying || !verificationResult) && (
                        <>
                            {/* PHASE 2.2 : FormatToggle pour basculer entre textuel/image */}
                            <div className="verify-options-card">
                                <div className="format-toggle-optional-label">
                                    <span>Format d'empreinte</span>
                                </div>
                                <FormatToggle 
                                    value={IsString === null ? false : IsString} 
                                    onChange={(value) => {
                                        setIsString(value);
                                    }} 
                                />
                                <input
                                    type="checkbox"
                                    id="signatureCheckbox"
                                    checked={IsString === true}
                                    onChange={() => {}}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* PHASE 2.1 : Cards d'input modernes */}
                            <div className="verify-modern-inputs">
                                {/* PHASE 2.2 : Input Signature ID */}
                                <div className="verify-modern-input-card verify-modern-input-card-primary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                        <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            Empreinte
                                            {IsString && signatureValidation.isValid === false && (
                                                <span style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '8px' }}>⚠️</span>
                                            )}
                                            {IsString && signatureValidation.isValid === true && (
                                                <span style={{ color: '#7fffa7', fontSize: '10px', marginLeft: '8px' }}>✓</span>
                                            )}
                                        </label>
                                        <div className="modern-input-wrapper">
                                            {IsString ? (
                                                <>
                                                    <CustomTextInput
                                                        id="signatureIdString"
                                                        placeholder="[CERTIDOCS]0x..."
                                                        value={texte1}
                                                        onChange={e => setTexte1(e.target.value)}
                                                        aria-label="Empreinte ID au format textuel"
                                                        aria-invalid={signatureValidation.isValid === false}
                                                        aria-describedby={signatureValidation.message ? "signature-error" : undefined}
                                                        style={{
                                                            borderColor: signatureValidation.isValid === false 
                                                                ? 'rgba(255, 107, 107, 0.6)' 
                                                                : signatureValidation.isValid === true 
                                                                ? 'rgba(127, 255, 167, 0.6)' 
                                                                : undefined
                                                        }}
                                                    />
                                                    {signatureValidation.message && (
                                                        <div 
                                                            id="signature-error"
                                                            role="alert"
                                                            style={{
                                                                fontSize: '11px',
                                                                color: '#ff6b6b',
                                                                marginTop: '4px',
                                                                padding: '4px 8px',
                                                                background: 'rgba(255, 107, 107, 0.1)',
                                                                borderRadius: '6px',
                                                                border: '1px solid rgba(255, 107, 107, 0.2)'
                                                            }}
                                                        >
                                                            {signatureValidation.message}
                                                        </div>
                                                    )}
                                                    {signatureValidation.message && (
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#ff6b6b',
                                                            marginTop: '4px',
                                                            padding: '4px 8px',
                                                            background: 'rgba(255, 107, 107, 0.1)',
                                                            borderRadius: '6px',
                                                            border: '1px solid rgba(255, 107, 107, 0.2)'
                                                        }}>
                                                            {signatureValidation.message}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* PHASE 2.3 : Input Message signé */}
                                <div className="verify-modern-input-card verify-modern-input-card-secondary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            Message signé
                                        </label>
                                        <div className="modern-input-wrapper">
                                            <CustomTextInput
                                                id="texte2"
                                                rows={3}
                                                placeholder="Collez ici le message signé..."
                                                value={texte2}
                                                onChange={e => setTexte2(e.target.value)}
                                                aria-label="Message signé à vérifier"
                                                aria-required="true"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p id="verify" style={{ display: 'none' }}></p>
                        </>
                    )}
                </>
            ),
        },
        {
            // PHASE 5.1 : Onglet PDF avec icône
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaFileAlt style={{ fontSize: '16px' }} />
                    <span>PDF</span>
                </div>
            ),
            content: (
                <>
                    {/* PHASE 4.2 : Animation de vérification */}
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && pdfFile && (signatureFile || texte1)}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {(!isVerifying || !verificationResult) && (
                        <>
                            {/* PHASE 2.2 : FormatToggle */}
                            <div className="verify-options-card">
                                <div className="format-toggle-optional-label">
                                    <span>Format d'empreinte</span>
                                </div>
                                <FormatToggle 
                                    value={IsString === null ? false : IsString} 
                                    onChange={(value) => {
                                        setIsString(value);
                                    }} 
                                />
                                <input
                                    type="checkbox"
                                    id="signatureCheckbox"
                                    checked={IsString === true}
                                    onChange={() => {}}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* PHASE 2.1 : Cards d'input modernes */}
                            <div className="verify-modern-inputs">
                                {/* PHASE 2.2 : Input Signature ID */}
                                <div className="verify-modern-input-card verify-modern-input-card-primary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                        <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            Empreinte
                                            {IsString && signatureValidation.isValid === false && (
                                                <span style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '8px' }}>⚠️</span>
                                            )}
                                            {IsString && signatureValidation.isValid === true && (
                                                <span style={{ color: '#7fffa7', fontSize: '10px', marginLeft: '8px' }}>✓</span>
                                            )}
                                        </label>
                                        <div className="modern-input-wrapper">
                                            {IsString ? (
                                                <>
                                                    <CustomTextInput
                                                        id="signatureIdString"
                                                        placeholder="[CERTIDOCS]0x..."
                                                        value={texte1}
                                                        onChange={e => setTexte1(e.target.value)}
                                                        aria-label="Empreinte ID au format textuel"
                                                        aria-invalid={signatureValidation.isValid === false}
                                                        aria-describedby={signatureValidation.message ? "signature-error" : undefined}
                                                        style={{
                                                            borderColor: signatureValidation.isValid === false 
                                                                ? 'rgba(255, 107, 107, 0.6)' 
                                                                : signatureValidation.isValid === true 
                                                                ? 'rgba(127, 255, 167, 0.6)' 
                                                                : undefined
                                                        }}
                                                    />
                                                    {signatureValidation.message && (
                                                        <div 
                                                            id="signature-error"
                                                            role="alert"
                                                            style={{
                                                                fontSize: '11px',
                                                                color: '#ff6b6b',
                                                                marginTop: '4px',
                                                                padding: '4px 8px',
                                                                background: 'rgba(255, 107, 107, 0.1)',
                                                                borderRadius: '6px',
                                                                border: '1px solid rgba(255, 107, 107, 0.2)'
                                                            }}
                                                        >
                                                            {signatureValidation.message}
                                                        </div>
                                                    )}
                                                    {signatureValidation.message && (
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#ff6b6b',
                                                            marginTop: '4px',
                                                            padding: '4px 8px',
                                                            background: 'rgba(255, 107, 107, 0.1)',
                                                            borderRadius: '6px',
                                                            border: '1px solid rgba(255, 107, 107, 0.2)'
                                                        }}>
                                                            {signatureValidation.message}
                                                        </div>
                                                    )}
                        </>
                    ) : (
                                                <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* PHASE 2.3 : Input PDF signé */}
                                <div className="verify-modern-input-card verify-modern-input-card-secondary">
                                    <div className="modern-input-icon">
                                        <FaFileAlt style={{ width: '24px', height: '24px' }} />
                                    </div>
                                    <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            PDF signé
                                        </label>
                                        <div className="modern-input-wrapper">
                                            <PDFSection value={pdfFile} onChange={setPdfFile} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p id="verify" style={{ display: 'none' }}></p>
                        </>
                    )}
                </>
            ),
        },
        {
            // PHASE 5.1 : Onglet Image avec icône
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaCamera style={{ fontSize: '16px' }} />
                    <span>Image</span>
                </div>
            ),
            content: (
                <>
                    {/* PHASE 4.2 : Animation de vérification */}
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && imageFile && (signatureFile || texte1)}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {(!isVerifying || !verificationResult) && (
                        <>
                            {/* PHASE 2.2 : FormatToggle */}
                            <div className="verify-options-card">
                                <div className="format-toggle-optional-label">
                                    <span>Format d'empreinte</span>
                                </div>
                                <FormatToggle 
                                    value={IsString === null ? false : IsString} 
                                    onChange={(value) => {
                                        setIsString(value);
                                    }} 
                                />
                                <input
                                    type="checkbox"
                                    id="signatureCheckbox"
                                    checked={IsString === true}
                                    onChange={() => {}}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* PHASE 2.1 : Cards d'input modernes */}
                            <div className="verify-modern-inputs">
                                {/* PHASE 2.2 : Input Signature ID */}
                                <div className="verify-modern-input-card verify-modern-input-card-primary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                        <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            Empreinte
                                            {IsString && signatureValidation.isValid === false && (
                                                <span style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '8px' }}>⚠️</span>
                                            )}
                                            {IsString && signatureValidation.isValid === true && (
                                                <span style={{ color: '#7fffa7', fontSize: '10px', marginLeft: '8px' }}>✓</span>
                                            )}
                                        </label>
                                        <div className="modern-input-wrapper">
                                            {IsString ? (
                                                <>
                                                    <CustomTextInput
                                                        id="signatureIdString"
                                                        placeholder="[CERTIDOCS]0x..."
                                                        value={texte1}
                                                        onChange={e => setTexte1(e.target.value)}
                                                        aria-label="Empreinte ID au format textuel"
                                                        aria-invalid={signatureValidation.isValid === false}
                                                        aria-describedby={signatureValidation.message ? "signature-error" : undefined}
                                                        style={{
                                                            borderColor: signatureValidation.isValid === false 
                                                                ? 'rgba(255, 107, 107, 0.6)' 
                                                                : signatureValidation.isValid === true 
                                                                ? 'rgba(127, 255, 167, 0.6)' 
                                                                : undefined
                                                        }}
                                                    />
                                                    {signatureValidation.message && (
                                                        <div 
                                                            id="signature-error"
                                                            role="alert"
                                                            style={{
                                                                fontSize: '11px',
                                                                color: '#ff6b6b',
                                                                marginTop: '4px',
                                                                padding: '4px 8px',
                                                                background: 'rgba(255, 107, 107, 0.1)',
                                                                borderRadius: '6px',
                                                                border: '1px solid rgba(255, 107, 107, 0.2)'
                                                            }}
                                                        >
                                                            {signatureValidation.message}
                                                        </div>
                                                    )}
                                                    {signatureValidation.message && (
                                                        <div style={{
                                                            fontSize: '11px',
                                                            color: '#ff6b6b',
                                                            marginTop: '4px',
                                                            padding: '4px 8px',
                                                            background: 'rgba(255, 107, 107, 0.1)',
                                                            borderRadius: '6px',
                                                            border: '1px solid rgba(255, 107, 107, 0.2)'
                                                        }}>
                                                            {signatureValidation.message}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* PHASE 2.3 : Input Image signée */}
                                <div className="verify-modern-input-card verify-modern-input-card-secondary">
                                    <div className="modern-input-icon">
                                        <FaCamera style={{ width: '24px', height: '24px' }} />
                                    </div>
                                    <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            Image signée
                                        </label>
                                        <div className="modern-input-wrapper">
                                            <ImageSection value={imageFile} onChange={setImageFile} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p id="verify" style={{ display: 'none' }}></p>
                        </>
                    )}
                </>
            ),
        },
    ];

    // ============================================
    // RENDU PRINCIPAL - PHASE 1, 2, 3, 4, 5
    // ============================================
    return (
        <>
            <HeaderExpert />
            <div className="verify-page-wrapper">
                <div className="verify-container perspective-container">
                    {/* PHASE 1.2 : Timeline - Parcours utilisateur */}
                    <div className="verify-timeline-section">
                        <Timeline 
                            currentStep={currentStep}
                            steps={[
                                { id: 1, label: 'Connexion', icon: FaCircle },
                                { id: 2, label: 'Vérification', icon: FaCircle },
                                { id: 3, label: 'Résultat', icon: FaCircle },
                            ]}
                        />
            </div>

                    {/* PHASE 5.1 : Sélection du type de contenu */}
                    <div className="verify-tabs-section">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
                    </div>

                    {/* PHASE 3.1 : Bouton de vérification sticky */}
                    <StickyButton
                    onClick={handleVerifyClick}
                        disabled={!isButtonEnabled()}
                        isLoading={isVerifying}
                        isSuccess={verificationResult === 'success'}
                        isError={verificationResult === 'error'}
                        loadingText="Vérification en cours..."
                        successText="Empreinte valide !"
                        errorText="Empreinte Invalide"
                    >
                        VÉRIFIER L'EMPREINTE
                    </StickyButton>
                </div>
            </div>

            {/* PHASE 4.1 : Modal de résultat de vérification */}
            <VerifyResultModal
                isOpen={isResultModalOpen}
                onClose={handleCloseModal}
                result={verificationResult}
                signatureId={signatureId || texte1}
                message={message || texte2}
                activeTab={activeTab}
            />
        </>
    );
}

export default VerifyPage;
