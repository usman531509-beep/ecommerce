import React, { useEffect, useState, useContext } from "react";
import { Trash2, CheckSquare, Clock } from "lucide-react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";

  

// const API_BASE_URL = "http://localhost:4000/api/contact"; 


const TOKEN = localStorage.getItem("auth-token"); 

const AdminContactManagement = () => {
  const { API_BASE_URL } = useContext(ShopContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Utility Functions (No Change) ---

  const fetchMessages = async () => {
    try {
      // Assuming GET /api/contact fetches all messages (as per routes setup)
      const res = await axios.get(`${API_BASE_URL}/api/contact`, { 
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const sortedMessages = res.data.messages.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.date) - new Date(b.date);
      });

      setMessages(sortedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/${id}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      
      const updatedList = messages.map(msg => 
        msg._id === id ? { ...msg, status: newStatus } : msg
      ).sort((a, b) => {
          if (a.status === 'Pending' && b.status !== 'Pending') return -1;
          if (a.status !== 'Pending' && b.status === 'Pending') return 1;
          return new Date(b.date) - new Date(a.date);
      });
      setMessages(updatedList);
      
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update message status.");
    }
  };

  const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await axios.delete(`${API_BASE_URL}/api/contact/${id}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            });
            setMessages(messages.filter(msg => msg._id !== id));
        } catch (error) {
            console.error("Error deleting message:", error);
            alert("Failed to delete message.");
        }
    };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    if (TOKEN) {
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, []);

  // --- Loading & Empty State ---
  if (loading) return <p className="text-center mt-10 text-lg">Loading contact messages...</p>;
  if (messages.length === 0) return <p className="text-center mt-10 text-lg text-gray-500">No contact messages received yet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#ff4141]">✉️ Contact Message Management</h1> {/* Title color set to accent */}

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full text-left">
          <thead className="bg-[#fdf4f4] text-gray-800 text-sm uppercase tracking-wider border-b border-[#ff4141]/30">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Message</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg._id}
                // Highlight pending rows using a light version of the accent color
                className={`border-b transition ${msg.status === 'Pending' ? 'bg-[#fffafa] hover:bg-[#ffebeb]' : 'hover:bg-gray-50'}`}
              >
                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(msg.date)}
                </td>
                <td className="p-4 font-semibold text-gray-800 whitespace-nowrap">
                  {msg.name}
                </td>
                <td className="p-4 text-blue-600 hover:underline">
                  <a href={`mailto:${msg.email}`}>{msg.email}</a>
                </td>
                <td className="p-4 text-gray-700 max-w-xs truncate" title={msg.message}>
                  {msg.message}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    // Pending status uses the accent color for prominence
                    msg.status === 'Pending' ? 'bg-[#ff4141]/10 text-[#ff4141]' : 
                    // Reviewed status uses standard green for confirmation
                    msg.status === 'Reviewed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {msg.status}
                  </span>
                </td>

                <td className="p-4 flex gap-2 justify-center items-center">
                  {/* Mark as Reviewed Button */}
                  {msg.status === 'Pending' && (
                    <button
                        onClick={() => updateMessageStatus(msg._id, 'Reviewed')}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        title="Mark as Reviewed"
                    >
                        <CheckSquare size={18} />
                    </button>
                  )}
                  {/* Delete Button (Uses accent red) */}
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="p-2 bg-[#ff4141] text-white rounded-lg hover:bg-[#e03a3a] transition"
                    title="Delete Message"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContactManagement;