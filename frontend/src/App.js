import './App.css';
import Header from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import Shop from './Pages/Shop';
import ShopCatagory from './Pages/ShopCatagory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginPage from './Pages/LoginPage';
import Footer from './Components/Footer/Footer';
import CheckoutForm from './Pages/CheckoutForm';

import { ShopContext } from './Context/ShopContext';
import Contact from './Pages/Contact.jsx';
import About from './Pages/About.jsx';
import './index.css';
import ProtectedRoute from './Components/ProtectedRoutes/ProtectedRoute.jsx';
import AdminPanel from './Pages/AdminPanel.jsx';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop.jsx';
import OfferMarquee from './Components/Marquee/Marquee.jsx';
import WhatsAppWidget from './Components/Whatsapp/Whatsapp.jsx';
import ProductBot from './Components/Chatbot/Chatbot.jsx';
import { initGA, trackPageView } from './analytics.js';

// const stripePromise = loadStripe('pk_test_51RLfz8Kn5UF7A7CjaOfKjFrD27yrWNU9z9PQsQVPnt1XGG5t0Eac16ecyXNkKE47jYZMl8xWP4PEeGVmMcAibmI800zJiXlct7');

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
};

function App() {
  return (
    <div>
     
        <BrowserRouter>
          
          <AnalyticsTracker />
          
          <OfferMarquee />
          <Header />
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Shop />} />
            <Route path='/About' element={<About />} />
            <Route path='/:categoryName' element={<ShopCatagory />} />
            <Route path='/Contact' element={<Contact />} />
            <Route path='/Product/:ProductId' element={<Product />} />
            <Route path='/Cart' element={<Cart />} />
            <Route path='/LoginPage' element={<LoginPage />} />
            <Route path='/CheckoutPage' element={<CheckoutForm />} />
            <Route 
              path='/admin' 
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ProductBot />
          <WhatsAppWidget />
          <Footer />
        </BrowserRouter>
      
    </div>
  );
}

export default App;