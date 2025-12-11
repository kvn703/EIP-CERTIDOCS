import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import "../CSS/style.css";
import "../CSS/copyButton.css";
import "../CSS/adresse.css";
import "../CSS/verifyLayout.css";
import CustomTextInput from "../component/CustomTextInput";
import StickyButton from "../component/StickyButton";
import { useAppKitAccount } from "@reown/appkit/react";
import { FaInbox, FaEdit, FaFileAlt, FaCamera, FaCircle, FaTimes } from "react-icons/fa";
import Tabs from "../component/Tabs";
import "../component/Tabs.css";
import PDFSection from "../component/PdfPage/PDFSection";
import ImageSection from "../component/PdfPage/ImageSection";
import VerificationAnimation from "../component/VerificationAnimation";
import VerifyLoading from "../component/VerifyLoading";
import Timeline from "../component/Timeline";
import FormatToggle from "../component/FormatToggle";
import VerifyResultModal from "../component/VerifyResultModal";
import HashDisplay from "../component/HashDisplay";

function VerifyPage() {
    const location = useLocation();
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
    const [hasVerificationCompleted, setHasVerificationCompleted] = useState(false);
    const [showContentRecovered, setShowContentRecovered] = useState(true);
    const [signatureFile, _setSignatureFile] = useState(null);
    const [IsString, setIsString] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const resultProcessedRef = useRef(false);
    const setActiveTab = (tabIndex) => {
        _setActiveTab(tabIndex);
        if (tabIndex === 0) {
            setIsString(false);
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

    useEffect(() => {
        if (isConnected) {
            window.dispatchEvent(new Event('walletConnected'));
            setCurrentStep(1);
        } else {
            setCurrentStep(1);
        }
    }, [isConnected]);

    useEffect(() => {
        if (verificationResult || hasVerificationCompleted) {
            setCurrentStep(4);
        }
    }, [verificationResult, hasVerificationCompleted]);

    useEffect(() => {
        if (verificationResult || hasVerificationCompleted) {
            return;
        }
        
        if (isVerifying) {
            setCurrentStep(2);
            return;
        }
        
        if (!isConnected) {
            setCurrentStep(1);
            return;
        }
        
        if (isConnected && (signatureId || signatureFile || texte1) && (message || texte2 || pdfFile || imageFile)) {
            setCurrentStep(2);
            return;
        }
        
        if (isConnected) {
            setCurrentStep(1);
        }
    }, [isConnected, isVerifying, verificationResult, hasVerificationCompleted, signatureId, signatureFile, texte1, message, texte2, pdfFile, imageFile]);
    // Détection des paramètres URL (logique existante préservée)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const signatureIdParam = urlParams.get("signatureId");
        const messageParam = urlParams.get("messageHash");
        if (signatureIdParam && messageParam) {
            setSignatureId(signatureIdParam);
            setMessage(messageParam);
            setActiveTab(0);
        } else {
            setActiveTab(1);
        }
    }, [location.search]); // Se déclenche aussi lors de la navigation

    // Nouvelle fonctionnalité : Détection du mail lors de la navigation (sans rechargement)
    useEffect(() => {
        // Ne rien faire si on a déjà des données (pour préserver la base du code)
        if (signatureId && message) {
            return;
        }

        // Ne rien faire si on vient d'avoir des paramètres dans l'URL (géré par le useEffect précédent)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("signatureId") || urlParams.get("messageHash")) {
            return;
        }

        // Essayer de récupérer le mail via l'extension Chrome si disponible
        const tryDetectMail = async () => {
            try {
                // Utiliser window.postMessage pour communiquer avec le content script
                // Le content script écoutera ce message et le transmettra au background script
                const requestId = `mailRequest_${Date.now()}_${Math.random()}`;
                
                // Écouter la réponse du content script
                const messageHandler = (event) => {
                    // Vérifier que le message vient du content script
                    if (event.data && event.data.type === 'mailContentResponse' && event.data.requestId === requestId) {
                        window.removeEventListener('message', messageHandler);
                        
                        if (event.data.content && event.data.signatureId) {
                            setMessage(event.data.content); // content est déjà le hash
                            setSignatureId(event.data.signatureId);
                            setActiveTab(0);
                        } else if (event.data.error) {
                            // Ne pas afficher l'erreur si c'est juste que l'extension n'est pas disponible
                            // (c'est normal si on n'est pas dans le contexte d'une extension)
                            if (!event.data.error.includes('Extension Chrome non disponible') && 
                                !event.data.error.includes('Could not establish connection')) {
                                console.log('[VerifyPage] Erreur lors de la récupération du mail:', event.data.error);
        }
                        }
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
                // Envoyer la demande au content script
                window.postMessage({
                    type: 'requestMailContentForVerify',
                    requestId: requestId,
                    source: 'verify-page'
                }, '*');
                
                // Timeout de sécurité : retirer le listener après 5 secondes
                setTimeout(() => {
                    window.removeEventListener('message', messageHandler);
                }, 5000);
            } catch (error) {
                console.log('[VerifyPage] Erreur lors de la détection du mail:', error);
            }
        };

        // Attendre un peu pour laisser le temps à la page de se charger
        const timeoutId = setTimeout(tryDetectMail, 500);
        
        return () => clearTimeout(timeoutId);
    }, [location.pathname, signatureId, message]); // Se déclenche à chaque navigation vers /verify

    useEffect(() => {
        const signatureIdInput = document.getElementById("signatureId");
        const messageInput = document.getElementById("messageInput");
        
        if (signatureIdInput && signatureId) {
            let formatted_id = signatureId.trim();
            if (formatted_id.startsWith("[CERTIDOCS]")) {
                formatted_id = formatted_id.replace("[CERTIDOCS]", "").trim();
            }
            
            if (!formatted_id.startsWith('0x')) {
                formatted_id = '0x' + formatted_id;
            }
            
            const hex_part = formatted_id.slice(2);
            if (hex_part.length < 64) {
                formatted_id = '0x' + hex_part.padStart(64, '0');
            } else if (hex_part.length > 64) {
                formatted_id = '0x' + hex_part.slice(0, 64);
            }
            signatureIdInput.value = formatted_id;
        } else if (signatureIdInput) {
            signatureIdInput.value = '';
        }
        
        if (messageInput) {
            messageInput.value = message || '';
        }
    }, [signatureId, message]);
    useEffect(() => {
        const texte2_element = document.getElementById("texte2");
        const signature_id_string_element = document.getElementById("signatureIdString");
        
        if (texte2_element) {
            texte2_element.value = texte2 || '';
        }
        
        if (signature_id_string_element) {
            signature_id_string_element.value = texte1 || '';
        }
    }, [texte1, texte2]);

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

    useEffect(() => {
        // Ne pas vérifier si on n'est pas en train de vérifier ou si le résultat est déjà traité
        if (!isVerifying || resultProcessedRef.current || verificationResult) {
            return;
        }

        let interval;
        let timeoutId;
        let checkCount = 0;
        const maxChecks = 60; // Maximum 30 secondes (60 * 500ms)

        const check_verification_result = () => {
            // Vérifier si on doit arrêter (si le résultat a été traité ou si on n'est plus en train de vérifier)
            if (resultProcessedRef.current || !isVerifying || verificationResult) {
                if (interval) clearInterval(interval);
                return;
            }

            checkCount++;
            
            // Timeout de sécurité : arrêter après 30 secondes
            if (checkCount > maxChecks) {
                setIsVerifying(false);
                setVerificationResult('error');
                setHasVerificationCompleted(true);
                setCurrentStep(4);
                setIsResultModalOpen(true);
                resultProcessedRef.current = true;
                if (interval) clearInterval(interval);
                return;
            }

            const verify_element = document.getElementById("verify");
            if (verify_element && !resultProcessedRef.current) {
                // S'assurer que l'élément reste toujours caché
                verify_element.style.display = 'none';
                
                const text = verify_element.innerText || verify_element.textContent || '';
                
                // Vérifier si on a un résultat valide
                if (text.includes("✅ Empreinte VALIDE") || text.includes("✅ Signature VALIDE")) {
                    setIsVerifying(false);
                    setVerificationResult('success');
                    setHasVerificationCompleted(true);
                    setCurrentStep(4);
                    setIsResultModalOpen(true);
                    resultProcessedRef.current = true;
                    verify_element.style.display = 'none';
                    verify_element.innerText = '';
                    if (interval) clearInterval(interval);
                } else if (text.includes("❌ Empreinte NON VALIDE") || text.includes("❌ Signature NON VALIDE") || text.includes("❌ Erreur")) {
                    setIsVerifying(false);
                    setVerificationResult('error');
                    setHasVerificationCompleted(true);
                    setCurrentStep(4);
                    setIsResultModalOpen(true);
                    resultProcessedRef.current = true;
                    verify_element.style.display = 'none';
                    verify_element.innerText = '';
                    if (interval) clearInterval(interval);
                }
                // Si le texte est "Vérification en cours...", on continue à vérifier
                // Sinon, si le texte est vide ou différent, on continue aussi
            }
        };

        interval = setInterval(check_verification_result, 500);
        
        return () => {
            if (interval) clearInterval(interval);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isVerifying, verificationResult]);
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

    const validate_signature_format = (sig) => {
        if (!sig) return { isValid: false, message: '' };
        const trimmed = sig.trim();
        const cleaned = trimmed.startsWith("[CERTIDOCS]") 
            ? trimmed.replace("[CERTIDOCS]", "").trim()
            : trimmed;
        const is_valid = /^0x[a-fA-F0-9]{64}$/.test(cleaned);
        return {
            isValid: is_valid,
            message: is_valid ? '' : 'Format invalide. Doit être 0x suivi de 64 caractères hexadécimaux.'
        };
    };

    const [signatureValidation, setSignatureValidation] = useState({ isValid: null, message: '' });

    useEffect(() => {
        if (activeTab === 1 || activeTab === 2 || activeTab === 3) {
            if (IsString && texte1) {
                const timeout_id = setTimeout(() => {
                    const validation = validate_signature_format(texte1);
                    setSignatureValidation(validation);
                }, 300);
                return () => clearTimeout(timeout_id);
            } else {
                setSignatureValidation({ isValid: null, message: '' });
            }
        } else {
            setSignatureValidation({ isValid: null, message: '' });
        }
    }, [texte1, IsString, activeTab]);
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

    const handleVerifyClick = () => {
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
        
        resultProcessedRef.current = false;
        setShowContentRecovered(false);
        setIsVerifying(true);
        setVerificationResult(null);
        setHasVerificationCompleted(false);
        
        // S'assurer que l'élément verify existe et est prêt
        // IMPORTANT: Garder display: none pour que le texte ne soit pas visible
        const verify_element = document.getElementById("verify");
        if (verify_element) {
            verify_element.style.display = 'none'; // Toujours caché
            verify_element.innerText = ''; // Réinitialiser le texte
        }
        
        if (typeof window.verifySignature === 'function') {
            window.verifySignature();
        } else {
            setTimeout(() => {
                if (typeof window.verifySignature === 'function') {
                    window.verifySignature();
                } else {
                    // Si verifySignature n'est toujours pas disponible, arrêter la vérification
                    setIsVerifying(false);
                    setVerificationResult('error');
                    setHasVerificationCompleted(true);
                }
            }, 100);
        }
    };

    const handleCloseModal = () => {
        setIsResultModalOpen(false);
        setVerificationResult(null);
        setIsVerifying(false);
        resultProcessedRef.current = false;
    };
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

    const tabs = [
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaInbox style={{ fontSize: '16px' }} />
                    <span>Mail</span>
                </div>
            ),
            content: (
                <>
                    {isVerifying && !verificationResult && (
                        <VerifyLoading />
                    )}

                    {verificationResult && (
                        <VerificationAnimation
                            isVerifying={false}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {!isVerifying && !verificationResult && (
                        <>
                            {signatureId && message && showContentRecovered && (
                                <div className="content-recovered-notification">
                                    <div className="content-recovered-notification-inner">
                                        <div className="content-recovered-status-indicator"></div>
                                        <div className="content-recovered-notification-content">
                                            <div className="content-recovered-notification-title">
                                                Contenu récupéré
                                            </div>
                                            <div className="content-recovered-notification-message">
                                                Empreinte et message extraits de votre boîte mail
                                            </div>
                                        </div>
                                        <button 
                                            className="content-recovered-notification-close"
                                            onClick={() => setShowContentRecovered(false)}
                                            aria-label="Fermer"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                            </div>
                        )}

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
                                                <HashDisplay
                                                    value={signatureId}
                                                    label="Empreinte ID"
                                                    onCopy={async (value) => {
                                                        await navigator.clipboard.writeText(value);
                                                    }}
                                                />
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
                                                <HashDisplay
                                                    value={message}
                                                    label="Message signé"
                                                    onCopy={async (value) => {
                                                        await navigator.clipboard.writeText(value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <p id="verify" style={{ display: 'none' }}></p>
                </>
            ),
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaEdit style={{ fontSize: '16px' }} />
                    <span>Texte</span>
                </div>
            ),
            content: (
                <>
                    {isVerifying && !verificationResult && (
                        <VerifyLoading />
                    )}

                    {verificationResult && (
                        <VerificationAnimation
                            isVerifying={false}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {!isVerifying && !verificationResult && (
                        <>
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
                                                <span style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '8px' }}>!</span>
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
                                                </>
                                            ) : (
                                                <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                            )}
                                        </div>
                                    </div>
                                </div>

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
                        </>
                    )}
                    {/* Éléments toujours présents dans le DOM pour verify.js - Onglet Texte */}
                    <div style={{ display: 'none' }}>
                        <textarea id="texte2" value={texte2} onChange={() => {}} readOnly />
                        <input id="signatureIdString" value={texte1} onChange={() => {}} readOnly />
                    </div>
                    <p id="verify" style={{ display: 'none' }}></p>
                </>
            ),
        },
        {
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
                                                <span style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '8px' }}>!</span>
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
                        </>
                    ) : (
                                                <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                            )}
                                        </div>
                                    </div>
                                </div>

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
                                                <span style={{ color: '#ff6b6b', fontSize: '10px', marginLeft: '8px' }}>!</span>
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
                                                </>
                                            ) : (
                                                <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                            )}
                                        </div>
                                    </div>
                                </div>

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

    return (
        <>
            <div className="verify-page-wrapper">
                <div className="verify-container perspective-container">
                    <div className="verify-timeline-section">
                        <Timeline 
                            currentStep={verificationResult ? 4 : currentStep}
                            steps={[
                                { id: 1, label: 'Connexion', icon: FaCircle },
                                { id: 2, label: 'Vérification', icon: FaCircle },
                                { id: 3, label: 'Résultat', icon: FaCircle },
                            ]}
                        />
            </div>

                    <div className="verify-tabs-section">
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
                    </div>

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

            <VerifyResultModal
                isOpen={isResultModalOpen}
                onClose={handleCloseModal}
                result={verificationResult}
                signatureId={signatureId || texte1}
                message={message || texte2}
                activeTab={activeTab}
            />
            
            <div style={{ display: 'none' }}>
                <input
                    type="text"
                    id="signatureId"
                />
                <textarea
                    id="messageInput"
                />
            </div>
            
            <input
                type="checkbox"
                id="signatureCheckbox"
                checked={IsString === true}
                onChange={() => {}}
                style={{ display: 'none' }}
            />
        </>
    );
}

export default VerifyPage;
