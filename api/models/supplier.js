const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  company: String,
  contactName: String,
  phone: Number,
  country: String,
  products: [
    {
      productName: String,
      productPrice: Number,
      productDescription: String,
    },
  ],
  createdAt: Number,
});

module.exports = mongoose.model("Supplier", supplierSchema);
