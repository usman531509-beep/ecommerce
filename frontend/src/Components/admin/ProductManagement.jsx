import React, { useEffect, useState, useRef } from "react";
  import axios from "axios";
  
  // Custom Icon Imports (using Lucide icons as placeholders, assuming availability or using simple text)
  const BoldIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8V4m0 0a4 4 0 014 4h-4m0 0a4 4 0 00-4 4v0a4 4 0 004 4m0 0a4 4 0 004 4v0a4 4 0 00-4 4m0 0V8"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12h-3"></path></svg>;
  const ItalicIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20h4m-4 0h-4m4-16h4m0 0h-4m-2 16l-2-16m6 16l2-16"></path></svg>;
  const ListIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>;

  // --- Rich Text Editor Component ---
  const RichTextEditor = ({ value, onChange, placeholder }) => {
    const editorRef = useRef(null);

    // Sync state to the contentEditable div only when the value prop changes (e.g., on editProduct load)
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, [value]);

    // Handle input change and update the parent form state (HTML content)
    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    // Apply formatting commands
    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        // Ensure the change is reflected in the parent state immediately
        handleInput(); 
        editorRef.current.focus(); // Keep focus after command
    };
    
    // Prevent default form submission on button clicks inside the editor
    const handleButtonClick = (e, command) => {
        e.preventDefault();
        applyFormat(command);
    };

    return (
        <div className="col-span-full">
            <h3 className="font-semibold mb-2">Description Editor</h3>
            
            {/* Toolbar */}
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
                contentEditable={true}
                className="border p-4 rounded-b-lg min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                dangerouslySetInnerHTML={{ __html: value }}
                placeholder={placeholder}
            >
            </div>
        </div>
    );
  };
  // --- End of Rich Text Editor Component ---


  const ProductManagement = () => {
    const token = localStorage.getItem("auth-token");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
      name: "",
      description: "", // Now holds HTML/Rich Text content
      price: "",
      old_price: "",
      category: "",
      stock: "",
      isFeatured: false,
      isActive: true,
      variations: [],
      colors: [],
      sizes: [],
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
    const [message, setMessage] = useState(null); // For custom alerts/messages

    // Helper to display custom message
    const displayMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 5000);
    };

    //Fetch all products
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    //Fetch all categories
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    useEffect(() => {
      fetchProducts();
      fetchCategories();
    }, []);

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

    //Add Product Level Size
    const addSize = () => {
      if (!sizeInput.trim()) return;
      setForm((prev) => ({
        ...prev,
        sizes: [...prev.sizes, sizeInput.trim()],
      }));
      setSizeInput("");
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
      const files = Array.from(e.target.files || []);
      setImages((prev) => [...prev, ...files]);
    };

    // Submit form
    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const formData = new FormData();

        // append normal fields
        Object.entries(form).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Arrays (variations, colors, sizes) are sent as JSON strings
            formData.append(key, JSON.stringify(value));
          } else {
            // The description field (HTML string) is also appended here
            formData.append(key, value);
          }
        });

        // append image files
        images.forEach((file) => formData.append("images", file));

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        };

        if (editingProduct) {
          await axios.put(
            `http://localhost:4000/api/products/${editingProduct._id}`,
            formData,
            config
          );
          displayMessage("Product updated successfully!");
        } else {
          await axios.post("http://localhost:4000/api/products", formData, config);
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
          variations: [],
          colors: [],
          sizes: [],
        });

        setImages([]);
        setEditingProduct(null);
        fetchProducts();
      } catch (error) {
        console.error("Error saving product:", error);
        displayMessage("Failed to save product", "error");
      }
    };

    // Delete Product
    const deleteProduct = async (id) => {
      // Custom confirmation modal (replacing window.confirm)
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      
      try {
        await axios.delete(`http://localhost:4000/api/products/${id}`, {
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
        // Ensure description is an empty string if null/undefined for RTE
        description: product.description || "", 
        category: product.category?._id || product.category,
        colors: product.colors || [],
        sizes: product.sizes || [],
        variations: product.variations || [],
      });

      setImages([]);
    };

    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Custom Message/Alert Box */}
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
          {/* Top Inputs */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />

          <input
            name="old_price"
            type="number"
            value={form.old_price}
            onChange={handleChange}
            placeholder="Old Price (Optional)"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Checkboxes */}
          <div className="flex items-center space-x-6 p-2 border bg-gray-50 rounded col-span-1">
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
          </div>

          {/* DESCRIPTION RICH TEXT EDITOR (Replaced textarea) */}
          <RichTextEditor
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="Product details, features, specifications, etc. (Bold and Italic formatting supported)"
          />

          {/* Colors Input */}
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
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Sizes Input */}
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
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* FILE UPLOAD */}
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

            {(images.length > 0 || (editingProduct && editingProduct.images && editingProduct.images.length > 0)) && (
              <div className="mt-2 flex flex-wrap gap-2 p-2 bg-gray-50 rounded">
                <span className="font-medium text-sm text-gray-700 w-full mb-1">
                    {editingProduct ? 'Current/New Images:' : 'Selected New Images:'}
                </span>
                {/* Display existing images if editing */}
                {editingProduct && editingProduct.images && editingProduct.images.map((imgUrl, i) => (
                    <p
                        key={`existing-${i}`}
                        className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded"
                    >
                        Existing Image {i + 1}
                    </p>
                ))}
                {/* Display newly selected images */}
                {images.map((file, i) => (
                  <p
                    key={`new-${i}`}
                    className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded"
                  >
                    New: {file.name}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Variations */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="col-span-full bg-[#ff4141] hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Product Table */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">All Products</h2>

        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-red-50/50 transition duration-150">
                  <td className="py-3 px-4 font-medium text-gray-800">{p.name}</td>
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
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    );
  };

  export default ProductManagement;