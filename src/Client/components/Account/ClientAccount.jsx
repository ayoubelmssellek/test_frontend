import  { useEffect, useState } from 'react';
import  Navbar  from '../navbar/Navbar';
import { Link } from 'react-router-dom';
import './ClientAccount.css';
import { FaUtensils, FaHistory, FaHeart, FaCog } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { fetchingUser } from '../../../Api/fetchingData/FetchUserData';

const ClientAccount = () => {
      const token = localStorage.getItem('authToken');

    const { data: userInfo } = useQuery({
    queryKey: ["user"],
    queryFn: fetchingUser,
    enabled: !!token,  // هادي كتخلي useQuery يخدم غير إذا كان التوكن موجود (true)
    staleTime: 1000 * 60 * 5,
  });


  return (
    <>
      <Navbar />
      <div className="client-account-container">
        {userInfo ? (
          <div className="account-content">
            {/* قسم الترحيب */}
            <div  className="welcome-banner">
              <div className="welcome-text">
                <h1>مرحبًا بعودتك، {userInfo.name}! 👋</h1>
                <p>ما هي الوجبة اللذيذة التي تشتهيها اليوم؟</p>
              </div>
              <div className="food-illustration">
                <img src="https://cdn-icons-png.flaticon.com/512/5787/5787100.png" alt="توضيح الطعام" />
              </div>
            </div>

            {/* شبكة الإجراءات السريعة */}
            <div className="quick-actions-grid">
              <Link to="/menu" className="action-card">
                <FaUtensils className="action-icon" />
                <h3>اطلب الآن</h3>
                <p>استكشف قائمتنا الشهية</p>
              </Link>

              <Link to="/orderhistory" className="action-card">
                <FaHistory className="action-icon" />
                <h3>سجل الطلبات</h3>
                <p>عرض طلباتك السابقة</p>
              </Link>

              <Link to="/Favorite" className="action-card">
                <FaHeart className="action-icon" />
                <h3>المفضلة</h3>
                <p>عناصرك المحفوظة</p>
              </Link>

              <Link to="/settings" className="action-card">
                <FaCog className="action-icon" />
                <h3>الإعدادات</h3>
                <p>تفضيلات الحساب</p>
              </Link>
            </div>

          </div>
        ) : (
          <div className='guest-content'>
          <h2>مرحبًا بك! 👋</h2>
          <p>يرجى تسجيل الدخول أو إنشاء حساب للاستمتاع بالخدمات</p>
         <Link to={'/Login'}> <button className="auth-button" >إنشاء حساب</button></Link>
        </div>
       
        )}
      </div>
    </>
  );
};

export default ClientAccount;
