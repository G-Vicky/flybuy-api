const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  _id: mongoose.Schema.ObjectId,
  customerId: mongoose.Schema.ObjectId,
  products: [
    {
      productId: mongoose.Schema.ObjectId,
      productCount: Number,
    },
  ],
  year: Number,
  month: String,
  day: Number,
  totalCost: Number,
  createdAt: Number,
});

module.exports = mongoose.model("Tansaction", transactionSchema);
