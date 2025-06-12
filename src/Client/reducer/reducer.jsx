import { cart_amount } from "../actions/action";
import { toast } from "react-toastify";
import { t } from "i18next";

const initState = {
    cartItems:localStorage.getItem('cartItems')?
              JSON.parse(localStorage.getItem('cartItems')):[],
    cartAmount:localStorage.getItem('cartAmount')?
                JSON.parse(localStorage.getItem('cartAmount')):0,
    product_info:[] , 
    Favorite:localStorage.getItem('FavoriteList')?
              JSON.parse(localStorage.getItem('FavoriteList')):[] ,
    toggelModalOpen:false,
    toggelcheckoutClicked:false,
    showRegister: false
  };
  
  
  export const ClientReducer = (state = initState, action) => {
    switch (action.type) {
      case 'addTo_cart': {
        const isMobile=window.innerWidth <= 576;
        const findIndex = state.cartItems.findIndex(
          (item) => item.id === action.produit.id
        );
      
        if (findIndex >=0) {
          const updatedCartItems = state.cartItems.map((item, index) =>
            index === findIndex
              ? { ...item, quantity: item.quantity + 1 } 
              : item 
          );
       
            toast.success(`Incease ${state.cartItems[findIndex].name} Quantity`,{
              position:isMobile ? 'top-left' :'bottom-left',
          
              style:isMobile?{ 
                display:'none',
              }:{
             
              }
            
              
            } )
          
          localStorage.setItem('cartItems',JSON.stringify(updatedCartItems))

          return {
            ...state,
            cartItems: updatedCartItems, 
          };
        } else {
          const newProduit = { ...action.produit, quantity: 1 };
          const updatedCartItems = [...state.cartItems, newProduit]; 
          localStorage.setItem('cartItems',JSON.stringify(updatedCartItems))
          localStorage.setItem('cartAmount',JSON.stringify(updatedCartItems.length))
          toast.success(`Product ${action.produit.name} added to cart`,{
            position:isMobile ? 'top-left' :'bottom-left',
            style:isMobile?{ 
            display:'none'
            }:{
           
            }
          
            
          } )

          return {
            ...state,cartItems:updatedCartItems,
           cartAmount: updatedCartItems.length,
          };
        }
      }
      case 'DicreaseQuantity': {
        const isMobile=window.innerWidth <= 576;
        const findIndexDic = state.cartItems.findIndex(item => item.id === action.paytoad.id);
      
        if (findIndexDic >= 0) {
          const updatedCartItems = state.cartItems.map((item, index) =>
            index === findIndexDic
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          toast.info(`Dicrease ${updatedCartItems[findIndexDic].name} Quantity`,{
            position:isMobile ? 'top-left' :'bottom-left',
            style:isMobile?{ 
             display:'none'
            }:{
           
            }
          
            
          } )
          const filteredCartItems = updatedCartItems.filter(item => item.quantity > 0);

          localStorage.setItem('cartItems', JSON.stringify(filteredCartItems));
          localStorage.setItem('cartAmount',JSON.stringify(filteredCartItems.length))    
          return { ...state, cartItems: filteredCartItems,
            cartAmount: filteredCartItems.length,


           };
        }}
        break

        case 'clear':
          return{
            ...state,cartItems:[],
            cartAmount:0
            
          }
          case 'addTo_Favorite': {
            const correntFavoriteList=localStorage.getItem('FavoriteList')?
            JSON.parse(localStorage.getItem('FavoriteList')):[]  
            const inList = correntFavoriteList.some(item => item.id === action.payload.id);
        
            let updatedList = inList
                ? correntFavoriteList.filter(item => item.id !== action.payload.id)  
                : [...state.Favorite, action.payload.product];  
             
            localStorage.setItem('FavoriteList', JSON.stringify(updatedList));
        
            return {
                ...state,
                Favorite: updatedList
            };
        }
        
     
          case 'SET_REORDER': {
            const updatedCartItems = [...state.cartItems];
          
            action.reorder.forEach((item) => {
              // استخدم product_id إذا كان موجود
              const productId = item.product_id || item.id;
              const reorderQuantity = Number(item.quantity) || 1;
          
              const findIndex = updatedCartItems.findIndex(
                (cartItem) => Number(cartItem.id) === Number(productId)
              );
          
              if (findIndex >= 0) {
                // زيد quantity
                updatedCartItems[findIndex].quantity += reorderQuantity;
              } else {
                // أول مرة يضيفه
                updatedCartItems.push({
                  ...item,
                  id: productId,
                  quantity: reorderQuantity,
                });
              }
            });
          
            localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
            localStorage.setItem("cartAmount", JSON.stringify(updatedCartItems.length));
          
            return {
              ...state,
              cartItems: updatedCartItems,
              cartAmount: updatedCartItems.length,
            };
          }
          
          case 'toggelModalOpen':
            return{
              ...state,toggelModalOpen:!state.toggelModalOpen
            }
            case 'toggelcheckoutClicked':
            return{
              ...state,toggelcheckoutClicked:!state.toggelcheckoutClicked
            }
            case 'TOGGLE_REGISTER':
      return {
        ...state,
        showRegister: !state.showRegister
      };
            
          
          
          
        
       






      default:
        return state;  
    }
  };
  