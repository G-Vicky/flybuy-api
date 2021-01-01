const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    productName: String,
    productPrice: Number,
    productDescription: String,
    category: [{type: String}],
    Brand: String,
    inventoryQuantity: Number,
    dateCreated: Number
});

module.exports = mongoose.model("Product", productSchema);