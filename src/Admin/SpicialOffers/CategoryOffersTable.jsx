import { useTranslation } from 'react-i18next';
import {FaTrash , FaEdit } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { fetchingOffres } from '../../Api/fetchingData/FetchGetOffres';
import { useDeleteOffre } from '../../Api/hooks/UseDeleteOffre';


import styles from './OffersTabs.module.css';

const CategoryOffersTable = () => {
  const { data: offers = [] } = useQuery({ queryKey: ['offres'], queryFn: fetchingOffres });
  const { t } = useTranslation();
    const deleteProductMutation = useDeleteOffre(); 



  const categoryOffers = offers.filter(offer => offer.type === 'category');
  


  const handelDelete = async (IdOffre) => {
      deleteProductMutation.mutate(IdOffre);
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('categories.name')}</th>
            <th>{t('offers.discount')}</th>
            <th>{t('offers.start_date')}</th>
            <th>{t('offers.end_date')}</th>
            <th>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {categoryOffers.map(offer => (
            <tr key={offer.id}>
              <td>{offer.target.name}</td>
              <td>{offer.discount ? `${offer.discount}%` : '-'}</td>
              <td>{offer.startDate}</td>
              <td>{offer.endDate}</td>
              <td>
                  <button>
                    <FaEdit size={20} color="#10b981"/>
                  </button>
                  <button onClick={()=>handelDelete(offer.id)}>
                    <FaTrash size={20} color="#ef4444"/>
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryOffersTable;
