import { useEffect, useState } from 'react';
import styles from './navbar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import { VscAccount } from "react-icons/vsc";
import { GrFavorite } from "react-icons/gr";
import { BiFoodMenu } from "react-icons/bi";
import { BsCart4 } from "react-icons/bs";
import { assets } from '../../../Admin/assets/assets';
import { fetchingUser } from '../../../Api/fetchingData/FetchUserData';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const token = localStorage.getItem('authToken');
  const { data: userInfo } = useQuery({
    queryKey: ["user"],
    queryFn: fetchingUser,
    enabled: !!token, 
    staleTime: 1000 * 60 * 5,
  });
  
  const [cart_amount, setCartamount] = useState();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const cartAmount = useSelector(state => state.client.cartAmount);

  useEffect(() => {
    setCartamount(cartAmount);
  }, [cartAmount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'ar', name: 'AR' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navbarContainer}>
          <Link to='/' className={styles.logoContainer}>
            <img className={styles.gustologo} src={assets.logo} alt="Logo" />
            <span className={styles.logoText}>Restaurant</span>
          </Link>
          
          <ul className={styles.navLinks}>
            <li>
              <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.active : ''}`}>
                {t("navbar.home")}
              </Link>
            </li>
            <li>
              <Link to="/menu" className={`${styles.navLink} ${location.pathname === '/menu' ? styles.active : ''}`}>
                {t("navbar.menu")}
              </Link>
            </li>
            <li>
              <Link to="/contactUs" className={`${styles.navLink} ${location.pathname === '/contactUs' ? styles.active : ''}`}>
                {t("navbar.contact")}
              </Link>
            </li>
          </ul>
          
          <div className={styles.navbarActions}>
            <div className={styles.languageSelector}>
              {languages.map((lang) => (
                <button 
                  key={lang.code}
                  className={`${styles.langBtn} ${i18n.language === lang.code ? styles.activeLang : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            
            <div className={styles.cartIconContainer}>
              <Link to="/shoupingCart" className={styles.cartLink}>
                <BsCart4 className={styles.cartIcon} />
                {cart_amount > 0 && <span className={styles.cartBadge}>{cart_amount}</span>}
              </Link>
            </div>
            
            {userInfo ? (
              <Link to="/myaccount" className={styles.accountLink}>
                <div className={styles.userProfile}>
                  <div className={styles.userAvatar}>
                    {userInfo.name[0].toUpperCase()}
                  </div>
                  <span className={styles.userName}>{userInfo.name}</span>
                </div>
              </Link>
            ) : (
              <Link to="/login" className={styles.loginBtn}>
                <Button label={t("navbar.login")} severity="warning" rounded />
              </Link>
            )}
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <nav className={styles.mobileNav}>
        <Link to="/" className={`${styles.mobileNavItem} ${location.pathname === '/' ? styles.active : ''}`}>
          <i className="pi pi-home" style={{ fontSize: '1.5rem' }}></i>
          <span>{t("navbar.home")}</span>
        </Link>
        
        <Link to="/menu" className={`${styles.mobileNavItem} ${location.pathname === '/menu' ? styles.active : ''}`}>
          <BiFoodMenu size="24px" />
          <span>{t("navbar.menu")}</span>
        </Link>
        
        <Link to="/shoupingCart" className={`${styles.mobileNavItem} ${location.pathname === '/shoupingCart' ? styles.active : ''}`}>
          <div className={styles.cartWrapper}>
            <BsCart4 size="24px" />
            {cart_amount > 0 && <span className={styles.mobileCartBadge}>{cart_amount}</span>}
          </div>
          <span>{t("navbar.cart")}</span>
        </Link>
        
        <Link to="/favorite" className={`${styles.mobileNavItem} ${location.pathname === '/favorite' ? styles.active : ''}`}>
          <GrFavorite size="24px" />
          <span>{t("navbar.favorites")}</span>
        </Link>
        
        <Link to="/myaccount" className={`${styles.mobileNavItem} ${location.pathname === '/myaccount' ? styles.active : ''}`}>
          <VscAccount size="24px" />
          <span>{t("navbar.account")}</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;