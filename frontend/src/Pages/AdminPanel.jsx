import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ProductManagement from "../Components/admin/ProductManagement.jsx";
import UsersTable from "../Components/admin/UsersTable.jsx";
import CategoryManagement from "../Components/admin/CategoryManagement.jsx";
import AdminOrders from "../Components/admin/AdminOrders.jsx";
import AdminReviewManagement from "../Components/admin/ReviewsManagement.jsx";
import AdminReports from "../Components/admin/Reports.jsx";

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("reports");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (isMobile) setIsSidebarOpen(false); // auto close on mobile
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      
      {/* 1. Mobile Header: z-50 rakhein. (This is already good) */}
      <header className="md:hidden bg-[#ff4141] text-white flex justify-between items-center px-4 py-3 shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* 2. Sidebar: Z-index ko header se zyada karein (e.g., z-51 ya z-50 se zyada koi bhi value). */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: isMobile ? -250 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? -250 : 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            // CHANGE: z-50/z-40 ko z-51 kar dein.
            className={`md:relative md:translate-x-0 ${
              isMobile
                ? "fixed top-0 left-0 h-full z-[51] shadow-lg" // <--- Z-INDEX CHANGE
                : "h-auto"
            } w-64 bg-[#ff4141] text-white flex flex-col`}
          >
            <div className="hidden md:block p-6 text-2xl font-bold border-b border-white/30">
              Admin Dashboard
            </div>

            <nav className="flex flex-col mt-6 overflow-y-auto">
              <button
                onClick={() => handleSectionChange("reports")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "reports" && "bg-white/30"
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => handleSectionChange("products")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "products" && "bg-white/30"
                }`}
              >
                🛍️ Product Management
              </button>
              <button
                onClick={() => handleSectionChange("categories")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "categories" && "bg-white/30"
                }`}
              >
                🧩 Category Management
              </button>
              <button
                onClick={() => handleSectionChange("reviews")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "reviews" && "bg-white/30"
                }`}
              >
                📖 Reviews Management
              </button>
              
              <button
                onClick={() => handleSectionChange("orders")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "orders" && "bg-white/30"
                }`}
              >
                📦 Orders
              </button>
              <button
                onClick={() => handleSectionChange("users")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "users" && "bg-white/30"
                }`}
              >
                👤 Users
              </button>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3.Dark Overlay: Z-index ko sidebar se kam (e.g., z-50) karein. */}
      {isMobile && isSidebarOpen && (
        <motion.div
          //CHANGE: z-30 ko z-50 kar dein.
          className="fixed inset-0 bg-black bg-opacity-40 z-50" // <--- Z-INDEX CHANGE
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 p-4 md:p-10 mt-16 md:mt-0 overflow-y-auto transition-all duration-300 ${
          !isMobile ? "" : ""
        }`}
      >
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeSection === "products" && <ProductManagement />}
          {activeSection === "categories" && <CategoryManagement />}
          {activeSection === "reviews" && <AdminReviewManagement />}
          {activeSection === "reports" && <AdminReports />}
          {activeSection === "orders" && <AdminOrders />}
          {activeSection === "users" && <UsersTable />}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPanel;