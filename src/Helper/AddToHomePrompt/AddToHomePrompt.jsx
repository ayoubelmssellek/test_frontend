import { useEffect, useState } from 'react';
import './InstallAppPrompt.css';

function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [closed, setClosed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // iOS detection
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // Check if in standalone mode
  const isInStandaloneMode = () =>
    'standalone' in window.navigator && window.navigator.standalone;

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowAndroid(true);
      setIsVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (isIos() && !isInStandaloneMode()) {
      setShowIOS(true);
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install prompt');
        } else {
          console.log('User dismissed install prompt');
        }
        setDeferredPrompt(null);
        setShowAndroid(false);
        setIsVisible(false);
      });
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setClosed(true), 300);
  };

  if ((!showAndroid && !showIOS) || closed) return null;

  return (
    <div className={`app-install-prompt ${isVisible ? 'visible' : ''}`}>
      <div className="prompt-content">
        {showAndroid && (
          <div className="android-prompt">
            <div className="prompt-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,1H5A5.006,5.006,0,0,0,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6A5.006,5.006,0,0,0,19,1ZM5,3H19a3,3,0,0,1,3,3v8H2V6A3,3,0,0,1,5,3ZM19,21H5a3,3,0,0,1-3-3V16H22v2A3,3,0,0,1,19,21Z"/>
              </svg>
            </div>
            <span>تطبيق طعامنا: </span>
            <button onClick={handleInstallClick} className="install-button">
              تثبيت
            </button>
          </div>
        )}

        {showIOS && (
          <div className="ios-prompt">
            <div className="prompt-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.365,1.43a1.5,1.5,0,0,0-1.5,0L5.577,6.893a1.5,1.5,0,0,0-.75,1.3v7.614a1.5,1.5,0,0,0,.75,1.3l9.288,5.463a1.5,1.5,0,0,0,1.5,0l9.288-5.463a1.5,1.5,0,0,0,.75-1.3V8.193a1.5,1.5,0,0,0-.75-1.3ZM18,15a1,1,0,0,1-1,1H13a1,1,0,0,1-1-1V13a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1Z"/>
              </svg>
            </div>
            <span>إضافة تطبيق: مشاركة → إضافة للشاشة الرئيسية</span>
          </div>
        )}
      </div>
      
      <button onClick={handleClose} className="close-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"/>
        </svg>
      </button>
    </div>
  );
}

export default InstallAppPrompt;