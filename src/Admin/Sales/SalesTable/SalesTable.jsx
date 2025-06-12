import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './SalesTable.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetching_filtred_sales } from '../../../Api/fetchingData/FetchFilteredSales'; 
import { fetching_sales_statistic } from '../../../Api/fetchingData/FetchSalesStatistic';
import {
  TrendingUp,
  Calendar,
  Package,
  Search,
  ArrowUpRight
} from 'lucide-react';

const SalesTable = () => {
  const { t } = useTranslation();

  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: sales_statistic, isLoading: isLoadingSales } = useQuery({
    queryKey: ['sales_statistic'],
    queryFn: fetching_sales_statistic,
  });

  const { data: filtred_sales, isLoading: isLoadingStatistic } = useQuery({
    queryKey: ['sales', timeFilter],
    queryFn: () => fetching_filtred_sales(timeFilter),
    keepPreviousData: true, // لتحسين تجربة المستخدم عند تبديل الفلتر
  });
  
  
 
  if (isLoadingSales || isLoadingStatistic){
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  return (
    <div className={styles.salesDashboard}>
      <div className={styles.analyticsGrid}>
        <div className={styles.analyticsCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>{t('filters.Total Sales')}</p>
              <p className={styles.cardValue}>{sales_statistic?.total_sales}</p>
            </div>
            <ArrowUpRight color="var(--success-color)" />
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>{t('filters.daily_sales')}</p>
              <p className={styles.cardValue}>{sales_statistic?.sales_last_24_hours}</p>
            </div>
            <Calendar color="var(--primary)" />
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>{t('filters.weekly_sales')}</p>
              <p className={styles.cardValue}>{sales_statistic?.sales_last_7_days}</p>
            </div>
            <TrendingUp color="var(--success-color)" />
          </div>
        </div>

        <div className={styles.analyticsCard}>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>{t('filters.monthly_sales')}</p>
              <p className={styles.cardValue}>{sales_statistic?.sales_last_30_days}</p>
            </div>
            <Package color="var(--icon-color)" />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={styles.filters}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t('filters.search_placeholder')}
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.dateFilter}>
          <Calendar className={styles.calendarIcon} />
          <select
            className={styles.dateSelect}
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">{t('filters.time.all')}</option>
            <option value="day">{t('filters.time.day')}</option>
            <option value="week">{t('filters.time.week')}</option>
            <option value="month">{t('filters.time.month')}</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className={styles.salesTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('tables.sale_id')}</th>
              <th>{t('tables.date')}</th>
              <th>{t('tables.product_name')}</th>
              <th>{t('tables.category')}</th>
              <th>{t('tables.type')}</th>
              <th>{t('tables.status')}</th>
              <th>{t('tables.total')}</th>
            </tr>
          </thead>
          <tbody>
            {filtred_sales?.filter((sale) =>
                (sale.product?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                sale.category?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                sale.type?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
              )
              .map((sale) => (
                <tr key={sale.id} className={styles.tableRow}>
                  <td className={styles.tableData}>{sale.sale_number ?? sale.id}</td>
                  <td className={styles.tableData}>{sale.sold_at}</td>
                  <td className={styles.tableData}>{sale.product.name}</td>
                  <td className={styles.tableData}>{sale.category.name}</td>
                  <td className={styles.tableData}>{sale.type.name}</td>
                  <td className={styles.tableData}>
                    <span
                      className={`${styles.statusBadge} ${
                        sale.id ? styles.completed : styles.refunded
                      }`}
                    >
                      completed
                    </span>
                  </td>
                  <td className={styles.tableData}>{sale.total_price} Dh</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
