import React, { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import VerifyPage from "./pages/VerifyPage";
import GeneratePage from "./pages/GeneratePage";
import NotificationSystem from "./component/NotificationSystem";
import ThemeToggle from "./component/ThemeToggle";
import HeaderExpert from "./component/HeaderExpert";
import "./App.css";

// 🧹 Import propre
import { wagmiAdapter } from "./config/appkit";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');

  useEffect(() => {
    if (location !== displayLocation) {
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
      <ThemeToggle />
      <HeaderExpert />
      <div className={`page-transition-container ${transitionStage}`}>
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
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
