import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../AddProduct/AddProduct.module.css';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchingCategories } from '../../../Api/fetchingData/FetchCategories';
import { fetchingTypes } from '../../../Api/fetchingData/FetchingTypes';
import { useMutation , useQueryClient } from '@tanstack/react-query';
import { fetchingAddProduct } from '../../../Api/fetchingData/FetchAddProduct';
const AddProduct = ({ onClose }) => {
  const { data:Categories, isLoading:loadingCategories, error:errorCategories } = useQuery({
    queryKey: ['categories'],
    queryFn:fetchingCategories
  })
  const { data:Types, isLoading: loadingTypes, error: errorTypes } = useQuery({
    queryKey: ['types'],
    queryFn: fetchingTypes,
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn:fetchingAddProduct,
    onSuccess: () => {
        queryClient.invalidateQueries(['products']);
    },
    onMutate:async (newProduct) => {
      await queryClient.cancelQueries(['products']);
      const previousProducts = queryClient.getQueryData(['products']);
      queryClient.setQueryData(['products'], (old) => [...old, newProduct]);
      return { previousProducts };
    },
  
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['products'], context.previousProducts);
      console.log('Error:', err.message); 
    },
  })

  
  console.log('Categories',Categories);
  console.log('Types',Types);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    category_id:'',
    type_id: '',
    price: '',
    image: '',
    description: 'this is a description',
    status: 'avalaible',
    disponible: 1,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validatePrice = (price) => {
    if (isNaN(price)) return t('errors.invalid_price');
    if (price <= 0) return t('errors.positive_price');
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category_id || !formData.price || !formData.type_id) {
      setError(t('errors.fill_all_fields'));
      return;
    }

    const validationError = validatePrice(formData.price);
    if (validationError) {
      setError(validationError);
      return;
    }
    const newProduct ={
      ...formData,
          name: formData.name,
          category_id: formData.category_id,
          type_id: formData.type_id,
          price: formData.price,
          image: formData.image,

    }
    // console.log('newProduct', newProduct);
    
    mutation.mutate(newProduct);
    onClose();
    
   
  };
  if (loadingCategories || loadingTypes) {
    return <div>{t('common.loading')}</div>;
  }
  if (errorCategories || errorTypes) {
    return <div>{t('errors.fetching_data')}</div>;
  }
  
  return (
    <div className={styles.formContainer} dir={isRTL ? 'rtl' : 'ltr'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>{t('products.add_product')}</p>
        {errors && <span className={styles.errorMessage}>{errors}</span>}

        <div className={styles.flex}>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={t('tables.product_name')}
          />
          <input
            className={styles.input}
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            placeholder={t('tables.price')}
          />
        </div>

        <div className={styles.flex}>
          <select
            className={styles.input}
            value={formData.type_id}
            onChange={(e) => setFormData(prev => ({ ...prev, type_id: e.target.value }))}
          >
            <option value="">{t('filters.select_type')}</option>
            {Types?.map(type => (
              <option key={type.name} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            className={styles.input}
            value={formData.category_id}
            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
          >
            <option disabled selected value="">{t('filters.select_category')}</option>
            {Categories?.map(cat => (
              <option key={cat.name} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
            id="fileUpload"
            name='image'
          />
          <label htmlFor="fileUpload" className={styles.fileUploadLabel}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
                style={{ width: '100%', height: '180px' }}
              />
            ) : (
              <span>{t('common.click_to_upload')}</span>
            )}
          </label>
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button type="submit" className={styles.updateProductBtn} disabled={loading}>
            {loading ? t('common.loading') : t('products.add_product')}
          </button>
          <button type="button" className={styles.cancelProductBtn} onClick={onClose}>
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

AddProduct.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AddProduct;
