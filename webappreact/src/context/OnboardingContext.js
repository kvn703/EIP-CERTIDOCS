import React, { createContext, useContext, useState, useEffect } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ouvrir automatiquement au premier chargement si l'utilisateur n'a pas encore vu le tutoriel
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('certidocs_has_seen_tutorial');
    if (!hasSeenTutorial) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const openOnboarding = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeOnboarding = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    localStorage.setItem('certidocs_has_seen_tutorial', 'true');
  };

  return (
    <OnboardingContext.Provider value={{ isOpen, openOnboarding, closeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};
