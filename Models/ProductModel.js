const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: String,

  description: String,

  price: Number,

  quantity: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: ["T-shirts", "jeans", "Jackets", "Shoes"],
    required: true,
  },

  size: {
    type: String,
    enum: ["S", "M", "L"],
    required: true,
  },

  color: {
    type: String,
    enum: ["White", "Black", "Yellow", "Green", "Blue", "Pink"],
    required: true,
  },

  imageUrl: String,

  gender: {
    type: String,
    enum: ["Mens", "Womens"],
    required: true,
  },

  imageUrl: String,
});

module.exports = mongoose.model("Product", ProductSchema);
