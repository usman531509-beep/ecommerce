import React from "react";
import new_collections from "../Assests/new_collections";
import Item from "../Items/Item";

const NewCollections = () => {
  return (
    <section id="new-collection" className="flex flex-col items-center gap-4 mt-10 px-4 sm:px-8 md:px-12">
     
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight text-center">
        NEW COLLECTIONS
      </h1>
      <hr className="w-32 sm:w-48 h-1.5 bg-gray-800 rounded-full border-none mt-1" />

    
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-16 place-items-center">
        {new_collections.map((item, i) => (
          <Item
            key={i}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </section>
  );
};

export default NewCollections;
