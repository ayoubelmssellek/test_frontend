import React, { useEffect, useState } from 'react';
import { 
  FiShare2, 
  FiHome, 
  FiX,
  FiDownload,
  FiPlusSquare
} from 'react-icons/fi';
import { HiOutlineDevicePhoneMobile } from 'react-icons/hi2';
import styles from './InstallAppPrompt.module.css';

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
    <div className={styles.promptContainer}>
      <div className={styles.promptContent}>
        {showAndroid && (
          <div className={styles.promptRow}>
            <span className={styles.promptIcon}>
              <HiOutlineDevicePhoneMobile />
            </span>
            <span className={styles.instructionText}>
              أضف التطبيق للشاشة الرئيسية لتسهيل الوصول
            </span>
            <button 
              onClick={handleInstallClick} 
              className={styles.installButton}
              aria-label="Install app"
            >
              <FiDownload /> تثبيت
            </button>
          </div>
        )}

        {showIOS && (
          <div className={styles.promptRow}>
            <span className={styles.instructionText} >
              <span className={styles.text}>اضغط على</span>
              <span className={styles.icon}><FiShare2 /></span>
              <span className={styles.text}>ثم</span>
              <span className={styles.highlight}>"إضافة إلى الشاشة الرئيسية"</span>
              <span className={styles.icon}><FiHome /></span>
              <span className={styles.text}>لتثبيت التطبيق</span>
              <span className={styles.icon}><HiOutlineDevicePhoneMobile /></span>
            </span>
          </div>
        )}
      </div>
      
      <button 
        onClick={handleClose} 
        className={styles.closeButton} 
        aria-label="Close prompt"
      >
        <FiX size={20} />
      </button>
    </div>
  );
}

export default InstallAppPrompt;