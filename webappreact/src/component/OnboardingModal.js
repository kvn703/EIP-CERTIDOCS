import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWallet, FaFingerprint, FaShieldAlt, FaRocket, FaAddressBook } from 'react-icons/fa';
import { useOnboarding } from '../context/OnboardingContext';
import './OnboardingModal.css';

const OnboardingModal = () => {
    const { t } = useTranslation();
    const { isOpen, closeOnboarding } = useOnboarding();
    const [currentStep, setCurrentStep] = useState(0);

    // Réinitialiser à la première page chaque fois que le modal s'ouvre
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    const handleClose = () => {
        closeOnboarding();
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const steps = [
        {
            icon: <FaRocket />,
            title: t('tutorial_welcome_title'),
            desc: t('tutorial_welcome_desc')
        },
        {
            icon: <FaWallet />,
            title: t('tutorial_wallet_title'),
            desc: t('tutorial_wallet_desc')
        },
        {
            icon: <FaFingerprint />,
            title: t('tutorial_generate_title'),
            desc: t('tutorial_generate_desc')
        },
        {
            icon: <FaShieldAlt />,
            title: t('tutorial_verify_title'),
            desc: t('tutorial_verify_desc')
        },
        {
            icon: <FaAddressBook />,
            title: t('tutorial_directory_title'),
            desc: t('tutorial_directory_desc')
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-content">
                <i className="fas fa-times onboarding-close" onClick={handleClose} aria-label={t('close')}></i>

                <div className="onboarding-step" key={currentStep} style={{ animation: 'fadeIn 0.5s ease' }}>
                    <div className="onboarding-icon-container">
                        <div className="onboarding-icon">
                            {steps[currentStep].icon}
                        </div>
                    </div>

                    <h2 className="onboarding-title">
                        {steps[currentStep].title}
                    </h2>

                    <p className="onboarding-desc">
                        {steps[currentStep].desc}
                    </p>

                    <div className="onboarding-dots">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                className={`onboarding-dot ${index === currentStep ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="onboarding-footer">
                        {currentStep === 0 ? (
                            <div className="onboarding-nav onboarding-nav-first">
                                <button className="onboarding-btn onboarding-btn-close" onClick={handleClose}>
                                    {t('tutorial_close')}
                                </button>
                                <button className="onboarding-btn onboarding-btn-primary" onClick={handleNext}>
                                    {t('tutorial_next')}
                                </button>
                            </div>
                        ) : (
                            <div className="onboarding-nav">
                                <button className="onboarding-btn onboarding-btn-secondary" onClick={handlePrev}>
                                    {t('tutorial_prev')}
                                </button>
                                <button className="onboarding-btn onboarding-btn-primary" onClick={handleNext}>
                                    {currentStep === steps.length - 1 ? t('tutorial_finish') : t('tutorial_next')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
