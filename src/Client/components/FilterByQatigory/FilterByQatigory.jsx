import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  MdAddShoppingCart,
  MdRemove,
  MdAdd,
  MdVisibility,
  MdFavorite,
  MdFavoriteBorder,
  MdArrowBackIos,
} from "react-icons/md";
import  Navbar  from "../navbar/Navbar";
import styles from "./FilterByQatigory.module.css";
import { addTo_Cart, DicreaseQuantity } from "../../actions/action";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingProducts } from "../../../Api/fetchingData/FetchProducts";
import { fetchingToggleFavorite } from "../../../Api/fetchingData/FetchToggleFavorite";
import Loading from "../../../Helper/Loading/Loading";

const FilterByQatigory = () => {
  const { data: food_list, isLoading: loading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchingProducts,
  });

  const CartItems = useSelector((state) => state.client.cartItems);
  const FavoriteList = useQueryClient().getQueryData(["favorites"]) || [];

  const { category } = useParams();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const filtredList = food_list?.filter(
    (item) => item.category.name === category
  );

  const isInCart = (id) => CartItems.some((item) => item.id === id);
  const isFavorite = (id) => FavoriteList.some((item) => item.id === id);

  const handleAddItem = (product) => dispatch(addTo_Cart(product));
  const DicreaseProdectQauntity = (id) => dispatch(DicreaseQuantity(id));

  // ✅ Mutation for toggling favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: (productId) => fetchingToggleFavorite(productId),

    // Optimistic Update
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

  const handleToggleFavorite = (id) => {
    toggleFavoriteMutation.mutate(id);
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <>
      <Navbar />
      <div className={styles["Food-display"]}>
        <div className={styles.HeaderContainer}>
          <Link to="/" className={styles.BackButton}>
            <MdArrowBackIos size={24} />
            <span>العودة</span>
          </Link>
          <h1 className={styles.QategoryName}>
            {filtredList?.length === 0 ? "" : category}
          </h1>
        </div>

        <div className={styles["Food-display-list"]}>
          {filtredList?.length === 0 ? (
            <div className={styles.EmptyContainer}>
              <img
                src="https://static.vecteezy.com/system/resources/previews/048/216/130/non_2x/reminder-list-empty-ui-illustration-free-vector.jpg"
                alt="No items"
                className={styles.EmptyImage}
              />
              <h2 className={styles.EmptyText}>لا توجد عناصر في هذا التصنيف</h2>
            </div>
          ) : (
            filtredList?.map((produit) => (
              <div key={produit.id} className={styles.Cart}>
                <div
                  className={`${styles.ImageContainer} ${
                    produit.status === "out_of_stock"
                      ? styles.OutOfStockOverlay
                      : ""
                  } `}
>
                  {/* Add discount badge here */}
                  {produit.discount !== 0 && (
                    <div className={styles.DiscountBadge}>
                      <span>{produit.discount}% تخفيض</span>
                    </div>
                  )}
                  <img
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${produit.image_path}`}
                    alt={produit.name}
                    className={styles.ProductImage}
                    loading="lazy"
                  />

                  {produit.status === "out_of_stock" && (
                    <div className={styles.OutOfStock}> غير متوفر حاليا</div>
                  )}

                  <button
                    className={`${styles.FavoriteButton} ${
                      isFavorite(produit.id) ? styles.active : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(produit.id);
                    }}
                    disabled={produit.status === "out_of_stock"}
                  >
                    {isFavorite(produit.id) ? (
                      <MdFavorite className={styles.favoriteIcon} size={24} />
                    ) : (
                      <MdFavoriteBorder
                        className={styles.favoriteIcon}
                        size={24}
                      />
                    )}
                  </button>
                </div>

                <div className={styles.ProductContent}>
                  <div className={styles.ProductHeader}>
                    <Link
                      to={`/product/${produit.id}`}
                      className={styles.ProductTitle}
                    >
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
{/* 
                  {produit.description && (
                    <p className={styles.ProductDescription}>
                      {produit.description}
                    </p> 
                  )} */}

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

                      {produit.status === "out_of_stock" ? (
                        <button
                          className={`${styles.IconButton} ${styles.CartButton} ${styles.DisabledButton}`}
                          disabled
                        >
                          <MdAddShoppingCart size={20} />
                        </button>
                      ) : !isInCart(produit.id) ? (
                        <button
                          className={`${styles.IconButton} ${styles.CartButton}`}
                          onClick={() => {
                            handleAddItem(produit);
                          }}
                        >
                          <MdAddShoppingCart size={20} />
                        </button>
                      ) : (
                        <div className={styles.QuantityControls}>
                          <button
                            className={styles.QuantityButton}
                            onClick={() =>
                              DicreaseProdectQauntity(produit.id)
                            }
                          >
                            <MdRemove size={20} />
                          </button>
                          <span>
                            {
                              CartItems.find(
                                (item) => item.id === produit.id
                              )?.quantity
                            }
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FilterByQatigory;
