import mongoose from "mongoose";

// Variation Schema
const variationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sku: { type: String },
  },
  { _id: false }
);

// Image Schema
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    price: { type: Number, required: true },
    old_price: { type: Number },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    //PRODUCT LEVEL COLORS
    colors: {
      type: [String],
      default: [],
    },

    //PRODUCT LEVEL SIZES
    sizes: {
      type: [String],
      default: [],
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    variations: {
      type: [variationSchema],
      default: [],
    },

    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
