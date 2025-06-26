import styles from './NotFound.module.css';
import { Link, useNavigate } from 'react-router-dom';
const NotFoundPage = () => {
    const navigate = useNavigate();
  return (
    <div className={styles.pageContainer}>
      <div className={styles.decoration}>🍕</div>
      <div className={styles.decoration}>🍔</div>
      <div className={styles.decoration}>🍟</div>

      <div className={styles.contentWrapper}>
        <div className={styles.foodIcon}></div>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorMessage}>Oops! Page Not Found</h2>

      <Link to="#" onClick={() => navigate(-1)} className={styles.homeButton}>
        Go Back
      </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;