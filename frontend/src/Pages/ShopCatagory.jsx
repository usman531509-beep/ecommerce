import React, { useContext, useState, useMemo } from "react";
import { useParams } from 'react-router-dom';
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Items/Item";
import { SlidersHorizontal, ArrowDownWideNarrow,} from "lucide-react"; 
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


  const getCalculatedPrice = (item) => {
    const originalPrice = item.price;
    const discount = item.currentOffer?.isActive ? item.currentOffer.discountPercentage : 0;
    
    if (discount > 0) {
      // Formula: Price - (Price * Discount / 100)
      return originalPrice - (originalPrice * discount / 100);
    }
    return originalPrice;
  }

  const filteredProducts = useMemo(() => {
    if (!all_product || all_product.length === 0) return [];
    
    const normalizedCurrentCategory = currentCategory.toLowerCase();
    
    let products = all_product.filter((item) => {
      if (item.isActive !== true) return false;
      
      if (!item.category) return false;
      const itemCategoryName = typeof item.category === "object"
          ? item.category.name?.toLowerCase()
          : item.category.toLowerCase();
          
      if (normalizedCurrentCategory !== 'shop' && itemCategoryName !== normalizedCurrentCategory) return false;

      // 💡 Filter using calculated Discounted Price
      const displayPrice = getCalculatedPrice(item);
      const minPrice = Number(priceRange.min);
      const maxPrice = Number(priceRange.max);
      
      if (minPrice > 0 && displayPrice < minPrice) return false;
      if (maxPrice > 0 && displayPrice > maxPrice) return false;
      
      if (inStockOnly && item.stock <= 0) return false;
      
      return true;
    });

    setVisibleProducts(8); 
    return products;
  }, [all_product, currentCategory, priceRange, inStockOnly]);

  const sortedProducts = useMemo(() => {
    let products = [...filteredProducts];
    products.sort((a, b) => {
        const priceA = getCalculatedPrice(a);
        const priceB = getCalculatedPrice(b);
        if (sortOrder === "lowToHigh") return priceA - priceB;
        if (sortOrder === "highToLow") return priceB - priceA;
        return 0; 
    });
    return products;
  }, [filteredProducts, sortOrder]);

  const loadMoreItems = () => setVisibleProducts((prev) => prev + 6);

  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-[#fde1ff] to-[#e1ffea22] items-center px-4 md:px-10 pt-20 pb-16 bg-white min-h-screen"> 
      
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl mb-10 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-gray-500 mb-2">The Essentials</p>
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 capitalize">
          {currentCategory} <span className="font-medium">Collection</span>
        </h1>
      </motion.div>

      {/* Controls Bar */}
      <motion.div className={`flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-10 py-4 px-6 rounded-lg ${LIGHT_BG} shadow-sm gap-4`}>
        <p className="text-gray-700 text-base font-medium">
          <span className="text-gray-900 font-semibold">{sortedProducts.length}</span> Results found.
        </p>
        <div className="flex gap-4">
          <button onClick={toggleFilter} className={`flex items-center gap-2 border rounded-lg px-4 py-2 transition-all text-sm bg-white ${isFilterOpen ? 'border-[#ff4141] text-[#ff4141]' : 'border-gray-300'}`}>
            <SlidersHorizontal size={18} /> <span>Filter</span>
          </button>
          <div className="relative flex items-center">
            <ArrowDownWideNarrow size={18} className="absolute left-3 text-[#ff4141]" />
            <select className="appearance-none border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm bg-white focus:outline-none" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
              <option value="">Sort by Relevance</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className={`w-full max-w-6xl p-6 mb-8 rounded-lg border border-gray-200 ${LIGHT_BG}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="col-span-2 flex gap-3">
                    <input type="number" name="min" placeholder="Min Price" value={priceRange.min} onChange={handlePriceChange} className="border p-2 rounded-lg w-full text-sm" />
                    <input type="number" name="max" placeholder="Max Price" value={priceRange.max} onChange={handlePriceChange} className="border p-2 rounded-lg w-full text-sm" />
                </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="inStockOnly" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="h-5 w-5" />
                    <label htmlFor="inStockOnly" className="text-sm font-medium">In Stock Only</label>
                </div>
                <button onClick={clearFilters} className="px-4 py-2 border border-gray-400 rounded-lg text-sm">Clear All</button>
            </div>
        </motion.div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full max-w-6xl">
        {sortedProducts.slice(0, visibleProducts).map((item, index) => {
            
            // 💡 Dynamic Calculation for UI
            const hasActiveOffer = item.currentOffer?.isActive && item.currentOffer?.discountPercentage > 0;
            const newPrice = getCalculatedPrice(item);
            const oldPrice = item.price; 
            
            return (
                <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <Item
                        id={item._id}
                        name={item.name}
                        image={item.images?.[0]?.url} 
                        new_price={newPrice}
                        old_price={hasActiveOffer ? oldPrice : null} // Sirf offer hone par purani price dikhayein
                        discountPercentage={item.currentOffer?.discountPercentage}
                    />
                </motion.div>
            );
        })}
      </div>

      {/* Pagination & No Results */}
      {visibleProducts < sortedProducts.length && (
        <button onClick={loadMoreItems} className={`mt-12 px-10 py-3 ${ACCENT_BG} text-white font-semibold rounded-full shadow-lg`}>
          Load More
        </button>
      )}
      {sortedProducts.length === 0 && (
        <p className="text-gray-500 mt-20 text-lg">No products found matching the criteria.</p>
      )}
    </div>
  );
};

export default ShopCategory;