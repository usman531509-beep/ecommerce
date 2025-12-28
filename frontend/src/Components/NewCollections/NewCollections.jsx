import React, { useContext } from "react";
// static asset import ko hata diya kyunki hum context use kar rahe hain
import Item from "../Items/Item";
import { ShopContext } from "../../Context/ShopContext";

const NewCollections = () => {
  const { all_product } = useContext(ShopContext);

  const newArrival = all_product
    ? all_product.filter((item) => item.isNewArrival === true)
    : [];

  return (
    <section id="new-collection" className="flex flex-col items-center gap-4 mt-10 px-4 sm:px-8 md:px-12">
     
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight text-center">
        NEW COLLECTIONS
      </h1>
      <hr className="w-32 sm:w-48 h-1.5 bg-gray-800 rounded-full border-none mt-1" />

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-16 place-items-center">
        {newArrival.length > 0 ? (
          newArrival.map((item, i) => (
            <Item
              key={i}
              id={item._id} 
              name={item.name}
              image={item.images?.[0]?.url || item.image} 
              new_price={item.price} 
              old_price={item.old_price}
              discountPercentage={item.currentOffer?.isActive ? item.currentOffer.discountPercentage : ''}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full py-10">No new arrivals available.</p>
        )}
      </div>
    </section>
  );
};

export default NewCollections;