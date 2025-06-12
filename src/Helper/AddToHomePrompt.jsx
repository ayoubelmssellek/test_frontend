import React, { useEffect, useState } from 'react';

const AddToHomeMessage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setShowMessage(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleAddToHome = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted A2HS');
        } else {
          console.log('User dismissed A2HS');
        }
        setShowMessage(false);
      });
    }
  };

  if (!showMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: '#fff3cd',
      border: '1px solid #ffeeba',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <span>📱 Add Gusto Dakhla to your home screen for easy access</span>
      <button
        onClick={handleAddToHome}
        style={{
          marginLeft: '15px',
          padding: '8px 14px',
          backgroundColor: '#ff5722',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add to Home
      </button>
    </div>
  );
};

export default AddToHomeMessage;
