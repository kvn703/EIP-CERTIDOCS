import React, { useState, useEffect } from "react";
import "../CSS/style.css";
import "../CSS/copyButton.css";
import "../CSS/adresse.css";
import ButtonCustom from "../component/ButtonCustom";
import Container from "../component/Container";
import CustomText from "../component/CustomText";
import CustomTextInput from "../component/CustomTextInput";
import { useAppKitAccount } from "@reown/appkit/react";
import { FaInbox, FaEdit, FaFileAlt, FaCamera } from "react-icons/fa";
import Tabs from "../component/Tabs";
import "../component/Tabs.css";
import PDFSection from "../component/PdfPage/PDFSection";
import ImageSection from "../component/PdfPage/ImageSection";
import VerificationAnimation from "../component/VerificationAnimation";
import HeaderExpert from "../component/HeaderExpert";

function VerifyPage() {
    const { isConnected } = useAppKitAccount();
    const [signatureId, setSignatureId] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, _setActiveTab] = useState(0);
    const [texte1, setTexte1] = useState("");
    const [texte2, setTexte2] = useState("");
    const [pdfFile, _setPdfFile] = useState(null);
    const [imageFile, _setImageFile] = useState(null);
    const [mailContentLost, setMailContentLost] = useState(false);
    const [originalMailContent, setOriginalMailContent] = useState({ signatureId: "", message: "" });
    const [hasVisitedOtherTab, setHasVisitedOtherTab] = useState(false);
    const [isReloading, setIsReloading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [showContentRecovered, setShowContentRecovered] = useState(true);
    const [signatureFile, _setSignatureFile] = useState(null);
    const [IsString, setIsString] = useState(false);

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
    useEffect(() => {
        if (isConnected) {
            window.dispatchEvent(new Event('walletConnected'));
        }
    }, [isConnected]);

    window.addEventListener('Error', (event) => {
        setIsVerifying(false);
        setVerificationResult(null);
    });

    useEffect(() => {
        // retrieve url parameters
        const urlParams = new URLSearchParams(window.location.search);
        const signatureIdParam = urlParams.get("signatureId")
        const messageParam = urlParams.get("messageHash");
        if (signatureIdParam && messageParam) {
            setSignatureId(signatureIdParam);
            setMessage(messageParam);
            setOriginalMailContent({ signatureId: signatureIdParam, message: messageParam });
        } else {
            setActiveTab(1); // Switch to Texte tab if no parameters
        }
    }, [signatureId, message, originalMailContent.signatureId]);

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
        const checkVerificationResult = () => {
            const verifyElement = document.getElementById("verify");
            if (verifyElement) {
                const text = verifyElement.innerText;
                if (text.includes("✅ Signature VALIDE")) {
                    setVerificationResult('success');
                    setIsVerifying(false);
                    verifyElement.style.display = 'none';
                    verifyElement.innerText = ''; // Clear the text to avoid confusion
                } else if (text.includes("❌ Signature NON VALIDE") || text.includes("❌ Erreur")) {
                    setVerificationResult('error');
                    setIsVerifying(false);
                    verifyElement.style.display = 'none';
                    verifyElement.innerText = ''; // Clear the text to avoid confusion
                }
            }
        };

        const interval = setInterval(checkVerificationResult, 500);
        return () => clearInterval(interval);
    }, []);

    // Initialisation directe des données mail
    //   useEffect(() => {
    //     // if (activeTab === 0 && !signatureId && !message) {
    //     //   // Récupération directe des données sans animation
    //     //   setSignatureId("0x" + Math.random().toString(16).slice(2, 66));
    //     //   setMessage("Message récupéré automatiquement depuis votre boîte mail");
    //     // }
    //     console.log(activeTab, signatureId, message);
    //     if (activeTab === 0 && signatureId === "" && message === "") {
    //         setActiveTab(1); // Switch to Texte tab if no mail content
    //     } else if (activeTab !== 0 && (signatureId !== "" || message !== "")) {
    //         setActiveTab(0); // Ensure we stay on Mail tab if content is available
    //     }
    //   }, [activeTab, signatureId, message]);

    const handleReloadMailContent = () => {
        setIsReloading(true);
        setTimeout(() => {
            document.location.reload();
        }, 100);
    };

    const handleVerificationComplete = () => {
        setVerificationResult(null);
        setIsVerifying(false);
        // Ne pas remettre showContentRecovered à true pour éviter que le message réapparaisse
    };

    const handleVerifyClick = () => {
        // Vérifier selon l'onglet actif
        if (activeTab === 0) {
            // Onglet Mail
            if (!signatureId || !message) {
                setIsVerifying(false);
                setVerificationResult(null);
                setShowContentRecovered(false);
                return;
            }
        } else if (activeTab === 1) {
            // Onglet Texte
            if (!texte2 || (!signatureFile && !texte1)) {
                setIsVerifying(false);
                setVerificationResult(null);
                return;
            }
        } else if (activeTab === 2) {
            // Onglet PDF
            if (!pdfFile || (!signatureFile && !texte1)) {
                setIsVerifying(false);
                setVerificationResult(null);
                return;
            }
        } else if (activeTab === 3) {
            // Onglet Image
            if (!imageFile || (!signatureFile && !texte1)) {
                setIsVerifying(false);
                setVerificationResult(null);
                return;
            }
        }
        
        setShowContentRecovered(false);
        setIsVerifying(true);
        setVerificationResult(null);
        
        // Appeler la fonction de vérification de verify.js
        if (typeof window.verifySignature === 'function') {
            window.verifySignature();
        } else {
            // Attendre que la fonction soit disponible
            setTimeout(() => {
                if (typeof window.verifySignature === 'function') {
                    window.verifySignature();
                }
            }, 100);
        }
    };

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

                    {signatureId && message && showContentRecovered && !isVerifying && !verificationResult && (
                        <div style={{ textAlign: 'center', padding: '32px 20px' }}>
                            <div style={{ fontSize: '22px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                                ✅ Contenu récupéré avec succès !
                            </div>
                            <div style={{ color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
                                Signature et message extraits de votre boîte mail.<br />
                                Cliquez sur le bouton ci-dessous pour vérifier votre signature
                            </div>
                        </div>
                    )}

                    <div style={{ marginRight: 20, backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <label style={{ display: 'none', alignItems: 'right', justifyContent: 'right', gap: '8px' }}>
                            <span style={{ marginTop: 9, fontSize: 13 }}>Signature textuelle</span>
                            <input
                                type="checkbox"
                                id="signatureCheckbox"
                                style={{ width: '16px', height: '16px' }}
                                onChange={(e) => setIsString(e.target.checked)}
                                checked={IsString}
                            />
                        </label>
                    </div>

                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && signatureId && message}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}

                    {mailContentLost && (
                        <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f0eaff', borderRadius: 8, border: '2px solid #9584ff', fontSize: '14px', boxShadow: '0 2px 8px rgba(149, 132, 255, 0.2)' }}>
                            <div style={{ color: '#9584ff', fontWeight: 500, marginBottom: 8 }}>
                                Contenu du mail perdu ou introuvable
                            </div>
                            <button
                                onClick={handleReloadMailContent}
                                style={{ backgroundColor: '#9584ff', color: 'white', border: 'none', padding: '12px 24px', fontSize: '15px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                RECHARGER LE CONTENU DU MAIL
                            </button>
                        </div>
                    )}
                    {/* Champs cachés mais toujours présents pour la logique */}
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
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && (signatureFile || texte1) && texte2}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}
                    {(!isVerifying || !verificationResult) && (
                        <>
                            <div style={{ marginRight: 20, backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'right', justifyContent: 'right', gap: '8px' }}>
                                    <span style={{ marginTop: 9, fontSize: 13 }}>Signature textuelle</span>
                                    <input
                                        type="checkbox"
                                        id="signatureCheckbox"
                                        style={{ width: '16px', height: '16px' }}
                                        onChange={(e) => setIsString(e.target.checked)}
                                        checked={IsString}
                                    />
                                </label>
                            </div>
                            <div style={{ paddingTop: 8, paddingBottom: 18, paddingLeft: 18, paddingRight: 18 }}>

                                <CustomText className="" Text="Signature ID :">

                                </CustomText>
                                {IsString ? (
                                    <CustomTextInput
                                        id="signatureIdString"
                                        placeholder="[CERTIDOCS]0x..."
                                        value={texte1}
                                        onChange={e => setTexte1(e.target.value)}
                                    />
                                ) : (
                                    <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                )}
                                <CustomText className="" Text="Message signé :" />
                                <CustomTextInput
                                    id="texte2"
                                    placeholder="Collez ici le message signé..."
                                    value={texte2}
                                    onChange={e => setTexte2(e.target.value)}
                                />
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
                    <FaFileAlt style={{ fontSize: '16px' }} />
                    <span>PDF</span>
                </div>
            ),
            content: (
                <>
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && pdfFile &&  (signatureFile || texte1)}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}
                    {(!isVerifying || !verificationResult) && (
                        <>
                            <div style={{ marginRight: 20, backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'right', justifyContent: 'right', gap: '8px' }}>
                                    <span style={{ marginTop: 9, fontSize: 13 }}>Signature textuelle</span>
                                    <input
                                        type="checkbox"
                                        id="signatureCheckbox"
                                        style={{ width: '16px', height: '16px' }}
                                        onChange={(e) => setIsString(e.target.checked)}
                                        checked={IsString}
                                    />
                                </label>
                            </div>
                            <div style={{ paddingTop: 8, paddingBottom: 18, paddingLeft: 18, paddingRight: 18 }}>
                                <CustomText className="" Text="Signature ID :" />
                                {IsString ? (
                                    <CustomTextInput
                                        id="signatureIdString"
                                        placeholder="[CERTIDOCS]0x..."
                                        value={texte1}
                                        onChange={e => setTexte1(e.target.value)}
                                    />
                                ) : (
                                    <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                )}
                                <CustomText className="" Text="PDF signé :" />
                                <PDFSection value={pdfFile} onChange={setPdfFile} />
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
                    {(isVerifying || verificationResult) && (
                        <VerificationAnimation
                            isVerifying={isVerifying && imageFile && (signatureFile || texte1)}
                            result={verificationResult}
                            onComplete={handleVerificationComplete}
                        />
                    )}
                    {(!isVerifying || !verificationResult) && (
                        <>
                            <div style={{ marginRight: 20, backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                                <label style={{ display: 'flex', alignItems: 'right', justifyContent: 'right', gap: '8px' }}>
                                    <span style={{ marginTop: 9, fontSize: 13 }}>Signature textuelle</span>
                                    <input
                                        type="checkbox"
                                        id="signatureCheckbox"
                                        style={{ width: '16px', height: '16px' }}
                                        onChange={(e) => setIsString(e.target.checked)}
                                        checked={IsString}
                                    />
                                </label>
                            </div>
                            <div style={{ paddingTop: 8, paddingBottom: 18, paddingLeft: 18, paddingRight: 18 }}>
                                <CustomText className="" Text="Signature ID :" />
                                {IsString ? (
                                    <CustomTextInput
                                        id="signatureIdString"
                                        placeholder="[CERTIDOCS]0x..."
                                        value={texte1}
                                        onChange={e => setTexte1(e.target.value)}
                                    />
                                ) : (
                                    <ImageSection value={signatureFile} onChange={setSignatureFile} />
                                )}
                                <CustomText className="" Text="Image signé :" />
                                <ImageSection value={imageFile} onChange={setImageFile} />
                            </div>
                            <p id="verify" style={{ display: 'none' }}></p>
                        </>
                    )}
                </>
            ),
        },
    ];

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

    return (
        <>
            <HeaderExpert 
                showProgress={true}
                currentStep={1}
                steps={["Connexion", "Vérification", "Résultat"]}
            />
            <Container>
            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonCustom
                    id="verifySignature"
                    style={{ marginTop: 6, width: '80%', padding: '12px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={handleVerifyClick}
                // disabled={isVerifying || !message || (!signatureId && !signatureFile) || !texte2 }
                >
                    Vérifier la signature
                </ButtonCustom>
            </div>
            </Container>
        </>
    );
}

export default VerifyPage;
