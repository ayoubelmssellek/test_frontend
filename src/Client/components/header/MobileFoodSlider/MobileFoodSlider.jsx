import  { useState, useEffect, useRef } from "react";
import "./MobileFoodSlider.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTo_Cart } from "../../../actions/action";
import { useQuery } from "@tanstack/react-query";
import { fetchingProducts } from "../../../../Api/fetchingData/FetchProducts";
import Loading from "../../../../Helper/Loading/Loading";

const MobileFoodSlider = () => {
      const { 
        data: food_list = [], 
        isLoading: productsLoading, 
        error: productsError 
      } = useQuery({
        queryKey: ["products"],
        queryFn: fetchingProducts,
      });

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const timeoutRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const listimg = useSelector((state) => state.client.food_list) || [];

 const slides = (() => {
    const filteredList = food_list?.filter(i => {
      const category = i.category.name?.toLowerCase();
      return category !== 'extra' && category !== 'jus';
    });
   
    const discounted = filteredList.filter(i => i.discount !== 0);

   return (discounted.length > 0 ? discounted : filteredList).slice(0, 8);
  })();

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (slides?.length === 0) return;

    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev === slides?.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => resetTimeout();
  }, [activeIndex, slides?.length]);

  const handlePrev = () => {
    if (slides?.length === 0) return;
    setActiveIndex((prev) => (prev === 0 ? slides?.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slides?.length === 0) return;
    setActiveIndex((prev) => (prev === slides?.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX); 
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX); 
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext();  
    }
    if (touchStart - touchEnd < -50) {
      handlePrev(); 
    }
  };

  const addAndGoToCart = (item, e) => {
    e.stopPropagation(); 
    dispatch(addTo_Cart(item));
    navigate("/shoupingCart");
  };
  if (productsLoading) {
    return <div className="loading-message"><Loading/></div>;
  }
  if (productsError) {
    return <div className="error-message">خطأ: {productsError.message}</div>;
  }

  return (
    <div className="mobile-food-slider">
      {slides?.length > 0 ? (
        <div
          className="slider-container"
          onTouchStart={handleTouchStart} 
          onTouchMove={handleTouchMove} 
          onTouchEnd={handleTouchEnd} 
        >
          <div className="slider-track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {slides?.slice(0, 8).map((slide, index) => (
              <div className="mobileslide" key={index}>
                <div className="mobileslideimg">
                  <img src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${slide.image_path}`} alt={slide.name} />
                  {slide.discount !==0 && (
                  <div className="discount-label">
                    <span>{slide.discount}% تخفيض</span>
                  </div>
                  )}
                </div>

                <div className="text-overlay">
                <span className="Product-category">{slide.category.name}</span>
                  <h3 className="Product-name">{slide.name}</h3>
                 <div className="prixandbutton">
                 <button className="button-Order" onClick={(e) => addAndGoToCart(slide, e)}>
                    اطلب الآن
                  </button>
                 <span className="slide-Price">
                    <bdi>درهم</bdi> {slide.price}
                  </span>
                 
                 </div>
                </div>
              </div>
            ))}
          </div>

          <div className="progress-dots">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`dot ${index === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="no-slides-message">لا توجد عناصر حديثة للعرض</div>
      )}
    </div>
  );
};

export default MobileFoodSlider;
