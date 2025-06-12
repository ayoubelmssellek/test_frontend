import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Login/Login.module.css';
import { useDispatch } from 'react-redux';
import { toggleRegister } from '../../../Client/actions/action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../../fetchingData/FetchLogin';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (loginData) => loginUser(loginData),
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      queryClient.setQueryData(['user'], data.user);
      console.log(data)
      
      if (data.user.role_name === 'admin' || data.user.role_name === 'manager') {
        navigate(`/Dashboard/${data.user.role_name}`);
      } else {
        navigate('/');
      }
    },
   
    onError: (error) => {
      setErrors({
        ...error.response?.data?.errors,
        general: error.response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات',
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = {};
    if (!loginData.phone) newErrors.phone = 'حقل الهاتف مطلوب';
    if (!loginData.password) newErrors.password = 'حقل كلمة المرور مطلوب';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    mutation.mutate(loginData);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h3>تسجيل الدخول</h3>

          {errors.general && (
            <div className={styles.errorMessage} style={{ textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <div className={styles.inputContainer}>
            <input
              type="tel"
              placeholder="رقم الهاتف"
              value={loginData.phone}
              onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
              className={errors.phone ? styles.errorInput : ''}
            />
            {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
          </div>

          <div className={styles.inputContainer}>
            <input
              type="password"
              placeholder="كلمة المرور"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className={errors.password ? styles.errorInput : ''}
            />
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className={styles.switchFormText}>
          ليس لديك حساب؟{' '}
          <button
            onClick={() => dispatch(toggleRegister())}
            className={styles.switchFormButton}
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
