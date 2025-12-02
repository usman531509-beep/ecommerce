import React, { useEffect, useState , useContext} from "react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";
const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("auth-token");

  const { API_BASE_URL } = useContext(ShopContext);
  
  // NOTE: In a real app, this should handle if token is missing
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/api/categories/${editingCategory._id}`,
          { name, description },
          config
        );
      } else {
        await axios.post(
          `${API_BASE_URL}/api/categories`,
          { name, description },
          config
        );
      }
      setName("");
      setDescription("");
      setEditingCategory(null);
      fetchCategories();
      setError(""); // Clear error on success
    } catch (err) {
      // Use custom modal or message box instead of alert/window.confirm
      const errorMessage = err.response?.data?.message || "Failed to save category.";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Edit category
  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description);
  };

  // Delete category
  const handleDelete = async (id) => {
   
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to delete category.";
      console.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
  };

  return (
    
    <div className="p-4 sm:p-6 font-sans">
      <div className="max-w-full xl:max-w-[1400px] mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-6 text-center">
          <span className="text-red-500">🗂️</span> Category Manager
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        
        <form
          onSubmit={handleSubmit}
      
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none transition"
            required
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 outline-none transition"
          />

         
          <div className="col-span-full flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto sm:flex-1 md:flex-none md:w-40 bg-red-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-red-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : editingCategory ? "Update" : "Create"}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="w-full sm:w-auto sm:flex-1 md:flex-none md:w-40 bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-500 transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

      
        <div className="overflow-x-auto shadow-inner rounded-xl">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-red-500 text-white sticky top-0">
              <tr>
            
                <th className="py-3 px-4 text-left rounded-tl-xl w-1/4">Category Name</th>
            
                <th className="py-3 px-4 text-left hidden sm:table-cell w-1/3">Description</th>
                <th className="py-3 px-4 text-center rounded-tr-xl w-auto">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id}
                  className="hover:bg-red-50 transition-colors duration-200 group border-b border-gray-100"
                >
                  <td className="py-3 px-4 font-medium text-gray-800 group-hover:text-white">
                    {cat.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600 hidden sm:table-cell group-hover:text-red-100 truncate max-w-xs">
                    {cat.description || "—"}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                 
                    <button
                      onClick={() => handleEdit(cat)}
                      className="bg-yellow-500 text-white font-medium px-3 py-1 rounded-full text-xs sm:text-sm mr-2 hover:bg-yellow-600 transition transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="bg-red-600 text-white font-medium px-3 py-1 rounded-full text-xs sm:text-sm hover:bg-red-700 transition transform hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No categories found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;