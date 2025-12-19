import Product from "../models/Product.js";
import Offer from "../models/Offer.js"; 
import dotenv from 'dotenv';
dotenv.config();



const applyOfferToProduct = async (productData) => {
    
    
    if (!productData.currentOffer) {
        productData.discountPrice = null;
        return;
    }

    try {
        const offer = await Offer.findById(productData.currentOffer);

        if (!offer || !offer.isActive || new Date(offer.endDate) < new Date()) {
            
            productData.currentOffer = null;
            productData.discountPrice = null;
            return;
        }

       
        const originalPrice = parseFloat(productData.price || productData.price);
        const discount = offer.discountPercentage;
        
        if (originalPrice && discount) {
           
            const discountedAmount = originalPrice * (discount / 100);
            const calculatedPrice = originalPrice - discountedAmount;
            
            
            productData.discountPrice = parseFloat(calculatedPrice.toFixed(2));
            
        } else {
            productData.discountPrice = null;
        }

    } catch (error) {
        console.error("Error applying offer:", error);
        productData.currentOffer = null; 
        productData.discountPrice = null;
    }
};


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
      isNewArrival,
      currentOffer, 
    } = req.body;
    
    // 1. Parsing JSON fields
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

    // 2. Handle uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path, 
        alt: name,
      }));
    }

    if (!name || !price || !category || !description) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }
    
    
    const productData = {
        name,
        description,
        price,
        old_price,
        images,
        category,
        stock,
        colors: parsedColors,
        sizes: parsedSizes,
        currentOffer: currentOffer || null,
        variations: parsedVariations,
        isFeatured: isFeatured || false,
        isActive: isActive ?? true,
        isNewArrival: isNewArrival || false,
        discountPrice: null, // Initialize
    };
    
    
    await applyOfferToProduct(productData);
    
   
    const product = await Product.create(productData);
    
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
    const { populate } = req.query;
    
    let query = Product.find().sort({ createdAt: -1 });
    
    
   query = query.populate("currentOffer", "name discountPercentage endDate isActive");

    query = query.populate("category", "name");

    const products = await query.exec();

    res.status(200).json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
        .populate("category", "name")
        .populate("currentOffer", "name discountPercentage endDate isActive"); // 💡 Populate Offer here too

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
      isNewArrival,
      currentOffer, // 💡 ID received from frontend
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 1. Parse JSON fields
    const parsedVariations =
      variations && typeof variations === "string"
        ? JSON.parse(variations)
        : variations;

    const parsedColors =
      colors && typeof colors === "string" ? JSON.parse(colors) : colors;

    const parsedSizes =
      sizes && typeof sizes === "string" ? JSON.parse(sizes) : sizes;

    // 2. Handle uploaded images (Appending new images)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path, 
        alt: name || product.name,
      }));
      product.images = [...product.images, ...newImages];
    }

    // 3. Update fields (Apply changes from req.body)
    if (name) product.name = name;
    if (description) product.description = description;
    
    // Agar price change ho to update karein
    if (price) product.price = price;
    
    if (old_price) product.old_price = old_price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    if (parsedColors) product.colors = parsedColors;
    if (parsedSizes) product.sizes = parsedSizes;
    if (parsedVariations) product.variations = parsedVariations;

    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isActive !== undefined) product.isActive = isActive;
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;

   
    const isOfferChanged = (product.currentOffer?.toString() !== currentOffer) || (price && price !== product.price);

    if (isOfferChanged) {
        
        product.currentOffer = currentOffer || null;
        
       
        const tempProductData = {
            currentOffer: product.currentOffer,
            price: price || product.price, 
            discountPrice: product.discountPrice 
        };
        
        
        await applyOfferToProduct(tempProductData);
        
        // Update the actual product fields
        product.discountPrice = tempProductData.discountPrice;
    }
    
    // 5. Save the updated product
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

    await product.deleteOne();

    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: error.message });
  }
};