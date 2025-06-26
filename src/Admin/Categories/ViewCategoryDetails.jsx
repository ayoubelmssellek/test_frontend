import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import styles from '../Categories/ViewCategoryDetails.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchingProducts } from '../../Api/fetchingData/FetchProducts';

const ViewCategoryDetails = () => {
    const { t, i18n } = useTranslation(); // Get translation
    const isRTL = i18n.language === 'ar'; // Determine RTL direction
    const { data: products, isLoading, isError } = useQuery({
        queryKey: ['products'],
        queryFn: fetchingProducts,
    })
    

    const [isOpen, setIsOpen] = useState(false);
    const { nameCategory} = useParams();
    const CategoryDetails = products?.filter((item) => item?.category?.name === nameCategory);
    

    const handleSidebarStateChange = (newState) => setIsOpen(newState);

    isLoading&&<div className={styles.loading}>Loading...</div>
    isError&&<div className={styles.error}>Error: {isError.message}</div>
    


    return (
        <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
            <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
            <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
                <Navbar pagePath={t('titles.view_category_details')} />
                <div className={styles.pages}>
                    <div className={styles.viewMoreAboutProduct}>
                        <div className={styles.tableContainer}>
                            <table className={styles.productsTable}>
                                <thead>
                                    <tr>
                                        <th>{t('tables.name')}</th>
                                        <th>{t('tables.category')}</th>
                                        <th>{t('tables.price')}</th>
                                        <th>{t('tables.image')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {CategoryDetails?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.name}</td>
                                            <td>${item.price}</td>
                                            <td>
                                                <img
                                                    src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.image_path}`}
                                                    alt="product"
                                                    title='image'
                                                    width={60}
                                                    height={60}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {CategoryDetails?.length === 0 && <h3>{t('categories.no_products')}</h3>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCategoryDetails;
