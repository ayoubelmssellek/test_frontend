import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchingOffres } from '../../Api/fetchingData/FetchGetOffres';
import { FaTrash , FaEdit } from "react-icons/fa";
import { useDeleteOffre } from '../../Api/hooks/UseDeleteOffre';
import styles from './OffersTabs.module.css';

const ProductOffersTable = () => {
  const { data: offers = [] } = useQuery({ queryKey: ['offres'], queryFn: fetchingOffres });
  const { t } = useTranslation();
  const deleteProductMutation = useDeleteOffre(); 
  

  const productOffers = offers.filter((o) => o.type === 'product');
  

  const calculateNewPrice = (price, discount) => {
    return (price - (price * discount) / 100).toFixed(2);
  };

  const handelDelete = (IdOffre) => {
    deleteProductMutation.mutate(IdOffre);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('tables.name')}</th>
            <th>{t('tables.category')}</th>
            <th>{t('tables.type')}</th>
            <th>{t('tables.price')}</th>
            <th>{t('offers.discount')}</th>
            <th>{t('offers.new_price')}</th>
            <th>{t('offers.start_date')}</th>
            <th>{t('offers.end_date')}</th>
            <th>{t('offers.image')}</th>
            <th>{t('common.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {productOffers.map((offer) => (
            <tr key={offer.id}>
              <td>{offer.target.name}</td>
              <td>{offer.target.category}</td>
              <td>{offer.target.type}</td>
              <td>{offer.target.price}</td>
              <td>{offer.discount}%</td>
              <td>{calculateNewPrice(offer.target.price, offer.discount)}</td>
              <td>{offer.startDate}</td>
              <td>{offer.endDate}</td>
              <td>
                {offer.target.image && (
                  <img src={`http://localhost:8000/storage/${offer.target.image}`} alt="product" />
                )}
              </td>
              <td>
                <button>
                  <FaEdit size={20} color="#10b981" />
                </button>
                <button onClick={() => handelDelete(offer.id)}>
                  <FaTrash size={20} color="#ef4444" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductOffersTable;
