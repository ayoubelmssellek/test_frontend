import React, { useMemo } from "react";
import { MdAddShoppingCart, MdRemove, MdAdd, MdVisibility, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from '../FoodDesplay/Fooddesplay.module.css';
import { useDispatch, useSelector } from "react-redux";
import { addTo_Cart, DicreaseQuantity } from "../../actions/action";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchingProducts } from "../../../Api/fetchingData/FetchProducts";
import { fetchingToggleFavorite } from "../../../Api/fetchingData/FetchToggleFavorite"; // فرضا عندك هاد الدالة
import Loading from "../../../Helper/Loading/Loading";

 const MenuComponnent = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: food_list =[], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchingProducts
  });

  const CartItems = useSelector((state) => state.client.cartItems);
   const filtredList = food_list?.filter(i =>
    i.category.name.toLowerCase() !== 'extra' &&
    i.category.name.toLowerCase() !== 'jus'
  );
  const mutation = useMutation({
    mutationFn: (productId) => fetchingToggleFavorite(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['favorites']);
      const previousFavorites = queryClient.getQueryData(['favorites']) || [];

      const isCurrentlyFavorite = previousFavorites.some(item => item.id === productId);

      queryClient.setQueryData(['favorites'], (old = []) =>
        isCurrentlyFavorite
          ? old.filter(item => item.id !== productId)
          : [...old, { id: productId }]
      );

      return { previousFavorites };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(['favorites'], context.previousFavorites);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
    }
  });

  // هنا كندير mutate
  const handleToggleFavorite = (productId) => {
    mutation.mutate(productId);
  };

  // جلب الفيفوريت من الـ cache ديال react-query
  const FavoriteList = queryClient.getQueryData(['favorites']) || [];

  const groupedArray = useMemo(() => {
    if (!filtredList) return [];
  
    const grouped = filtredList.reduce((acc, item) => {
      if (!acc[item.category.name]) {
        acc[item.category.name] = [];
      }
      acc[item.category.name].push(item);
      return acc;
    }, {});
  
    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items
    }));
  }, [filtredList]);

  const isInCart = (id) => CartItems?.some((item) => item.id === id);
  const isitClicked = (id) => FavoriteList?.some(item => item.id === id);

  const handelAddItem = (produit) => {
    dispatch(addTo_Cart(produit));
  };

  const DicreaseProdectQauntity = (id) => dispatch(DicreaseQuantity(id));

  if (isLoading) return <Loading />;
 if (error) {
  console.error("Error fetching products:", error);
  return (
    <div className={styles.error}>
      Error: {typeof error === 'object' && error?.message ? error.message : 'حدث خطأ ما'}
    </div>
  );
}

  return (
    <>
      {groupedArray?.map((group) => (
        <div className={styles["Food-desplay"]} key={group.category}>
          <h1 className={styles.QategoryName}>{group.category}</h1>
          <div className={styles["Food-desplay-list"]}>
            {group.items?.map((produit) => (
              <div key={produit.id} className={styles.Cart}>
                <div className={`${styles.ImageContainer} ${produit.status === 'out of stock' ? styles.OutOfStockOverlay : ''}`}>
                  <img 
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${produit.image_path}`} 
                    alt={produit.name} 
                    className={styles.ProductImage}
                    loading="lazy" 
                  />
                                  {/* Add discount badge here */}
  {produit.discount > 0 && (
    <div className={styles.DiscountBadge}>
      <span>{produit.discount}% تخفيض</span>
    </div>
  )}
                  {produit.status === 'out of stock' && (
                    <div className={styles.OutOfStock}>غير متوفر</div>
                  )}
                  <button
                    className={`${styles.FavoriteButton} ${isitClicked(produit.id) ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!mutation.isLoading) {
                        handleToggleFavorite(produit.id);
                      }
                    }}
                    disabled={produit.status === 'out of stock'}
                  >
                    {isitClicked(produit.id) ? (
                      <MdFavorite className={styles.favoriteIcon} size={24} />
                    ) : (
                      <MdFavoriteBorder className={styles.favoriteIcon} size={24} />
                    )}
                  </button>
                </div>
                <div className={styles.ProductContent}>
                  <div className={styles.ProductHeader}>
                    <Link to={`/product/${produit.id}`} className={styles.ProductTitle}>
                      {produit.name}
                    </Link>
                    <div className={styles.PriceContainer}>
                      {produit.discount > 0 && (
                        <span dir="ltr" className={styles.OldPrice}>
                          <bdi>درهم</bdi> {produit.price}
                        </span>
                      )}
                      <span dir="ltr" className={styles.ProductPrice}>
                        <bdi>درهم</bdi>
                        {produit.discount
                          ? (produit.price * (1 - produit.discount / 100)).toFixed(2)
                          : produit.price}
                      </span>
                    </div>
                  </div>
    
                  <div className={styles.InfoContainer}>
                    {produit.reviews_count !== 0 && (
                      <div className={styles.ReviewsInfo}>
                        عدد التقييمات: <strong>{produit.reviews_count}</strong>
                      </div>
                    )}
    
                    {produit.favorites_count !== 0 && (
                      <div className={styles.FavoritesInfo}>
                        في المفضلة: <strong>{produit.favorites_count}</strong>
                      </div>
                    )}
                  </div>
                  <div dir="ltr" className={styles.ProductFooter}>
                    {produit.category.name && (
                      <span className={styles.CategoryTag}>
                        {produit.category.name}
                      </span>
                    )}
                    <div dir="ltr" className={styles.ActionButtons}>
                      <Link 
                        to={`/product/${produit.id}`}
                        className={`${styles.IconButton} ${styles.ViewButton}`}
                      >
                        <MdVisibility size={20} />
                      </Link>
                      {produit.status === 'out of stock' ? (
                        <button
                          className={`${styles.IconButton} ${styles.CartButton} ${styles.DisabledButton}`}
                          disabled
                        >
                          <MdAddShoppingCart size={20} />
                        </button>
                      ) : !isInCart(produit.id) ? (
                        <button
                          className={`${styles.IconButton} ${styles.CartButton}`}
                          onClick={() => handelAddItem(produit)}
                        >
                          <MdAddShoppingCart size={20} />
                        </button>
                      ) : (
                        <div className={styles.QuantityControls}>
                          <button
                            className={styles.QuantityButton}
                            onClick={() => DicreaseProdectQauntity(produit.id)}
                          >
                            <MdRemove size={20} />
                          </button>
                          <span>
                            {CartItems.find(item => item.id === produit.id)?.quantity}
                          </span>
                          <button
                            className={styles.QuantityButton}
                            onClick={() => handelAddItem(produit)}
                          >
                            <MdAdd size={20} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
export default MenuComponnent;