const Product = require("../Models/ProductModel");
const Order = require("../Models/OrderModel");

const mongoose = require("mongoose");

exports.getProductList = async (req, res) => {
  Product.find({})
    .then((products) => {
      res.json(products);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving products");
    });
};

exports.createProduct = async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        quantity,
        category,
        size,
        color,
        gender,
      } = req.body;
      const imageUrl = req.file.path; // Get the path of the uploaded file

      // Create a new product instance
      const product = new Product({
        title,
        description,
        price,
        category,
        size,
        color,
        imageUrl,
        gender,
        quantity,
      });

      // Save the product to the database
      await product.save();

      res.redirect("/admin"); // Redirect back to the admin page
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while adding the product");
    }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body)
    const {
      productIdToUpdate,
      title,
      description,
      price,
      category,
      size,
      color,
      gender,
      quantity,
      imageUrl
    } = req.body;

    const update = {};

    if (title) {
      update.title = title;
    }
    if (quantity) {
      update.quantity = quantity;
    }
    if (description) {
      update.description = description;
    }
    if (price) {
      update.price = price;
    }
    if (category) {
      update.category = category;
    }
    if (size) {
      update.size = size;
    }
    if (color) {
      update.color = color;
    }
    if (gender) {
      update.gender = gender;
    }
    if (imageUrl) {
      update.imageUrl = imageUrl;
    }

    const options = {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    };

    await Product.findByIdAndUpdate(productIdToUpdate, update, options);

    res.redirect("/admin");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating product");
  }
};

exports.deleteProduct = async (req, res) => {
    try {
      const { productIdToDelete } = req.body;

      // Convert productIdToDelete to a valid ObjectId
      const objectIdToDelete = new mongoose.Types.ObjectId(productIdToDelete);

      await Product.findOneAndDelete({ _id: objectIdToDelete });
      res.redirect("/admin");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting product");
    }
};

exports.getOrders = async (req, res) => {
  try {
    
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }};

exports.adminPage = async (req, res) => {
    res.render("Pages/Admin.ejs", { loggedIn: req.session.userId });
};
