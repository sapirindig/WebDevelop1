const Product = require("../Models/ProductModel");

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