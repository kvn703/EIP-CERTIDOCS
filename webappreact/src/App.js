import React from "react";
import { WagmiProvider } from "wagmi";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import VerifyPage from "./pages/VerifyPage";
import GeneratePage from "./pages/GeneratePage";
import NotificationSystem from "./component/NotificationSystem";
import ThemeToggle from "./component/ThemeToggle";

// 🧹 Import propre
import { wagmiAdapter } from "./config/appkit";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
            <NotificationSystem />
            <ThemeToggle />
            <Routes>
              <Route path="/verify" element={<VerifyPage />} />
              <Route path="/" element={<GeneratePage />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
