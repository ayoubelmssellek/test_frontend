import { useEffect, useState } from 'react';
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
    <div 
      className={`${styles.container} ${!isVisible ? styles.containerHidden : ''}`}
      aria-label="Install app prompt"
    >
      <div className={styles.banner}>
        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.iconContainer}>
              <svg 
                className={styles.icon} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className={styles.headerText}>
              <h3 className={styles.title}>تطبيق توصيل الطعام</h3>
              <p className={styles.subtitle}>تجربة أفضل مع التطبيق</p>
            </div>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {/* Android Prompt */}
            {showAndroid && (
              <div className={styles.androidPrompt}>
                <div className={styles.stepContainer}>
                  <div className={styles.stepIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className={styles.stepText}>حمل تطبيقنا لتجربة أسرع وطلبات أسهل</p>
                </div>
                <button 
                  onClick={handleInstallClick}
                  className={styles.installButton}
                  aria-label="Install app"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  تثبيت التطبيق
                </button>
              </div>
            )}

            {/* iOS Prompt */}
            {showIOS && (
              <div className={styles.iosPrompt}>
                <div className={styles.stepContainer}>
                  <div className={styles.stepIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className={styles.stepText}>
                    اضغط على <span className={styles.highlight}>مشاركة</span> ثم{' '}
                    <span className={styles.highlight}>إضافة إلى الشاشة الرئيسية</span>
                  </p>
                </div>
                <div className={styles.iosSteps}>
                  <span className={styles.iosStep}>
                    مشاركة
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className={styles.iosStep}>
                    إضافة
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button 
            onClick={handleClose} 
            className={styles.closeButton}
            aria-label="Close prompt"
          >
            <svg 
              className={styles.closeIcon} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default InstallAppPrompt;