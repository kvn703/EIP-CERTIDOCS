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

import { useTranslation } from 'react-i18next';

function VerifyPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const { isConnected } = useAppKitAccount();
    const [signatureId, setSignatureId] = useState("");
    const [message, setMessage] = useState("");
    const [activeTab, _setActiveTab] = useState(0);

    // IMPORTANT: Charger dynamiquement verify.js si ce n'est pas déjà fait
    // Le script n'est chargé dans index.html que si on arrive directement sur /verify
    // Avec React Router, lors de la navigation, le script n'est pas chargé
    useEffect(() => {
        // Initialiser les flags globaux si nécessaire
        if (typeof window.__verifyScriptLoaded === 'undefined') {
            window.__verifyScriptLoaded = false;
        }
        if (typeof window.__verifyScriptLoading === 'undefined') {
            window.__verifyScriptLoading = false;
        }

        // PRIORITÉ 1: Vérifier si la fonction est déjà disponible (script déjà chargé)
        if (typeof window.verifySignature === 'function') {
            console.log('[VerifyPage] verifySignature déjà disponible, ne pas charger le script');
            window.__verifyScriptLoaded = true;
            window.__verifyScriptLoading = false;
            return; // Le script est déjà chargé et exécuté
        }

        // PRIORITÉ 2: Vérifier le flag global pour éviter le double chargement
        // Cette vérification doit être faite AVANT de vérifier le DOM car le script peut être en cours de chargement
        if (window.__verifyScriptLoaded || window.__verifyScriptLoading) {
            console.log('[VerifyPage] Script verify.js déjà chargé ou en cours de chargement (flag global), ne pas le charger à nouveau');
            return;
        }

        // PRIORITÉ 3: Vérifier si le script est déjà dans le DOM (même s'il n'est pas encore chargé)
        // Cette vérification doit être faite AVANT de charger le script
        const allScripts = Array.from(document.querySelectorAll('script[src]'));
        const existingScript = allScripts.find(script => {
            const src = script.src || script.getAttribute('src') || '';
            // Vérifier si le src contient 'verify.js' (peut être avec ou sans PUBLIC_URL)
            return src.includes('verify.js') || src.includes('/scripts/verify.js');
        });

        if (existingScript) {
            // Le script est déjà présent dans le DOM
            console.log('[VerifyPage] Script verify.js déjà présent dans le DOM, ne pas le charger à nouveau');
            window.__verifyScriptLoaded = true;
            window.__verifyScriptLoading = false;

            // Attendre qu'il soit chargé si nécessaire
            if (existingScript.readyState === 'complete' || existingScript.readyState === 'loaded') {
                // Le script est chargé, vérifier si la fonction est disponible
                if (typeof window.verifySignature === 'function') {
                    console.log('[VerifyPage] Script verify.js existant - fonction disponible');
                    return;
                }
                // Le script est chargé mais la fonction n'est pas encore disponible
                // Attendre un peu plus pour que le script soit complètement exécuté
                setTimeout(() => {
                    if (typeof window.verifySignature === 'function') {
                        console.log('[VerifyPage] Script verify.js existant - fonction disponible après délai');
                    } else {
                        console.warn('[VerifyPage] Script verify.js existant mais verifySignature n\'est pas disponible');
                    }
                }, 500);
            } else {
                // Le script est en cours de chargement, attendre qu'il soit chargé
                window.__verifyScriptLoading = true;
                const loadHandler = () => {
                    console.log('[VerifyPage] Script verify.js existant chargé avec succès');
                    window.__verifyScriptLoading = false;
                    window.__verifyScriptLoaded = true;
                    // Vérifier après un court délai si la fonction est disponible
                    setTimeout(() => {
                        if (typeof window.verifySignature === 'function') {
                            console.log('[VerifyPage] verifySignature disponible après chargement');
                        } else {
                            console.warn('[VerifyPage] verifySignature n\'est toujours pas disponible après le chargement');
                        }
                    }, 200);
                };
                existingScript.addEventListener('load', loadHandler, { once: true });
                // Si le script est déjà chargé mais l'événement load n'a pas été déclenché
                if (existingScript.readyState === 'interactive') {
                    loadHandler();
                }
            }
            return; // Ne JAMAIS charger le script à nouveau
        }

        // PRIORITÉ 4: Le script n'est pas dans le DOM et la fonction n'existe pas
        // Le charger dynamiquement (cas de navigation avec React Router)
        console.log('[VerifyPage] Chargement dynamique de verify.js (navigation React Router)');
        window.__verifyScriptLoading = true; // Marquer comme en cours de chargement AVANT de l'ajouter au DOM
        window.__verifyScriptLoaded = false; // S'assurer que le flag est à false

        const script = document.createElement('script');
        const publicUrl = process.env.PUBLIC_URL || '';
        script.src = publicUrl ? `${publicUrl}/scripts/verify.js` : '/scripts/verify.js';
        script.async = true; // Charger de manière asynchrone

        script.onload = () => {
            console.log('[VerifyPage] Script verify.js chargé avec succès');
            window.__verifyScriptLoading = false;
            window.__verifyScriptLoaded = true;
            // Attendre un peu pour que le script soit complètement exécuté
            setTimeout(() => {
                if (typeof window.verifySignature === 'function') {
                    console.log('[VerifyPage] verifySignature disponible après chargement dynamique');
                } else {
                    console.warn('[VerifyPage] verifySignature n\'est toujours pas disponible après le chargement du script');
                }
            }, 200);
        };

        script.onerror = () => {
            console.error('[VerifyPage] Erreur lors du chargement du script verify.js');
            window.__verifyScriptLoading = false;
            window.__verifyScriptLoaded = false; // Réinitialiser le flag en cas d'erreur
        };

        document.body.appendChild(script);

        return () => {
            // Ne pas supprimer le script au démontage car il peut être utilisé ailleurs
            // Le script reste en mémoire même si le composant est démonté
        };
    }, []); // Se déclenche une seule fois au montage du composant
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
            // IMPORTANT: Synchroniser le wallet pour verify.js avant de déclencher l'événement
            // Cela résout le problème de navigation où le signer n'est pas disponible
            const syncAndConnect = async () => {
                if (typeof window.__syncWalletForVerify === 'function') {
                    await window.__syncWalletForVerify();
                }
                window.dispatchEvent(new Event('walletConnected'));
            };
            syncAndConnect();
        }
        // Ne pas réinitialiser currentStep ici, laisser la logique basée sur les champs le gérer
    }, [isConnected]);

    useEffect(() => {
        if (verificationResult || hasVerificationCompleted) {
            setCurrentStep(4);
        }
    }, [verificationResult, hasVerificationCompleted]);

    // S'assurer que la modal s'ouvre automatiquement quand le résultat est disponible
    useEffect(() => {
        if (verificationResult && hasVerificationCompleted && !isResultModalOpen) {
            setIsResultModalOpen(true);
        }
    }, [verificationResult, hasVerificationCompleted, isResultModalOpen]);

    // Calcul de l'étape actuelle basé sur les champs remplis
    useEffect(() => {
        if (verificationResult || hasVerificationCompleted) {
            return;
        }

        if (isVerifying) {
            setCurrentStep(3);
            return;
        }

        // Vérifier si l'empreinte est remplie (signatureId ou texte1)
        const hasFingerprint = (signatureId && signatureId.trim() !== '') || (texte1 && texte1.trim() !== '') || signatureFile;
        
        // Vérifier si le contenu est rempli (message, texte2, pdfFile, ou imageFile)
        const hasContent = (message && message.trim() !== '') || (texte2 && texte2.trim() !== '') || pdfFile || imageFile;

        // Étape 3 : Résultat (en cours de vérification)
        if (isVerifying) {
            setCurrentStep(3);
            return;
        }

        // Étape 2 : Contenu rempli - cocher étape 1 (Empreinte) et étape 2 (Contenu)
        if (hasFingerprint && hasContent) {
            setCurrentStep(3);
            return;
        }

        // Étape 1 : Empreinte remplie - cocher étape 1 (Empreinte)
        if (hasFingerprint) {
            setCurrentStep(2);
            return;
        }

        // Étape 0 : Aucun champ rempli
        setCurrentStep(1);
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

        if (messageInput && message) {
            // Normaliser le message : supprimer les espaces et s'assurer qu'il est au bon format
            let normalizedMessage = message.trim().replace(/\s/g, '');
            // Si c'est un hash sans préfixe 0x, l'ajouter
            if (/^[a-fA-F0-9]{64}$/.test(normalizedMessage) && !normalizedMessage.startsWith('0x')) {
                normalizedMessage = '0x' + normalizedMessage;
            }
            messageInput.value = normalizedMessage;
        } else if (messageInput) {
            messageInput.value = '';
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
                if (text.includes("✅ Empreinte VALIDE") || text.includes("✅ Preuve VALIDE")) {
                    setIsVerifying(false);
                    setVerificationResult('success');
                    setHasVerificationCompleted(true);
                    setCurrentStep(4);
                    setIsResultModalOpen(true);
                    resultProcessedRef.current = true;
                    verify_element.style.display = 'none';
                    verify_element.innerText = '';
                    if (interval) clearInterval(interval);
                } else if (text.includes("❌ Empreinte NON VALIDE") || text.includes("❌ Preuve NON VALIDE") || text.includes("❌ Erreur")) {
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
        // setShowContentRecovered(false); // Garder la notif affichée comme demandé
        setIsVerifying(true);
        setVerificationResult(null);
        setHasVerificationCompleted(false);

        // IMPORTANT: S'assurer que les inputs DOM sont remplis AVANT d'appeler verifySignature()
        // Cela garantit que les valeurs sont synchronisées même lors de la première vérification
        if (activeTab === 0) {
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
            }

            if (messageInput && message) {
                // Normaliser le message : supprimer les espaces et s'assurer qu'il est au bon format
                let normalizedMessage = message.trim().replace(/\s/g, '');
                // Si c'est un hash sans préfixe 0x, l'ajouter
                if (/^[a-fA-F0-9]{64}$/.test(normalizedMessage) && !normalizedMessage.startsWith('0x')) {
                    normalizedMessage = '0x' + normalizedMessage;
                }
                messageInput.value = normalizedMessage;
            }
        }

        // S'assurer que l'élément verify existe et est prêt
        // IMPORTANT: Garder display: none pour que le texte ne soit pas visible
        const verify_element = document.getElementById("verify");
        if (verify_element) {
            verify_element.style.display = 'none'; // Toujours caché
            verify_element.innerText = ''; // Réinitialiser le texte
        }

        // IMPORTANT: Attendre que le script verify.js soit chargé et que signer/contract soient initialisés
        // Le script est chargé de manière asynchrone, donc il peut ne pas être disponible immédiatement
        // Augmenter le nombre de tentatives pour donner plus de temps au script de se charger
        const waitForVerifySignature = (maxAttempts = 50, attempt = 0) => {
            // IMPORTANT: Synchroniser currentTab dans verify.js avec l'onglet actif React
            // currentTab est une variable globale dans verify.js qui doit être mise à jour
            if (typeof window.dispatchEvent === 'function') {
                window.dispatchEvent(new CustomEvent('tabChanged', { detail: activeTab }));
            }

            // Vérifier une dernière fois que les inputs sont bien remplis avant d'appeler verifySignature
            if (activeTab === 0) {
                const signatureIdInput = document.getElementById("signatureId");
                const messageInput = document.getElementById("messageInput");

                // Si les inputs ne sont pas remplis, les remplir à nouveau
                if (signatureIdInput && signatureId && !signatureIdInput.value.trim()) {
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
                }

                if (messageInput && message && !messageInput.value.trim()) {
                    // Normaliser le message : supprimer les espaces et s'assurer qu'il est au bon format
                    let normalizedMessage = message.trim().replace(/\s/g, '');
                    // Si c'est un hash sans préfixe 0x, l'ajouter
                    if (/^[a-fA-F0-9]{64}$/.test(normalizedMessage) && !normalizedMessage.startsWith('0x')) {
                        normalizedMessage = '0x' + normalizedMessage;
                    }
                    messageInput.value = normalizedMessage;
                }
            }

            // Vérifier que verifySignature est disponible ET que signer est initialisé
            // Note: verifySignature vérifie signer lui-même et affiche une alerte si non disponible
            // Mais on veut s'assurer que la fonction s'exécute vraiment
            if (typeof window.verifySignature === 'function') {
                // Vérifier que les éléments DOM nécessaires existent
                if (activeTab === 0) {
                    const signatureIdInput = document.getElementById("signatureId");
                    const messageInput = document.getElementById("messageInput");
                    if (!signatureIdInput || !messageInput) {
                        if (attempt < maxAttempts) {
                            setTimeout(() => waitForVerifySignature(maxAttempts, attempt + 1), 100);
                            return;
                        }
                    }
                }

                try {
                    // Appeler verifySignature - il vérifiera signer lui-même
                    window.verifySignature();
                } catch (error) {
                    console.error('[VerifyPage] Erreur lors de l\'appel à verifySignature:', error);
                    setIsVerifying(false);
                    setVerificationResult('error');
                    setHasVerificationCompleted(true);
                }
            } else if (attempt < maxAttempts) {
                // Réessayer après 150ms si le script n'est pas encore chargé
                // Augmenter le délai pour donner plus de temps au script de se charger
                setTimeout(() => waitForVerifySignature(maxAttempts, attempt + 1), 150);
            } else {
                // Si verifySignature n'est toujours pas disponible après plusieurs tentatives, arrêter la vérification
                console.error('[VerifyPage] verifySignature n\'est pas disponible après', maxAttempts, 'tentatives');
                setIsVerifying(false);
                setVerificationResult('error');
                setHasVerificationCompleted(true);
            }
        };

        // Commencer à attendre que verifySignature soit disponible
        // Utiliser setTimeout pour s'assurer que les inputs DOM sont bien mis à jour
        // Augmenter le délai initial pour donner plus de temps au script de se charger
        setTimeout(() => {
            waitForVerifySignature();
        }, 200);
    };

    const handleCloseModal = () => {
        setIsResultModalOpen(false);
        const wasError = verificationResult === 'error';
        setVerificationResult(null);
        setIsVerifying(false);
        setHasVerificationCompleted(false);
        resultProcessedRef.current = false;
        // Si la preuve était invalide, réinitialiser la barre de progression et les champs
        if (wasError) {
            setCurrentStep(1);
            // Réinitialiser les champs de l'empreinte
            setSignatureId("");
            setTexte1("");
            setSignatureFile(null);
            // Réinitialiser les champs du contenu
            setMessage("");
            setTexte2("");
            setPdfFile(null);
            setImageFile(null);
            // Réinitialiser aussi les inputs DOM pour verify.js
            setTimeout(() => {
                const signatureIdInput = document.getElementById("signatureId");
                const messageInput = document.getElementById("messageInput");
                const texte2Input = document.getElementById("texte2");
                const signatureIdStringInput = document.getElementById("signatureIdString");
                if (signatureIdInput) signatureIdInput.value = "";
                if (messageInput) messageInput.value = "";
                if (texte2Input) texte2Input.value = "";
                if (signatureIdStringInput) signatureIdStringInput.value = "";
                
                // Réinitialiser les inputs file pour PDF et Image
                const pdfInputs = document.querySelectorAll('input[type="file"][accept="application/pdf"]');
                pdfInputs.forEach(input => {
                    if (input) input.value = "";
                });
                
                const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
                imageInputs.forEach(input => {
                    if (input) input.value = "";
                });
            }, 0);
        }
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
                        {t('reloading')}
                    </div>
                    <div style={{
                        fontSize: '16px',
                        color: '#666',
                        lineHeight: '1.5'
                    }}>
                        {t('recovering_mail_content')}
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
                    <span>{t('tab_mail')}</span>
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


                            {mailContentLost && (
                                <div className="verify-modern-inputs" style={{ marginBottom: '4px' }}>
                                    <div className="verify-modern-input-card" style={{ borderColor: 'rgba(149, 132, 255, 0.4)', background: 'linear-gradient(135deg, rgba(240, 234, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)' }}>
                                        <div className="modern-input-icon" style={{ background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.25) 0%, rgba(184, 170, 255, 0.18) 100%)' }}>
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '28px', height: '28px' }}>
                                                <path d="M12 9V13M12 17H12.01M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <div className="modern-input-content">
                                            <label className="modern-input-label">
                                                {t('content_lost')}
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
                                                {t('reload_mail_content')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(signatureId || message) && (
                                <div className="verify-modern-inputs">
                                    {signatureId && (
                                        <div className="verify-modern-input-card verify-modern-input-card-primary" style={{ opacity: 0.7 }}>
                                            <div className="modern-input-icon">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="modern-input-content">
                                                <HashDisplay
                                                    value={signatureId}
                                                    label={t('fingerprint_id')}
                                                    onCopy={async (value) => {
                                                        await navigator.clipboard.writeText(value);
                                                    }}
                                                    isReadOnly={true}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Message certifié masqué comme demandé */}
                                    {/* {message && (
                                        <div className="verify-modern-input-card verify-modern-input-card-secondary">
                                            <div className="modern-input-icon">
                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <div className="modern-input-content">
                                                <HashDisplay
                                                    value={message}
                                                    label={t('signed_message')}
                                                    onCopy={async (value) => {
                                                        await navigator.clipboard.writeText(value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            )}

                            {signatureId && message && showContentRecovered && (
                                <div style={{
                                    flex: 1,
                                    margin: '16px 0',
                                    background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.08) 0%, rgba(184, 170, 255, 0.04) 100%)',
                                    border: '1px solid rgba(149, 132, 255, 0.2)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    padding: '24px',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 20px rgba(149, 132, 255, 0.1)',
                                    animation: 'fadeIn 0.5s ease-out'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: 'linear-gradient(135deg, #7fffa7 0%, #9584ff 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '16px',
                                        boxShadow: '0 8px 16px rgba(149, 132, 255, 0.2)'
                                    }}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '18px',
                                        fontWeight: '700',
                                        color: '#2d2a3e'
                                    }}>
                                        Contenu récupéré
                                    </h3>
                                    <p style={{
                                        margin: '0',
                                        fontSize: '14px',
                                        color: '#6b6880',
                                        lineHeight: '1.5',
                                        maxWidth: '280px'
                                    }}>
                                        Contenu du mail et empreinte ID dans l'image récupérés avec succès. Vous pouvez maintenant lancer la vérification.
                                    </p>
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

                    {verificationResult && !isResultModalOpen && (
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
                                    onChange={() => { }}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* PHASE 2.1 : Cards d'input modernes */}
                            <div className="verify-modern-inputs">
                                {/* PHASE 2.2 : Input Proof ID */}
                                <div className="verify-modern-input-card verify-modern-input-card-primary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M7 13L10 16L17 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="modern-input-content">
                                        <label className="modern-input-label">
                                            {t('signed_message')}
                                        </label>
                                        <div className="modern-input-wrapper">
                                            <CustomTextInput
                                                id="texte2"
                                                rows={3}
                                                placeholder={t('paste_signed_message')}
                                                value={texte2}
                                                onChange={e => setTexte2(e.target.value)}
                                                aria-label="Message certifié à vérifier"
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
                        <textarea id="texte2" value={texte2} onChange={() => { }} readOnly />
                        <input id="signatureIdString" value={texte1} onChange={() => { }} readOnly />
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
                    {(isVerifying || verificationResult) && !isResultModalOpen && (
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
                                    onChange={() => { }}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* PHASE 2.1 : Cards d'input modernes */}
                            <div className="verify-modern-inputs">
                                {/* PHASE 2.2 : Input Proof ID */}
                                <div className="verify-modern-input-card verify-modern-input-card-primary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                            {t('signed_pdf')}
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
                    {(isVerifying || verificationResult) && !isResultModalOpen && (
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
                                    onChange={() => { }}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            {/* PHASE 2.1 : Cards d'input modernes */}
                            <div className="verify-modern-inputs">
                                {/* PHASE 2.2 : Input Proof ID */}
                                <div className="verify-modern-input-card verify-modern-input-card-primary">
                                    <div className="modern-input-icon">
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                            {t('signed_image')}
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
                    <div className="verify-scrollable-content">
                        <div className="verify-timeline-section">
                            <Timeline
                                currentStep={verificationResult ? 4 : currentStep}
                                steps={[
                                    { id: 1, label: t('step_fingerprint'), icon: FaCircle },
                                    { id: 2, label: t('step_content'), icon: FaEdit },
                                    { id: 3, label: t('step_result'), icon: FaCircle },
                                ]}
                            />
                        </div>

                        <div className="verify-tabs-section">
                            <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
                        </div>
                    </div>

                    <StickyButton
                        onClick={handleVerifyClick}
                        disabled={!isButtonEnabled()}
                        isLoading={isVerifying}
                        isSuccess={verificationResult === 'success'}
                        isError={verificationResult === 'error'}
                        loadingText={t('verifying')}
                        successText={t('valid_fingerprint')}
                        errorText={t('invalid_fingerprint')}
                    >
                        {t('verify_button')}
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
                onChange={() => { }}
                style={{ display: 'none' }}
            />
        </>
    );
}

export default VerifyPage;
