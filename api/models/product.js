const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  productName: String,
  productPrice: Number,
  productDescription: String,
  inventoryQuantity: Number,
  createdAt: Number,
});

module.exports = mongoose.model("Product", productSchema);
