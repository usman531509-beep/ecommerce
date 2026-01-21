import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { Trash2, Edit, Save, PlusCircle, RotateCcw } from "lucide-react";

const OfferManagement = () => {
  const { API_BASE_URL } = useContext(ShopContext);
  const token = localStorage.getItem("auth-token");
  const API_URL = `${API_BASE_URL}/api/offers`;

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // 💡 ENHANCEMENT 1: Add marqueeText to the form state
  const [form, setForm] = useState({
    name: "",
    discountPercentage: "",
    startDate: "",
    endDate: "",
    marqueeText: "", // New field for marquee content
    isActive: true,
  });

  const [editingOffer, setEditingOffer] = useState(null);


  // --- Helper Functions ---
  const displayMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  // Format date for input field (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // --- Data Fetching ---
  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setOffers(res.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      displayMessage("Failed to load offers.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      discountPercentage: "",
      startDate: "",
      endDate: "",
      marqueeText: "", // Reset marqueeText
      isActive: true,
    });
    setEditingOffer(null);
  };


  // --- CRUD Operations ---

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      discountPercentage: Number(form.discountPercentage),
      // If marqueeText is empty, let the backend default take over (if defined)
      marqueeText: form.marqueeText.trim() === "" ? undefined : form.marqueeText,
      products: [], // Still sending empty array for consistency
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingOffer) {
        // Update Offer
        await axios.put(`${API_URL}/${editingOffer._id}`, dataToSend, config);
        displayMessage("Offer updated successfully!");
      } else {
        // Create Offer
        await axios.post(API_URL, dataToSend, config);
        displayMessage("Offer created successfully!");
      }

      resetForm();
      fetchOffers(); // Refresh the list
    } catch (error) {
      console.error("Error saving offer:", error);
      displayMessage(`Failed to save offer: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  // Edit Offer Load
  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setForm({
      name: offer.name,
      discountPercentage: offer.discountPercentage,
      startDate: formatDate(offer.startDate),
      endDate: formatDate(offer.endDate),
      marqueeText: offer.marqueeText || "", // 💡 Set existing marqueeText
      isActive: offer.isActive,
    });
  };

  // Delete Offer
  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${API_URL}/${offerId}`, config);
      displayMessage("Offer deleted successfully!");
      fetchOffers();
      if (editingOffer && editingOffer._id === offerId) {
        resetForm();
      }
    } catch (error) {
      console.error("Delete Offer Error:", error);
      displayMessage("Failed to delete offer.", "error");
    }
  };

  // --- Render Functions ---

  const getStatusClass = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-red-100 text-red-800 border-red-300";
  };


  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* Message Area */}
      {message && (
        <div className={`p-3 mb-4 rounded-lg text-white font-semibold shadow-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        {editingOffer ? "Edit Offer Definition" : "Define New Offer"}
      </h1>

      {/* 1. Offer Definition Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md mb-10"
      >
        {/* Name and Discount */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Offer Name (e.g., Winter Clearance)"
          className="border p-2 rounded focus:ring-[#ff4141] focus:border-[#ff4141]"
          required
        />
        <input
          name="discountPercentage"
          type="number"
          value={form.discountPercentage}
          onChange={handleChange}
          placeholder="Discount % (e.g., 20)"
          min="1"
          max="100"
          className="border p-2 rounded focus:ring-[#ff4141] focus:border-[#ff4141]"
          required
        />

        {/* Dates */}
        <div className="flex space-x-2">
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            title="Start Date"
            className="border p-2 rounded w-full focus:ring-[#ff4141] focus:border-[#ff4141]"
            required
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            title="End Date"
            className="border p-2 rounded w-full focus:ring-[#ff4141] focus:border-[#ff4141]"
            required
          />
        </div>

        {/* 💡 ENHANCEMENT 2: Marquee Text Input */}
        <div className="md:col-span-2">
          <label htmlFor="marqueeText" className="block text-sm font-medium text-gray-700 mb-1">
            Marquee Text (Homepage Banner)
          </label>
          <textarea
            id="marqueeText"
            name="marqueeText"
            rows="2"
            placeholder="E.g., FLAT 20% OFF on all Summer Shirts! Limited time offer!"
            value={form.marqueeText}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#ff4141] focus:border-[#ff4141]"
          />
          <p className="mt-1 text-xs text-gray-500">
            (Optional) This message will scroll across the homepage banner.
          </p>
        </div>

        {/* Checkbox and Buttons */}
        <div className="flex items-center space-x-6 p-2 bg-gray-50 rounded col-span-1">
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="font-medium text-gray-700">Offer Active:</span>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
          </label>
        </div>

        <div className="flex space-x-2 col-span-2 mt-2">
          <button
            type="submit"
            className="flex-grow bg-[#ff4141] hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{editingOffer ? "Update Offer Definition" : "Create Offer Definition"}</span>
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* 2. Offers Table */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Existing Offers</h2>

      {loading ? (
        <p className="text-center py-8 text-red-600">Loading offers...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-red-600 text-white uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 text-center">Discount %</th>
                <th className="py-3 px-4 hidden sm:table-cell">Marquee Text</th> {/* 💡 Marquee Column */}
                <th className="py-3 px-4 hidden sm:table-cell">End Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {offers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No offers have been created yet.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer._id} className="border-t hover:bg-red-50/50 transition duration-150">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {offer.name}
                    </td>
                    <td className="py-3 px-4 text-center text-lg font-bold text-red-600">
                      {offer.discountPercentage}%
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-xs text-gray-600 truncate max-w-xs" title={offer.marqueeText}>
                      {/* 💡 Display Marquee Text */}
                      {offer.marqueeText || `(Default: ${offer.discountPercentage}% OFF)`}
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {formatDate(offer.endDate)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusClass(offer.isActive)}`}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEdit(offer)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded transition"
                        title="Edit Offer"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(offer._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr >
                ))
              )}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
};

export default OfferManagement;