import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // useNavigate hook is necessary

import ProductManagement from "../Components/admin/ProductManagement.jsx";
import UsersTable from "../Components/admin/UsersTable.jsx";
import CategoryManagement from "../Components/admin/CategoryManagement.jsx";
import AdminOrders from "../Components/admin/AdminOrders.jsx";
import AdminReviewManagement from "../Components/admin/ReviewsManagement.jsx";
import AdminReports from "../Components/admin/Reports.jsx";
import AdminContactManagement from "../Components/admin/ContactManagement.jsx";

const AdminPanel = () => {
  const navigate = useNavigate(); 

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

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
    navigate("/loginPage"); 
  };

  // Assuming header height is roughly p-4 which is approx 4 units/1rem/16px
  // Let's use h-[56px] for the header height or Tailwind's h-14/h-16
  const mobileHeaderHeight = 'h-[56px]'; // Custom height for clarity

  return (
    // Parent container now has flex-row on desktop and takes up full screen height
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative md:h-screen"> 
      
      {/* 1. Mobile Header: sticky top-0 */}
      <header className={`md:hidden bg-[#ff4141] text-white flex justify-between items-center px-4 py-3 shadow-md sticky top-0 z-50 ${mobileHeaderHeight}`}>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* 2. Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || !isMobile) && (
          <motion.aside
            key="sidebar"
            initial={{ x: isMobile ? -250 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? -250 : 0 }}
            transition={{ type: "tween", duration: 0.3 }}
            // FIX: Mobile sidebar starts below the mobile header and takes remaining height.
            // Desktop sidebar is sticky/fixed on the left side and takes full viewport height.
            className={`md:relative md:translate-x-0 w-64 bg-[#ff4141] text-white flex flex-col shrink-0 ${
              isMobile
                ? `fixed top-[56px] left-0 h-[calc(100vh-56px)] z-[51] shadow-lg` // FIX: Starts below 56px header and uses calc() for remaining height
                : "h-screen sticky top-0" // FIX: Desktop sticky sidebar
            }`}
          >
            {/* Desktop Header */}
            <div className="hidden md:block p-6 text-2xl font-bold border-b border-white/30 shrink-0">
              Admin Dashboard
            </div>
            
            {/* Mobile Sidebar Header (Removed the duplicate header for mobile sidebar. The main fixed header handles this.) */}
            

            {/* Navigation Links (Scrollable Area) */}
            <nav className="flex flex-col mt-2 overflow-y-auto flex-1">
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
                onClick={() => handleSectionChange("contacts")}
                className={`text-left px-6 py-3 hover:bg-white/20 ${
                  activeSection === "contacts" && "bg-white/30"
                }`}
              >
                📖 Contacts Management
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

            {/* --- Bottom Action Buttons (Fixed at the bottom of the sidebar) --- */}
            <div className="p-4 border-t border-white/30 space-y-3 shrink-0"> 
               {/* Go to Home Page Button */}
              <button
                onClick={() => {
                    navigate("/");
                    if (isMobile) setIsSidebarOpen(false);
                }}
                className="w-full text-center py-2 bg-white/10 hover:bg-white/30 transition duration-200 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                🏠 Go to Home
              </button>
              
               {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-center py-2 bg-red-700 hover:bg-red-800 transition duration-200 rounded-md font-semibold flex items-center justify-center gap-2"
              >
                🚪 Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3.Dark Overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          // FIX: The dark overlay needs to cover the entire screen, including the fixed mobile header.
          className="fixed inset-0 bg-black bg-opacity-40 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className="flex-1 p-4 md:p-10 overflow-y-auto" // Added overflow-y-auto for content scrolling
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
          {activeSection === "contacts" && <AdminContactManagement />}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPanel;