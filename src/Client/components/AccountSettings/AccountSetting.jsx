import  { useState } from 'react';
import { FaUser, FaLock, FaBell, FaInfoCircle, FaChevronDown, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './AccountSettings.module.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({
    name: 'ayoub',
    phone: '+212673897450',
    location: 'hay hassani',
    securityNumber: '',
    language: 'ar',
    notifications: true,
  });

  const settingsSections = [
    {
      id: 'personal',
      title: 'المعلومات الشخصية',
      icon: <FaUser />,
      content: (
        <div className={styles.sectionContent}>
          <div className={styles.formGroup}>
            <label>الاسم الكامل</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className={styles.formGroup}>
            <label>رقم الهاتف</label>
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className={styles.formGroup}>
            <label>الموقع</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <button className={styles.saveButton}>حفظ التغييرات</button>
        </div>
      ),
    },
    {
      id: 'security',
      title: 'الأمان',
      icon: <FaLock />,
      content: (
        <div className={styles.sectionContent}>
          <div className={styles.formGroup}>
            <label>رقم الهاتف الأمني</label>
            <input type="tel" value={formData.securityNumber} onChange={(e) => setFormData({ ...formData, securityNumber: e.target.value })} placeholder="أدخل رقم هاتف للاسترداد" />
          </div>
          <div className={styles.formGroup}>
            <label>كلمة المرور الحالية</label>
            <input type="password" />
          </div>
          <div className={styles.formGroup}>
            <label>كلمة المرور الجديدة</label>
            <input type="password" />
          </div>
          <button className={styles.saveButton}>تحديث الأمان</button>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'الإشعارات',
      icon: <FaBell />,
      content: (
        <div className={styles.sectionContent}>
          <div className={styles.toggleGroup}>
            <label>إشعارات التطبيق</label>
            <div
              className={`${styles.toggle} ${formData.notifications ? styles.active : ''}`}
              onClick={() => setFormData({ ...formData, notifications: !formData.notifications })}
            >
              <div className={styles.toggleSwitch}></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'التفضيلات',
      icon: <FaInfoCircle />,
      content: (
        <div className={styles.sectionContent}>
          <div className={styles.formGroup}>
            <label>اللغة</label>
            <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      ),
    },
  ];
  const handleLogout = () => {
    const confirm=window.confirm('are you sur you want to logout')
    if (confirm) {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        navigate('/login'); 
    }
  
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowRight className={styles.backIcon} />
          رجوع
        </button>
        <div>
          <h1 className={styles.title}>الإعدادات</h1>
          <p className={styles.subtitle}>تفضيلات الحساب والإعدادات الشخصية</p>
        </div>
      </div>

      <div className={styles.settingsSections}>
        {settingsSections.map((section) => (
          <div
            className={`${styles.section} ${activeSection === section.id ? styles.active : ''}`}
            key={section.id}
          >
            <div
              className={styles.sectionHeader}
              onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
            >
              <div className={styles.sectionTitle}>
                {section.icon}
                <span>{section.title}</span>
              </div>
              <FaChevronDown className={`${styles.arrow} ${activeSection === section.id ? styles.rotated : ''}`} />
            </div>

            {activeSection === section.id && <div className={styles.sectionBody}>{section.content}</div>}
          </div>
        ))}
         <div className={styles.section}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <FaSignOutAlt className={styles.logoutIcon} />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
