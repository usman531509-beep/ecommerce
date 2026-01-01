import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from "../../Context/ShopContext.jsx";

// Helper function for status colors (matching AdminOrders for consistency)
const getStatusClasses = (status) => {
    switch (status) {
        case "Delivered": return "text-green-800 bg-green-100 border-green-300";
        case "Cancelled": return "text-red-800 bg-red-100 border-red-300";
        case "Processing": return "text-yellow-800 bg-yellow-100 border-yellow-300";
        case "Shipped": return "text-blue-800 bg-blue-100 border-blue-300";
        case "Returned": return "text-purple-800 bg-purple-100 border-purple-300"; // Added Returned
        case "Pending": return "text-gray-800 bg-gray-100 border-gray-300";
        default: return "text-gray-800 bg-gray-100 border-gray-300";
    }
};


const AdminReports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth-token");
  const { API_BASE_URL, all_product } = useContext(ShopContext);


  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const reportData = useMemo(() => {
 
    const totalOrderValue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    
    // 💡 FIX 1: Filter out 'Cancelled' AND 'Returned' orders for Revenue calculation
    const revenueGeneratingOrders = orders.filter(order => 
        (order.status === 'Delivered' || order.status === 'Shipped')
        // Ensure no cancelled or returned orders are counted in revenue
        && order.status !== 'Cancelled' 
        && order.status !== 'Returned' 
    );

   
    const totalRevenue = revenueGeneratingOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalSalesCount = revenueGeneratingOrders.length;
    let totalItemsSold = 0;

    
    const productSalesMap = {}; 

    // Calculate items sold/revenue ONLY from revenue-generating orders
    revenueGeneratingOrders.forEach(order => {
      order.orderItems.forEach(item => {
        totalItemsSold += item.qty;

        const productId = item.product?._id || item.product;
        const itemName = item.name || 'Unknown Product'; 
        const itemRevenue = item.qty * item.price;

        if (!productSalesMap[productId]) {
          productSalesMap[productId] = {
            name: itemName,
            totalRevenue: 0,
            totalQuantity: 0,
          };
        }

        productSalesMap[productId].totalRevenue += itemRevenue;
        productSalesMap[productId].totalQuantity += item.qty;
      });
    });

  
    const productSalesArray = Object.values(productSalesMap).sort((a, b) => b.totalQuantity - a.totalQuantity);
    
   
    const statusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'Other';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});


    return {
      totalOrderValue: totalOrderValue, 
      totalRevenue: totalRevenue, 
      totalSalesCount: totalSalesCount,
      totalItemsSold: totalItemsSold,
      productSalesArray: productSalesArray, 
      statusCounts: statusCounts, 
      
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="p-8 text-center text-xl text-red-600 min-h-screen bg-gray-50">
        <p>📊 Orders data loading.....</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-700 bg-red-100 border border-red-400 rounded-lg min-h-screen">
        <p className="font-semibold">{error}</p>
        <p className="text-sm mt-2">Please check the newtwork connection.</p>
      </div>
    );
  }

  const {
    totalOrderValue, // RAW REVENUE
    totalRevenue,
    totalSalesCount,
    totalItemsSold,
    productSalesArray,
    statusCounts,
  } = reportData;

  const currencyFormatter = (value) => `Rs ${value.toLocaleString('en-IN')}`;
  
  // Total Orders Count
  const totalOrdersCount = orders.length;
  
  const metrics = [
    { 
      title: "Total Orders Placed",
      value: totalOrdersCount.toLocaleString(),
      description: "All orders count.",
      color: "border-blue-500",
      textColor: "text-blue-600"
    },
    { 
      title: "Total Value of Orders Received",
      value: currencyFormatter(totalOrderValue),
      description: "All orders raw value.",
      color: "border-purple-500",
      textColor: "text-purple-600"
    },
    { 
      title: "Net Revenue (Delivered/Shipped)",
      value: currencyFormatter(totalRevenue),
      description: "Delivered/Shipped orders final revenue.", // Updated description
      color: "border-red-500",
      textColor: "text-red-600"
    },
    { 
      title: "Total Items Sold",
      value: totalItemsSold.toLocaleString(),
      description: "Products sold", // Updated description
      color: "border-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Total Products",
      value: all_product.length.toLocaleString(),
      description: "Total products available in the store.",
      color: "border-yellow-500",
      textColor: "text-yellow-600"
    }
  ];


  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-2">
        📈 Admin Sales Reporting Dashboard
      </h2>

      {/* 1. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={`bg-white p-6 rounded-xl shadow-lg border-b-4 ${metric.color} hover:shadow-xl transition duration-300`}
            >
              <p className="text-sm font-medium text-gray-500">{metric.title}</p>
              <p className={`text-3xl font-bold ${metric.textColor} mt-1`}>{metric.value}</p>
              <span className="text-xs text-gray-500">{metric.description}</span>
            </div>
        ))}
      </div>

      {/* 2. Order Status Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Order Status Breakdown (Counts)</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            {Object.entries(statusCounts).map(([status, count]) => (
                // 💡 FIX 2: Added dynamic styling for status cards
                <div 
                    key={status} 
                    className={`p-3 rounded-lg border ${getStatusClasses(status)}`}
                >
                    <p className="text-xs font-medium">{status}</p>
                    <p className="text-xl font-bold">{count}</p>
                </div>
            ))}
            {Object.keys(statusCounts).length === 0 && (
                <p className="text-gray-500">No status breakdown available.</p>
            )}
          </div>
      </div>


      {/* 3. Detailed Product Sales Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Detailed Product Sales Report (Top Selling)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead className="bg-red-500 text-white sticky top-0">
              <tr>
                <th className="py-3 px-4 rounded-tl-lg">S. No.</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4 text-right">Total Quantity Sold</th>
                <th className="py-3 px-4 rounded-tr-lg text-right">Total Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {productSalesArray.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No product sales data available.
                  </td>
                </tr>
              ) : (
                productSalesArray.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{product.name}</td>
                    <td className="py-3 px-4 text-right text-blue-600 font-semibold">
                      {product.totalQuantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-red-600 font-bold">
                      {currencyFormatter(product.totalRevenue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;