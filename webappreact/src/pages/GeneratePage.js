// src/pages/GeneratePage.js
import React, { useEffect, useState } from "react";
import "../CSS/style.css";
import "../CSS/adresse.css";
import "../CSS/copyButton.css";
import "../CSS/status.css";
import "../CSS/logoutButton.css";
import "../CSS/modern2025.css";
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
    const [IsString, setIsString] = useState(false);

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
            setIsString(false); // Reset IsString when switching to Mail tab
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

    return (
        <>
            <HeaderExpert />
            <div className="container perspective-container">

            {/* Étape 2: Sélection du type de contenu - Flow logique */}
            <div 
                className="gpu-accelerated animation-container scroll-reveal transform-3d-hover"
                style={{ 
                    marginBottom: '20px',
                    animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both'
                }}
            >
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            </div>

            {/* Étape 3: Saisie du contenu (conditionnel selon l'onglet) */}
            {!mailMessage && activeTab === 1 && (
                <div 
                    className="stagger-item gpu-accelerated animation-container scroll-reveal depth-card micro-interaction"
                    style={{ 
                        marginBottom: '18px', 
                        padding: '16px', 
                        background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.08) 0%, rgba(184, 170, 255, 0.04) 100%)',
                        borderRadius: '14px',
                        border: '1px solid rgba(149, 132, 255, 0.15)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 12px rgba(149, 132, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                        backdropFilter: 'blur(8px)'
                    }}
                >
                    <CustomText className="fas fa-pen custom-text" Text="Votre message :" />
                    <CustomTextInput
                        id="messageInput"
                        rows="5"
                        placeholder="Saisissez votre message..."
                        value={texteValue}
                        onChange={(e) => setTexteValue(e.target.value)}
                    />
                </div>
            )}

            <div id="confirmationMessage" style={{ display: 'none' }}></div>

            <div id="confirmationMessage" style={{ display: 'none' }}></div>

            {/* Étape 4: Configuration - Destinataires */}
            <div 
                className="stagger-item gpu-accelerated animation-container scroll-reveal depth-card micro-interaction"
                style={{
                    padding: '16px', 
                    background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.08) 0%, rgba(184, 170, 255, 0.04) 100%)',
                    borderRadius: '14px',
                    border: '1px solid rgba(149, 132, 255, 0.15)',
                    marginBottom: '18px',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(149, 132, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                <CustomText className="fas fa-user custom-text" Text="Destinataires autorisés :" />
                <CustomTextInput id="recipientsInput" placeholder="Adresse1, Adresse2, ..." />
                <p className="info-tooltip" style={{ fontSize: '11px', fontStyle: "italic", color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0, opacity: 0.8 }}>
                    Séparées par des virgules
                    <span className="info-tooltip-content">Format attendu : 0x1234..., 0x5678..., etc.</span>
                </p>
            </div>

            {/* Étape 5: Options - Signature textuelle (si applicable) */}
            {activeTab !== 0 && (
                <div 
                    className="stagger-item gpu-accelerated animation-container scroll-reveal depth-card micro-interaction"
                    style={{ 
                        marginBottom: '20px', 
                        padding: '14px', 
                        background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.06) 0%, rgba(184, 170, 255, 0.03) 100%)',
                        borderRadius: '14px',
                        border: '1px solid rgba(149, 132, 255, 0.12)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        backdropFilter: 'blur(6px)'
                    }}
                >
                    <label 
                        className="info-tooltip"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px',
                            cursor: 'pointer',
                            margin: 0
                        }}
                    >
                        <input
                            type="checkbox"
                            id="signatureCheckbox"
                            className="interaction-debounce"
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                            onChange={(e) => setIsString(e.target.checked)}
                            checked={IsString}
                        />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-main)' }}>
                            Signature textuelle
                        </span>
                        <span className="info-tooltip-content">
                            Activez cette option pour générer une signature au format texte plutôt qu'hexadécimal
                        </span>
                    </label>
                </div>
            )}

            {/* Étape 6: Action principale - Bouton de génération */}
            <button
                id="signMessage"
                className="button-3d gpu-accelerated interaction-debounce scroll-reveal transform-3d-hover micro-interaction"
                disabled={!texteValue || !isConnected}
                style={{ 
                    width: '50%', 
                    marginTop: 8, 
                    marginBottom: 4, 
                    fontSize: 16, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginLeft: 'auto', 
                    marginRight: 'auto', 
                    fontWeight: 1000, 
                    padding: '10px 20px', 
                    backgroundColor: 'var(--accent)', 
                    color: '#fff', 
                    borderRadius: '8px', 
                    cursor: (!texteValue || !isConnected) ? 'not-allowed' : 'pointer'
                }}
            >
                GÉNÉRER SIGNATURE
            </button>

            {/* Étape 7: Résultat - Signature générée */}
            {signed && signature && (
                <div style={{ 
                    marginTop: '24px',
                    animation: 'fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                    <SignatureCard signature={signature} onCopy={launchConfetti} />
                </div>
            )}

            <p id="status" className="gpu-accelerated" style={{ minHeight: 18, color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}></p>
            <div id="copyMessage" className="gpu-accelerated"></div>
            </div>
        </>
    );
};

export default GeneratePage;
