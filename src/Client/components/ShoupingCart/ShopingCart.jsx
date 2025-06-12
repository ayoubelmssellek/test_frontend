import { useState } from "react";
import "./ShopingCart.css";
import { useDispatch, useSelector } from "react-redux";
import {  addTo_Cart, DicreaseQuantity, shoping_cart, toggelcheckoutClicked, toggelModalOpen } from "../../actions/action";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import DrinkPopup from '../../components/DrinkSelectionPopup/DrinkSelectionPopup';
import { fetchingAddOrder } from "../../../Api/fetchingData/FetchAddOrder";
import { useMutation,useQueryClient } from "@tanstack/react-query";
const ShopingCart = () => {
  const [name, setname] = useState('');
  const [phonenumber, setphonenumber] = useState('');
  const [street, setstreet] = useState('');
  const [housenumber, sethousenumber] = useState('');
  const [error, seterror] = useState({});
  const [deliveryOption, setDeliveryOption] = useState('delivery');
  const queryClient = useQueryClient();
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.client.cartItems);
  const cartAmount = useSelector(state => state.client.cartAmount);
  const IScheckoutClicked=useSelector(state => state.client.toggelcheckoutClicked);
  const unifiedCartItems = cartItems.map(item => {
    return {
      id: item.id,
      name: item.name || item.product_name,
      quantity: item.quantity, 
      price: item.discount? (item.price * (1 - item.discount / 100)).toFixed(2): item.price, 
      image: item.image_path || item.product_image || '', 
    };
  });
  
  const productTotalPricePerItem = unifiedCartItems.map(item => item.price * item.quantity);
                                                              
  
  const totalDebut = productTotalPricePerItem.reduce((total, item) => total + item, 0);

  const IncreaseProdectQauntity = (prodect) => {
    dispatch(addTo_Cart(prodect));
  };

  const DicreaseProdectQauntity = (id, item) => {
    dispatch(DicreaseQuantity(id, item));
  };
 
 const mutate=useMutation({
    mutationFn:fetchingAddOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      navigation('/orderSuccess');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartAmount');
      dispatch(shoping_cart());
      
    },

    onError: (error) => {
      console.error("Error adding order:", error.message);
    }
 })

  const HandelSubmit = (event) => {
    event.preventDefault();
    let errors = {};
    if (!name.trim()) errors.name = "الاسم مطلوب!";
    if (!phonenumber.trim()) errors.phonenumber = "رقم الهاتف مطلوب!";
    if (deliveryOption === 'delivery' && !street.trim()) errors.street = "اسم الشارع مطلوب!";
    seterror(errors);
    if (Object.keys(errors).length === 0) {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,  
        total_price: (item.discount? (item.price * (1 - item.discount / 100)).toFixed(2): item.price) * item.quantity,
        quantity: item.quantity,
      }));
      const newOrder = {
        name: name,
        phonenumber: phonenumber,
        delivery_type: deliveryOption,
        ...(deliveryOption === 'delivery' && {
          street: String(street || ''),
          housenumber: String(housenumber || ''),
        }),
        status: 'pending',
        items: orderItems
      };
          mutate.mutate(newOrder);
    }
  };

  return (
    <div className="container">

      {cartItems.length === 0 ? (
        <div className="EmptyCart">
          <img src={"https://static.vecteezy.com/system/resources/previews/005/006/007/non_2x/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"}
            alt="" srcSet="" />
          <h1>الحقيبة فارغة</h1>

          <Link to={'/menu'}>
            <button dir="ltr" className={'BackButton'} >
              <FaArrowRight className={'backIcon'} />
              العودة إلى القائمة
            </button>
          </Link>
        </div>
      ) : (
        <div className="shopping-cart">
          <div className="cart-items">
            <div className="cart-header">
              <h1>السلة</h1>
              <button dir="ltr" className={'backButton'} onClick={() => navigation(-1)}>
                <FaArrowRight className={'backIcon'} />
                رجوع
              </button>
            </div>
            {unifiedCartItems.map((item, index) =>
              <div className="cart-item" key={index}>
                <div className="item-info">
                  <img src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.image}`} alt={item.image}/>
                  <h6>{item.name}</h6>
                </div>
                <div className="itemprix">
                  <p><bdi>درهم</bdi> {productTotalPricePerItem[index].toFixed(2)} </p>
                </div>
                <div className="quantity-control">
                  <button  onClick={() => DicreaseProdectQauntity(item.id, item)} >-</button>
                  <strong>{item.quantity}</strong>
                  <button disabled={item.quantity >= 5}  onClick={() => IncreaseProdectQauntity(item)}>+</button>
                </div>
              </div>
            )}
          </div>

          <div className="summary">
            {IScheckoutClicked ? (
              <form onSubmit={HandelSubmit} >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div className="clientinfomation">
                    <span ><h4 style={{ display: 'flex', width: '100%', fontSize: '20px' }}>الاسم والهاتف للتوصيل
                      <i style={{ color: 'red' }}>*</i></h4>
                      {IScheckoutClicked &&
                        <button dir="ltr" className={'backButton'} onClick={()=>dispatch(toggelcheckoutClicked())}>
                          <FaArrowRight className={'backIcon'} />
                          رجوع
                        </button>
                      }
                    </span>
                    <input type="text" name="name" placeholder="أكتب إسمك الكامل" onChange={(e) => setname(e.target.value)} />
                    {error.name && <p style={{ color: "red" }}>{error.name}</p>}
                    <input type="text" name="phonenumber" placeholder="أكتب رقم هاتفك" onChange={(e) => setphonenumber(e.target.value)} />
                    {error.phonenumber && <p style={{ color: "red" }}>{error.phonenumber}</p>}
                  </div>

                  <div className="clientlocation">
                    <span style={{ display: 'flex', fontSize: '20px' }}>
                      <h4>طريقة الاستلام<span style={{ color: 'red' }}>*</span></h4>
                    </span>
                    
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                      <button
                        type="button"
                        style={{
                          background: deliveryOption === 'delivery' ? 'tomato' : '#f0f0f0',
                          color: deliveryOption === 'delivery' ? 'white' : '#333',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          width: '50%'
                        }}
                        onClick={() => setDeliveryOption('delivery')}
                      >
                        التوصيل
                      </button>
                      
                      <button
                        type="button"
                        style={{
                          background: deliveryOption === 'pickup' ? 'tomato' : '#f0f0f0',
                          color: deliveryOption === 'pickup' ? 'white' : '#333',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          width: '50%'
                        }}
                        onClick={() => setDeliveryOption('pickup')}
                      >
                        الاستلام من المطعم
                      </button>
                    </div>

                    {deliveryOption === 'pickup' ? (
                      <p style={{ color: '#4CAF50', marginTop: '10px' }}>
                        سيتم تجهيز طلبك خلال 10 دقائق
                      </p>
                    ) : (
                      <>
                        <input
                          type="text"
                          name="street"
                          placeholder="الشارع"
                          onChange={(e) => setstreet(e.target.value)}
                        />
                        {error.street && <p style={{ color: "red" }}>{error.street}</p>}
                        <input
                          type="text"
                          name="housenumber"
                          placeholder="رقم المنزل (اختياري)"
                          onChange={(e) => sethousenumber(e.target.value)}
                        />
                      </>
                    )}
                  </div>
                </div>
                <button type="submit" className="orderplaced" >شراء</button>
              </form>
            ) : (
              <>
                <div className="summaryInfo">
                  <div className="summaryHeader" >
                    <h3>تفاصيل السلة</h3>
                    <p> {cartAmount}  عناصر </p>
                  </div>
                  <div className='promo-code'>
                    <label htmlFor="codepromo"> كود خصم</label>
                    <div className='input-promo-code'>
                      <input name="codepromo" type="text" placeholder="هل لديك كود خصم؟" />
                      <button className="applybutton">تفعيل</button>
                    </div>
                  </div>
                  <div className="priceDetail">
                    <div>
                      <p >المجموع الفرعي</p>
                      <p >{totalDebut} <bdi>درهم</bdi></p>
                    </div>
                    <hr className="dashed-line" />
                    <div>
                      <p>الخصم</p>
                      <p>0.00 <bdi>درهم</bdi></p>
                    </div>
                    <hr className="dashed-line" />
                    <div>
                      <p className="total-price">الإجمالي</p>
                      <p className="total-price">{totalDebut} <bdi>درهم</bdi> </p>
                    </div>
                  </div>
                </div>
                <button className="orderplaced"  onClick={() => dispatch(toggelModalOpen())}>التالي</button>
                <DrinkPopup/>

              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopingCart;