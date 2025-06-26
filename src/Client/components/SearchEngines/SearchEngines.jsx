// SearchOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import './SearchEngines.css';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { addTo_Cart, DicreaseQuantity } from '../../actions/action';
import { MdAdd, MdAddShoppingCart, MdRemove } from 'react-icons/md';
import { fetchingProducts } from '../../../Api/fetchingData/FetchProducts';
import { useQuery } from '@tanstack/react-query';
// import { assets } from '../../Admin/assets/assets';
// import { food_list } from "../../../Admin/assets/assets";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="search-icon"
  >
    <path d="M10 2a8 8 0 0 1 6.32 12.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
  </svg>
);

const ClearIcon = ({ onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="clear-icon"
    onClick={onClick}
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.707 14.707a1 1 0 0 1-1.414 0L12 13.414l-3.293 3.293a1 1 0 0 1-1.414-1.414L10.586 12 7.293 8.707a1 1 0 0 1 1.414-1.414L12 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414L13.414 12l3.293 3.293a1 1 0 0 1 0 1.414z" />
  </svg>
);

 const SearchOverlay = () => {
  const {data:products,isLoading ,isEroor } = useQuery({
    queryKey: ['products'],
    queryFn: fetchingProducts
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  const cartItems = useSelector((state) => state.client.cartItems) || [];
  const dispatch = useDispatch();
 
  const filteredProducts = products?.filter(
    (product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setIsOverlayVisible(searchTerm.trim().length > 0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOverlayVisible(false);
        setSearchTerm('');
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOverlayVisible) {
        setIsOverlayVisible(false);
        setSearchTerm('');
        inputRef.current?.focus();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOverlayVisible]);

  const isInCart = (id) => cartItems.some((item) => item.id === id);

  const handleAddItem = (product, e) => {
    e.stopPropagation(); 
    dispatch(addTo_Cart(product));
  };

  const decreaseProductQuantity = (id, item, e) => {
    e.stopPropagation(); 
    dispatch(DicreaseQuantity(id, item));
  };

  const handleClearInput = (e) => {
    e.stopPropagation(); 
    setSearchTerm('');
    inputRef.current?.focus();
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (isEroor) {
    return <div className="error">Error: {isEroor.message}</div>;
  }

  return (
    <div className="search-overlay-wrapper">
      <motion.div
        className="search-container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="search-input-wrapper">
          {searchTerm.length > 0 && <ClearIcon onClick={handleClearInput} />}
          <input
            type="text"
            id="searchInput"
            placeholder="ابحث عن المنتجات (مثل: salad, pizza)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            ref={inputRef}
            dir="rtl"
          />
          <SearchIcon />
        </div>
      </motion.div>


      {isOverlayVisible && (
        <div className="overlay" ref={overlayRef}>
          <div className="results-container">
            {filteredProducts?.length === 0 ? (
              <p className="no-results">لم يتم العثور على منتجات</p>
            ) : (      
              filteredProducts?.map((product) => (
                <div className="result-card" key={product.id}>
                  <img
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${product.image_path}`}	
                    alt={product.name}
                    className="product-img"
                  />
                  <div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-category">{product.category.name}</span>
                    <div className="price-cart">
                      <span className="product-price"> 
                      <bdi>درهم</bdi>  {product.price || 'N/A'} 
                      </span>
                      {!isInCart(product.id) ? (
                        <button
                          className="add-to-cart"
                          onClick={(e) => handleAddItem(product, e)}
                        >
                          <MdAddShoppingCart size={20} />
                          أضف إلى السلة
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn decrease"
                            onClick={(e) => decreaseProductQuantity(product.id, product, e)}
                          >
                            <MdRemove/>
                          </button>
                          <span className="quantity">
                            {cartItems.find((item) => item.id === product.id)?.quantity || 0}
                          </span>
                          <button
                            className="quantity-btn increase"
                            onClick={(e) => handleAddItem(product, e)}
                          >
                            <MdAdd />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchOverlay;