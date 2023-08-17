const User = require("../Models/UserModel");
const Product = require("../Models/ProductModel");
const Order = require("../Models/OrderModel");

exports.getCartItems = async (req, res) => {
  try {
    const user = await getUserFromReq(req);

    if (!user) {
      return res.status(401).send("User not found");
    }

    res.json(user.cart);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching cart items" });
  }
};

exports.changeAmount = async (req, res) => {
  const user = await getUserFromReq(req);

  if (!user) {
    return res.status(401).send("User not found");
  }

  const { index, quantity } = req.params;
  user.cart[index].quantity = Number(quantity);
  await user.save();

  res.json({ message: "changed amount successfully" });
};
exports.removeFromCart = async (req, res) => {
  const user = await getUserFromReq(req);

  if (!user) {
    return res.status(401).send("User not found");
  }

  const { deleteIndex } = req.params;
  user.cart.splice(Number(deleteIndex), 1);
  await user.save();

  res.json({ message: "removed successfully" });
};
exports.addCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await getUserFromReq(req);

    if (!user) {
      return res.status(401).json({ message: "User must be logged in" });
    }

    // Find the product in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Add the product to the user's shopping cart
    user.cart.push({ product: product._id, quantity: 1 }); // Assuming quantity is always 1 for simplicity
    await user.save();

    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res
      .status(500)
      .send("An error occurred while adding the product to the cart");
  }
};

exports.getCartPage = async (req, res) => {
  const cartItems = (await getCartProducts(req)) || [];
  console.log({ cartItems });
  res.render("cart.ejs", {
    loggedIn: req.session.userId,
    cartItems,
  });
};

exports.PlaceOrder = async (req, res) => {
  try {
    const user = await getUserFromReq(req);
    const cartItems = await getCartProducts(req);

    const order = new Order({
      userId: user._id,
      products: cartItems,
    });

    // Save the order to the database
    await order.save();

    // Return a success response with the saved order data
    res.json(order);
  } catch (error) {
    // Return an error response if there was an issue saving the order
    res
      .status(500)
      .json({ error: "Failed to place the order.", message: error.message });
  }
};

exports.ClearCart = async (req, res) => {
  try {
    // Get the user's ID from the request body or session, depending on your setup
    const userId = req.session.userId; // Change this based on your implementation
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Clear the cart
    user.cart = [];

    // Save the updated user
    await user.save();

    return res.status(200).send("Cart cleared successfully");
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).send("Error clearing cart");
  }
};

async function getUserFromReq(req) {
  const userId = req.session.userId;
  const user = await User.findById(userId);
  return user;
}

async function getCartProducts(req) {
  const userId = req.session.userId;
  const user = await User.findById(userId).populate("cart.product");
  return user?.cart || [];
}
