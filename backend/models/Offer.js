import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // E.g., "Summer Sale"
  discountPercentage: { type: Number, required: true }, // E.g., 20
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  marqueeText: {
    type: String,
    required: false, // Optional rakhein agar default text use karna ho
    trim: true,
    default: function() {
      // Agar user koi text na de, toh default text use karein
      return `${this.discountPercentage}% OFF on selected products! Limited time offer!`;
    }
  },
  // Products jo is offer mein shamil hain
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;