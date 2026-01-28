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
            className="lang-toggle"
            onClick={toggleLanguage}
            title={i18n.language === 'fr' ? "Switch to English" : "Passer en Français"}
        >
            <span className="lang-code">
                {i18n.language === 'fr' ? 'FR' : 'EN'}
            </span>
            <i className="fas fa-globe"></i>
        </button>
    );
};

export default LanguageToggle;
