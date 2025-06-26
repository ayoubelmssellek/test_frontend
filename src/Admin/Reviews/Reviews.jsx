import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import { 
  FaCheck, 
  FaTimes, 
  FaStar, 
  FaRegStar, 
  FaListAlt, 
  FaCheckCircle, 
  FaTimesCircle,
  FaUndo
} from "react-icons/fa";
import styles from './Reviews.module.css';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FetchingListReviews } from "../../Api/fetchingData/FetchReviews";
import { fetchingUpdateReviewsStatus } from "../../Api/fetchingData/FetchChangeReviewStatus";

const Reviews = () => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: FetchingListReviews,
  });

  const queryClient = useQueryClient();

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
  });

  const mutate = useMutation({
  mutationFn: ({ id, formdata }) => fetchingUpdateReviewsStatus({ id, formdata }),

  onMutate: async ({ id, formdata }) => {
    await queryClient.cancelQueries(['reviews']);
    const previousReviews = queryClient.getQueryData(['reviews']);

    queryClient.setQueryData(['reviews'], oldReviews =>
      oldReviews.map(review =>
        review.id === id ? { ...review, status:formdata.status } : review
      )
    );

    return { previousReviews };
  },

  onError: (err, variables, context) => {
    if (context?.previousReviews) {
      queryClient.setQueryData(['reviews'], context.previousReviews);
    }
  },

  onSuccess: () => {
    // تأكد أن updatedReview هو الريفيو الجديد مع status محدث
    queryClient.setQueryData(['reviews']
    );
  },
});


  const handleAcceptReview = (id) => {
    const formdata = { status: "Accepted" };
    mutate.mutate({ id, formdata });
  };

  const handleRejectReview = (id) => {
    const formdata = { status: "Rejected" };
    mutate.mutate({ id, formdata });
  };

  const handleRestoreReview = (id) => {
    const formdata = { status: "Pending" };
    mutate.mutate({ id, formdata });
  };

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  const totalReviews = reviews?.length;
  const acceptedReviews = reviews?.filter(review => review.status === 'Accepted').length;
  const rejectedReviews = reviews?.filter(review => review.status === 'Rejected').length;

  const handleSidebarStateChange = (newState) => setIsOpen(newState);

  if (isLoading) {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  return (
    <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
        <Navbar pagePath={t('titles.Reviews')} />
        <div className={styles.pages}>
          <div className={styles.statsContainer}>
            <div className={`${styles.statBadge} ${styles.total}`}>
              <FaListAlt className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>{t('filters.total_reviews')}</span>
                <span className={styles.statNumber}>{totalReviews}</span>
              </div>
            </div>
            <div className={`${styles.statBadge} ${styles.accepted}`}>
              <FaCheckCircle className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>{t('filters.accepted_reviews')}</span>
                <span className={styles.statNumber}>{acceptedReviews}</span>
              </div>
            </div>
            <div className={`${styles.statBadge} ${styles.rejected}`}>
              <FaTimesCircle className={styles.statIcon} />
              <div className={styles.statContent}>
                <span className={styles.statLabel}>{t('filters.rejected_reviews')}</span>
                <span className={styles.statNumber}>{rejectedReviews}</span>
              </div>
            </div>
          </div>

          {reviews?.length !== 0 ? (
            <div className={styles.productsContainer}>
              <div className={styles.tableContainer}>
                <table className={styles.productsTable}>
                  <thead>
                    <tr>
                      <th>{t('tables.name')}</th>
                      <th>{t('badges.products')}</th>
                      <th>{t('tables.opinion')}</th>
                      <th>{t('tables.rating')}</th>
                      <th>{t('tables.date')}</th>
                      <th>{t('tables.image')}</th>
                      <th>{t('tables.actions')}</th>
                      <th>{t('tables.status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.user_name}</td>
                        <td>{item.product_name}</td>
                        <td>{item.comment}</td>
                        <td>
                          <div className={styles.rating}>
                            {[...Array(5)].map((_, i) =>
                              i < item.rating ? (
                                <FaStar key={i} className={styles.filled} size={20} />
                              ) : (
                                <FaRegStar key={i} className={styles.star} />
                              )
                            )}
                          </div>
                        </td>
                        <td>{item.created_at}</td>
                        <td>
                          <img
                            src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.product_image}`}
                            className={styles.productImage}
                          />
                        </td>
                        <td>
                          {item.status === 'Accepted' || item.status === 'Rejected' ? (
                            <button
                              onClick={() => handleRestoreReview(item.id)}
                              className={styles.restoreButton}
                              aria-label={t('actions.restore_review')}
                            >
                              <FaUndo size={20} color="#ff9800" />
                            </button>
                          ) : (
                            <div className={styles.acceptRejectIcons}>
                              <button
                                onClick={() => handleAcceptReview(item.id)}
                                aria-label={t('actions.accept_review')}
                              >
                                <FaCheck size={30} color="#4CAF50" />
                              </button>
                              <button
                                onClick={() => handleRejectReview(item.id)}
                                aria-label={t('actions.reject_review')}
                              >
                                <FaTimes size={30} color="#f44336" />
                              </button>
                            </div>
                          )}
                        </td>
                        <td>
                          {item.status === 'Accepted' ? (
                            <span className={styles.acceptedStatus}>
                              {t('status.accepted')}
                            </span>
                          ) : item.status === 'Rejected' ? (
                            <span className={styles.rejectedStatus}>
                              {t('status.rejected')}
                            </span>
                          ) : (
                            <span className={styles.pendingStatus}>
                              {t('status.pending')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <h3 className={styles.noProducts}>{t('reviews.no_reviews')}</h3>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
