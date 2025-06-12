import React, { useEffect, useState } from 'react';

const AddToHome = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // باش مانخليهش يطلع بوحدو
      setDeferredPrompt(e);
      setShowPrompt(true); // نعرض الزر ديال الإضافة
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAddToHome = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // كيطلع popup ديال Chrome
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div style={{
      background: '#fff3cd',
      padding: '10px',
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    }}>
      <span>🌟 زيد Gusto Dakhla للشاشة الرئيسية!</span>
      <button onClick={handleAddToHome} style={{
        marginLeft: '10px',
        padding: '5px 10px',
        background: '#ff5722',
        color: '#fff',
        border: 'none',
        borderRadius: '4px'
      }}>
        ضيف
      </button>
    </div>
  );
};

export default AddToHome;
