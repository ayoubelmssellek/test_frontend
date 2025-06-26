import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { CalendarDays, TrendingUp, BarChart4, Users } from 'lucide-react';
import styles from './Customers.module.css';
import { fetchingClientsData } from '../../Api/fetchingData/FetchGetClientsData';
import { useQuery } from "@tanstack/react-query";
import { fetchingSubscriptionsStatistics } from '../../Api/fetchingData/FetchSubscriptionsStatistics';


const Customers = () => {
  const { data: data, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchingClientsData,
  });
  console.log(data);
  
  const { data: subscriptionData,isLoading: isLoadingSubscription } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: fetchingSubscriptionsStatistics,
  });
  
  
  const { t, i18n } = useTranslation(); // Destructure i18n from useTranslation
    const isRTL = i18n.language === 'ar'; // Determine RTL status
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
  });

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };
  if (isLoading) {
  return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }
  if (isLoadingSubscription) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'} >
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
        <Navbar pagePath={t('titles.Customers')} />
        <div className={styles.pages}>
          <div className={styles.badgesContainer}>
            <div className={styles.statBadge}>
              <h3>
                <Users size={18} />
                {t('filters.total')}
              </h3>
              <p>{subscriptionData.total_users}</p>
            </div>
            <div className={styles.statBadge}>
              <h3>
                <CalendarDays size={18} /> 
                {t('filters.daily')}
              </h3>
              <p>{subscriptionData.daily_subscriptions || 0} </p>
            </div>
            <div className={styles.statBadge}>
              <h3>
                <TrendingUp size={18} />
                {t('filters.weekly')}
              </h3>
              <p>{subscriptionData.weekly_subscriptions || 0}</p>
            </div>
            <div className={styles.statBadge}>
              <h3>
                <BarChart4 size={18} />
                {t('filters.monthly')}
              </h3>
              <p>{subscriptionData.monthly_subscriptions || 0}</p>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.usersTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>{t('tables.customer')}</th>
                  <th>{t('tables.phone')}</th>
                  <th>{t('tables.last_active')}</th>
                  <th>{t('titles.Orders')}</th>
                  {/* <th>{t('tables.status')}</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.map((item) => (
                  <tr key={item.name} className={styles.tableRow}>
                    <td>
                      <div className={styles.employeeGroup}>
                        <img 
                          src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                          alt={item.name} 
                          className={styles.employeeAvatar} 
                        />
                        <div className={styles.employeeDetails}>
                          <p className={styles.employeeName}>{item.name}</p>
                        </div>
                      </div>
                    </td>
                    <td>{item.phone}</td>
                    <td className={styles.lastActive}>
                      {item.last_order_date ? item.last_order_date :'__'}
                    </td>
                    <td className={styles.ordersCount}>
                      {item.total_sales}
                    </td>
                    {/* <td>
                      <span className={`${styles.statusBadge} ${
                        item.active ? styles.active : styles.disabled
                      }`}>
                        {item.active ? t('status.active') : t('status.disabled')}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;