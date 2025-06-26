// LocationSection.jsx
import React from 'react';
import styles from './LocationSection.module.css';

const LocationSection = () => {
  const restaurantAddress = "Gusto Dakhla, Dakhla, Western Sahara";
  const encodedAddress = encodeURIComponent(restaurantAddress);

  return (
    <section dir='rtl'  className={styles['location-section']}>
      {/* <div className={styles['location-container']}>
        <h2 className={styles['section-title']}>اعثر على مطعمنا</h2>
        
        <div className={styles['location-grid']}>
          <div className={styles['map-wrapper']}>
            <iframe
              className={styles['restaurant-map']}
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14613.851727241134!2d-15.932591000000002!3d23.695157!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xc224991115db94f%3A0x5a9b5af92f69f976!2sGUSTO%20DAKHLA!5e0!3m2!1sen!2sus!4v1739997330045!5m2!1sen!2sus"
              title="موقع Gusto Dakhla"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className={styles['map-marker']}>
              <span className={styles['pin-icon']}>📍</span>
              <p>نحن هنا!</p>
            </div>
          </div>

          <div className={styles['location-info']}>
            <div className={styles['info-card']}>
              <h3 className={styles['info-title']}>عنواننا</h3>
              <p className={styles['address']}>
                GUSTO DAKHLA<br />
                الداخلة، الصحراء المغربية<br />
                <span className={styles['landmark']}> (الطريق الساحلي)</span>
              </p>

              <div className={styles['info-group']}>
                <div className={styles['info-item']}>
                  <span className={styles['icon']}>🕒</span>
                  <div>
                    <h4>ساعات العمل</h4>
                    <p>الإثنين - الأحد:1 بعد الظهر -  3 بعد منتصف الليل<br />
                    <span className={styles['highlight']}>مفتوح حتى وقت متأخر للمناسبات الخاصة</span></p>
                  </div>
                </div>

                <div className={styles['info-item']}>
                  <span className={styles['icon']}>🌊</span>
                  <div>
                    <h4>مميزات الموقع</h4>
                    <p>تناول الطعام أمام المحيط<br />
                    <span className={styles['highlight']}>موقف سيارات واسع متاح</span></p>
                  </div>
                </div>
              </div>

              <div className={styles['action-buttons']}>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`}
                  className={styles['btn'] + ' ' + styles['directions-btn']}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles['btn-icon']}>🗺️</span>
                  احصل على الاتجاهات
                </a>
                <a href="tel:+212616700532" className={styles['btn'] + ' ' + styles['phone-btn']}>
                  <span className={styles['btn-icon']}>📞</span>
                  اتصل الآن
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default LocationSection;
