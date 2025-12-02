import React, { useContext, useState, useEffect } from "react";
import Logo from "../Assests/logo.jpg";
import atelier from "../Assests/atelier2.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faRightFromBracket,
  faHeart,
  faCartShopping,
  faUser,
  faBars,
  faXmark,
  faChevronDown,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import { motion } from "framer-motion";

const API_CATEGORIES_URL = "http://localhost:4000/api/categories"; 

function Header() {
  const { getTotalCartItem, all_product } = useContext(ShopContext);
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]); 
  const navigate = useNavigate();
  

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_CATEGORIES_URL);
        const data = await response.json();

        let fetchedCategories = [];

       
        if (Array.isArray(data)) {
            fetchedCategories = data;
        } 
       
        else if (data && Array.isArray(data.categories)) {
            fetchedCategories = data.categories;
        } 
       
        else if (data && typeof data === 'object') {
           
             console.warn("API returned object, checking structure...");
            
             if (data.length > 0 && data[0].name) {
                 fetchedCategories = data;
             }
        }

        if (fetchedCategories.length > 0) {
            setCategories(fetchedCategories);
        } else {
             console.log("No categories fetched or data is empty/misformatted. Check API response.");
             
        }

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []); 
  
  // ... (Rest of the component's existing logic for scroll, user role, logout, AdminDropdown etc.)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 useEffect(() => {
  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      const parsedUser = JSON.parse(userString);
      setUserRole(parsedUser.role || "user");
    } catch (err) {
      console.error("Invalid user JSON in localStorage:", err);
      setUserRole("guest");
    }
  } else {
    setUserRole("guest");
  }
}, []);


  if (userRole === "admin" && window.location.pathname.startsWith("/admin")) {
    return null; 
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace("/");
  };


  const filteredProducts = all_product.filter((product) =>
    product.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  const AdminDropdown = ({ closeMenu }) => (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-1 hover:text-red-500 transition font-normal" 
      >
        <FontAwesomeIcon icon={faUser} />
        <FontAwesomeIcon icon={faChevronDown} className={`text-sm ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isDropdownOpen && (
        <div 
          className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-fadeIn"
          onMouseLeave={() => setIsDropdownOpen(false)} 
        >
          <Link 
            to="/admin" 
            onClick={() => { closeMenu(); setIsDropdownOpen(false); }}
            className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ff4141] transition duration-150 border-b border-gray-100 text-base font-normal" 
          >
            <FontAwesomeIcon icon={faGaugeHigh} className="w-4"/>
            Admin Panel
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-[#ff4141] transition duration-150 text-base font-normal" 
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4"/>
            Logout
          </button>
        </div>
      )}
    </div>
  );
  // ... (end of existing logic)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`font-sans w-full fixed top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-md"
          : "bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="flex items-center justify-between px-5 md:px-12 py-4">
        
        {/* --- Logo --- */}
        <div className="flex justify-start md:justify-start items-center w-auto md:w-56">
             <Link 
                to="/" 
                className="flex items-center gap-2 
                           absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0" 
             >
              <img 
                  src={atelier} 
                  alt="Atelier Logo" 
                  className="w-24 h-12 object-contain transition-all duration-300 md:w-40 md:h-20" 
              />
            </Link>
        </div>

        {/* --- MOBILE ACTION ICONS --- */}
        <div className="flex items-center md:hidden gap-5 text-2xl text-gray-700">
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="relative hover:text-red-500 transition transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow font-normal">
                {getTotalCartItem()}
              </span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:text-red-500 transition"
            >
              <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
            </button>
        </div>


        {/* Navigation Menu (Dropdown on Mobile, Links on Desktop) */}
        <nav
          className={`${
            menuOpen
              ? "flex flex-col items-center absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg shadow-2xl py-6 gap-5 rounded-b-3xl transition-all duration-300"
              : "hidden"
          } md:flex md:flex-row md:gap-10 md:static md:shadow-none`}
        >
          {/* Static Links: SHOP (Home) */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="relative text-gray-700 hover:text-[#ff4141] text-lg font-normal tracking-wide transition-all duration-300 group"
          >
            <span className="inline-block transform transition-transform duration-300 group-hover:scale-105 group-hover:translate-y-[-2px]">
              Shop
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff4141] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          
          {/* --- Dynamic Category Links (FINAL CORRECTED MAPPING) --- */}
          {categories.map((item, i) => (
            <Link
              key={item._id || i} // Use MongoDB _id or index as key
              to={`/${item.name.toLowerCase()}`} // Use name as the URL path (slug equivalent)
              onClick={() => setMenuOpen(false)}
              className="relative text-gray-700 hover:text-[#ff4141] text-lg font-normal tracking-wide transition-all duration-300 group" 
            >
              <span className="inline-block transform transition-transform duration-300 group-hover:scale-105 group-hover:translate-y-[-2px]">
                {item.name}
              </span>
              {item.name === "Watches" && ( // Example conditional tag
                <sup className="absolute -top-2 -right-4 text-xs text-[#ff4141] font-medium"> 
                  New
                </sup>
              )}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff4141] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          {/* Static Links: ABOUT and CONTACT */}
          {["About", "Contact Us"].map((item, i) => (
              <Link
                key={i}
                to={item === "Contact Us" ? "/contact" : "/about"}
                onClick={() => setMenuOpen(false)}
                className="relative text-gray-700 hover:text-[#ff4141] text-lg font-normal tracking-wide transition-all duration-300 group"
              >
                <span className="inline-block transform transition-transform duration-300 group-hover:scale-105 group-hover:translate-y-[-2px]">
                  {item}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff4141] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}


          {/* Mobile Search and Actions (No change) */}
          <div className="flex md:hidden items-center bg-gray-100/80 px-4 py-2 rounded-full w-[85%] relative hover:shadow-md transition-all duration-300 mt-3">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 flex-1 text-gray-700 font-normal" 
            />
          </div>

          <div className="flex md:hidden items-center justify-center gap-10 text-2xl text-gray-700 mt-5">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
              <FontAwesomeIcon icon={faHeart} />
            </Link>
            
            {userRole === "admin" ? (
                <AdminDropdown closeMenu={() => setMenuOpen(false)} />
            ) : localStorage.getItem("auth-token") ? (
              <button
                onClick={handleLogout}
                className="hover:text-red-500 transition"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            ) : (
              <Link to="/loginPage" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}
          </div>
        </nav>

        {/* Desktop Search + Icons (No change) */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center bg-gray-100/80 px-4 py-2 rounded-full w-[260px] relative hover:shadow-md transition-all duration-300">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 flex-1 text-gray-700 font-normal" 
            />
            {searchVal && (
              <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setSearchVal("")}
                      className="block px-4 py-2 hover:bg-red-50 text-gray-700 text-sm transition-colors font-normal" 
                    >
                      {product.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm font-normal">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Action Icons */}
          <div className="flex items-center gap-6 text-2xl text-gray-700">
            <Link to="/" className="hover:text-red-500 transition">
              <FontAwesomeIcon icon={faHeart} />
            </Link>
            
            {userRole === "admin" ? (
                <AdminDropdown closeMenu={() => setMenuOpen(false)} />
            ) : localStorage.getItem("auth-token") ? (
              <button
                onClick={handleLogout}
                className="hover:text-red-500 transition"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            ) : (
              <Link to="/loginPage" className="hover:text-red-500 transition">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}

            <Link
              to="/cart"
              className="relative hover:text-red-500 transition transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow font-normal">
                {getTotalCartItem()}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;