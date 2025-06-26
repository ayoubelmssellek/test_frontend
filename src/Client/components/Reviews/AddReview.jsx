import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FaArrowLeft, FaStar, FaChevronDown } from 'react-icons/fa';
import { fetchUserOrders } from '../../../Api/fetchingData/FetchUserOrders';
import styles from './AddReview.module.css';
import { fetchingAddReview } from '../../../Api/fetchingData/FetchAddreview';
import { useMutation ,useQueryClient } from '@tanstack/react-query';
const AddReview = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchUserOrders,
  });
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTimeAgo = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);

    // ✅ تعويض فارق التوقيت (مثلاً UTC +1 للمغرب)
    orderTime.setHours(orderTime.getHours() + 1);

    if (isNaN(orderTime)) return 'تاريخ غير صالح';

    const diff = now - orderTime;

    const seconds = Math.floor(diff / 1000);
    if (seconds < 0) return 'في المستقبل';
    if (seconds < 10) return 'الآن';
    if (seconds < 60) return `${seconds} ثانية`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} دقيقة`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعة`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} يوم`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} شهر`;

    const years = Math.floor(months / 12);
    return `${years} سنة`;
  };
  
  const mutation = useMutation({
    mutationFn: fetchingAddReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      navigate('/');
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      alert('حدث خطأ أثناء إرسال المراجعة. يرجى المحاولة مرة أخرى.');
    },
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!selectedProduct) validationErrors.selectedProduct = 'الرجاء اختيار طبق';
    if (!text.trim()) validationErrors.text = 'المراجعة مطلوبة';
    if (rating < 1) validationErrors.rating = 'الرجاء إعطاء تقييم';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const reviewData = {
        product_id: selectedProduct?.product_id,
        comment: text,
        rating
      };
      
    mutation.mutate(reviewData);
    
    }
  };

  return (
    <div className={styles.reviewContainer} dir="rtl">
      <header className={styles.reviewHeader}>
        <button 
          className={styles.backButton}
          onClick={() => navigate(-1)}
          aria-label="العودة"
        >
          <FaArrowLeft className={styles.backIcon} />
          رجوع
        </button>
        <h1 className={styles.reviewTitle}>شاركنا تجربتك</h1>
      </header>

      <form className={styles.reviewForm} onSubmit={handleSubmit}>
        <section className={styles.productSelection}>
          <h3 className={styles.sectionTitle}>اختر الطبق</h3>
          <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
              type="button"
              className={styles.dropdownTrigger}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              {selectedProduct ? (
                <div className={styles.selectedProduct}>
                  <img 
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${selectedProduct.product_image}`} 
                    alt={selectedProduct.product_name}
                    className={styles.productThumbnail}
                    loading="lazy"
                  />
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{selectedProduct.product_name}</div>
                    <div className={styles.orderMeta}>
                      الطلب رقم #{selectedProduct.order_number} • منذ {getTimeAgo(selectedProduct.created_at)}
                    </div>
                  </div>
                </div>
              ) : (
                ' -- اختر منتج من طلباتك --'
              )}
              <FaChevronDown className={styles.chevron} />
            </button>
            
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownScrollContainer}>
                  {orders?.map(order => 
                    order.items.map(item => (
                      <button
                        type="button"
                        key={item.id}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setSelectedProduct({ 
                            ...item,
                            order_number: order.order_number,
                            created_at: order.created_at 
                          });
                          setIsDropdownOpen(false);
                        }}
                      >
                        <img 
                          src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.product_image}`} 
                          alt={item.product_name}
                          className={styles.productThumbnail}
                          loading="lazy"
                        />
                        <div className={styles.productInfo}>
                          <div className={styles.productName}>{item.product_name}</div>
                          <div className={styles.orderMeta}>
                            <span>الطلب رقم #{order.order_number}</span>
                            <span>•</span>
                            <span>منذ {getTimeAgo(order.created_at)}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.selectedProduct && (
            <p className={styles.errorMessage}>{errors.selectedProduct}</p>
          )}
        </section>

        <section className={styles.ratingSection}>
          <h3 className={styles.sectionTitle}>تقييمك</h3>
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                className={`${styles.star} ${
                  star <= (hoverRating || rating) ? styles.active : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${star} نجوم`}
              >
                <FaStar />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className={styles.errorMessage}>{errors.rating}</p>
          )}
        </section>

        <section className={styles.reviewContent}>
          <h3 className={styles.sectionTitle}>اكتب مراجعتك</h3>
          <textarea
            className={styles.reviewTextarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="شاركنا تفاصيل تجربتك..."
            rows="5"
            aria-label="نص المراجعة"
          />
          {errors.text && (
            <p className={styles.errorMessage}>{errors.text}</p>
          )}
        </section>

        <button type="submit" className={styles.submitButton}>
          نشر المراجعة
        </button>
      </form>
    </div>
  );
};

export default AddReview;
