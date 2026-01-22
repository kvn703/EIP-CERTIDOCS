import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaTimes, FaFingerprint, FaShieldAlt, FaRocket } from 'react-icons/fa';
import './OnboardingModal.css';

const OnboardingModal = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('certidocs_has_seen_tutorial');
        if (!hasSeenTutorial) {
            setIsOpen(true);
            document.body.style.overflow = 'hidden';
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        document.body.style.overflow = '';
        localStorage.setItem('certidocs_has_seen_tutorial', 'true');
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
            icon: <FaFingerprint />,
            title: t('tutorial_generate_title'),
            desc: t('tutorial_generate_desc')
        },
        {
            icon: <FaShieldAlt />,
            title: t('tutorial_verify_title'),
            desc: t('tutorial_verify_desc')
        }
    ];

    if (!isOpen) return null;

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-content">
                <button className="onboarding-close" onClick={handleClose} aria-label={t('close')}>
                    <FaTimes />
                </button>

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
                        <button className="onboarding-skip" onClick={handleClose}>
                            {t('tutorial_skip')}
                        </button>

                        <div className="onboarding-nav">
                            {currentStep > 0 && (
                                <button className="onboarding-btn onboarding-btn-secondary" onClick={handlePrev}>
                                    {t('tutorial_prev')}
                                </button>
                            )}
                            <button className="onboarding-btn onboarding-btn-primary" onClick={handleNext}>
                                {currentStep === steps.length - 1 ? t('tutorial_finish') : t('tutorial_next')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
