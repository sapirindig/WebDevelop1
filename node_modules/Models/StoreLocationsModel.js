const mongoose = require("mongoose");

const StoreLocationSchema = new mongoose.Schema({
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

module.exports = mongoose.model("StoreLocation", StoreLocationSchema);
