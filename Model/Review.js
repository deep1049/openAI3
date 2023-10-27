const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: String,
  description: String,
  cDate: { type: Date, default: Date.now },
  uDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
