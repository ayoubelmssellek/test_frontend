import PropTypes from 'prop-types';
import styles from './OffersTabs.module.css';
import { FaTrash , FaEdit } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchingOffres } from '../../Api/fetchingData/FetchGetOffres';
import { useDeleteOffre } from '../../Api/hooks/UseDeleteOffre';


const TypeOffersTable = () => {
  const { data: offers = [] } = useQuery({ queryKey: ['offres'], queryFn: fetchingOffres });
  const { t } = useTranslation();
  const deleteProductMutation = useDeleteOffre();

  const typeOffers = offers?.filter(offer => offer.type === 'type');
  
  const handelDelete = async (IdOffre) => {
      deleteProductMutation.mutate(IdOffre);
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('types.name')}</th>
            <th>{t('offers.discount')}</th>
            <th>{t('offers.start_date')}</th>
            <th>{t('offers.end_date')}</th>
            <th>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {typeOffers.map(offer => (
            <tr key={offer.id}>
              <td>{offer.target.name}</td>
              <td>{offer.discount}%</td>
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

TypeOffersTable.propTypes = {
  offers: PropTypes.array.isRequired,
};

export default TypeOffersTable;
