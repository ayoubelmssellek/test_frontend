

import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styles from '../Notification/Notification.module.css';
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import fetchNotifications from "../../Api/fetchingData/FetchNotification";
import Loading from "../../Helper/Loading/Loading";
import { FiShoppingBag, FiStar, FiBell, FiTrash2, FiClock, FiUser } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const { 
    data: notifications,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 1000 * 60 * 5,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const { role } = useParams();

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };

  const handleClearAll = () => {
    localStorage.removeItem('notificationListe');
    refetch();
  };

  const markAsRead = (id) => {
    // Implement your mark as read logic here
    console.log(`Marked notification ${id} as read`);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className={styles.error}>Error loading notifications</div>;

  return (
    <div className={styles.content} dir={isRTL ? "rtl" : "ltr"}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />

      <div
        className={`${styles.typesContainer} ${
          isOpen ? styles.typesContainerPush : styles.typesContainerNoPush
        }`}
      >
        <Navbar pagePath={t("titles.Types")} />

        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.titleContainer}>
              <FiBell className={styles.titleIcon} />
              <h1>Notifications</h1>
              {notifications.length > 0 && (
                <span className={styles.countBadge}>{notifications.length}</span>
              )}
            </div>

            {notifications.length > 0 && (
              <button 
                onClick={handleClearAll}
                className={styles.clearButton}
              >
                <FiTrash2 className={styles.clearIcon} />
                Clear All
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <FiBell className={styles.emptyIcon} />
              <h3>No notifications yet</h3>
              <p>We'll notify you when something arrives</p>
            </div>
          ) : (
            <div className={styles.notificationsList}>
              {notifications?.map((item) => {
                const formattedOrderId = String(item.reference_id).padStart(5, '0');
                const formattedDate = new Date(item.created_at).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });
                
                return (
                  <div 
                    key={item.id}
                    className={`${styles.notificationItem} ${item.type === 'order' ? styles.order : styles.review}`}
                  >
                    <div className={styles.notificationHeader}>
                      <div className={styles.headerContent}>
                        {item.type === 'order' ? (
                          <Link 
                            to={`/Dashboard/${role}/ViewOrderDetails/${item.reference_id}`}
                            className={styles.notificationLink}
                          >
                            <span className={styles.messageTitle}>طلب جديد</span>
                            <span className={styles.orderId}>#{formattedOrderId}</span>
                          </Link>
                        ) : (
                          <span className={styles.messageTitle}>تقييم جديد</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.mainContent}>
                      <div className={styles.notificationContent}>
                        <div className={styles.iconContainer}>
                          {item.type === 'order' ? (
                            <FiShoppingBag className={styles.icon} />
                          ) : (
                            <FiStar className={styles.icon} />
                          )}
                        </div>
                        <div className={styles.textContent}>
                          <div className={styles.clientInfo}>
                            <FiUser className={styles.clientIcon} />
                            <span className={styles.clientName}>
                              {item.message}
                            </span>
                          </div>
                          <p className={styles.messageText}>
                            {item.type === 'order' 
                              ? "📦 تم استلام طلب جديد" 
                              : "⭐ تقييم جديد"}
                          </p>
                          <p className={styles.time}>
                            <FiClock className={styles.timeIcon} />
                            {formattedDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className={styles.notificationActions}>
                        <span className={styles.typeBadge}>
                          {item.type === 'order' ? "طلب" : "تقييم"}
                        </span>
                        <button 
                          onClick={() => markAsRead(item.id)}
                          className={styles.closeButton}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;