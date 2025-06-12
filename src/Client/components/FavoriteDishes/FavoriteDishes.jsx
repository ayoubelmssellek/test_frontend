import { useDispatch, useSelector } from 'react-redux';
import { addTo_Cart, DicreaseQuantity } from '../../actions/action';
import { Link, useNavigate } from 'react-router-dom';
import { MdAddShoppingCart, MdArrowBackIos, MdRemove, MdAdd, MdVisibility, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import styles from './FavoriteDishes.module.css';
import Navbar  from '../navbar/Navbar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchingListFavorites } from '../../../Api/fetchingData/FetchListFavorite';
import { fetchingToggleFavorite } from '../../../Api/fetchingData/FetchToggleFavorite';
import Loading from '../../../Helper/Loading/Loading';

const FavoriteDishes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: FavoriteList = [] ,isError ,isLoading} = useQuery({
    queryKey: ['favorites'],
    queryFn: FetchingListFavorites  
  });
  

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
    },
  });

  const CartItems = useSelector((state) => state.client.cartItems);

  const isInCart = (id) => CartItems.some((item) => item.id === id);
  const isFavorite = (id) => FavoriteList?.some(item => item.id === id);

  const handleAddItem = (product) => dispatch(addTo_Cart(product));
  const decreaseProductQuantity = (id) => dispatch(DicreaseQuantity(id));
  const handleToggleFavorite = (productId) => mutation.mutate(productId);
   if (isLoading) return <Loading />;
  if (isError) return <div className={styles.Error}>Error: {isError.message}</div>;
  return (
    <>
      <Navbar />
      {FavoriteList?.length === 0 ? (
        <div className={styles.EmptyContainer}>
          <img 
            src="https://static.vecteezy.com/system/resources/previews/048/216/130/non_2x/reminder-list-empty-ui-illustration-free-vector.jpg" 
            alt="No favorites" 
            className={styles.EmptyImage}
          />
          <h2 className={styles.EmptyText}>لا يوجد أطباق مفضلة في الوقت الراهن</h2>
        </div>
      ) : (
        <div className={styles["Food-desplay"]}>
          <div className={styles.HeaderContainer}>
            <button onClick={() => navigate(-1)} className={styles.BackButton}>
              <MdArrowBackIos size={24} />
              <span>العودة</span>
            </button>
            <h1 className={styles.QategoryName}>أطباقك المفضلة</h1>
          </div>

          <div className={styles["Food-desplay-list"]}>
            {FavoriteList?.map((produit) => (
              <div key={produit.id} className={styles.Cart}>
                <div className={`${styles.ImageContainer} ${produit.status === 'out of stock' ? styles.OutOfStockOverlay : ''}`}>
                  <Link to={`/product/${produit.id}`}>
                    <img 
                      src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${produit.image_path}`} 
                      alt={produit.name} 
                      className={styles.ProductImage}
                      loading="lazy" 
                    />
                  </Link>

                  {produit.status === 'out of stock' && (
                    <div className={styles.OutOfStock}>غير متوفر حاليا</div>
                  )}

                  <button
                    className={`${styles.FavoriteButton} ${isFavorite(produit.id) ? styles.active : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(produit.id);
                    }}
                    disabled={produit.status === 'out of stock'}
                  >
                    {isFavorite(produit.id) ? (
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

                  {/* {produit.description && (
                    <p className={styles.ProductDescription}>
                      {produit.description}
                    </p>
                  )} */}

                  <div dir='ltr' className={styles.ProductFooter}>
                    {produit.category_name && (
                      <span className={styles.CategoryTag}>
                        {produit.category_name}
                      </span>
                    )}
                    <div dir='ltr' className={styles.ActionButtons}>
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
                          onClick={() => handleAddItem(produit)}
                        >
                          <MdAddShoppingCart size={20} />
                        </button>
                      ) : (
                        <div className={styles.QuantityControls}>
                          <button
                            className={styles.QuantityButton}
                            onClick={() => decreaseProductQuantity(produit.id)}
                          >
                            <MdRemove size={20} />
                          </button>
                          <span>
                            {CartItems.find(item => item.id === produit.id)?.quantity}
                          </span>
                          <button
                            className={styles.QuantityButton}
                            onClick={() => handleAddItem(produit)}
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
      )}
    </>
  );
};

export default FavoriteDishes;
