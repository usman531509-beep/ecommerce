import Review from "../models/Reviews.js";
import Product from "../models/Product.js";

// Create a new review
export const createReview = async (req, res) => {
        try {
    const { productId,name, email, rating, comment, } = req.body;
            console.log("Create Review Request Body:", req.body);
    // Check if product exists
    const product = await Product.findOne({ _id: productId });
    console.log("Product found for review:", product);
    
    if (!product) { 
      return res.status(404).json({ message: "Product not found" });
    }

    // Create and save the review
    const review = new Review({
      product: productId,
      name,
      email,
      rating,
      comment,
    });
    await review.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("Create Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a specific product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch reviews
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get All Reviews Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the owner of the review or an admin
    if (review.user.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: error.message });
  }
};      