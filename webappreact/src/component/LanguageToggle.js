import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            className="header-action-btn-compact"
            onClick={toggleLanguage}
            title={i18n.language === 'fr' ? "Switch to English" : "Passer en Français"}
        >
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                {i18n.language === 'fr' ? 'FR' : 'EN'}
            </span>
        </button>
    );
};

export default LanguageToggle;
