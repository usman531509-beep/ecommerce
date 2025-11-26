import React, { useContext, useState, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Items/Item";
import SalesBanner from "../Components/SalesBanner/SalesBanner";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [visibleProducts, setVisibleProducts  ] = useState(8);
  const [sortOrder, setSortOrder] = useState("");

  //Filter products based on category name or ID
  const filteredProducts = useMemo(() => {
    if (!all_product || all_product.length === 0) return [];

    return all_product.filter((item) => {
      if (!item.category) return false;

      const categoryName =
        typeof item.category === "object"
          ? item.category.name?.toLowerCase()
          : item.category.toLowerCase();

      return categoryName === props.category?.toLowerCase();
    });
  }, [all_product, props.category]);

  //ort products by price
  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];
    if (sortOrder === "lowToHigh") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      products.sort((a, b) => b.price - a.price);
    }
    return products;
  }, [filteredProducts, sortOrder]);

  //Load more items
  const loadMoreItems = () => setVisibleProducts((prev) => prev + 6);

  return (
    <div className="w-full flex flex-col items-center px-4 md:px-10 py-20 bg-gradient-to-b from-white to-pink-50 min-h-screen">
      <SalesBanner />
      {/* Category Banner
      {props.banner && (
        <img
          className="w-full max-h-[400px] object-cover rounded-3xl shadow-lg mb-10"
          src={props.banner}
          alt={`${props.category} banner`}
        />
      )} */}

      {/*Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-6 gap-4">
        <p className="text-gray-700 text-lg font-medium text-center sm:text-left">
          Showing{" "}
          <span className="font-semibold text-red-500">
            {Math.min(visibleProducts, sortedProducts.length)}
          </span>{" "}
          of {sortedProducts.length} products
        </p>

        <select
          className="border border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white transition-all"
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/*Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 w-full max-w-6xl">
        {sortedProducts.slice(0, visibleProducts).map((item) => (
          <Item
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            image={item.images?.[0]?.url} // show first image
            new_price={item.price}
            old_price={item.old_price}
          />
        ))}
      </div>

      {/*Load More Button */}
      {visibleProducts < sortedProducts.length && (
        <button
          onClick={loadMoreItems}
          className="mt-10 px-8 py-3 bg-red-500 text-white font-medium rounded-full shadow-md hover:bg-red-600 transition-all duration-300"
        >
          Load More
        </button>
      )}

      {/*No Products */}
      {sortedProducts.length === 0 && (
        <p className="text-gray-500 mt-20 text-lg">No products found.</p>
      )}
    </div>
  );
};

export default ShopCategory;
