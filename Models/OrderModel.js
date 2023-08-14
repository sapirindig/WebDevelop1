const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  products : [
    {
      product: Object,
      quantity: Number 
    }
  ]
});

module.exports = mongoose.model("Orders", OrdersSchema);
