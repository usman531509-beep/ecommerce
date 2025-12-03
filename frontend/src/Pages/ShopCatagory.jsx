import React, { useContext, useState, useMemo } from "react";
import { useParams } from 'react-router-dom';
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Items/Item";
import { SlidersHorizontal, ArrowDownWideNarrow, X } from "lucide-react"; 
import { motion } from "framer-motion";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [sortOrder, setSortOrder] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [inStockOnly, setInStockOnly] = useState(false);

  const { categoryName } = useParams();
  const currentCategory = categoryName || 'shop'; 

  const ACCENT_COLOR = "text-[#ff4141]";
  const ACCENT_BG = "bg-[#ff4141]";
  const LIGHT_BG = "bg-gray-50"; 
  
  const toggleFilter = () => setIsFilterOpen(prev => !prev);

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };
  
  const clearFilters = () => {
    setPriceRange({ min: "", max: "" });
    setInStockOnly(false);
    setVisibleProducts(8);
  };


  // Filter products based on active status, category, price range, and stock
  const filteredProducts = useMemo(() => {
    if (!all_product || all_product.length === 0) return [];
    
    const normalizedCurrentCategory = currentCategory.toLowerCase();
    
    let products = all_product.filter((item) => {
        
      if (item.isActive !== true) {
          return false;
      }
      
      // 1. Category Filter
      if (!item.category) return false;
      
      const itemCategoryName =
        typeof item.category === "object"
          ? item.category.name?.toLowerCase()
          : item.category.toLowerCase();
          
      // Special case: If the path is '/' (Shop page), show all active products
      if (normalizedCurrentCategory === 'shop' && itemCategoryName) return true; 

      // Match the item's category name with the URL category name
      if (itemCategoryName !== normalizedCurrentCategory) return false;

      // 2. Price Range Filter
      const minPrice = Number(priceRange.min);
      const maxPrice = Number(priceRange.max);
      
      if (minPrice > 0 && item.price < minPrice) return false;
      if (maxPrice > 0 && item.price > maxPrice) return false;
      
      // 3. Stock Filter
      if (inStockOnly) {
          const stockCount = item.stockCount || 1; 
          if (stockCount <= 0) return false;
      }
      
      return true;
    });

    setVisibleProducts(8); 
    
    return products;
  }, [all_product, currentCategory, priceRange, inStockOnly]);


  // Sort products by price (Existing logic)
  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];
    if (sortOrder === "lowToHigh") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      products.sort((a, b) => b.price - a.price);
    }
    return products;
  }, [filteredProducts, sortOrder]);

  // Load more items
  const loadMoreItems = () => setVisibleProducts((prev) => prev + 6);

  // --- Rendering ---
  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] items-center px-4 md:px-10 pt-32 pb-16 bg-white min-h-screen"> 
      
      {/* 🚀 Category Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mb-10 text-center"
      >
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">
            The Essentials
        </p>
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 capitalize">
          {currentCategory} <span className="font-medium">Collection</span>
        </h1>
      </motion.div>

      
      {/* --- Top Controls: Sorting and Filters (Clean Bar) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-10 py-4 px-6 rounded-lg ${LIGHT_BG} shadow-sm gap-4`}
      >
        
        {/* Showing Count */}
        <p className="text-gray-700 text-base font-medium text-center sm:text-left">
          <span className="text-gray-900 font-semibold">
            {sortedProducts.length}
          </span>{" "}
          Results found. Showing{" "}
          <span className={`font-bold ${ACCENT_COLOR}`}>
            {Math.min(visibleProducts, sortedProducts.length)}
          </span>{" "}
          items.
        </p>

        {/* Filter and Sort Group */}
        <div className="flex gap-4">
          
          {/* Filter Button */}
          <button
            onClick={toggleFilter}
            className={`flex items-center gap-2 border rounded-lg px-4 py-2 shadow-sm transition-all text-sm ${
                isFilterOpen ? `border-[#ff4141] text-[#ff4141] bg-white` : 'border-gray-300 text-gray-700 bg-white hover:border-gray-400'
            }`}
          >
            <SlidersHorizontal size={18} />
            <span className="font-medium">Filter</span>
          </button>

          {/* Sorting Dropdown */}
          <div className="relative flex items-center">
            <ArrowDownWideNarrow size={18} className={`absolute left-3 ${ACCENT_COLOR.replace('text-', 'text-')}`} />
            <select
              className={`appearance-none border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#ff4141] bg-white transition-all shadow-sm font-medium text-sm`}
              onChange={(e) => setSortOrder(e.target.value)}
              value={sortOrder}
            >
              <option value="">Sort by Relevance</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* --- Filter Panel (Existing) --- */}
      {isFilterOpen && (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-6xl p-6 mb-8 rounded-lg shadow-inner border border-gray-200 ${LIGHT_BG}`}
        >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <SlidersHorizontal size={20} className={ACCENT_COLOR.replace('text-', 'text-')} /> Active Filters
                </h3>
                <button 
                    onClick={toggleFilter}
                    className="text-gray-500 hover:text-gray-800 transition"
                >
                    <X size={20} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                {/* Price Range Filter */}
                <div className="col-span-2 flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-1">Price Min (Rs)</label>
                        <input
                            type="number"
                            name="min"
                            placeholder="Min Price"
                            value={priceRange.min}
                            onChange={handlePriceChange}
                            className="border border-gray-300 p-2 rounded-lg text-sm focus:border-[#ff4141] focus:ring-[#ff4141]"
                        />
                    </div>
                    <div className="flex flex-col flex-1">
                        <label className="text-sm font-medium text-gray-700 mb-1">Price Max (Rs)</label>
                        <input
                            type="number"
                            name="max"
                            placeholder="Max Price"
                            value={priceRange.max}
                            onChange={handlePriceChange}
                            className="border border-gray-300 p-2 rounded-lg text-sm focus:border-[#ff4141] focus:ring-[#ff4141]"
                        />
                    </div>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="inStockOnly"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className={`form-checkbox h-5 w-5 ${ACCENT_COLOR.replace('text-', 'text-')}`}
                    />
                    <label htmlFor="inStockOnly" className="text-sm font-medium text-gray-700">
                        In Stock Only
                    </label>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-end">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-white transition text-sm font-medium"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>
        </motion.div>
      )}


      {/* Product Grid (Existing) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-6xl">
        {sortedProducts.slice(0, visibleProducts).map((item, index) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
             <Item
                id={item._id}
                name={item.name}
                image={item.images?.[0]?.url} 
                new_price={item.price}
                old_price={item.old_price}
                isFastDelivery={true} 
             />
          </motion.div>
        ))}
      </div>

      {/* Load More Button (Existing) */}
      {visibleProducts < sortedProducts.length && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadMoreItems}
          className={`mt-12 px-10 py-3 ${ACCENT_BG} text-white font-semibold rounded-full shadow-lg shadow-red-300/50 hover:bg-[#e03a3a] transition-all duration-300`}
        >
          Load More Products ({sortedProducts.length - visibleProducts} left)
        </motion.button>
      )}

      {/* No Products (Existing) */}
      {sortedProducts.length === 0 && (
        <p className="text-gray-500 mt-20 text-lg">No products found matching the criteria.</p>
      )}
    </div>
  );
};

export default ShopCategory;