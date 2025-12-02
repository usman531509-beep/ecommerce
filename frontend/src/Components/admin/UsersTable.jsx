import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ShopContext } from "../../Context/ShopContext.jsx";
const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { API_BASE_URL } = useContext(ShopContext);
  const token = localStorage.getItem("auth-token");

  
  const fetchUsers = async () => {
    try {
      setLoading(true);
     
      if (!token) {
        throw new Error("Authentication token not found.");
      }
      
      const res = await axios.get(`${API_BASE_URL}/api/auth/allusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);
     
      setError(err.response?.data?.message || "Failed to fetch users. Check console for details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 min-h-[200px] text-gray-600 text-lg">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 text-center py-5 px-4 rounded-lg font-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Responsive padding: p-4 on mobile, p-6 on desktop
      className="bg-white rounded-xl shadow-2xl p-4 sm:p-6"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-5 text-gray-800 text-center">
        👥 Registered Users
      </h2>

      {users.length > 0 ? (
     
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm sm:text-base">
            <thead className="bg-red-500 text-white">
              <tr className="text-left">
                <th className="p-3 rounded-tl-xl whitespace-nowrap">Name</th>
                <th className="p-3 whitespace-nowrap">Email</th>
                <th className="p-3 whitespace-nowrap">Role</th>
               
                <th className="p-3 hidden sm:table-cell rounded-tr-xl whitespace-nowrap">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <motion.tr
                  key={user._id}
                  whileHover={{ backgroundColor: "#fef2f2" }} 
                  className="border-b last:border-none transition duration-150"
                >
                  <td className="p-3 font-medium text-gray-800 whitespace-nowrap">{user.name}</td>
                  <td className="p-3 text-gray-600 whitespace-nowrap">{user.email}</td>
                  <td className="p-3 capitalize whitespace-nowrap">
                    {user.role === "admin" ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Admin
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                        User
                      </span>
                    )}
                  </td>
                 
                  <td className="p-3 text-gray-500 hidden sm:table-cell whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-5 italic">No registered users found.</p>
      )}
    </motion.div>
  );
};

export default UsersTable;