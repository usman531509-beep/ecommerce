import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderSlip from "./Slip";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { useContext } from "react";
import { Search, RotateCcw } from "lucide-react";

const AdminOrders = () => {
  // Original data fetched from API
  const [originalOrders, setOriginalOrders] = useState([]);
  // Displayed data (which is filtered)
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slipOrder, setSlipOrder] = useState(null);
  const { API_BASE_URL } = useContext(ShopContext);
  const token = localStorage.getItem("auth-token");
  const API_URL = `${API_BASE_URL}/api/orders`;

  // STATE FOR FILTERS
  const [filters, setFilters] = useState({
    status: "",
    searchQuery: "", // For customer name/phone
    startDate: "",
    endDate: "",
  });

  // 💡 UPDATE 1: Add "Returned" to available statuses
  const availableStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];


  // --- 1. DATA FETCHING (Only once on load) ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      // NOTE: Ab hum filters ko API request mein nahi bhejenge.
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Original data store karein
      setOriginalOrders(res.data);
      // Displayed data ko bhi set karein
      setOrders(res.data);

    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- 2. FILTERING LOGIC (Runs whenever filters or original data changes) ---
  useEffect(() => {
    let filtered = originalOrders;

    // A. Status Filter
    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // B. Search (Name or Phone) Filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const name = order.customerInfo?.name?.toLowerCase() || '';
        const phone = order.customerInfo?.phone?.toLowerCase() || '';
        const orderId = order._id.toLowerCase() || ''; // ID se bhi search ho sakta hai

        return name.includes(query) || phone.includes(query) || orderId.includes(query);
      });
    }

    // C. Date Range Filter
    if (filters.startDate || filters.endDate) {
      const start = filters.startDate ? new Date(filters.startDate) : null;
      // End date ko agle din ki shuruat tak extend karein taaki poora din include ho
      let end = filters.endDate ? new Date(filters.endDate) : null;
      if (end) {
        end.setDate(end.getDate() + 1);
      }

      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        let pass = true;

        if (start && orderDate < start) {
          pass = false;
        }
        if (end && orderDate >= end) {
          pass = false;
        }
        return pass;
      });
    }

    setOrders(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, originalOrders]);


  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handler for resetting filters
  const handleResetFilters = () => {
    setFilters({
      status: "",
      searchQuery: "",
      startDate: "",
      endDate: "",
    });
  };


  const getStatusClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      // 💡 UPDATE 2: Added Returned Status Class
      case "Returned":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Pending":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };


  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!token) {
      alert("Authentication token missing.");
      return;
    }

    // Safety Confirmations for important transitions
    const confirmMsg = newStatus === 'Processing'
      ? "Mark as Processing? This will deduct items from current stock."
      : newStatus === 'Returned'
        ? "Mark as Returned? This will add items back to your stock."
        : `Are you sure you want to mark this order as ${newStatus}?`;

    if (['Processing', 'Returned', 'Cancelled'].includes(newStatus)) {
      if (!window.confirm(confirmMsg)) return;
    }

    try {
      // API call to update status
      const response = await axios.put(`${API_URL}/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local list
      fetchOrders();

      // Update selected order view in modal
      if (selectedOrder && selectedOrder._id === orderId) {
        // Backend se updated order mil raha ho toh wo set karein, warna local state update
        setSelectedOrder(response.data.order || { ...selectedOrder, status: newStatus });
      }

      alert(response.data.message || `Order status updated to ${newStatus}.`);
    } catch (error) {
      console.error("Error updating status:", error);

      // 💡 Stock error handling: Backend se ane wala specific message dikhayein
      const errorMessage = error.response?.data?.message || "Failed to update order status.";
      alert(`⚠️ ERROR: ${errorMessage}`);
    }
  };


  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">📦 All Orders</h2>

      {/* FILTERS UI */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Filter & Search Orders (Client-Side)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 bg-white"
            >
              <option value="">All Statuses</option>
              {/* 💡 UPDATE 3: Use the updated availableStatuses */}
              {availableStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Search by Customer */}
          <div className="lg:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search (Name/Phone/ID)</label>
            <input
              type="text"
              name="searchQuery"
              placeholder="Search Customer Name, Phone or ID..."
              value={filters.searchQuery}
              onChange={handleFilterChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
            />
            <Search className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
          </div>

          {/* Date Range Start */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Date Range End */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="col-span-1 lg:col-span-1 p-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
      {/* END FILTERS UI */}


      {loading && <p className="text-center text-red-600 font-semibold mt-8">Orders data load ho raha hai...</p>}


      {!loading && (
        <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-red-600 text-white">
              <tr>

                <th className="py-3 px-4 rounded-tl-xl text-xs sm:text-sm">S. No.</th>

                <th className="py-3 px-4 text-xs sm:text-sm">Customer</th>
                <th className="py-3 px-4 hidden md:table-cell text-xs sm:text-sm">Phone</th>
                <th className="py-3 px-4 text-xs sm:text-sm whitespace-nowrap">Total Price</th>
                <th className="py-3 px-4 hidden sm:table-cell text-xs sm:text-sm">Payment</th>
                <th className="py-3 px-4 text-xs sm:text-sm">Status</th>

                <th className="py-3 px-4 text-xs sm:text-sm whitespace-nowrap">Date</th>
                <th className="py-3 px-4 rounded-tr-xl text-center text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>

                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No orders found matching the current filters.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b last:border-b-0 hover:bg-red-50 transition"
                  >

                    <td className="py-3 px-4 text-gray-700 font-medium">{index + 1}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium whitespace-nowrap">
                      {order.customerInfo?.name}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-600 whitespace-nowrap">
                      {order.customerInfo?.phone}
                    </td>
                    <td className="py-3 px-4 text-red-600 font-bold whitespace-nowrap">
                      Rs {order.totalPrice}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-gray-600">
                      {order.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <span

                        className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-sm active:shadow-none"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}


      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl transition"
              onClick={() => setSelectedOrder(null)}
            >
              &times;
            </button>

            <h3 className="text-xl sm:text-2xl mb-4 text-gray-800 border-b pb-2">
              🧾 Order #{selectedOrder._id}
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
              <div className="p-3 border rounded-lg bg-gray-50">
                <p className="font-semibold text-gray-700 mb-1">Customer Info</p>
                <p><strong>Name:</strong> {selectedOrder.customerInfo?.name}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerInfo?.phone}</p>
                <p><strong>Email:</strong> {selectedOrder.customerInfo?.email || "N/A"}</p>
              </div>
              <div className="p-3 border rounded-lg bg-gray-50">
                <p className="font-semibold text-gray-700 mb-1">Order Summary</p>
                <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`font-semibold ${getStatusClasses(selectedOrder.status)} px-2 rounded-full border ml-1`}>
                    {selectedOrder.status}
                  </span>
                </p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> <span className="text-red-600 font-bold">Rs {selectedOrder.totalPrice}</span></p>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6 p-3 border rounded-lg">
              <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
              <p className="text-sm text-gray-600">
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.country}
              </p>
            </div>


            <div className="mb-6 p-3 border border-yellow-400 rounded-lg bg-yellow-50">
              <p className="font-semibold text-gray-700 mb-2">Update Status:</p>
              <select
                value={selectedOrder.status}
                // 💡 UPDATE 4: Use the updated availableStatuses in the dropdown
                onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value)}
                className="w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {availableStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>


            <h4 className="text-lg font-bold mb-3 border-b pb-1 text-gray-800">🛍️ Items Ordered:</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {selectedOrder.orderItems.map((item, index) => (
                <div key={index} className="py-2 flex items-center gap-3 border-b last:border-b-0">
                  <img
                    src={item.image || "https://placehold.co/64x64/f0f0f0/999?text=Item"}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border flex-shrink-0"

                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/f0f0f0/999?text=Item"; }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>


                    <p className="text-sm text-gray-500">
                      Qty: {item.qty} × Rs {item.price}
                    </p>
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.selectedColor && (
                          <span className="mr-2">Color: <span className="font-semibold text-gray-700">{item.selectedColor}</span></span>
                        )}
                        {item.selectedSize && (
                          <span>Size: <span className="font-semibold text-gray-700">{item.selectedSize}</span></span>
                        )}
                      </div>
                    )}


                    {item.variation && <span className="ml-2 italic text-xs">({item.variation})</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setSlipOrder(selectedOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition w-full mt-4"
              >
                Generate Order Slip
              </button>


              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition mt-2 w-full"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      {slipOrder && (
        <OrderSlip order={slipOrder} onClose={() => setSlipOrder(null)} />
      )}

    </div>

  );
};

export default AdminOrders;