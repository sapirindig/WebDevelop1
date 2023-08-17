const StoreLocation = require("../Models/StoreLocationsModel");

exports.getLocations = async (req, res) => {
  try {
    const storeLocations = await StoreLocation.find();
    console.log(storeLocations);
    res.json(storeLocations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
