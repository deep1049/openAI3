const express = require("express");
const router = express.Router();
const Product = require("./models/Product");
const Review = require("./models/Review");

// Create a Product
router.post("/api/products", async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = new Product({ name, price });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create a product" });
  }
});

// Read All Products
router.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// Read Product by ID
router.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve the product" });
  }
});

// Update a Product
router.put("/api/products/:id", async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update the product" });
  }
});

// Delete a Product
router.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete the product" });
  }
});

// Create a Review for a Product
router.post("/api/products/:productId/reviews", async (req, res) => {
  try {
    const { userId, description } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const review = new Review({ userId, description });
    await review.save();
    product.reviews.push(review);
    await product.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create a review" });
  }
});

// Delete a Review
router.delete(
  "/api/products/:productId/reviews/:reviewId",
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const review = await Review.findByIdAndRemove(req.params.reviewId);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      // Remove the review reference from the product
      product.reviews = product.reviews.filter(
        (id) => id.toString() !== req.params.reviewId
      );
      await product.save();
      res.json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete the review" });
    }
  }
);

// Virtual Population of Reviews for a Product
router.get("/api/products/:productId/reviews", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "reviews"
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product.reviews);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to retrieve reviews for the product" });
  }
});

module.exports = router;
