import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from '../Up/UpdateSelectedProduct.module.css';
import i18n from 'i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchingCategories } from '../../../Api/fetchingData/FetchCategories';
import { fetchingTypes } from '../../../Api/fetchingData/FetchingTypes';
import { fetchingUpdateProduct } from '../../../Api/fetchingData/FetchUpdateProduct';

const UpdateSelectedProduct = ({ Code, product, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: Categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchingCategories,
  });

  const { data: Types } = useQuery({
    queryKey: ['types'],
    queryFn: fetchingTypes,
  });

  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    type_id: '',
    price: '',
    image_path: null,
    status: 'available',
    disponible: true, // أضفت حقل التوفر
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        price: product.price || '',
        type_id: product.type_id || '',
        image_path: null,
        status: product.status || 'available',
        disponible: product.disponible ?? true, // جلب القيمة أو true إذا غير موجودة
        id: product.id,
      });

      if (product.image_path) {
        setPreviewImage(`${import.meta.env.VITE_API_IMG_BASE_URL}/${product.image_path}`);
      } else {
        setPreviewImage(null);
      }
    }
  }, [product]);

  const validatePrice = (price) => {
    if (isNaN(price)) return t('errors.invalid_price');
    if (price <= 0) return t('errors.positive_price');
    return '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image_path: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const mutation = useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const form = new FormData();
      form.append('name', updatedData.name);
      form.append('category_id', updatedData.category_id);
      form.append('type_id', updatedData.type_id);
      form.append('price', updatedData.price);
      form.append('status', updatedData.status);
      form.append('disponible', updatedData.disponible ? '1' : '0'); // حقل boolean ترسله كـ '1' أو '0'
      form.append('_method', 'PUT');

      if (updatedData.image_path instanceof File) {
        form.append('image', updatedData.image_path); // تم تعديل اسم الحقل هنا
      }

      return await fetchingUpdateProduct(id, form);
    },

    onMutate: async (updatedProduct) => {
      await queryClient.cancelQueries(['products']);
      const previousProducts = queryClient.getQueryData(['products']);

      queryClient.setQueryData(['products'], (old = []) =>
        old.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
      );

      return { previousProducts };
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },

    onError: (_error, _updatedProduct, context) => {
      queryClient.setQueryData(['products'], context.previousProducts);
      setError(t('errors.update_product_failed'));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category_id ||
      !formData.price ||
      !formData.type_id ||
      !formData.status
    ) {
      setError(t('errors.fill_all_fields'));
      return;
    }

    const validationError = validatePrice(formData.price);
    if (validationError) {
      setError(validationError);
      return;
    }

    mutation.mutate({ id: product.id, ...formData });
    onClose();
  };

  return (
    <div
      className={styles.formContainer}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>{t('products.update_product')}</p>
        {error && <span className={styles.errorMessage}>{error}</span>}

        <div className={styles.flex}>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder={t('products.product_name')}
          />
          <input
            className={styles.input}
            type="number"
            name="price"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            placeholder={t('tables.price')}
          />
        </div>

        <div className={styles.flex}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.input}
              name="category"
              value={formData.category_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category_id: e.target.value }))
              }
            >
              {Categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selectWrapper}>
            <select
              className={styles.input}
              name="type"
              value={formData.type_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type_id: e.target.value }))
              }
            >
              {Types?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.flex}>
          <select
            className={styles.input}
            name="status"
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="avalaible">{t('products.available')}</option>
            <option value="out of stock">{t('products.out_of_stock')}</option>
          </select>
        </div>



        <div className={styles.formGroup}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className={styles.fileUploadLabel}>
            {previewImage ? (
              <img
                src={previewImage}
                alt={t('common.image_preview')}
                className={styles.imageUpdatePreview}
              />
            ) : (
              <span>{t('common.click_to_upload')}</span>
            )}
          </label>
        </div>

        <div className={styles.actionAndCancelBtn}>
          <button type="submit" className={styles.updateProductBtn}>
            {t('products.update_product')}
          </button>
          <button
            type="button"
            className={styles.cancelProductBtn}
            onClick={onClose}
          >
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

UpdateSelectedProduct.propTypes = {
  Code: PropTypes.number.isRequired,
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpdateSelectedProduct;
