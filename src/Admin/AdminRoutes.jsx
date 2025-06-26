// import './App.css'
import './AdminStyles/Adminindex.css'
 import 'preline';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Products from './Pages/Products/Products';
import Dashboard from './Dashboard/Dashboard';
import Employees from './Employees/ListEmployees/Employees';
import ListeOrders from './Orders/ListeOrders';
import ViewOrderDetails from './ViewOrderDetails/ViewOrderDetails';

import Categoreis from './Categories/Categoreis';
import ViewCategoryDetails from './Categories/ViewCategoryDetails';
import ListeOffers from './SpicialOffers/ListeOffers';

import AdminProfile from './AdminProfile/AdminProfile';
import Notification from './Notification/Notifiication'
import SalesCompenent from './Sales/SalesCompenent/SalesCompenent';
import Customers from './Customers/Customers';
import  Reviews  from './Reviews/Reviews';
import TypeCompenet from './Types/TypesCompenet/TypesCompenet';
// import Login from './Admin/Pages/Login/Login';
import {Route, Routes } from 'react-router-dom';
import NotFoundPage from '../Helper/NotFound/NotFound';
import OrderNotifier from './OrderNotifier/OrderNotifier';
function AdminRoutes() {
  

return (
    <div>
        <Routes>
          <Route path='/:role' element={<Dashboard/>} />
          <Route path='/:role/Products' element={<Products/>} />
          <Route path='/:role/Products/:Code' element={<Products/>} />
          <Route path='/:role/Employees' element={<Employees/>} />
          <Route path='/:role/ListeOrders' element={<ListeOrders/>} />
          <Route path='/:role/ViewOrderDetails/:id' element={<ViewOrderDetails/>} />
          <Route path='/:role/Reviews' element={<Reviews/>} />
          <Route path='/:role/Categories' element={<Categoreis/>} />
          <Route path='/:role/Types' element={<TypeCompenet/>} />
          <Route path='/:role/Notification' element={<Notification/>} />
          <Route path='/:role/ViewCategoryDetails/:nameCategory' element={<ViewCategoryDetails/>} />
          <Route path='/:role/ListeOffers' element={<ListeOffers/>} />
          <Route path='/:role/AdminProfile' element={<AdminProfile/>} />
          <Route path='/:role/SalesCompenent' element={<SalesCompenent/>} />
          <Route path='/:role/Customers' element={<Customers/>} />
          <Route path="/:role/*" element={<NotFoundPage/>} />
        </Routes>

              <OrderNotifier />

    </div>
  )
}

export default AdminRoutes
{/* <Route path='/Login' element={<Login/>} /> */}