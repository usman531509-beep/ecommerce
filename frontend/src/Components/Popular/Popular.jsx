import React, { useContext } from 'react'
import './Popular.css'
import Item from '../Items/Item'
import { ShopContext } from '../../Context/ShopContext.jsx'

const Popular = () => {
  
  const { all_product } = useContext(ShopContext);
  const featuredItems = all_product ? all_product.filter((item) => item.isFeatured === true) : [];
  

  return (
    <div className='popular'>
      <h1>POPULAR ITEMS</h1>
      <hr />
      <div className="popular-item">
        {featuredItems.length > 0 ? (
          featuredItems.map((item, i) => {
            return (
              <Item 
                key={i} 
                id={item._id} 
                offers={item.offers}
                name={item.name} 
                image={item.images?.[0]?.url || item.image} 
                new_price={item.price} 
                old_price={item.old_price} 
                discountPercentage={item.currentOffer?.isActive ? item.currentOffer.discountPercentage : ''}
              />
            )
          })
        ) : (
          <p className="text-gray-500">No popular items available at the moment.</p>
        )}
      </div>
    </div>
  )
}

export default Popular