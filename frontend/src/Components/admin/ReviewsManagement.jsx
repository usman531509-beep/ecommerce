import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { ShopContext } from "../../Context/ShopContext.jsx";
const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { API_BASE_URL } = useContext(ShopContext);
  const token = localStorage.getItem("auth-token");
  
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching reviews:", error);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews(reviews.filter((r) => r._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading reviews...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Review Management</h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Name</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr
                key={review._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-4 font-medium text-gray-800">
                  {review.product?.name || "Unknown Product"}
                </td>

                <td className="p-4 text-gray-600">{review.name}</td>

                <td className="p-4 text-yellow-500 font-bold">
                  {"⭐".repeat(review.rating)}
                </td>

                <td className="p-4 text-gray-700">{review.comment}</td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteReview(review._id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    title="Delete Review"
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

export default AdminReviewManagement;
