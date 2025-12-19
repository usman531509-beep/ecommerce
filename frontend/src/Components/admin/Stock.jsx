import React, { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

const StockPage = () => {
  const { all_product } = useContext(ShopContext);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Package className="text-blue-600" /> Inventory Management
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-700">Product</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Current Stock</th>
                <th className="p-4 font-semibold text-gray-700 text-center">Status</th>
                <th className="p-4 font-semibold text-gray-700 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {all_product.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img 
                      src={product.images?.[0]?.url || product.image} 
                      className="w-12 h-12 rounded object-cover border" 
                      alt={product.name} 
                    />
                    <span className="font-medium text-gray-800">{product.name}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-lg font-bold ${product.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {product.stock <= 0 ? (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1">
                        <AlertTriangle size={12} /> Out of Stock
                      </span>
                    ) : product.stock < 5 ? (
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> In Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right font-semibold text-gray-600">
                    Rs {product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockPage;