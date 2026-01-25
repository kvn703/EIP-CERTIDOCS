import React from 'react';
import { FaSpinner, FaShieldAlt } from 'react-icons/fa';
import './VerifyLoading.css';

const VerifyLoading = () => {
    return (
        <div className="verify-loading-container">
            <div className="verify-loading-content">
                <div className="verify-loading-icon-wrapper">
                    <div className="verify-loading-pulse-ring-1"></div>
                    <div className="verify-loading-pulse-ring-2"></div>
                    <div className="verify-loading-pulse-ring-3"></div>
                    <div className="verify-loading-spinner-wrapper">
                        <FaSpinner className="verify-loading-spinner" />
                        <div className="verify-loading-glow"></div>
                    </div>
                </div>
                <div className="verify-loading-text-wrapper">
                    <FaShieldAlt className="verify-loading-shield-icon" />
                    <div className="verify-loading-text">
                        Vérification en cours
                        <span className="verify-loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                    </div>
                </div>
                <div className="verify-loading-progress-bar">
                    <div className="verify-loading-progress-fill"></div>
                </div>
            </div>
        </div>
    );
};

export default VerifyLoading;

