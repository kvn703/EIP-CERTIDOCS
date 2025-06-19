import React from "react";
import { WagmiProvider } from "wagmi";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import VerifyPage from "./pages/VerifyPage";
import GeneratePage from "./pages/GeneratePage";
import SignPDFPage from "./pages/SignPDFPage";
import VerifyPDFPage from "./pages/VerifyPDFPage";

// 🧹 Import propre
import { wagmiAdapter } from "./config/appkit";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="App">
          <Routes>
            <Route path="/verify" element={<VerifyPage />} id="verify" />
            <Route path="/signPDF" element={<SignPDFPage />} id="signPDF" />
            <Route path="/verifyPDF" element={<VerifyPDFPage />} id="verifyPDF" />
            <Route path="/" element={<GeneratePage />} id="generate" />
          </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
