import { useState } from 'react';
import styles from './DrinkSelectionPopup.module.css';
import { useDispatch, useSelector } from 'react-redux';
// import { food_list } from '../../../Admin/assets/assets';
import { addTo_Cart, DicreaseQuantity, toggelcheckoutClicked } from '../../actions/action';
import { toggelModalOpen } from '../../actions/action';
import { MdAdd, MdAddShoppingCart, MdRemove } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';
import { fetchingProducts } from '../../../Api/fetchingData/FetchProducts';
const DrinkPopup = () => {
  const {data:food_list ,}=useQuery({
    queryKey:["product"],
    queryFn:fetchingProducts
  })
  const ExtraFood=food_list?.filter(item=>item.name.toLowerCase().includes('jus'))
 const dispatch=useDispatch()
 const IStoggelModalOpen=useSelector(state=>state.client.toggelModalOpen)
 const CartItems=useSelector(state=>state.client.cartItems)
 const IsinCart=(id)=>CartItems.some(item=>item.id==id)
 
  if (!IStoggelModalOpen) {
    return null
  }

  return (
    <div className={styles.container}>
      {IStoggelModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <span 
              className={styles.closeBtn} 
              onClick={() => dispatch(toggelModalOpen())}
            >
              &times;
            </span>
            <h2 className={styles.title}>🥤 هل ترغب في إضافة مشروبات إلى طلبك؟ </h2>
            
            <div className={styles.drinkList}>
              {ExtraFood?.map((item) => (
                <div key={item.id} className={styles.drinkItem}>
                  <img 
                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.image_path}`} 
                    className={styles.drinkImage} 
                    alt={item.name} 
                  />
                  <div className={styles.drinkInfo}>
                    <div className={styles.drinkName}>{item.name}</div>
                    <div className={styles.drinkPrice}><bdi>درهم</bdi>{item.price}</div>
                  </div>
                  <div className={styles.drinkControls}>
                    
                   {
                    !IsinCart(item.id)?(
                    <button
                    className={`${styles.IconButton} ${styles.CartButton}`}
                    onClick={() => dispatch(addTo_Cart(item))}
                  >
                    <MdAddShoppingCart size={20} />
                  </button>
                    ):(
                   <div className={styles.QuantityControls}>
                    <button
                      className={styles.QuantityButton}
                      onClick={() =>dispatch(DicreaseQuantity(item.id))}
                    >
                      <MdRemove size={20} />
                    </button>
                    <span>
                      {CartItems.find(Item => Item.id === item.id)?.quantity}
                    </span>
                    <button
                      className={styles.QuantityButton}
                      onClick={() => dispatch(addTo_Cart(item))}
                    >
                      <MdAdd size={20} />
                    </button>
                  </div>
                    )
                   }
                    
                  </div>
                </div>
              ))}
            </div>

            <button 
              className={styles.checkoutDrinksBtn} 
              onClick={()=>{dispatch(toggelcheckoutClicked()), dispatch(toggelModalOpen())}}
            >
              أكمل طلبك
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkPopup;