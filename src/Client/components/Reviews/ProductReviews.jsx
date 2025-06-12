// AllReviews.jsx
import  { useState } from 'react';
import { FaStar, FaRegStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './ProductReviews.module.css';
import { useQuery } from '@tanstack/react-query';
import { FetchReviewsById } from '../../../Api/fetchingData/FetchReviewsById';
import PropTypes from 'prop-types';

const ProductReviews = ({ id }) => {
  const { data: reviewsData } = useQuery({
    queryKey: ['productReviews', id],
    queryFn: () => FetchReviewsById(id),
  });
  
  const [expandedText, setExpandedText] = useState(null);
  const acceptedReviews = reviewsData?.filter(item => item.status === "Accepted");

  const toggleText = (reviewId) => {
    setExpandedText(prev => prev === reviewId ? null : reviewId);
  };

  return (
    <>
     { acceptedReviews?.length > 0 && (
            <div  className={styles.reviewsSection}>
      <div className={styles.reviewsContainer}>
        <div className={styles.reviewsHeader}>
          <h1 className={styles.sectionTitle}>آراء الزبناء حول المنتج</h1>
        </div>

        <div className={styles.allReviewsGrid}>
          {acceptedReviews?.map((review) => (
            <div className={styles.reviewCard} key={review.id}>
              <div className={styles.cardHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {review.user_name[0]}
                  </div>
                  <div className={styles.userDetails}>
                    <h3 className={styles.userName}>{review.user_name}</h3>
                    <div className={styles.reviewDate}>
                      {new Date(review.updated_at).toLocaleDateString('ar-EG')}
                    </div>
                  </div>
                </div>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    i < review.rating ? 
                    <FaStar key={i} className={styles.starFilled} /> : 
                    <FaRegStar key={i} className={styles.star} />
                  ))}
                </div>
              </div>

              <div className={styles.reviewContent}>
                <div 
                  className={`${styles.reviewText} ${
                    expandedText === review.id ? '' : styles.reviewTextCollapsed
                  }`}
                >
                  {review.comment}
                </div>
                {review.comment.length > 200 && (
                  <button 
                    className={styles.toggleTextBtn}
                    onClick={() => toggleText(review.id)}
                  >
                    {expandedText === review.id ? (
                      <>
                        <FaChevronUp className={styles.toggleIcon} />
                        اقرأ أقل
                      </>
                    ) : (
                      <>
                        <FaChevronDown className={styles.toggleIcon} />
                        اقرأ المزيد
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      )}
      </>
  );
};
ProductReviews.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ProductReviews;