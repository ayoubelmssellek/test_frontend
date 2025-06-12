import { useState, useEffect, useRef } from 'react';
import style from './DisktopFoodSlider.module.css';
import { useDispatch } from 'react-redux';
import { addTo_Cart } from '../../actions/action';
import { useNavigate } from 'react-router-dom';
import { fetchingProducts } from '../../../Api/fetchingData/FetchProducts';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../Helper/Loading/Loading';

const DesktopFoodSlider = () => {
  const {
    data: food_list = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchingProducts,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const slides = (() => {
    const filteredList = food_list?.filter(i => {
      const category = i.category.name?.toLowerCase();
      return category !== 'extra' && category !== 'jus';
    });

    const discounted = filteredList.filter(i => i.discount !== 0);

    return (discounted.length > 0 ? discounted : filteredList).slice(0, 8);
  })();

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (slides?.length === 0) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(prev => (prev === slides?.length - 1 ? 0 : prev + 1));
    }, 5000);

    return resetTimeout;
  }, [activeIndex, slides?.length]);

  const handlePrev = () => {
    if (slides?.length === 0) return;
    setActiveIndex(prev => (prev === 0 ? slides?.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slides?.length === 0) return;
    setActiveIndex(prev => (prev === slides?.length - 1 ? 0 : prev + 1));
  };

  const addToCart = (item) => {
    dispatch(addTo_Cart(item));
    navigate('/shoupingCart');
  };

  if (productsLoading) return <div><Loading /></div>;
  if (productsError) return <div className="error-message">Error: {productsError.message}</div>;

  return (
    <div className={style['food-slider-container']}>
      {slides?.length > 0 ? (
        <div className={style['slider-wrapper']}>
          <div
            className={style['slider']}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div className={style['slide']} key={index}>
                <div className={style['slide-info']}>
                  <span className={style['category-badge']}>{slide.category.name}</span>
                  <h2 className={style['slide-title']}>{slide.name}</h2>
                  <div className={style['price-container']}>
                     <div className={style.PriceContainer}>
                    <span dir="ltr" className={style['slide-price']}>
                    <bdi > درهم </bdi>      { slide.discount  ? (slide.price * (1 - slide.discount / 100)).toFixed(2) : slide.price}
                  </span>
                  
                  {slide.discount > 0 && (
                    <span dir="ltr" className={style.OldPrice}>
                      <bdi> درهم </bdi>   {slide.price}
                    </span>
                  )}
                </div>
                    <button
                      className={style['order-button']}
                      onClick={() => addToCart(slide)}
                    >
                      اطلب الان
                    </button>
                  </div>
                </div>

                <div className={style['slide-content']}>
                  {slide.discount !== 0 && (
                    <div className={style['discount-label']}>
                      <span>{slide.discount}% تخفيض</span>
                    </div>
                  )}
                  <img
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${slide.image_path}`}
                    alt={slide.name}
                    className={style['slide-image']}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            ))}
          </div>

          <button className={`${style['control']} ${style['prev']}`} onClick={handlePrev} aria-label="Previous slide">
            ❮
          </button>
          <button className={`${style['control']} ${style['next']}`} onClick={handleNext} aria-label="Next slide">
            ❯
          </button>

          <div className={style['progress-bar']}>
            <div
              className={style['progress']}
              style={{
                width: `${(activeIndex + 1) * (100 / slides.length)}%`,
                transition: 'width 5s linear'
              }}
            />
          </div>

          <div className={style['thumbnails']}>
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`${style['thumbnail']} ${index === activeIndex ? style['active'] : ''}`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${slide.image_path}`}
                  alt={`Thumbnail - ${slide.name}`}
                  className={style['thumbnail-image']}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={style['no-slides-message']}>
          لا توجد عناصر حالية للعرض
        </div>
      )}
    </div>
  );
};

export default DesktopFoodSlider;
