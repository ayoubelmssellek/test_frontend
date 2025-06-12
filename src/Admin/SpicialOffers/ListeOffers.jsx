import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import Modal from '../Modal/Modal';
import AddOffer from './AddOffer';
import AddCategoryOffer from './AddCategoryOffer';
import AddTypeOffer from './AddTypeOffer';

import styles from './ListeOffers.module.css';
import ProductOffersTable from './ProductOffersTable';
import CategoryOffersTable from './CategoryOffersTable';
import TypeOffersTable from './TypeOffersTable';

const ListeOffers = () => {


    const [activeTab, setActiveTab] = useState('product');

    const renderTable = () => {
        switch (activeTab) {
        case 'product':
            return <ProductOffersTable />;
        case 'category':
            return <CategoryOffersTable />;
        case 'type':
            return <TypeOffersTable />;
        default:
            return null;
        }
    };

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    return savedState ? JSON.parse(savedState) : window.innerWidth >= 915;
  });

  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  const [modalType, setModalType] = useState(null); // "product" | "category" | "type"
  const [selectedOffer, setSelectedOffer] = useState(null);

  const openModal = (type, offer = null) => {
    setModalType(type);
    setSelectedOffer(offer);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedOffer(null);
  };



  return (
    <div className={styles.content} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={setIsOpen} />
      <div className={`${styles.allBadges} ${isOpen ? styles.pushMainContent : styles.ml20}`}>
        <Navbar pagePath={t('titles.Offers')} />

        <div className={styles.pages}>

           <div className={styles.container}>
            <div className={styles.offerTabs}>
              <button
                className={`${styles.offerTabButton} ${activeTab === 'product' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('product')}
              >
                {t('offers.product_offers')}
              </button>
              <button
                className={`${styles.offerTabButton} ${activeTab === 'category' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('category')}
              >
                {t('offers.category_offers')}
              </button>
              <button
                className={`${styles.offerTabButton} ${activeTab === 'type' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('type')}
              >
                {t('offers.type_offers')}
              </button>
            </div>
          <div className={styles.headerActions}>
            <button className={styles.addOfferButton} onClick={() => openModal('product')}>
              {t('product_offre')}
            </button>
            <button className={styles.addOfferButton} onClick={() => openModal('category')}>
              {t('category_offer')}
            </button>
            <button className={styles.addOfferButton} onClick={() => openModal('type')}>
              {t('type_offer')}
            </button>
          </div>

       
           </div>
          <div className={styles.tableContainer}>{renderTable()}</div>

        </div>

        <Modal isOpen={modalType !== null} onClose={closeModal}>
          {modalType === 'product' && (
            <AddOffer Code={selectedOffer?.product_id} product={selectedOffer} onClose={closeModal} />
          )}
          {modalType === 'category' && <AddCategoryOffer onClose={closeModal} />}
          {modalType === 'type' && <AddTypeOffer onClose={closeModal} />}
        </Modal>
      </div>
    </div>
  );
};

export default ListeOffers;
