const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: String,
  fullname: String,
  password: String,
  phone: String,
  adress: String,
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
});




module.exports = mongoose.model("User", UserSchema);
