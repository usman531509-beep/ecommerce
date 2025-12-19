import Offer from "../models/Offer.js";
import mongoose from "mongoose"; // Mongoose ko import karein for ObjectId check

// Create a new offer
export const createOffer = async (req, res) => {
  try {
    // 💡 ENHANCEMENT 1: Add marqueeText
    const { name, discountPercentage, startDate, endDate, products, isActive, marqueeText } = req.body;

    if (!name || !discountPercentage || !startDate || !endDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const offer = new Offer({
      name,
      discountPercentage,
      startDate,
      endDate,
      products,
      isActive,
      marqueeText, // 💡 marqueeText field shamil kiya gaya
    });

    const createdOffer = await offer.save();
    res.status(201).json(createdOffer);
  } catch (error) {
    console.error("Create Offer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all offers
export const getAllOffers = async (req, res) => {
  try {
    // 💡 ENHANCEMENT 2: MarqueeText bhi select karein taake admin panel mein dikhe
    const offers = await Offer.find().select('+marqueeText').populate("products", "name price");
    res.status(200).json(offers);
  } catch (error) {
    console.error("Get Offers Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// get offer by ID
export const getOfferById = async (req, res) => {
  try {
    const offerId = req.params.id;
    
    // 💡 ENHANCEMENT 3: Invalid ObjectId check (for robustness against CastError)
    if (!mongoose.isValidObjectId(offerId)) {
      return res.status(400).json({ message: "Invalid Offer ID format." });
    }
    
    // MarqueeText bhi select karein
    const offer = await Offer.findById(offerId).select('+marqueeText').populate("products", "name price");

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(offer);
  } catch (error) {
    console.error("Get Offer By ID Error:", error);
    // 💡 Specific CastError handling (agar upar ka check miss ho jaye)
    if (error.kind === 'ObjectId') {
        return res.status(400).json({ message: "Invalid Offer ID format or structure." });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update an offer
export const updateOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    // 💡 ENHANCEMENT 4: Add marqueeText in destructuring
    const { name, discountPercentage, startDate, endDate, products, isActive, marqueeText } = req.body;

    // 💡 ENHANCEMENT 5: Use findByIdAndUpdate for efficiency
    // aur yeh ensure karein ki null/empty strings bhejkar data delete na ho
    const updateFields = {
        ...(name && { name }),
        ...(discountPercentage && { discountPercentage }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(products && { products }),
        // Checkboxes (isActive) ko explicitly include karein kyunki woh false bhi ho sakta hai
        ...(isActive !== undefined && { isActive }), 
        // 💡 marqueeText ko shamil karein (empty string bhi allow karein agar user use clear kare)
        ...(marqueeText !== undefined && { marqueeText }),
    };

    const updatedOffer = await Offer.findByIdAndUpdate(
        offerId,
        updateFields,
        { new: true, runValidators: true }
    );
    
    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(updatedOffer);
  } catch (error) {
    console.error("Update Offer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an offer
export const deleteOffer = async (req, res) => {
  try {
    const offerId = req.params.id;
    // findByIdAndDelete is more efficient than findById + deleteOne
    const deletedOffer = await Offer.findByIdAndDelete(offerId); 
    
    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Delete Offer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMarqueeOffers = async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Find offers that are active and not expired
    const activeOffers = await Offer.find({
      isActive: true,
      startDate: { $lte: currentDate }, // Offer shuru ho chuka ho
      endDate: { $gte: currentDate },   // Offer khatam na hua ho
    })
    // Sirf woh fields select karein jo Marquee mein chahiye
    .select('marqueeText discountPercentage name'); 

    res.status(200).json(activeOffers);
  } catch (error) {
    console.error("Get Marquee Offers Error:", error);
    res.status(500).json({ message: "Failed to fetch offers." });
  }
};