import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './VerificationAnimation.css';

const VerificationAnimation = ({ isVerifying, result, onComplete }) => {

    useEffect(() => {
        if (isVerifying) {
            // Logique de progression pour future utilisation
        }
    }, [isVerifying]);

    useEffect(() => {
        if (result && onComplete) {
            // Ne plus appeler onComplete automatiquement pour garder le résultat affiché
            // setTimeout(() => {
            //   onComplete();
            // }, 2000);
        }
    }, [result, onComplete]);

    if (!isVerifying && !result) {
        return null;
    }

    return (
        <div className="verification-animation-container" style={{ marginTop: isVerifying ? '20px' : '0' }}>
            {/* Masqué : partie "Vérification en cours" */}
            {/* {isVerifying && (
                <div className="verification-loading">
                    <div className="verification-header">
                        <div className="verification-icon-container">
                            <FaShieldAlt className="verification-main-icon" />
                            <div className="verification-pulse-ring"></div>
                        </div>
                        <h3 className="verification-title">Vérification en cours</h3>
                        <p className="verification-subtitle">Analyse de votre signature électronique</p>
                    </div>
                </div>
            )} */}

            {result && (
                <div className={`verification-result ${result === 'success' ? 'success' : 'error'}`}>
                    <div className="result-icon-container">
                        {result === 'success' ? (
                            <FaCheckCircle className="result-icon success" />
                        ) : (
                            <FaTimesCircle className="result-icon error" />
                        )}
                        <div className="result-pulse-ring"></div>
                    </div>

                    <h3 className="result-title">
                        {result === 'success' ? 'Signature Validée !' : 'Signature Invalide'}
                    </h3>

                    <p className="result-message">
                        {result === 'success'
                            ? 'Votre signature électronique est authentique et valide.'
                            : 'La signature ne correspond pas ou l\'ID est incorrect.'
                        }
                    </p>

                    <div className="result-details">
                        <div className="result-detail-item">
                            <span className="detail-label">Statut :</span>
                            <span className={`detail-value ${result === 'success' ? 'success' : 'error'}`}>
                                {result === 'success' ? 'Authentique' : 'Non authentique'}
                            </span>
                        </div>
                        <div className="result-detail-item">
                            <span className="detail-label">Timestamp :</span>
                            <span className="detail-value">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationAnimation; 