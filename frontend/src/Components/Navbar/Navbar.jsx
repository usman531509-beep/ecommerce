import React, { useContext, useState, useEffect } from "react";
import Logo from "../Assests/logo.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faRightFromBracket,
  faHeart,
  faCartShopping,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

function Header() {
  const { getTotalCartItem, all_product } = useContext(ShopContext);
  const [searchVal, setSearchVal] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userRole, setUserRole] = useState("");
  

  // Handle scroll for sticky navbar style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      setUserRole(parsedUser.role || "user");
    } catch (err) {
      console.error("Invalid user object");
      setUserRole("user");
    }
  } else {
    setUserRole("guest");
  }
}, []);


  const filteredProducts = all_product.filter((product) =>
    product.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`w-full fixed top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/70 backdrop-blur-md shadow-md"
          : "bg-transparent backdrop-blur-0"
      }`}
    >
      <div className="flex items-center justify-between px-5 md:px-12 py-4">
        {/* Logo or placeholder */}
        <div className="flex items-center gap-2 w-56">
          {userRole === "admin" ? (
            <div className="w-14 h-14"></div> 
            
          ) : (
              <Link to="/" className="flex items-center gap-2">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                src={Logo}
                alt="logo"
                className="w-14 h-14 rounded-full shadow-md"
              />
              <span className="hidden sm:inline text-2xl font-bold text-gray-800 tracking-tight">
                <span className="text-red-500">Store</span>
              </span>
            </Link>
            
          )}
        </div>

        {/* Hamburger (Mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700 hover:text-red-500 transition"
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>

        {/* Navigation Menu */}
        <nav
          className={`${
            menuOpen
              ? "flex flex-col items-center absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg shadow-2xl py-6 gap-5 rounded-b-3xl transition-all duration-300"
              : "hidden"
          } md:flex md:flex-row md:gap-10 md:static md:shadow-none`}
        >
          {/* Nav Links */}
          {["Shop", "Rings", "Airpods", "Watches", "About", "Contact Us"].map(
            (item, i) => (
              <Link
                key={i}
                to={
                  item === "Shop"
                    ? "/"
                    : item === "Contact Us"
                    ? "/contact"
                    : item === "About"
                    ? "/about"
                    : `/${item.toLowerCase()}`
                }
                onClick={() => setMenuOpen(false)}
                className="relative text-gray-700 hover:text-[#ff4141] text-lg font-semibold 
                 font-[Cursive] tracking-wide transition-all duration-300 group"
              >
                <span className="inline-block transform transition-transform duration-300 group-hover:scale-105 group-hover:translate-y-[-2px]">
                  {item}
                </span>
                {item === "Watches" && (
                  <sup className="absolute -top-2 -right-4 text-xs text-[#ff4141] font-semibold">
                    New
                  </sup>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#ff4141] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )
          )}

          {/* Mobile Search */}
          <div className="flex md:hidden items-center bg-gray-100/80 px-4 py-2 rounded-full w-[85%] relative hover:shadow-md transition-all duration-300 mt-3">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 flex-1 text-gray-700"
            />
          </div>

          {/* Mobile Action Icons */}
          <div className="flex md:hidden items-center justify-center gap-10 text-2xl text-gray-700 mt-5">
            <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
              <FontAwesomeIcon icon={faHeart} />
            </Link>

            {localStorage.getItem("auth-token") ? (
              <button
                onClick={() => {
                  localStorage.removeItem("auth-token");
                  window.location.replace("/");
                }}
                className="hover:text-red-500 transition"
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            ) : (
              <Link to="/loginPage" onClick={() => setMenuOpen(false)} className="hover:text-red-500 transition">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}

            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="relative hover:text-red-500 transition transform hover:scale-110"
            >
              <FontAwesomeIcon icon={faCartShopping} />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                {getTotalCartItem()}
              </span>
            </Link>
          </div>
        </nav>

        {/* Desktop Search + Icons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center bg-gray-100/80 px-4 py-2 rounded-full w-[260px] relative hover:shadow-md transition-all duration-300">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="bg-transparent outline-none text-sm px-2 flex-1 text-gray-700"
            />
            {searchVal && (
              <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 overflow-hidden animate-fadeIn">
                {filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 5).map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setSearchVal("")}
                      className="block px-4 py-2 hover:bg-red-50 text-gray-700 text-sm transition-colors"
                    >
                      {product.name}
                    </Link>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Action Icons */}
          <div className="flex items-center gap-6 text-xl text-gray-700">
            <Link to="/" className="hover:text-red-500 transition">
              <FontAwesomeIcon icon={faHeart} />
            </Link>

            {localStorage.getItem("auth-token") ? (
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.replace("/");
                }}
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
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
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
