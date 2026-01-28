import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import './MailSection.css';

const MailSection = ({ message, isConnected, active }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isConnected || !active) return;
    if (message) {
      setIsLoading(true);
      setIsDone(false);

      // Animation simple de 2 secondes
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsDone(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, isConnected, active]);

  if (!isConnected) {
    return <div style={{ color: 'var(--text-muted)', textAlign: 'center', margin: '1.5em 0' }}>{t('connect_wallet_sign')}</div>;
  }
  
  // Afficher un message si l'onglet Mail est actif mais qu'il n'y a pas de contenu
  if (!message && active) {
    return (
      <div className="mail-section-empty" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        margin: '1.5em 0',
        background: 'linear-gradient(135deg, rgba(240, 234, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(149, 132, 255, 0.3)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(149, 132, 255, 0.2) 0%, rgba(184, 170, 255, 0.15) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '32px', height: '32px', color: '#9584ff' }}>
            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#2d2346',
          marginBottom: '8px',
          marginTop: 0
        }}>
          {t('mail_content_not_found')}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#666',
          lineHeight: '1.6',
          margin: 0,
          maxWidth: '400px'
        }}>
          {t('open_extension_from_compose')}
        </p>
      </div>
    );
  }
  
  if (!message) {
    return null;
  }

  return (
    <div className={`mail-section-loading ${isDone ? 'completed' : ''}`}>
      {isLoading && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 8px',
          textAlign: 'left'
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            border: '2px solid #f3f3f3',
            borderTop: '2px solid #9584ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
            flexShrink: 0
          }}></div>
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '2px'
            }}>
              {t('recovering')}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.2'
            }}>
              {t('analyzing_mail')}
            </div>
          </div>
        </div>
      )}

      {isDone && (
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 8px'
        }}>
          <FaCheckCircle style={{
            fontSize: '18px',
            marginRight: '8px',
            color: '#4CAF50',
            flexShrink: 0
          }} />
          <div>
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '2px'
            }}>
              {t('content_ready')}
            </div>
            <div style={{
              color: '#666',
              fontSize: '12px',
              lineHeight: '1.2'
            }}>
              {t('message_ready')}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MailSection;