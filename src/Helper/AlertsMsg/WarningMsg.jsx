import { useTranslation } from 'react-i18next';
import styles from './WarningMsg.module.css';
import PropTypes from 'prop-types';

const WarningAlert = ({ message }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar"; // RTL detection
  return (
    <div className={styles.warningAlert} role="alert"  dir={isRTL ? "rtl" : "ltr"}>
      <svg
        className={styles.warningIcon}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.516 11.591c.75 1.336-.213 2.987-1.742 2.987H3.483c-1.53 0-2.492-1.65-1.742-2.987L8.257 3.1zm1.743 3.9a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0V7zm-.75 7a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <span className={styles.warningText}>
        <strong>{t("msg.Warning")}!</strong> {message}
      </span>
    </div>
  );
};

export default WarningAlert;

WarningAlert.propTypes = {
  message: PropTypes.string.isRequired,
};