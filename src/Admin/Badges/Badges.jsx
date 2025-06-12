import styles from './Badges.module.css';
import { Link, useParams } from 'react-router-dom';
import { FaRegStar, FaBoxOpen, FaUsers, FaChartLine, FaHamburger } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchingUser } from '../../Api/fetchingData/FetchUserData';
import{ fetching_badges_statistics} from '../../Api/fetchingData/Fetch_badges_statistics';
const Badge = () => {
      const token = localStorage.getItem('authToken');

    const { data: parsedUser } = useQuery({
        queryKey: ["user"],
        queryFn:fetchingUser,
        enabled: !!token,  // هادي كتخلي useQuery يخدم غير إذا كان التوكن موجود (true)
        staleTime: 1000 * 60 * 5,
    });

    const { data: badges_statistics , isLoading , isError } = useQuery({
        queryKey: ["badges_statistics"],
        queryFn:fetching_badges_statistics,
    });
    



    
    

    const { t } = useTranslation();
    const { role } = useParams();
    
    if (isLoading) return <div className={styles.loading}>Loading badges...</div>;
    if (isError) return <div className={styles.error}>Error loading badges statistics</div>;

    return (
        <div className={styles.BadgeContainer}>
            <Link to={`/Dashboard/${role}/Products`}>
                <div className={styles.badgeCard}>
                    <div className={styles.badgeHeader}>
                        <div className={styles.iconWrapper}>
                            <div className={`${styles.badgeIcon} ${styles.products}`}>
                                <FaHamburger color='#fff' size={20} />
                            </div>
                        </div>
                        <div className={styles.titleAndNumber}>
                            <h3 className={styles.cardTitle}>     
                            {t('badges.products')}
                            </h3>
                            <p className={styles.cardValue}>{badges_statistics.products.count}</p>
                        </div>
                    </div>
                    <p className={styles.growthText}>
                     {t('badges.lastUpdate')} {badges_statistics.products.updated_at}
                    </p>
                </div>
            </Link>

            <Link to={`/Dashboard/${role}/ListeOrders`}>
                <div className={styles.badgeCard}>
                    <div className={styles.badgeHeader}>
                        <div className={styles.iconWrapper}>
                            <div className={`${styles.badgeIcon} ${styles.orders}`}>
                                <FaBoxOpen color='#fff' size={20} />
                            </div>
                        </div>
                        <div className={styles.titleAndNumber}>
                            <h3 className={styles.cardTitle}>
                            {t('badges.orders')}
                            </h3>
                            <p className={styles.cardValue}>{badges_statistics.orders.count}</p>
                        </div>
                    </div>
                    <p className={styles.growthText}>
                    {t('badges.lastUpdate')} {badges_statistics.orders.updated_at}
                    </p>
                </div>
            </Link>

            {/* Repeat similar structure for other badges */}
            {
                parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin'  && (
                                <Link to={`/Dashboard/${role}/Customers`}>
                                    <div className={styles.badgeCard}>
                                        <div className={styles.badgeHeader}>
                                            <div className={`${styles.badgeIcon} ${styles.customers}`}>
                                                <FaUsers color='#fff' size={20} />
                                            </div>
                                            <div className={styles.titleAndNumber}>
                                                <h3 className={styles.cardTitle}>
                                                {t('badges.customers')}
                                                </h3>
                                                <p className={styles.cardValue}>{badges_statistics.users.count}</p>
                                            </div>
                                        </div>
                                        <p className={styles.growthText}>
                                        {t('badges.lastUpdate')} {badges_statistics.users.updated_at}
                                        </p>
                                    </div>
                                </Link>
                )
            }

         {
            parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin'  && (
                <Link to={`/Dashboard/${role}/Reviews`}>
                <div className={styles.badgeCard}>
                    <div className={styles.badgeHeader}>
                        <div className={`${styles.badgeIcon} ${styles.reviews}`}>
                            <FaRegStar color='#fff' size={20} />
                        </div>
                        <div className={styles.titleAndNumber}>
                            <h3 className={styles.cardTitle}>
                            {t('badges.reviews')}
                            </h3>
                            <p className={styles.cardValue}>{badges_statistics.reviews.count}</p>
                        </div>
                    </div>
                    <p className={styles.growthText}>
                    {t('badges.lastUpdate')} {badges_statistics.reviews.updated_at}
                    </p>
                </div>
            </Link>
            )
         }

        {
            parsedUser?.role_id === 2 && parsedUser?.role_name === 'admin' && (
                            <Link to={`/Dashboard/${role}/SalesCompenent`}>
                                <div className={styles.badgeCard}>
                                    <div className={styles.badgeHeader}>
                                        <div className={`${styles.badgeIcon} ${styles.sales}`}>
                                            <FaChartLine color='#fff' size={20} />
                                        </div>
                                        <div className={styles.titleAndNumber}>
                                            <h3 className={styles.cardTitle}>
                                            {t('badges.sales')}
                                            </h3>
                                            <p className={styles.cardValue}>{badges_statistics.sales.count}</p>
                                        </div>
                                    </div>
                                    <p className={styles.growthText}>
                                    {t('badges.lastUpdate')} {badges_statistics.sales.updated_at}
                                    </p>
                                </div>
                            </Link>
            )
        }
        </div>
    );
};

export default Badge;