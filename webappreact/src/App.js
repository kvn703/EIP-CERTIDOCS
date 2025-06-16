import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import VerifyPage from "./pages/VerifyPage";
import GeneratePage from "./pages/GeneratePage";
import SignPDFPage from "./pages/SignPDFPage";

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/verify" element={<VerifyPage />} id="verify" />
          <Route path="/signPDF" element={<SignPDFPage />} id="signPDF" />
          <Route path="/" element={<GeneratePage />} id="generate" />
        </Routes>
      </div>
    </Router>
  );
}

export default App;