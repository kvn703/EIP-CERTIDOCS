import React, { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import VerifyPage from "./pages/VerifyPage";
import GeneratePage from "./pages/GeneratePage";
import NotificationSystem from "./component/NotificationSystem";
import HeaderExpert from "./component/HeaderExpert";
import OnboardingModal from "./component/OnboardingModal";
import { OnboardingProvider } from "./context/OnboardingContext";
import "./App.css";

// 🧹 Import propre
import { wagmiAdapter } from "./config/appkit";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');
  const [direction, setDirection] = useState('right'); // 'right' ou 'left'

  useEffect(() => {
    if (location !== displayLocation) {
      // Déterminer la direction : Générer (/) → Vérifier (/verify) = gauche
      // Vérifier (/verify) → Générer (/) = droite
      const goingToVerify = location.pathname === '/verify';
      const comingFromVerify = displayLocation.pathname === '/verify';
      
      if (goingToVerify && !comingFromVerify) {
        // Générer → Vérifier : slide vers la gauche
        setDirection('left');
      } else if (!goingToVerify && comingFromVerify) {
        // Vérifier → Générer : slide vers la droite
        setDirection('right');
      }
      
      setTransitionStage('exit');
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (transitionStage === 'exit') {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, location]);

  return (
    <div className="App">
      <NotificationSystem />
      <HeaderExpert />
      <OnboardingModal />
      <div className={`page-transition-container ${transitionStage} ${transitionStage}-${direction}`}>
        <Routes location={displayLocation}>
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/" element={<GeneratePage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnboardingProvider>
          <Router>
            <AppContent />
          </Router>
        </OnboardingProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
