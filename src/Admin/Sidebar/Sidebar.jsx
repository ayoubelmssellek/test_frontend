import { useState, useEffect, useRef } from "react";
import { FaSignOutAlt, FaThList, FaTh, FaGift, FaSun, FaMoon, FaCog } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { MdPeople } from "react-icons/md";
import { LuPanelLeftClose, LuPanelLeftOpen } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { fetchingUser } from "../../Api/fetchingData/FetchUserData";

import './Sidebar.css';

export default function Sidebar({ isOpen, onSidebarStateChange }) {
      const { data: parsedUser } = useQuery({
        queryKey: ["user"],
        queryFn:fetchingUser,
    });
  
  const { role } = useParams();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const sidebarRef = useRef(null);
  const onSidebarStateChangeRef = useRef(onSidebarStateChange);
  const {t,i18n} = useTranslation();
  // Get current language
  const currentLang = i18n.language;
  const isRTL = currentLang === 'ar';

  useEffect(() => {
    onSidebarStateChangeRef.current = onSidebarStateChange;
  }, [onSidebarStateChange]);

  const toggleSidebar = () => {
    onSidebarStateChangeRef.current(!isOpen);
  };

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme);
    setShowThemeOptions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowThemeOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const checkWindowSize = () => {
      // Only auto-close if needed, don't auto-open
      if (window.innerWidth < 915 && isOpen) {
        onSidebarStateChangeRef.current(false);
      }
    };

    window.addEventListener("resize", checkWindowSize);
    return () => window.removeEventListener("resize", checkWindowSize);
  }, [isOpen]); // Add isOpen as dependency

  return (
    <div className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}  ${isRTL?'FixedRight':'FixedLeft'} ref={sidebarRef}`}>
      <div className="sidebar-header">
        <h2 className={`sidebar-title ${isOpen ? "visible" : "hidden"}`}>Restaurant Dakhla</h2>
        <button onClick={toggleSidebar} className="close-button">
          {isOpen ? (
            <LuPanelLeftClose size={25} className="close-icon"  />
          ) : (
            <LuPanelLeftOpen size={35} className="close-icon" />
          )}
        </button>
      </div>

      <nav className="sidebar-menu">
        <ul>
          <Link to={`/Dashboard/${role}`}>
            <li>
              <div className={`menu-item ${isOpen ? "hoverable" : ""}`}>
                <FaTh className="menu-icon" />
                <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.dashboard')}</span>
              </div>
            </li>
          </Link>
          {
            parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin' && (
                        <Link to={`/Dashboard/${role}/Employees`}>
                          <li>
                            <div className={`menu-item ${isOpen ? "hoverable" : ""}`}>
                              <MdPeople className="menu-icon" />
                              <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.employees')}</span>
                            </div>
                          </li>
                        </Link>
            )
          }

           {
             parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin' && (
                        <Link to={`/Dashboard/${role}/Categories`}>
                          <li>
                            <div className={`menu-item ${isOpen ? "hoverable" : ""}`}>
                              <FaThList className="menu-icon" />
                              <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.categories')}</span>
                            </div>
                          </li>
                        </Link>
            )
           }
           {
             parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin' && (
                        <Link to={`/Dashboard/${role}/Types`}>
                          <li>
                            <div className={`menu-item ${isOpen ? "hoverable" : ""}`}>
                              <FaThList className="menu-icon" />
                              <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.types')}</span>
                            </div>
                          </li>
                        </Link>
            )
           }
          {
             parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin' && (
                        <Link to={`/Dashboard/${role}/ListeOffers`}>
                          <li>
                            <div className={`menu-item ${isOpen ? "hoverable" : ""}`}>
                              <FaGift className="menu-icon" />
                              <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.offers')}</span>
                            </div>
                          </li>
                        </Link>
            )
          }
        </ul>
      </nav>
     
      <div className="sidebar-footer">
        
     <div className="theme-settings" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
  <div 
    className={`menu-item ${isOpen ? "hoverable" : ""}`}
    onClick={() => setShowThemeOptions(!showThemeOptions)}
  >
    <FaCog className="menu-icon" />
    <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.settings')}</span>
  </div>
  
  {showThemeOptions && (
    <div className={`theme-dropdown ${isOpen ? '' : 'collapsed'}`}>
      <button 
        onClick={() => handleThemeChange('light')}
        className={`theme-option ${theme === 'light' ? 'active' : ''}`}
      >
        <FaSun size={16} />
        {isOpen && <span className="theme-text">{t("sidebar.light")}</span>}
      </button>
      <button 
        onClick={() => handleThemeChange('dark')}
        className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
      >
        <FaMoon size={16} />
        {isOpen && <span className="theme-text">{t("sidebar.dark")}</span>}
      </button>
    </div>
  )}
</div>
        <Link to="/Login" className={`menu-item ${isOpen ? "hoverable" : ""}`}>
          <FaSignOutAlt className="menu-icon" />
          <span className={`menu-text ${isOpen ? "visible" : "hidden"}`}>{t('sidebar.logout')}</span>
        </Link>

      </div>
    </div>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSidebarStateChange: PropTypes.func.isRequired,
};