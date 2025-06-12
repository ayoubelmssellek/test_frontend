import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import './Dashboard.css';
import Badge from "../Badges/Badges";
import OrderTable from "../OrderTable/OrderTable";
import Navbar from "../Navbar/Navbar";
import ProductTypes from "../Types/Types";
import ApexDonutChartbyCatigory from '../Sales/SalesCharts/SalesChartsbyCategory';
import ApexDonutChartbytype from '../Sales/SalesCharts/SalesChartsbyType';
import { useTranslation } from 'react-i18next';
import { useQuery } from "@tanstack/react-query";
import { fetchingUser } from "../../Api/fetchingData/FetchUserData";

const Dashboard = () => {
      const { data: parsedUser } = useQuery({
    queryKey: ["user"],
    queryFn:fetchingUser,
  });


  const {t, i18n } = useTranslation(); // Get i18n instance

  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    return window.innerWidth >= 915; // Default to open on desktop
  });
  
  // Get current language
  const currentLang = i18n.language;
  const isRTL = currentLang === 'ar';
  
  useEffect(() => {
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  const handleSidebarStateChange = (newState) => {
    setIsOpen(newState);
  };

  return (
    <div className="dashboard"  dir={isRTL?'rtl':'ltr'}>
      <div className={`sidebar`}  >
        <Sidebar isOpen={isOpen} onSidebarStateChange={handleSidebarStateChange} />
      </div>

      <div className={`main-content ${isOpen ? 'push-main-content' : ''}`}>
        <Navbar pagePath={t('sidebar.dashboard')} />

        <div className="first-section">
            <Badge />
        </div>

        <div className="second-section">
          <div className="orders-table">
            <OrderTable />
          </div>
          <div className="Most-Sales-Product">
            <ProductTypes/>
          </div>
        </div>
      {
        parsedUser?.role_id === 2 && parsedUser.role_name === 'admin' && (
          
          <div className="Sales-charts-section">
            <div className="TypeSales">
              <ApexDonutChartbytype/>
            </div>
            <div className="CategorySales"> 
              <ApexDonutChartbyCatigory/>
            </div>
          </div>
        )
      }
      </div>
    </div>
  );
};

export default Dashboard;