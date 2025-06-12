import PropTypes from 'prop-types';
import styles from '../ViewMore/ViewMore.module.css';

const ViewMore = ({ product, onClose }) => {
    
    if (!product) {
        return (
            <div className={styles.container}>
                <p className={styles.errorMessage}>No product data available.</p>
                <button className={styles.closeButton} type="button" onClick={onClose}>
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.productInfo}>
                <img 
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${product.image_path}`} 
                    alt={product.name} 
                    loading="lazy" 
                    className={styles.productImage} 
                />
                <div className={styles.productAndBackButton}>
                    <div className={styles.productDetails}>
                        <div>
                            <label className={styles.detailLabel}>Name: </label>
                            <span className={styles.detailValue}>{product.name}</span>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Category: </label>
                            <span className={styles.detailValue}>{product.category_name}</span>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Type: </label>
                            <span className={styles.detailValue}>{product.type_name}</span>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Price: </label>
                            <span className={styles.detailValue}>{product.price}</span>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Date Added: </label>
                            <span className={styles.detailValue}>{product.created_at}</span>
                        </div>
                        <div>
                            <label className={styles.detailLabel}>Description: </label>
                            <span className={styles.detailValue}>{product.description}</span>
                        </div>
                    </div>
                    <div className={styles.actionContainer}>
                        <button className={styles.closeButton} type="button" onClick={onClose}>
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewMore;

ViewMore.propTypes = {
    product: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};