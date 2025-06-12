import { useState } from "react";
import { FaChevronDown, FaBox, FaCheckCircle, FaMotorcycle, FaRedoAlt, FaArrowRight } from "react-icons/fa";
import styles from "./OrderHistory.module.css";
import Navbar from "../navbar/Navbar";
import { useDispatch } from "react-redux";
import { setReorder } from "../../actions/action";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../../../Api/fetchingData/FetchUserOrders";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Helper/Loading/Loading";
import { useQueryClient } from "@tanstack/react-query";

const OrderHistory = () => {
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchUserOrders,
  });
   const { data: sales  } = useQuery({
    queryKey: ['sales'],
    queryFn: fetchUserOrders,
  });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' or 'completed'

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigator = useNavigate();

  const toggleOrder = (orderId) => setExpandedOrder(expandedOrder === orderId ? null : orderId);

  const handleTrackOrder = (orderId, e) => {
    e.stopPropagation();
    setTrackingOrder(trackingOrder === orderId ? null : orderId);
  };

  const handleReorder = (order) => {
    dispatch(setReorder(order));
    navigator("/shoupingCart"); 
  };

  // Filter orders based on active filter
  const filteredOrders = activeFilter === 'completed' 
    ? orders?.filter(order => order.status === 'delivered') 
    : orders;

  // Calculate completed orders count
  const completedOrdersCount = orders?.filter(order => order.status === 'delivered').length || 0;

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem", color: "red" }}>
        <h2>❌ وقع مشكل أثناء تحميل البيانات</h2>
        <button onClick={() => queryClient.invalidateQueries(["user"])}>
          🔁 إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className={styles.orderHistoryContainer}>
        <div className={styles.orderHistoryHeader}>
          <h1><FaBox className={styles.headerIcon} /> سجل الطلبات</h1>
          <div className={styles.orderStats}>
            <div className={styles.statItem}>
              <FaCheckCircle className={styles.statIcon} />
              <span>{completedOrdersCount} طلبات مكتملة</span>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className={styles.filterButtons}>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'all' ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              جميع الطلبات
            </button>
            <button 
              className={`${styles.filterBtn} ${activeFilter === 'completed' ? styles.activeFilter : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              الطلبات المكتملة
            </button>
          </div>
          
          <button dir="ltr" className={styles.backButton} onClick={() => navigator(-1)}>
            <FaArrowRight className={styles.backIcon} />
            رجوع
          </button>
        </div>

        <div className={styles.ordersList}>
          {filteredOrders?.length > 0 ? (
            filteredOrders.map((order) => (
              <div className={styles.orderItem} key={order.id}>
                <div className={styles.orderHeader} onClick={() => toggleOrder(order.id)}>
                  <div className={styles.orderMainInfo}>
                    <span className={styles.orderNumber}>{order.order_number}</span>
                    <span className={styles.orderDate}>{order.order_date}</span>
                    <button
                      className={styles.trackOrderBtn}
                      onClick={(e) => handleTrackOrder(order.id, e)}
                    >
                      <FaMotorcycle /> تتبع الطلب
                    </button>
                  </div>
                  <div className={styles.orderStatus}>
                    <span className={`${styles[order.status]}`}>
                      {order.status}
                    </span>
                    <FaChevronDown className={`${styles.expandIcon} ${expandedOrder === order.id ? styles.expanded : ""}`} />
                  </div>
                </div>
              
                {expandedOrder === order.id && (
                  <div className={styles.orderDetails}>
                    <div className={styles.productsList}>
                      {order.items.map((item, idx) => (
                        <div className={styles.productItem} key={idx}>
                          <img
                            src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.product_image}`}
                            alt={item.product_name}
                            className={styles.productImage}
                          />
                          <div className={styles.productInfo}>
                            <h4>{item.product_name}</h4>
                            <span>
                              {item.quantity}x <bdi>درهم</bdi> {item.total_price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderSummary}>
                      <div className={styles.summaryRow}>
                        <span dir="rtl">المجموع: {order.total_order} درهم</span>
                      </div>
                      <button
                        className={styles.reorderBtn}
                        onClick={() => handleReorder(order.items)}
                      >
                        <FaRedoAlt /> طلب مرة أخرى
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className={styles.noOrders}>
              {activeFilter === 'completed' 
                ? 'لا توجد طلبات مكتملة' 
                : 'لا توجد طلبات حاليًا'}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;