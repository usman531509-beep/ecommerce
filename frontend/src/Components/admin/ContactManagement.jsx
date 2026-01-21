import React, { useEffect, useState, useContext } from "react";
import { Trash2, CheckSquare, Eye, X } from "lucide-react"; // Eye and X icons added
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";

const TOKEN = localStorage.getItem("auth-token");

const AdminContactManagement = () => {
  const { API_BASE_URL } = useContext(ShopContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal States ---
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      const sortedMessages = res.data.messages.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.date) - new Date(a.date);
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
      await axios.put(`${API_BASE_URL}/api/contact/${id}/status`, // Fixed path
        { status: newStatus },
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      setMessages(prev => prev.map(msg =>
        msg._id === id ? { ...msg, status: newStatus } : msg
      ));

      // Modal mein bhi status update ho jaye agar khula hai
      if (selectedMsg && selectedMsg._id === id) {
        setSelectedMsg(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      setMessages(messages.filter(msg => msg._id !== id));
      setIsModalOpen(false); // Modal band kar dein agar wahan se delete kiya
    } catch (error) {
      alert("Failed to delete message.");
    }
  };

  const handleOpenModal = (msg) => {
    setSelectedMsg(msg);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  useEffect(() => {
    if (TOKEN) fetchMessages();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-6 text-[#ff4141]">✉️ Contact Management</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
        <table className="min-w-full text-left">
          <thead className="bg-[#fdf4f4] text-gray-800 text-sm uppercase tracking-wider">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Name</th>
              <th className="p-4">Message</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className={`border-b hover:bg-gray-50 transition ${msg.status === 'Pending' ? 'bg-[#fffafa]' : ''}`}>
                <td className="p-4 text-sm text-gray-500">{formatDate(msg.date)}</td>
                <td className="p-4 font-semibold">{msg.name}</td>
                <td className="p-4 text-gray-600 max-w-[200px] truncate">{msg.message}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-full ${msg.status === 'Pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {msg.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  {/* VIEW BUTTON */}
                  <button onClick={() => handleOpenModal(msg)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" title="View Full Message">
                    <Eye size={18} />
                  </button>
                  {/* Action Buttons */}
                  {msg.status === 'Pending' && (
                    <button onClick={() => updateMessageStatus(msg._id, 'Reviewed')} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"><CheckSquare size={18} /></button>
                  )}
                  <button onClick={() => deleteMessage(msg._id)} className="p-2 bg-[#ff4141] text-white rounded-lg hover:bg-red-700 transition"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && selectedMsg && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-[#ff4141] p-4 text-white flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-lg">
                <Eye size={20} /> Message Details
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform duration-300">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b pb-4 text-sm">
                <div>
                  <p className="text-gray-400 font-medium">Sender Name</p>
                  <p className="font-bold text-gray-800">{selectedMsg.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Status</p>
                  <span className={`font-bold ${selectedMsg.status === 'Pending' ? 'text-red-500' : 'text-green-500'}`}>{selectedMsg.status}</span>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400 font-medium">Email Address</p>
                  <a href={`mailto:${selectedMsg.email}`} className="text-blue-600 hover:underline font-semibold">{selectedMsg.email}</a>
                </div>
              </div>

              <div>
                <p className="text-gray-400 font-medium mb-1">Full Message</p>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 leading-relaxed border border-gray-100 max-h-60 overflow-y-auto italic">
                  "{selectedMsg.message}"
                </div>
              </div>

              <div className="text-right text-[11px] text-gray-400 italic">
                Received on: {formatDate(selectedMsg.date)}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 flex justify-end gap-3 border-t">
              {selectedMsg.status === 'Pending' && (
                <button onClick={() => updateMessageStatus(selectedMsg._id, 'Reviewed')} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-green-600 transition shadow-md">
                  <CheckSquare size={16} /> Mark as Reviewed
                </button>
              )}
              <button onClick={() => deleteMessage(selectedMsg._id)} className="px-4 py-2 bg-[#ff4141] text-white rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-red-700 transition shadow-md">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactManagement;