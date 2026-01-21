import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../../Context/ShopContext.jsx";
import { Search, RotateCcw, X } from "lucide-react";


const BoldIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4m0 0a4 4 0 014 4h-4m0 0a4 4 0 00-4 4v0a4 4 0 004 4m0 0a4 4 0 004 4v0a4 4 0 00-4 4m0 0V8"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h-3"></path></svg>;
const ItalicIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20h4m-4 0h-4m4-16h4m0 0h-4m-2 16l-2-16m6 16l2-16"></path></svg>;
const ListIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>;


const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isTyping) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, isTyping]);

  const handleInput = () => { };

  const handleBlur = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    setIsTyping(false);
  };

  const handleFocus = () => {
    setIsTyping(true);
  };


  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
    editorRef.current.focus();
  };


  const handleButtonClick = (e, command) => {
    e.preventDefault();
    applyFormat(command);
  };

  return (
    <div className="col-span-full">
      <h3 className="font-semibold mb-2">Description Editor</h3>


      <div className="flex space-x-2 p-2 bg-gray-100 border border-b-0 rounded-t-lg">
        <button
          type="button"
          title="Bold"
          onMouseDown={(e) => handleButtonClick(e, 'bold')}
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <BoldIcon />
        </button>
        <button
          type="button"
          title="Italic"
          onMouseDown={(e) => handleButtonClick(e, 'italic')}
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <ItalicIcon />
        </button>
        <button
          type="button"
          title="Unordered List"
          onMouseDown={(e) => handleButtonClick(e, 'insertUnorderedList')}
          className="p-1 rounded hover:bg-gray-200 transition"
        >
          <ListIcon />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        onInput={handleInput}
        onBlur={handleBlur}
        onFocus={handleFocus}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: value }}
        className="border p-4 rounded-b-lg min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        placeholder={placeholder}
      >
      </div>
    </div>
  );
};
// ... (End of RichTextEditor component code)



const ProductManagement = () => {
  const { API_BASE_URL } = useContext(ShopContext);
  const token = localStorage.getItem("auth-token");

  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // 💡 NEW STATE: To hold all active offers fetched from the backend
  const [offers, setOffers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    old_price: "",
    category: "",
    stock: "",
    isFeatured: false,
    isActive: true,
    isNewArrival: false,
    variations: [],
    colors: [],
    sizes: [],
    existingImages: [],
    // 💡 NEW FIELD: For storing the selected Offer ID
    currentOffer: "",
  });


  const [variation, setVariation] = useState({
    name: "",
    price: "",
    stock: "",
    size: "",
    color: "",
  });

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  const [images, setImages] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    searchQuery: "",
  });


  const displayMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };


  const fetchProducts = async () => {
    try {
      // 💡 UPDATE: products fetch karte waqt `currentOffer` ko populate karein
      const res = await axios.get(`${API_BASE_URL}/api/products?populate=currentOffer`);
      setOriginalProducts(res.data);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 💡 NEW FUNCTION: Fetch all active offers
  const fetchOffers = async () => {
    try {
      // Assuming your offers API returns all offers, we filter active ones client-side or backend-side
      const res = await axios.get(`${API_BASE_URL}/api/offers`);
      // Filter to show only currently Active offers in the dropdown
      const activeOffers = res.data.filter(o => o.isActive);
      setOffers(activeOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };


  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchOffers(); // Fetch offers when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- CLIENT-SIDE FILTERING LOGIC ---
  useEffect(() => {
    let filtered = originalProducts;

    // A. Category Filter
    if (filters.category) {
      filtered = filtered.filter(p =>
        (p.category?._id === filters.category) || (p.category === filters.category)
      );
    }

    // B. Search (Name) Filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query)
      );
    }

    setProducts(filtered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, originalProducts]);


  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handler for resetting filters
  const handleResetFilters = () => {
    setFilters({
      category: "",
      searchQuery: "",
    });
  };


  //Add Variation
  const addVariation = () => {
    if (!variation.name || !variation.price) {
      displayMessage("Please provide variation name and price.", "error");
      return;
    }
    setForm((prev) => ({
      ...prev,
      variations: [...prev.variations, variation],
    }));
    setVariation({ name: "", price: "", stock: "", size: "", color: "" });
  };

  //Add Product Level Color
  const addColor = () => {
    if (!colorInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, colorInput.trim()],
    }));
    setColorInput("");
  };

  // NEW: Remove Product Level Color
  const handleRemoveColor = (colorToRemove) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove),
    }));
  };

  //Add Product Level Size
  const addSize = () => {
    if (!sizeInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, sizeInput.trim()],
    }));
    setSizeInput("");
  };

  // NEW: Remove Product Level Size
  const handleRemoveSize = (sizeToRemove) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== sizeToRemove),
    }));
  };


  //Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle RTE change (updates description field)
  const handleDescriptionChange = (htmlContent) => {
    setForm(prev => ({
      ...prev,
      description: htmlContent
    }));
  };


  //Handle file input change
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...newFiles]);
    e.target.value = null;
  };

  // Remove a newly selected image (file)
  const handleRemoveNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();


      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === 'object') {
          // Variations, colors, sizes, existingImages, etc.
          formData.append(key, JSON.stringify(value));
        } else {
          // Other fields (including the new currentOffer ID)
          formData.append(key, value);
        }
      });


      images.forEach((file) => formData.append("images", file));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingProduct) {
        await axios.put(
          `${API_BASE_URL}/api/products/${editingProduct._id}`,
          formData,
          config
        );
        displayMessage("Product updated successfully! (Offer changes applied)");
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, formData, config);
        displayMessage("Product added successfully!");
      }

      // reset all
      setForm({
        name: "",
        description: "",
        price: "",
        old_price: "",
        category: "",
        stock: "",
        isFeatured: false,
        isActive: true,
        isNewArrival: false,
        variations: [],
        colors: [],
        sizes: [],
        existingImages: [],
        currentOffer: "", // Reset new field
      });

      setImages([]);
      setEditingProduct(null);
      fetchProducts(); // Refetch all products to update the list
    } catch (error) {
      console.error("Error saving product:", error);
      displayMessage("Failed to save product", "error");
    }
  };

  // Delete Product
  const deleteProduct = async (id) => {

    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      displayMessage("Product deleted!");
      fetchProducts();
    } catch (error) {
      console.error("Delete error:", error);
      displayMessage("Failed to delete product", "error");
    }
  };

  //Edit Product
  const editProduct = (product) => {
    setEditingProduct(product);

    setForm({
      ...product,
      description: product.description || "",
      category: product.category?._id || product.category,
      colors: product.colors || [],
      sizes: product.sizes || [],
      variations: product.variations || [],
      existingImages: product.images || [],
      isActive: product.isActive !== undefined ? product.isActive : true,
      isNewArrival: product.isNewArrival !== undefined ? product.isNewArrival : false,
      isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
      // 💡 NEW FIELD: Set currentOffer ID
      currentOffer: product.currentOffer?._id || "", // Agar populated hai to ID lo, warna empty
    });

    setImages([]);
  };

  // Helper to display offer details in the table
  const renderOfferCell = (product) => {
    const offer = product.currentOffer;

    if (!offer) {
      return <span className="text-gray-500">-</span>;
    }

    const isExpired = new Date(offer.endDate) < new Date();

    if (isExpired) {
      return <span className="text-orange-500 font-medium text-xs">Expired!</span>
    }

    return (
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
        {offer.discountPercentage}% OFF
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {message && (
        <div className={`p-3 mb-4 rounded-lg text-white font-semibold shadow-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md mb-10"
      >

        {/* Product Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Royal Gold Ring"
            className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all placeholder:text-gray-400"
            required
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none bg-white transition-all cursor-pointer"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">Current Price (Rs)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full border border-gray-300 p-2.5 pl-10 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Old Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-500 ml-1">Old Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
            <input
              name="old_price"
              type="number"
              value={form.old_price}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full border border-gray-200 p-2.5 pl-10 rounded-xl focus:ring-2 focus:ring-red-500/10 focus:border-gray-400 outline-none transition-all bg-gray-50/50"
            />
          </div>
        </div>

        {/* Offer Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-1">
            Active Offer
          </label>
          <select
            name="currentOffer"
            value={form.currentOffer}
            onChange={handleChange}
            className="w-full border-2 p-2.5 rounded-xl focus:ring-2 outline-none cursor-pointer font-medium text-gray-700"
          >
            <option value="">No Active Offer</option>
            {offers.map((offer) => (
              <option key={offer._id} value={offer._id}>
                {offer.name} — {offer.discountPercentage}% OFF
              </option>
            ))}
          </select>
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 ml-1">Stock Quantity</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="e.g. 50"
            className="w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-600 outline-none transition-all"
          />
        </div>



        {/* Checkboxes (Same as before) */}
        <div className="flex items-center space-x-6 p-2 border bg-gray-50 rounded col-span-2"> {/* Expanded to col-span-2 for better layout */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="font-medium text-gray-700">Featured:</span>
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="font-medium text-gray-700">Active:</span>
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="font-medium text-gray-700">New Arrival:</span>
            <input
              type="checkbox"
              name="isNewArrival"
              checked={form.isNewArrival}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>
        </div>

        <RichTextEditor
          value={form.description}
          onChange={handleDescriptionChange}
          placeholder="Product details, features, specifications, etc. (Bold and Italic formatting supported)"
        />

        {/* Colors Input (Same as before) */}
        <div className="col-span-full">
          <h3 className="font-semibold mb-1">Product Colors</h3>
          <div className="flex gap-2">
            <input
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              placeholder="Add color (e.g., Red, #FF0000)"
              className="border p-2 rounded flex-grow focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addColor}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {form.colors.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium cursor-pointer"
                onClick={() => handleRemoveColor(c)} // Handle removal on click
              >
                {c}
                <X className="w-3 h-3 ml-1 text-blue-800 hover:text-red-600 transition" />
              </span>
            ))}
          </div>
        </div>

        {/* Sizes Input (Same as before) */}
        <div className="col-span-full">
          <h3 className="font-semibold mb-1">Product Sizes</h3>
          <div className="flex gap-2">
            <input
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              placeholder="Add size (e.g., S, M, L, XL)"
              className="border p-2 rounded flex-grow focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addSize}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {form.sizes.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium cursor-pointer"
                onClick={() => handleRemoveSize(s)} // Handle removal on click
              >
                {s}
                <X className="w-3 h-3 ml-1 text-blue-800 hover:text-red-600 transition" />
              </span>
            ))}
          </div>
        </div>

        {/* FILE UPLOAD & IMAGE MANAGEMENT (Same as before) */}
        <div className="col-span-full">
          <label className="block mb-2 font-semibold text-gray-700">Upload Images:</label>

          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#ff4141] hover:file:bg-red-100"
          />

          {(form.existingImages.length > 0 || images.length > 0) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-bold text-gray-800 mb-4 block">
                Image Previews:
              </span>

              <div className="flex flex-wrap gap-4">
                {/* Existing Images Preview */}
                {form.existingImages.length > 0 && (
                  <div className="w-full">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">Saved Images:</h4>
                    <div className="flex flex-wrap gap-3">
                      {form.existingImages.map((img, i) => (
                        <div
                          key={img.url || i}
                          className="relative w-20 h-20 border border-green-400 rounded-lg overflow-hidden shadow-md"
                          title={`Saved Image ${i + 1}`}
                        >
                          <img
                            src={img.url}
                            alt={`Existing ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 bg-green-500 text-white text-[10px] px-1 rounded-tl">Saved</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview (Removable) */}
                {images.length > 0 && (
                  <div className="w-full mt-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 border-b pb-1">New Uploads (Click 'X' to remove):</h4>
                    <div className="flex flex-wrap gap-3">
                      {images.map((file, i) => (
                        <div
                          key={i}
                          className="relative w-20 h-20 border border-purple-400 rounded-lg overflow-hidden shadow-md group"
                          title={file.name}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(i)}
                            className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition"
                            title="Remove this new file"
                          >
                            <span className="font-bold">X</span>
                          </button>
                          <span className="absolute bottom-0 left-0 bg-purple-500 text-white text-[10px] px-1 rounded-tr">New</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Variations (Same as before) */}
        <div className="col-span-full border-t pt-4 mt-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Product Variations</h3>

          <div className="grid grid-cols-6 gap-2 mb-3 items-center">
            <input
              value={variation.name}
              onChange={(e) =>
                setVariation({ ...variation, name: e.target.value })
              }
              placeholder="Name"
              className="border p-2 rounded col-span-1 focus:ring-purple-500"
            />

            <input
              value={variation.size}
              onChange={(e) =>
                setVariation({ ...variation, size: e.target.value })
              }
              placeholder="Size"
              className="border p-2 rounded col-span-1 focus:ring-purple-500"
            />

            <input
              value={variation.color}
              onChange={(e) =>
                setVariation({ ...variation, color: e.target.value })
              }
              placeholder="Color"
              className="border p-2 rounded col-span-1 focus:ring-purple-500"
            />

            <input
              type="number"
              value={variation.price}
              onChange={(e) =>
                setVariation({ ...variation, price: e.target.value })
              }
              placeholder="Price"
              className="border p-2 rounded col-span-1 focus:ring-purple-500"
            />

            <input
              type="number"
              value={variation.stock}
              onChange={(e) =>
                setVariation({ ...variation, stock: e.target.value })
              }
              placeholder="Stock"
              className="border p-2 rounded col-span-1 focus:ring-purple-500"
            />

            <button
              type="button"
              onClick={addVariation}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition"
            >
              Add
            </button>
          </div>

          <ul className="list-disc ml-6 text-sm text-gray-700">
            {form.variations.map((v, i) => (
              <li key={i} className="mb-1 p-1 bg-purple-50/50 rounded">
                <span className="font-semibold">{v.name}</span> | Size: {v.size}, Color: {v.color} – Rs.<span className="font-bold text-purple-700">{v.price}</span> (Stock: {v.stock})
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button (Same as before) */}
        <button
          type="submit"
          className="col-span-full bg-[#ff4141] hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product Table */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">All Products</h2>

      {/* --- FILTERS UI --- */}
      <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Filter Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search by Name */}
          <div className="sm:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Product Name</label>
            <input
              type="text"
              name="searchQuery"
              placeholder="Search product name..."
              value={filters.searchQuery}
              onChange={handleFilterChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
          </div>

          {/* Reset Button */}
          <button
            onClick={handleResetFilters}
            className="sm:col-span-1 p-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
      {/* --- END FILTERS UI --- */}

      <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Sr. No</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Offer</th> {/* 💡 NEW COLUMN */}
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4">Active</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No products found matching the current filters.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-red-50/50 transition duration-150">
                  <td className="py-3 px-4">{products.indexOf(p) + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 px-4 text-center">{renderOfferCell(p)}</td> {/* 💡 NEW CELL */}
                  <td className="py-3 px-4 text-gray-600">{p.category?.name || "N/A"}</td>
                  <td className="py-3 px-4 font-semibold text-red-600">Rs {p.price}</td>
                  <td className="py-3 px-4 text-gray-800">{p.stock}</td>
                  <td className="py-3 px-4 text-center">{p.isFeatured ? "⭐" : "-"}</td>
                  <td className="py-3 px-4 text-center">{p.isActive ? "✅" : "❌"}</td>

                  <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => editProduct(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs transition shadow-sm"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr >
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default ProductManagement;