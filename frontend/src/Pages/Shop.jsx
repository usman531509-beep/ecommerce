import React from 'react'
import Main from '../Components/Main/Main'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import NewsLetter from '../Components/Newsletter/NewsLetter'
import OrderProcess from '../Components/orderProcess/orderProcess'
import Testimonials from '../Components/Reviews/Testimonials'
import StatsSection from '../Components/StatsSection/StatsSection'
import OfferMarquee from '../Components/Marquee/Marquee'


const Shop = () => {
  return (
    <div>
      
      <Main/>
      <OfferMarquee />
      <Popular/>
      <StatsSection/>
      <Offers/>
      <OrderProcess/>
      <NewCollections/>
      <Testimonials/>
      <NewsLetter/>
    </div>
  )
}

export default Shop;
