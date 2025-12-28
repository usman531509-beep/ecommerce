import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, X, ChevronLeft, ChevronRight, 
  LayoutDashboard, ShoppingBag, Tag, 
  Layers, MessageSquare, Contact, 
  ShoppingBasket, Box, Users, 
  Home, LogOut 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductManagement from "../Components/admin/ProductManagement.jsx";
import UsersTable from "../Components/admin/UsersTable.jsx";
import CategoryManagement from "../Components/admin/CategoryManagement.jsx";
import AdminOrders from "../Components/admin/AdminOrders.jsx";
import AdminReviewManagement from "../Components/admin/ReviewsManagement.jsx";
import AdminReports from "../Components/admin/Reports.jsx";
import AdminContactManagement from "../Components/admin/ContactManagement.jsx";
import OfferManagement from "../Components/admin/OfferManagement.jsx";
import StockPage from "../Components/admin/Stock.jsx";
import Atelier from "../Components/Assests/atelier-white-logo.png";
const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("reports");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false); // Reset mobile state on desktop
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = useMemo(() => [
    { id: "reports", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "products", label: "Products", icon: <ShoppingBag size={20} /> },
    { id: "offers", label: "Offers", icon: <Tag size={20} /> },
    { id: "categories", label: "Categories", icon: <Layers size={20} /> },
    { id: "reviews", label: "Reviews", icon: <MessageSquare size={20} /> },
    { id: "contacts", label: "Contacts", icon: <Contact size={20} /> },
    { id: "orders", label: "Orders", icon: <ShoppingBasket size={20} /> },
    { id: "stock", label: "Stock", icon: <Box size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
  ], []);

  const handleSectionChange = (id) => {
    setActiveSection(id);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/loginPage");
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden relative font-sans">
      
      {/* 1. MOBILE TOP BAR */}
      <header className="md:hidden bg-[#ff4141] text-white flex justify-between items-center px-5 h-16 shadow-md z-[100] shrink-0">
        <h1 className="text-xl font-bold tracking-tight">Atelier Admin</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 active:bg-white/20 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </header>

    
      {/* 2. SIDEBAR */}
<AnimatePresence mode="wait">
  {(isSidebarOpen || !isMobile) && (
    <motion.aside
      key="sidebar"
      initial={isMobile ? { x: "-100%" } : false}
      animate={{ x: 0, width: isMobile ? "280px" : (isCollapsed ? "80px" : "260px") }}
      exit={{ x: "-100%" }}
      transition={{ type: "tween", ease: "circOut", duration: 0.25 }}
      // 'h-full' aur 'overflow-y-auto' add kiya hai taake mobile par scroll ho sake
      className={`bg-[#ff4141] text-white flex flex-col shrink-0 z-[110] shadow-2xl fixed md:relative h-full top-0 left-0`}
    >
      {/* Collapse Toggle (Desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 bg-white text-[#ff4141] rounded-full p-1 shadow-xl border border-gray-100 z-[120] hover:scale-110 transition-transform"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      {/* Sidebar Branding */}
      <div className={`h-20 flex items-center px-6 border-b border-white/10 shrink-0 ${isCollapsed && !isMobile ? 'justify-center' : ''}`}>
      <img src={Atelier} alt="Atelier Logo" className="h-12 object-contain" />
        {/* <span className={`font-black text-xl tracking-tighter ${isCollapsed && !isMobile ? 'hidden' : 'block'}`}>ATELIER</span> */}
        {isCollapsed && !isMobile && <Box size={30} />}
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-1 scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSectionChange(item.id)}
            className={`w-full flex items-center rounded-xl transition-all duration-150 py-3.5 px-4 mb-1 group ${
              activeSection === item.id 
                ? "bg-white text-[#ff4141] shadow-lg font-bold" 
                : "hover:bg-white/10 text-white/90"
            } ${isCollapsed && !isMobile ? "justify-center px-0" : ""}`}
          >
            <div className={`${activeSection === item.id ? "scale-110" : ""} shrink-0`}>
              {item.icon}
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="ml-4 text-sm font-semibold whitespace-nowrap">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions - Fixed at Bottom */}
      <div className="p-4 bg-black/10 border-t border-white/10 space-y-2 shrink-0 pb-10 md:pb-20">
        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center p-3 rounded-xl hover:bg-white/10 transition-colors ${isCollapsed && !isMobile ? "justify-center" : "gap-4"}`}
        >
          <Home size={20} className="shrink-0" />
          {(!isCollapsed || isMobile) && <span className="text-sm font-bold">Store Home</span>}
        </button>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center p-3 rounded-xl bg-red-800/50 hover:bg-red-900 transition-colors ${isCollapsed && !isMobile ? "justify-center" : "gap-4"}`}
        >
          <LogOut size={20} className="shrink-0" />
          {(!isCollapsed || isMobile) && <span className="text-sm font-bold">Logout</span>}
        </button>
      </div>
    </motion.aside>
  )}
</AnimatePresence>

      {/* 3. MOBILE OVERLAY (Backdrop) */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[105]"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 scroll-smooth">
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 md:p-10">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === "reports" && <AdminReports />}
            {activeSection === "products" && <ProductManagement />}
            {activeSection === "offers" && <OfferManagement />}
            {activeSection === "categories" && <CategoryManagement />}
            {activeSection === "reviews" && <AdminReviewManagement />}
            {activeSection === "contacts" && <AdminContactManagement />}
            {activeSection === "orders" && <AdminOrders />}
            {activeSection === "stock" && <StockPage />}
            {activeSection === "users" && <UsersTable />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;