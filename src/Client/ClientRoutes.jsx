import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import styles from './styles/clientindex.module.css'; // تأكد من المسار حسب مشروعك
import Loading from "../Helper/Loading/Loading"; // تأكد من المسار حسب مشروعك
import NotFoundPage from "../Helper/NotFound/NotFound";

const Home = lazy(() => import("./pages/home/Home"));
const Menu = lazy(() => import("./pages/Menu/Menu"));
const LoginAndSignUp = lazy(() => import("./pages/loginAndSignUp/loginAndSignUp"));
const Shopingcartpage = lazy(() => import("./pages/shopingcart/Shopingcartpage"));
const FilterByQatigory = lazy(() => import("./components/FilterByQatigory/FilterByQatigory"));
const SingleProPage = lazy(() => import("./pages/SingleProPage/SingleProPage"));
const FavoriteDishes = lazy(() => import("./components/FavoriteDishes/FavoriteDishes"));
const ClientAccount = lazy(() => import("./components/Account/ClientAccount"));
const OrderSuccess = lazy(() => import("./components/Ordersuccess/OrderSuccess"));
// const OrderDetails = lazy(() => import("./components/Orderdetails/Orderdetails")); // Unused
const AddReview = lazy(() => import("./components/Reviews/AddReview"));
const OrderHistory = lazy(() => import("./components/Order-history/OrderHistory"));
const Settings = lazy(() => import("./components/AccountSettings/AccountSetting"));
const ContactForm = lazy(() => import("./components/ContactUs/ContactUs"));
const AllReviews = lazy(() => import("./components/Reviews/all_reviews"));
function ClientRoutes() {
  
  return (
  
    <div className={styles.clientapp}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<LoginAndSignUp />} />
          <Route path="/shoupingCart" element={<Shopingcartpage />} />
          <Route path="/category/:category" element={<FilterByQatigory />} />
          <Route path="/product/:id" element={<SingleProPage />} />
          <Route path="/favorite" element={<FavoriteDishes />} />
          <Route path="/myaccount" element={<ClientAccount />} />
          <Route path="/orderSuccess" element={<OrderSuccess />} />
          {/* <Route path="/OrderDetails" element={<OrderDetails />} /> */}
          <Route path="/addreview" element={<AddReview />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/all-reviews" element={<AllReviews />} />
          <Route path="/contactUs" element={<ContactForm />} />
           <Route path="/*" element={<NotFoundPage />} />

        </Routes>
      </Suspense>
   </div>
    
   
  
  );
}

export default ClientRoutes;
