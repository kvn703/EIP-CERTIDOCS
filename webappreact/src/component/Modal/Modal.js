import React from "react";
import "./Modal.css";

const Modal = ({ children, onClose }) => {
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fermer la modal">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 