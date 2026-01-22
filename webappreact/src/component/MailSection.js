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