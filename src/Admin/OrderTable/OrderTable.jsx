import { useTranslation } from 'react-i18next';
import styles from './OrderTable.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchAllOrders } from '../../Api/fetchingData/FetchGetAllOrders';


const OrderTable = () => {
  const { data: listorders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchAllOrders,
    refetchInterval: 10000, 
    refetchOnWindowFocus: true, 
    refetchOnReconnect: true, 
    retry: 1, 
  });
  const { t } = useTranslation();

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.recentOrders}>
      <div className={styles.tableHeader}>
        <h3>{t("tables.recentOrders")}</h3>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>{t('tables.order_id')}</th>
              <th>{t('tables.customer')}</th>
              <th>{t('tables.phone')}</th>
              <th>{t('tables.date')}</th>
              <th>{t('tables.items')}</th>
              <th>{t('tables.status')}</th>
            </tr>
          </thead>
          <tbody>
            {listorders.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{order.name}</td>
                <td>{order.phonenumber}</td>
                <td>{order.created_at}</td>
                <td>
                  {order.items.length} {order.items.length > 1 ? t('tables.items') : t('tables.item')}
                </td>
                <td>
                  <span  className={`${styles.statusBadge} ${styles[order.status]}`}>
                    {t(`status.${order.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;