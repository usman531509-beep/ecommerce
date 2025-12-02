
import './App.css';
import Header from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import Shop from './Pages/Shop';
import ShopCatagory from './Pages/ShopCatagory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginPage from './Pages/LoginPage';
import Footer from './Components/Footer/Footer';
import headphone_banner from './Components/Assests/banner_headphone.png';
import watch_banner from './Components/Assests/banner_watch.png';
import airpod_banner from './Components/Assests/banner_airpod.png';
import CheckoutForm from './Pages/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ShopContext } from './Context/ShopContext';
import CheckoutPage from './Pages/CheckoutPage';
import Contact from './Pages/Contact.jsx';
import About from './Pages/About.jsx';
import './index.css';
import ScrollToHashElement from './Lib/ScrollToHashElement.jsx';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';

// import ScrollToTop from './Components/ScrollToTop/ScrollToTop.JSX';


const stripePromise = loadStripe('pk_test_51RLfz8Kn5UF7A7CjaOfKjFrD27yrWNU9z9PQsQVPnt1XGG5t0Eac16ecyXNkKE47jYZMl8xWP4PEeGVmMcAibmI800zJiXlct7');

function App() {
  const {getTotalCartAmount} = useContext(ShopContext);
  return (
    <div>
      <Elements stripe = {stripePromise} >
      <BrowserRouter>

      <Header/>
      {/* <ScrollToTop/> */}
      <Routes>
        
        <Route path='/' element={<Shop/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/:categoryName' element={<ShopCatagory/>}/>
        {/* <Route path='/rings' element={<ShopCatagory banner = {headphone_banner} category = "rings"/>}/>
        <Route path='/Airpods' element={<ShopCatagory banner = {airpod_banner} category = "Airpod"/>}/>
        <Route path='/Watches' element={<ShopCatagory banner = {watch_banner} category = "Watch"/>}/> */}
        <Route path='/Contact' element={<Contact/>}/>
        <Route path='/Product/:ProductId' element={<Product/>}>
          {/* <Route path=':ProductId' element={<Product/>}/> */}
        </Route>
        <Route path='/Cart' element={<Cart/>}></Route>
        <Route path='/LoginPage' element={<LoginPage/>}></Route>
        {/* <Route path='/create-payment-intent' element={<CheckoutForm amount={getTotalCartAmount()*100}/>}></Route> */}
        <Route path='/CheckoutPage' element={<CheckoutForm/>}></Route>
        <Route 
  path='/admin' 
  element={
    <ProtectedRoute>
      <AdminPanel/>
    </ProtectedRoute>
  }
/>
        
      </Routes>
      <Footer/>
      </BrowserRouter>
      </Elements>
      
    </div>
  );
}

export default App;
