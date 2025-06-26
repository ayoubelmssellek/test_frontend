import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './addOffer.module.css';
import { fetchingTypes } from "../../Api/fetchingData/FetchingTypes";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingAddOffre } from '../../Api/fetchingData/FetchAddOffre';

const AddTypeOffer = ({ onClose }) => {
  const { data: types, isLoading, error } = useQuery({
    queryKey: ['types'],
    queryFn: fetchingTypes
  });
  const queryClient = useQueryClient();

  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    type_id: '',
    discount: '',
    startDate: '',
    endDate: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const validateForm = () => {
    const { type_id, discount, startDate, endDate } = formData;

    if (!type_id || !discount || !startDate || !endDate) {
      return 'Incomplete form data';
    }

    if (parseFloat(discount) <= 0 || parseFloat(discount) > 100) {
      return 'Invalid discount percentage';
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return 'Invalid date range';
    }

    return '';
  };
  const mutation = useMutation({
    mutationFn: data => fetchingAddOffre(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['types']);
      onClose();
    },
    onError: error => {
      console.error('Error adding offer:', error);
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    mutation.mutate(formData);
    onClose();
  };

  // ✅ Get min datetime string for input[type=datetime-local]
  const getMinDateTime = () => {
    const now = new Date();
    now.setSeconds(0, 0); // remove seconds and milliseconds
    const iso = now.toISOString();
    return iso.slice(0, 16); // format: YYYY-MM-DDTHH:MM
  };

  const minDateTime = getMinDateTime();

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.loading}>{error.message}</div>;
  }

  return (
    <div className={styles.updateProductForm}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>{t('offers.add_type_offer')}</p>

        {validationError && (
          <p className={styles.errorMessage}>{validationError}</p>
        )}

        <select
          name="type_id"
          className={styles.input}
          value={formData.type_id}
          onChange={handleChange}
        >
          <option value="">{t('offers.choose_type')}</option>
          {types.map(type => (
            <option key={type.id} value={type.id}>
              {t(`types.${type.name}`)}
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
        />

        <div className={styles.flex}>
          <input
            className={styles.input}
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            min={minDateTime}
          />
          <input
            className={styles.input}
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            min={minDateTime}
          />
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button className={styles.updateProductBtn} type="submit">
            {t('common.create')}
          </button>
          <button className={styles.cancelProductBtn} type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

AddTypeOffer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddTypeOffer;
