import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './addOffer.module.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingCategories } from '../../Api/fetchingData/FetchCategories';
import { fetchingAddOffre } from '../../Api/fetchingData/FetchAddOffre';

const AddCategoryOffer = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchingCategories,
  });

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    category_id: '',    // here the correct key
    discount: '',
    startDate: '',
    endDate: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const validateForm = () => {
    const { category_id, discount, startDate, endDate } = formData;

    if (!category_id || !discount || !startDate || !endDate) {
      return t('offers.error_incomplete_form');
    }

    if (parseFloat(discount) <= 0 || parseFloat(discount) > 100) {
      return t('offers.error_invalid_discount');
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return t('offers.error_invalid_date_range');
    }

    return '';
  };

  const mutation = useMutation({
    mutationFn: (data) => fetchingAddOffre(data),  // Pass whole data object directly
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      onClose();
    },
    onError: (error) => {
      console.error('Error adding offer:', error);
      setValidationError(t('offers.error_submission'));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }
    mutation.mutate(formData);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  const minDateTime = getMinDateTime();

  if (isLoading) {
    return <div className={styles.loading}>{t('loading')}</div>;
  }

  if (error) {
    return <div className={styles.error}>{error.message}</div>;
  }

  return (
    <div className={styles.updateProductForm} dir={isRTL ? 'rtl' : 'ltr'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>{t('offers.add_category_offer')}</p>

        {validationError && (
          <p className={styles.errorMessage}>{validationError}</p>
        )}

        <select
          name="category_id"
          className={styles.input}
          value={formData.category_id}
          onChange={handleChange}
          aria-label={t('offers.choose_category')}
        >
          <option value="">{t('offers.choose_category')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {t(`categories.${cat.name}`)}
            </option>
          ))}
        </select>

        <input
          className={styles.input}
          type="number"
          name="discount"
          value={formData.discount}
          placeholder={t('offers.discount_percent')}
          onChange={handleChange}
          min="1"
          max="100"
          step="0.01"
          aria-label={t('offers.discount_percent')}
        />

        <div className={styles.flex}>
          <input
            className={styles.input}
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={minDateTime}
            aria-label={t('offers.start_date')}
          />
          <input
            className={styles.input}
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={minDateTime}
            aria-label={t('offers.end_date')}
          />
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button
            className={styles.updateProductBtn}
            type="submit"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? t('common.saving') : t('common.create')}
          </button>
          <button
            className={styles.cancelProductBtn}
            type="button"
            onClick={onClose}
            disabled={mutation.isLoading}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

AddCategoryOffer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddCategoryOffer;
