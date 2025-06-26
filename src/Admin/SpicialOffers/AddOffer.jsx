import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';
import styles from './addOffer.module.css';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchingProducts } from "../../Api/fetchingData/FetchProducts";
import { fetchingAddOffre } from "../../Api/fetchingData/FetchAddOffre";

const AddOffer = ({ Code, product, onClose }) => {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchingProducts,
  });

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    product_id: '',
    discount: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (product) {
      const formatDateTime = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        product_id: product.id,
        discount: product.offer?.discount || '',
        startDate: formatDateTime(product.offer?.startDate),
        endDate: formatDateTime(product.offer?.endDate)
      });
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (newOfferData) => fetchingAddOffre(newOfferData),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']); // Refresh products list
      onClose();
    },
    onError: (error) => {
      console.error("Error adding offer:", error);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!products || !products.find(p => p.id == formData.product_id)) {
      alert(t('offers.select_valid_product'));
      return;
    }

    mutation.mutate(formData);
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;

  return (
    <div className={styles.updateProductForm}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>
          {product ? t('offers.edit_offer') : t('offers.add_offer')}
        </p>

        {!product && (
          <label>
            <select
              className={styles.input}
              name="product_id"
              value={formData.product_id}
              onChange={handleInputChange}
              required
            >
              <option value="">{t('offers.select_product')}</option>
              {products.filter(p => !p.offer).map(product => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <div>
          <label>
            <input
              className={styles.input}
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder={t('offers.discount_percent')}
              min={1}
              max={100}
              required
            />
          </label>
        </div>

        <div className={styles.flex}>
          <label>
            <input
              className={styles.input}
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
          </label>
          <label>
            <input
              className={styles.input}
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().slice(0, 16)}
              required
            />
          </label>
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button
            className={styles.updateProductBtn}
            type="submit"
            disabled={mutation.isLoading}
          >
            {product ? t('common.update') : t('common.create')}
          </button>
          <button className={styles.cancelProductBtn} type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

AddOffer.propTypes = {
  product: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  Code: PropTypes.string
};

export default AddOffer;
