

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAddShoppingCart, MdRemove, MdAdd, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from './ProductPageDiskTopVersion.module.css';
import { addTo_Cart, DicreaseQuantity } from '../../actions/action';
import { FaArrowRight } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingProducts } from '../../../Api/fetchingData/FetchProducts';
import ProductReviews from '../Reviews/ProductReviews';
import { fetchingToggleFavorite } from '../../../Api/fetchingData/FetchToggleFavorite';
import { FetchingListFavorites } from '../../../Api/fetchingData/FetchListFavorite';

const ProductPageDiskTopVersion = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cartItems, cartAmount } = useSelector((state) => state.client);
  
  // Fetch products
  const { data: produits, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchingProducts
  });
  
  // Fetch favorite list
  const { 
    data: favoriteList = [], 
    isLoading: favLoading, 
    error: favError 
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: FetchingListFavorites,
  });
  
  // Mutation for toggling favorite status
  const mutation = useMutation({
    mutationFn: (productId) => fetchingToggleFavorite(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(["favorites"]);
      const previousFavorites = queryClient.getQueryData(["favorites"]) || [];
      
      const isCurrentlyFavorite = previousFavorites.some(
        (fav) => fav.id === productId
      );
      
      queryClient.setQueryData(["favorites"], (old = []) =>
        isCurrentlyFavorite
          ? old.filter((fav) => fav.id !== productId)
          : [...old, { id: productId }] 
      );
      
      return { previousFavorites };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(["favorites"], context.previousFavorites);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });
  
  const product = produits?.find(item => item.id == id);
  const extraItems = produits?.filter((item) => item.category.name.toLowerCase() === 'extra');
  
  // Helper functions
  const inCart = cartItems.some(item => item.id == id);
  const isFavorite = favoriteList?.some(item => item.id == id);
  const isextraincart = (id) => cartItems.some(item => item.id == id);
  
  // Handle favorite toggle
  const handleToggleFavorite = (productId) => {
    mutation.mutate(productId);
  };

  if (isLoading || favLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  if (favError) return <div className={styles.error}>Error: {favError.message}</div>;
  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Product Not Found</h2>
        <p>The requested product does not exist.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <FaArrowRight className={styles.backIcon} />
            رجوع
          </button>
        </div>
        
        {/* Product Content */}
        <div className={styles.containerContent}>
          <div className={styles.imageContainer}>
            <img 
              src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${product.image_path}`} 
              alt={product.name} 
              className={styles.productImage} 
              loading="lazy" 
            />
          </div>

          {/* Product Info Section */}
          <div className={styles.infoSection}>
            {/* Favorite Button */}
            <button
              className={`${styles.favoriteButton} ${isFavorite ? styles.active : ''}`}
              onClick={() => handleToggleFavorite(product.id)}
            >
              {isFavorite ? (
                <MdFavorite size={24} />
              ) : (
                <MdFavoriteBorder size={24} />
              )}
            </button>

            <h1 className={styles.productTitle}>{product.name}</h1>
            <span className={styles.productCategory}>{product.category.name}</span>
            <p className={styles.productDescription}>{product.description}</p>

            {/* Extra Items Section */}
            <div className={styles.extraItemsSection}>
              <h3 className={styles.extraItemsTitle}>إضافات إختيارية</h3>
              <div className={styles.extraItemsContainer}>
                {extraItems?.map((product) => (
                  <div key={product.id} className={styles.extraItem}>
                    <img 
                      src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${product.image_path}`} 
                      alt={product.name} 
                      className={styles.extraItemImage} 
                    />
                    {!isextraincart(product.id) ? (
                      <button 
                        className={styles.addExtraButton}
                        onClick={() => dispatch(addTo_Cart(product))}
                      >
                        <MdAdd size={16} />
                      </button>
                    ) : (
                      <button 
                        className={styles.addExtraButton}
                        onClick={() => dispatch(DicreaseQuantity(product.id))}
                      >
                        <MdRemove size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <hr style={{border: '1px  solid whitesmoke', width: '100%',margin:"5px 0px"}}/>

            {/* Price and Add to Cart Section */}
            <div className={styles.priceSection}>
              <div className={styles.priceContainer}>
                {product.oldPrice ? ( 
                  <span className={styles.OldPrice}>
                    <bdi>درهم</bdi> {product.price}
                  </span>
                ):('')} 
                <span className={styles.price}>
                  <bdi>درهم</bdi> {product.oldPrice ? product.oldPrice : product.price} 
                </span>
              </div>

              {inCart ? (
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => dispatch(DicreaseQuantity(product.id))}
                  >
                    <MdRemove size={20} />
                  </button>
                  <span className={styles.quantity}>
                    {cartItems.find(item => item.id === product.id)?.quantity}
                  </span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => dispatch(addTo_Cart(product))}
                  >
                    <MdAdd size={20} />
                  </button>
                </div>
              ) : (
                <button
                  className={styles.cartButton}
                  onClick={() => dispatch(addTo_Cart(product))}
                  disabled={product.status === 'out_of_stock'}
                >
                  {product.status === 'out_of_stock' ? (
                    <p>غير متوفر حاليا</p> 
                  ) : (
                    <>
                      <MdAddShoppingCart size={20} />
                      <p>أضف إلى السلة</p>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProductReviews id={product.id}/>
    </>
  );
};

export default ProductPageDiskTopVersion;