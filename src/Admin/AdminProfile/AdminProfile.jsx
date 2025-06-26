import { useState, useEffect } from 'react';
import { User, Edit, Save } from "lucide-react";
import styles from './AdminProfile.module.css';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { fetchingAdminInformations } from '../../Api/fetchingData/FetchAdminInformation';
import { fetchingUpdateAdminAccount } from '../../Api/fetchingData/FetchUpdateAdminAccount';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../Modal/Modal';
import AddManager from './AddManager';
import ListeManagers from './ListeManagers';

export default function AdminProfile() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar'; 

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminInfo'],
    queryFn: fetchingAdminInformations,
  });

  const [showAddManagerComponent, setShowAddManagerComponent] = useState(false);
  const [showListeManagerComponent, setShowListeManagerComponent] = useState(false);



  const handleCloseAddManagerModal = () => setShowAddManagerComponent(false);
  const handleOpenAddManagerModal = () =>  setShowAddManagerComponent(true)


  const handleCloseListeManagerModal = () => setShowListeManagerComponent(false);
  const handleOpenListeManagerModal = () => setShowListeManagerComponent(true)

  // Sidebar open/close state
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    return window.innerWidth >= 915;
  });
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  // Update profile state when data is loaded
  useEffect(() => {
    if (data) {
      setProfile({
        name: data.name || '',
        phone: data.phone || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [data]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
  mutationFn: ({ AdminId, updatedData }) => fetchingUpdateAdminAccount(AdminId, updatedData),
  onSuccess: () => {
    queryClient.invalidateQueries(['adminInfo']);
    setIsEditing(false);
    alert(t('profile.Profile saved successfully!'));
    setProfile(prev => ({
      ...prev,
      password: '',
      password_confirmation: '',
    }));
  },
  onError: (error) => {
    alert(error.message || 'Failed to save profile.');
  }
 });
 
 

  const handleSave = () => {
    // Basic validation: check if password and confirmation match
    if (profile.password !== profile.password_confirmation) {
      alert(t('profile.Passwords do not match!'));
      return;
    }

    const updatedData = {
    name: profile.name,
    phone: profile.phone,
    password: profile.password,
    password_confirmation: profile.password_confirmation,
    };

    mutation.mutate({ AdminId: data.id, updatedData });
    console.log(updatedData);
    

  };

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
        <Navbar pagePath={t('titles.Profile')} />
        <div className={styles.pages}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <div>
               <h2 className={styles.cardTitle}>
                <User className={styles.iconSpacing} />
                {t('profile.Admin Profile')}
               </h2>
               <p className={styles.cardDescription}>
                {t('profile.Msg')}
               </p>
              </div>
               <div className={`${styles.gestingManager} `}>
               <button className={`${styles.AddManagerButton}`} onClick={handleOpenAddManagerModal}>Add Manager</button>
               <button className={`${styles.AddManagerButton}`} onClick={handleOpenListeManagerModal}>Liste  managers</button>
               </div>
            </div>
           
            <div className={styles.cardContent}>
              <div className={styles.formGrid}>
                <div className={styles.formRow}>
                  <label htmlFor="name">{t('profile.Name')}</label>
                  <input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className={styles.formRow}>
                  <label htmlFor="phone">{t('profile.Phone')}</label>
                  <input
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>

                <div className={styles.formRow}>
                  <label htmlFor="password">{t('profile.Password')}</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={isEditing ? profile.password : ''}
                    placeholder={isEditing ? '' : '********'}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    autoComplete="new-password"
                  />
                </div>

                {isEditing && (
                  <div className={styles.formRow}>
                    <label htmlFor="password_confirmation">{t('profile.Confirm Password')}</label>
                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      value={profile.password_confirmation}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.cardFooter}>
              {isEditing ? (
                <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave} disabled={mutation.isLoading}>
                  <Save className={styles.buttonIcon} />
                  {mutation.isLoading ? t('profile.Saving...') : t('profile.Save')}
                </button>
              ) : (
                <button className={`${styles.button} ${styles.editButton}`} onClick={() => setIsEditing(true)}>
                  <Edit className={styles.buttonIcon} />
                  {t('profile.Edit')}
                </button>
              )}
            </div>
          </div>
          </div>
                <Modal isOpen={showAddManagerComponent} onClose={handleCloseAddManagerModal}>
                  <AddManager onClose={handleCloseAddManagerModal} />
                </Modal>

                <Modal isOpen={showListeManagerComponent} onClose={handleCloseListeManagerModal}>
                  <ListeManagers onClose={handleCloseListeManagerModal} />
                </Modal>
      </div>
    </div>
  );
}
