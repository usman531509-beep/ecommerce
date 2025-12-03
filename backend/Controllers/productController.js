import Product from "../models/Product.js";

// Ensure ki aapka .env file load ho raha hai agar aap .env variables use karte hain
import dotenv from 'dotenv';
dotenv.config();

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      old_price,
      category,
      stock,
      variations,
      colors,
      sizes,
      isFeatured,
      isActive,
    } = req.body;

    const parsedVariations =
      variations && typeof variations === "string"
        ? JSON.parse(variations)
        : variations || [];

    const parsedColors =
      colors && typeof colors === "string"
        ? JSON.parse(colors)
        : colors || [];

    const parsedSizes =
      sizes && typeof sizes === "string"
        ? JSON.parse(sizes)
        : sizes || [];

    // Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        // 🛑 FIX: file.path contains the direct, permanent Cloudinary URL
        url: file.path, 
        alt: name,
      }));
    }

    if (!name || !price || !category || !description) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      old_price,
      images,
      category,
      stock,
      colors: parsedColors,
      sizes: parsedSizes,
      variations: parsedVariations,
      isFeatured: isFeatured || false,
      isActive: isActive ?? true,
    });

    res.status(201).json({
      message: "Product created successfully 👍",
      product,
    });

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      old_price,
      category,
      stock,
      variations,
      colors,
      sizes,
      isFeatured,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Parse JSON fields
    const parsedVariations =
      variations && typeof variations === "string"
        ? JSON.parse(variations)
        : variations;

    const parsedColors =
      colors && typeof colors === "string" ? JSON.parse(colors) : colors;

    const parsedSizes =
      sizes && typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        // 🛑 FIX: file.path contains the direct, permanent Cloudinary URL
        url: file.path, 
        alt: name || product.name,
      }));
      product.images = [...product.images, ...newImages];
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (old_price) product.old_price = old_price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    if (parsedColors) product.colors = parsedColors;
    if (parsedSizes) product.sizes = parsedSizes;

    if (parsedVariations) product.variations = parsedVariations;

    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully 🎉",
      updatedProduct,
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 💡 OPTIONAL: Agar aap Cloudinary se image delete karna chahte hain, 
    // toh yahan Cloudinary ka destroy method use karna hoga.

    await product.deleteOne();

    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};