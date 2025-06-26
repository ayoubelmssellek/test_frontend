import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../Register/Register.module.css';
import { toggleRegister } from '../../../Client/actions/action';
import { useDispatch } from 'react-redux';
import { useMutation  } from '@tanstack/react-query';
import { fetchRegister } from '../../fetchingData/FetchRegister';
import { useQueryClient } from '@tanstack/react-query';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  const queryClient = useQueryClient();
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const mutation = useMutation({
    mutationFn:(formData)=> fetchRegister(formData),
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
       
      queryClient.setQueryData(['user'], data.user);
      navigate('/');
      console.log(data.user);
      
    },
    

    // onMutate: async (newData) => {
    //   await queryClient.cancelQueries(['user']);
    //   const previousData = queryClient.getQueryData(['user']);
    //   queryClient.setQueryData(['user'], (old = []) =>
    //       old.map((item) =>
    //           item.phone === newData.phone ? { ...item, ...newData } : item
    //       )       
    //   );
      

    //   return { previousData };
    // },
    
    onError: (error) =>{
      setErrors({
        ...error.response?.data?.errors,
        general: error.response?.data?.message || 'حدث خطأ أثناء التسجيل'
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // التحقق من الصحة
    const newErrors = {};
    if (!formData.name) newErrors.name = 'حقل الاسم مطلوب';
    if (!formData.phone) newErrors.phone = 'حقل الهاتف مطلوب';
    if (!formData.password) newErrors.password = 'حقل كلمة المرور مطلوب';
    else if (formData.password.length < 4) newErrors.password = 'كلمة المرور يجب أن تحتوي على 4 أحرف على الأقل';
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'كلمات المرور غير متطابقة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log(formData);
    

    setLoading(true);
    mutation.mutate(formData);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h3>إنشاء حساب جديد</h3>

       
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="الاسم"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={errors.name ? styles.errorInput : ''}
            />
            {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="tel"
              placeholder="رقم الهاتف"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className={errors.phone ? styles.errorInput : ''}
            />
            {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={formData.password_confirmation}
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              className={errors.password_confirmation ? styles.errorInput : ''}
            />
            {errors.password_confirmation && (
              <div className={styles.errorMessage}>{errors.password_confirmation}</div>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل حساب جديد'}
          </button>

          <p>
            لديك حساب بالفعل؟{' '}
            <button 
              onClick={() => dispatch(toggleRegister())} 
            
             style={{ color: '#4a90e2' }}>
              تسجيل الدخول
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;