const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  customerName: String,
  customerEmail: String,
  customerPhone: Number,
  city: String,
  state: String,
  country: String,
  pincode: Number,
  createdAt: Number,
});

module.exports = mongoose.model("Customer", customerSchema);
