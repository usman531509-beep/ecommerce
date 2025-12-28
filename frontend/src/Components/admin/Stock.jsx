import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { Search, RotateCcw, Package, AlertTriangle, CheckCircle } from "lucide-react";

const StockPage = () => {
  const { all_product } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ searchQuery: "", status: "" });

  useEffect(() => {
    let result = all_product || [];
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(query));
    }
    if (filters.status) {
      if (filters.status === "Out of Stock") result = result.filter((p) => (p.stock ?? 0) <= 0);
      else if (filters.status === "Low Stock") result = result.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 5);
      else if (filters.status === "In Stock") result = result.filter((p) => (p.stock ?? 0) >= 5);
    }
    setFilteredProducts(result);
  }, [filters, all_product]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => setFilters({ searchQuery: "", status: "" });

  const getStatusBadge = (stock) => {
    if (stock <= 0) return "bg-red-50 text-red-600 border-red-200";
    if (stock < 5) return "bg-amber-50 text-amber-600 border-amber-200";
    return "bg-emerald-50 text-emerald-600 border-emerald-200";
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Package className="text-red-600 w-8 h-8" />
            Inventory Management
          </h2>
          <p className="text-gray-500 mt-1">Manage and track your product stock levels efficiently.</p>
        </header>

        {/* Filters Section */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="md:col-span-6 relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search Product</label>
              <div className="relative">
                <input
                  type="text"
                  name="searchQuery"
                  placeholder="Search by name..."
                  value={filters.searchQuery}
                  onChange={handleFilterChange}
                  className="w-full p-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Level</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-medium text-gray-700"
              >
                <option value="">All Levels</option>
                <option value="In Stock">In Stock (5+)</option>
                <option value="Low Stock">Low Stock (1-4)</option>
                <option value="Out of Stock">Out of Stock (0)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                onClick={handleReset}
                className="w-full p-3 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 px-1 flex justify-between items-center text-sm font-medium">
          <span className="text-gray-500">
            Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> products
          </span>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-fixed">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="w-[40%] py-5 px-8 text-left text-xs font-bold uppercase tracking-widest">Product Details</th>
                  <th className="w-[20%] py-5 px-4 text-center text-xs font-bold uppercase tracking-widest">Stock Qty</th>
                  <th className="w-[20%] py-5 px-4 text-center text-xs font-bold uppercase tracking-widest">Status</th>
                  <th className="w-[20%] py-5 px-8 text-right text-xs font-bold uppercase tracking-widest">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400 italic bg-gray-50/30">
                      No products found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-red-50/40 transition-all duration-200 group">
                      <td className="py-5 px-8">
                        <div className="flex items-center gap-4">
                          <div className="relative h-14 w-14 flex-shrink-0">
                            <img
                              src={product.images?.[0]?.url || product.image || "https://placehold.co/100x100?text=No+Image"}
                              className="h-full w-full rounded-xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                              alt={product.name}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate text-base">{product.name || "Untitled Product"}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5 tracking-tighter">ID: {product._id?.slice(-12)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-4 text-center">
                        <span className={`text-lg font-black ${(product.stock ?? 0) < 5 ? "text-red-600" : "text-gray-800"}`}>
                          {product.stock ?? 0}
                        </span>
                      </td>

                      <td className="py-5 px-4">
                        <div className="flex justify-center">
                          <span className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-1.5 rounded-full border shadow-sm ${getStatusBadge(product.stock ?? 0)}`}>
                            {(product.stock ?? 0) <= 0 && <AlertTriangle className="w-3 h-3" />}
                            {(product.stock ?? 0) >= 5 && <CheckCircle className="w-3 h-3" />}
                            {(product.stock ?? 0) <= 0 ? "OUT OF STOCK" : (product.stock ?? 0) < 5 ? "LOW STOCK" : "IN STOCK"}
                          </span>
                        </div>
                      </td>

                      <td className="py-5 px-8 text-right">
                        <div className="flex flex-col items-end">
                           <span className="text-red-600 font-black text-base">
                             <span className="text-xs mr-1 font-normal text-gray-400 italic">Rs.</span>
                             {(product.price || 0).toLocaleString()}
                           </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPage;