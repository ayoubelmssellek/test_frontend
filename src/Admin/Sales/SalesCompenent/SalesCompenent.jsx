import { useState,useEffect } from 'react';
// import { useSelector } from 'react-redux';
import Sidebar from '../../Sidebar/Sidebar';
import Navbar from '../../Navbar/Navbar';
import SalesTable from '../SalesTable/SalesTable';
import styles from '../SalesCompenent/SalesCompenent.module.css';
import { useTranslation } from 'react-i18next';

const SalesComponent = () => {
  const {i18n } = useTranslation();
  const isRTL = i18n.language === 'ar'; 
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    return window.innerWidth >= 915; // Default to open on desktop
  });
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);  
  // const Category = useSelector((state) => state.admin.ListeCategory);

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };

  return (
    <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'} >
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
        <Navbar pagePath='Sales' />
        <div className={`${styles.pages} ${styles.salesComponent}`}>
          <div className={styles.salesTableSection}>
            <SalesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesComponent;