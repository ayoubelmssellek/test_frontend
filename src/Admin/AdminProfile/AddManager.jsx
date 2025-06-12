import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AddManager.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingAddManager } from '../../Api/fetchingData/FetchAddManager';

const AddManager = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });
  
  const [errors, setErrors] = useState({
    name: null,
    phone: null,
    password: null,
    password_confirmation: null,
    general: null
  });

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // مسح خطأ الحقل عند الكتابة
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
const addManagerMutation = useMutation({
    mutationFn: (formData) => fetchingAddManager(formData),
    onSuccess: (data) => {
        queryClient.invalidateQueries(['managers']);
        onClose();
    },
    onError: (error) => {
        setErrors({
            ...error.errors,
            general: error.message || 'حدث خطأ غير متوقع'
        });
    },
});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({
      name: null,
      phone: null,
      password: null,
      password_confirmation: null,
      general: null
    });
    addManagerMutation.mutate(formData);
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>Add Mnager</p>

        {errors.general && (
          <div className={styles.error}>{errors.general}</div>
        )}

        <div className={styles.formGroup}>
          <input
            type="text"
            name="name"
            placeholder="name"
            className={`${styles.input} ${errors.name ? styles.errorBorder : ''}`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <div className={styles.fieldError}>{errors.name[0]}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="text"
            name="phone"
            placeholder="number phone"
            className={`${styles.input} ${errors.phone ? styles.errorBorder : ''}`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <div className={styles.fieldError}>{errors.phone[0]}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            name="password"
            placeholder="password"
            className={`${styles.input} ${errors.password ? styles.errorBorder : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div className={styles.fieldError}>{errors.password[0]}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <input
            type="password"
            name="password_confirmation"
            placeholder="confirm  password"
            className={`${styles.input} ${errors.password_confirmation ? styles.errorBorder : ''}`}
            value={formData.password_confirmation}
            onChange={handleChange}
          />
          {errors.password_confirmation && (
            <div className={styles.fieldError}>{errors.password_confirmation[0]}</div>
          )}
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={addManagerMutation.isLoading}
          >
            {addManagerMutation.isLoading ? 'Adding ...' : 'Add Manager'}
          </button>
          <button
            className={styles.cancelProductBtn}
            type="button"
            onClick={onClose}
            disabled={addManagerMutation.isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

AddManager.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddManager;