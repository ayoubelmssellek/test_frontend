import {
  MdAddShoppingCart,
  MdRemove,
  MdAdd,
  MdVisibility,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/md";
import styles from "./PopularDishes.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addTo_Cart, DicreaseQuantity } from "../../actions/action";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingProducts } from "../../../Api/fetchingData/FetchProducts";
import { fetchingToggleFavorite } from "../../../Api/fetchingData/FetchToggleFavorite";
import { FetchingListFavorites } from "../../../Api/fetchingData/FetchListFavorite";
import Loading from "../../../Helper/Loading/Loading";

const PopularDishes = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { 
    data: food_list = [], 
    isLoading: productsLoading, 
    error: productsError 
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchingProducts,
  });

  const filtredlist = food_list?.filter(i => 
    i.category.name.toLowerCase() !== 'extra' && 
    i.category.name.toLowerCase() !== 'jus'&&
    i.name.toLowerCase().includes("gusto")
  );

  const { 
    data: favoriteList = [], 
    isLoading: favLoading, 
    error: favError 
  } = useQuery({
    queryKey: ["favorites"],
    queryFn: FetchingListFavorites,
  });

  const CartItems = useSelector((state) => state.client.cartItems);

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

  const handleAddItem = (product) => {
    dispatch(addTo_Cart(product));
  };

  const decreaseProductQuantity = (id) => dispatch(DicreaseQuantity(id));

  const handleToggleFavorite = (productId) => {
    mutation.mutate(productId);
  };

  const isInCart = (id) => CartItems.some((item) => item.id === id);
  const isFavorite = (id) => favoriteList?.some((item) => item.id === id);

  if (productsLoading || favLoading) return <Loading />;
  if (productsError) return <div className={styles.error}>Error: {productsError.message}</div>;
  if (favError) return <div className={styles.error}>Error: {favError.message}</div>;

  return (
    <div className={styles["Food-desplay"]}>
      <h1 className={styles.QategoryName}> اكتشف أطباقنا</h1>
      <div className={styles["Food-desplay-list"]}>
        {filtredlist?.slice(-10).map((product) => (
          <div key={product.id} className={styles.Cart}>
            <div 
              className={`${styles.ImageContainer} ${
                product.status === "out of stock" ? styles.OutOfStockOverlay : ""
              }`}
            >
                {/* Add discount badge here */}
  {product.discount > 0 && (
    <div className={styles.DiscountBadge}>
      <span>{product.discount}% تخفيض</span>
    </div>
  )}
              <img
                src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${product.image_path}`}
                alt={product.name}
                className={styles.ProductImage}
                loading="lazy"
              />

              {product.status === "out of stock" && (
                <div className={styles.OutOfStock}>غير متوفر حاليا</div>
              )}

              <button
                className={`${styles.FavoriteButton} ${
                  isFavorite(product.id) ? styles.active : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(product.id);
                }}
                disabled={product.status === "out of stock"}
              >
                {isFavorite(product.id) ? (
                  <MdFavorite className={styles.favoriteIcon} size={24} />
                ) : (
                  <MdFavoriteBorder className={styles.favoriteIcon} size={24} />
                )}
              </button>
            </div>

            <div className={styles.ProductContent}>
              <div className={styles.ProductHeader}>
                <Link 
                  to={`/product/${product.id}`} 
                  className={styles.ProductTitle}
                >
                  {product.name}
                </Link>

                <div className={styles.PriceContainer}>
                   <span dir="ltr" className={styles.ProductPrice}>
                    <bdi>درهم</bdi>
                    {product.discount
                      ? (product.price * (1 - product.discount / 100)).toFixed(2)
                      : product.price}
                  </span>
                  
                  {product.discount > 0 && (
                    <span dir="ltr" className={styles.OldPrice}>
                      <bdi>درهم</bdi> {product.price}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.InfoContainer}>
                {product.reviews_count !== 0 && (
                  <div className={styles.ReviewsInfo}>
                    عدد التقييمات: <strong>{product.reviews_count}</strong>
                  </div>
                )}

                {product.favorites_count !== 0 && (
                  <div className={styles.FavoritesInfo}>
                    في المفضلة: <strong>{product.favorites_count}</strong>
                  </div>
                )}
              </div>

              <div dir="ltr" className={styles.ProductFooter}>
                {product.category.name && (
                  <span className={styles.CategoryTag}>
                    {product.category.name}
                  </span>
                )}

                <div dir="ltr" className={styles.ActionButtons}>
                  <Link
                    to={`/product/${product.id}`}
                    className={`${styles.IconButton} ${styles.ViewButton}`}
                  >
                    <MdVisibility size={20} />
                  </Link>

                  {product.status === "out of stock" ? (
                    <button
                      className={`${styles.IconButton} ${styles.CartButton} ${styles.DisabledButton}`}
                      disabled
                    >
                      <MdAddShoppingCart size={20} />
                    </button>
                  ) : !isInCart(product.id) ? (
                    <button
                      className={`${styles.IconButton} ${styles.CartButton}`}
                      onClick={() => handleAddItem(product)}
                    >
                      <MdAddShoppingCart size={20} />
                    </button>
                  ) : (
                    <div className={styles.QuantityControls}>
                      <button
                        className={styles.QuantityButton}
                        onClick={() => decreaseProductQuantity(product.id)}
                      >
                        <MdRemove size={20} />
                      </button>
                      <span>
                        {CartItems.find((item) => item.id === product.id)?.quantity}
                      </span>
                      <button
                        className={styles.QuantityButton}
                        onClick={() => handleAddItem(product)}
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
  );
};

export default PopularDishes;