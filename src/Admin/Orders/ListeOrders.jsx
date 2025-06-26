import { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Utensils, Table, ChevronDown } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import styles from './ListeOrders.module.css';
import { Link, useParams } from 'react-router-dom';
import i18n from 'i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchAllOrders } from '../../Api/fetchingData/FetchGetAllOrders';

import { fetchingUpdateOrderStatus } from '../../Api/fetchingData/FetchUpdateOrderStatus';
import { useMutation,useQueryClient } from '@tanstack/react-query';

const ListeOrders = () => {
  const { data: listorders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchAllOrders,
  });
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('all');
  const { role } = useParams();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
});

  useEffect(() => {
      localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  const mutate = useMutation({
  mutationFn: ({ orderId, newStatus }) => {
    return fetchingUpdateOrderStatus(orderId, { status: newStatus });
  },

  onMutate: async ({ orderId, newStatus }) => {
    await queryClient.cancelQueries(['orders']); // إلغاء أي طلبات جارية

    const previousOrders = queryClient.getQueryData(['orders']);

    queryClient.setQueryData(['orders'], (oldData) =>
      oldData.map((order) =>
        order.id === orderId ? { ...order, statusOrder: newStatus } : order
      )
    );

    return { previousOrders }; // ترجع البيانات السابقة باش نقدر نرجعها فحالة الخطأ
  },

  // ✅ إذا وقع خطأ، نرجع الكاش للبيانات القديمة
  onError: (err, variables, context) => {
    queryClient.setQueryData(['orders'], context.previousOrders);
    console.error('Error updating order status:', err);
  },

  // ✅ من بعد نجاح التحديث نرجع نأكد الكاش بالبيانات من السيرفر
  onSuccess: () => {
    queryClient.invalidateQueries(['orders']);
  },
  });




  const handleStatusChange = (orderId, newStatus) => {
    mutate.mutate({ orderId, newStatus });
    
  };

  // Combined filter logic
  const filteredOrders = listorders?.filter((order) => {
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    const typeMatch = selectedDeliveryType === 'all' || order.delivery_type  === selectedDeliveryType;
    return statusMatch && typeMatch;
  });

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };
  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.content} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
        <Navbar pagePath={t('titles.Orders_T')} />
        <div className={styles.pages}>
          <div className={styles.ordersPage}>
            <div className={styles.statsGrid}>
              {/* Stats Cards - Translated */}
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.bgBlue}`}>
                  <Utensils className={styles.icon} color='orange' />
                </div>
                <div>
                  <p className={styles.statLabel}>{t('filters.all_types')}</p>
                  <p className={styles.statValue}>{listorders?.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.bgGreen}`}>
                  <Table className={styles.icon}  color='#54a8ff'/>
                </div>
                <div>
                  <p className={styles.statLabel}>{t('filters.pickup')}</p>
                  <p className={styles.statValue}>
                    {listorders?.filter((o) => o.delivery_type === 'pickup').length}
                  </p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.bgPurple}`}>
                  <Truck className={styles.icon} color='#48e098' />
                </div>
                <div>
                  <p className={styles.statLabel}>{t('filters.delivery')}</p>
                  <p className={styles.statValue}>
                    {listorders?.filter((o) => o.delivery_type  === 'delivery').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Section - Translated */}
            <div className={styles.filterSection}>
              <div className={styles.filterGroup}>
                <div className={styles.filterButtons}>
                  <button
                    className={`${styles.filterButton} ${selectedStatus === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('all')}
                  >
                    {t('filters.all_status')}
                  </button>
                  <button
                    className={`${styles.filterButton} ${selectedStatus === 'pending' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('pending')}
                  >
                    {t('status.pending')}
                  </button>
                  <button
                    className={`${styles.filterButton} ${selectedStatus === 'preparation' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('preparation')}
                  >
                    {t('status.preparation')}
                  </button>
                  <button
                    className={`${styles.filterButton} ${selectedStatus === 'ready' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('ready')}
                  >
                    {t('status.ready')}
                   </button>
                   <button
                    className={`${styles.filterButton} ${selectedStatus === 'delivered' ? styles.active : ''}`}
                    onClick={() => setSelectedStatus('delivered')}
                  >
                    {t('status.delivered')}
                  </button> 
                </div>

                <div className={styles.filterButtons}>
                  <button
                    className={`${styles.filterButton} ${selectedDeliveryType === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedDeliveryType('all')}
                  >
                    {t('filters.all_types')}
                  </button>
                  <button
                    className={`${styles.filterButton} ${selectedDeliveryType === 'pickup' ? styles.active : ''}`}
                    onClick={() => setSelectedDeliveryType('pickup')}
                  >
                    {t('filters.pickup')}
                  </button>
                  <button
                    className={`${styles.filterButton} ${selectedDeliveryType === 'delivery' ? styles.active : ''}`}
                    onClick={() => setSelectedDeliveryType('delivery')}
                  >
                    {t('filters.delivery')}
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Table - Translated */}
            <div className={styles.ordersTable}>
              <table>
                <thead>
                  <tr>
                    <th>{t('tables.order_id')}</th>
                    <th>{t('tables.customer')}</th>
                    <th>{t('tables.phone')}</th>
                    <th>{t('tables.date')}</th>
                    <th>{t('tables.change_status')}</th>
                    <th>{t('tables.status')}</th>
                    <th>{t('tables.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.order_number}</td>
                      <td>{order.name}</td>
                      <td>{order.phonenumber}</td>
                      <td>{order.created_at}</td>
                      <td>
                        <div className={styles.selectWrapper}>
                          <select
                            value={order.statusOrder}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={styles.statusSelect}
                          >
                            <option value="pending">{t('status.pending')}</option>
                            <option value="preparation">{t('status.preparation')}</option>
                            <option value="ready">{t('status.ready')}</option>
                            <option value="delivered">{t('status.delivered')}</option>
                          </select>
                          <ChevronDown className={styles.selectIcon} size={16} />
                        </div>
                      </td>
                      <td>
                        <span  className={`${styles.statusBadge} ${styles[order.status]}`}>
                          {t(`status.${order.status}`)}
                        </span>
                      </td>
                      <td>
                        <Link to={`/Dashboard/${role}/ViewOrderDetails/${order.id}`}>
                          <button className={styles.viewButton}>
                            Order Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeOrders;