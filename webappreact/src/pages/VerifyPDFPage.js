import React, { useState } from "react";
import Container from "../component/Container";
import ButtonCustom from "../component/ButtonCustom";
import CustomText from "../component/CustomText";

const VerifyPDFPage = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const walletAddress = "0x75F8...1a2k"; // À remplacer par la vraie adresse si besoin

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles.filter(f => !prev.some(p => p.name === f.name && p.size === f.size))]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles.filter(f => !prev.some(p => p.name === f.name && p.size === f.size))]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleVerify = () => {
    setStatus("Vérification en cours...");
    // Logique de vérification à implémenter
    setTimeout(() => setStatus("Vérification terminée !"), 1500);
  };

  return (
    <Container>
      <CustomText Text="Vérifier un PDF" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <span style={{ color: '#4caf50', fontWeight: 'bold', marginRight: 8 }}>Connecté</span>
        <span style={{ background: '#f5f5f5', borderRadius: 8, padding: '2px 8px', fontSize: 13 }}>{walletAddress}</span>
        <span
          style={{ marginLeft: 8, color: copied ? '#9584ff' : '#bdbdbd', fontSize: 18, cursor: 'pointer', transition: 'color 0.2s' }}
          onClick={handleCopy}
          title="Copier l'adresse"
        >
          {copied ? '✅' : '📋'}
        </span>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #9584ff',
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
          marginBottom: 20,
          background: '#fafaff',
          cursor: 'pointer',
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          style={{ display: 'none' }}
          id="pdf-upload-verify"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="pdf-upload-verify" style={{ cursor: 'pointer' }}>
          <span style={{ fontSize: 32, color: '#9584ff' }}>⬆️</span>
          <div>Upload un fichier<br />ou drag and drop</div>
        </label>
      </div>
      {/* Liste des fichiers ajoutés */}
      {files.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {files.map((file, idx) => (
            <div key={file.name + file.size} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ flex: 1 }}>{file.name}</span>
              <span
                style={{ color: '#d32f2f', fontWeight: 'bold', cursor: 'pointer', marginLeft: 8 }}
                onClick={() => handleRemoveFile(idx)}
                title="Supprimer"
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      )}
      <ButtonCustom id="verifyPDF" onClick={handleVerify} style={{ marginTop: 24 }} disabled={files.length === 0}>
        Vérifier le(s) PDF
      </ButtonCustom>
      {status && <div style={{ marginTop: 16, color: '#4caf50', fontWeight: 'bold' }}>{status}</div>}
    </Container>
  );
};

export default VerifyPDFPage; 