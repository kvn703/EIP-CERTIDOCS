import React, { useState } from 'react';
import { FaCopy, FaEye, FaEyeSlash } from 'react-icons/fa';
import './HashDisplay.css';

const HashDisplay = ({ value, label, onCopy }) => {
    const [showFull, setShowFull] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!value) return null;

    const format_hash = (hash) => {
        if (!hash) return '';
        let clean_hash = hash.replace('[CERTIDOCS]', '').trim();
        if (clean_hash.length <= 24) return clean_hash;
        
        if (showFull) {
            return clean_hash.match(/.{1,4}/g)?.join(' ') || clean_hash;
        } else {
            return `${clean_hash.slice(0, 14)}...${clean_hash.slice(-10)}`;
        }
    };

    const handle_copy = async () => {
        if (onCopy) {
            await onCopy(value);
        } else {
            await navigator.clipboard.writeText(value);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatted_value = format_hash(value);
    const is_long = value.replace('[CERTIDOCS]', '').length > 20;

    return (
        <div className="hash-display-container">
            <div className="hash-display-header">
                <span className="hash-display-label">{label}</span>
                <div className="hash-display-actions">
                    {is_long && (
                        <button
                            className="hash-display-toggle"
                            onClick={() => setShowFull(!showFull)}
                            aria-label={showFull ? 'Réduire' : 'Voir complet'}
                            title={showFull ? 'Réduire' : 'Voir complet'}
                        >
                            {showFull ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    )}
                    <button
                        className={`hash-display-copy ${copied ? 'copied' : ''}`}
                        onClick={handle_copy}
                        aria-label="Copier"
                        title="Copier"
                    >
                        <FaCopy />
                    </button>
                </div>
            </div>
            <div className="hash-display-value" title={value}>
                {formatted_value}
            </div>
            {copied && (
                <div className="hash-display-feedback">
                    ✓ Copié !
                </div>
            )}
        </div>
    );
};

export default HashDisplay;

