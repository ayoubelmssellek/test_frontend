import { FaBell, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';
import PropTypes from 'prop-types';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = ({ pagePath }) => {
  const { role } = useParams();
  const {i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
  ];

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div className="navbar-container">
      <a href="#" className="navbar-brand">
        <span className="navbar-title">{pagePath}</span>
      </a>
      
      <div className="navbar-icons">
        <select 
          value={i18n.language} 
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="language-select"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <Link to={`/Dashboard/${role}/AdminProfile`} className="menu-item">
          <FaUserCircle size={30} />
        </Link>
        
        <Link to={`/Dashboard/${role}/Notification`} className="menu-item">
          <FaBell size={30} />
        </Link>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  pagePath: PropTypes.string.isRequired,
};

export default Navbar;