const Product = require("./Models/ProductModel");
const Orders = require("./Models/OrderModel");
const User = require("./Models/UserModel");
const axios = require("axios");

const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1/SKL", // MongoDB connection URI
  collection: "sessions", // Collection name to store sessions
});
// Catch and log any errors from the session store
store.on("error", function (error) {
  console.error("Session Store Error:", error);
});
app.use(
  session({
    secret: "your-secret-key",
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    resave: true,
    saveUninitialized: true,
    store: store,
  })
);

const http = require("http").Server(app);
const io = require("socket.io")(http);
io.on("connection", (socket) => {
  // Emit the current count of connected users to the newly connected user
  socket.emit("connectedUsersCount", io.engine.clientsCount);

  // Broadcast the updated count to all connected users
  io.emit("connectedUsersCount", io.engine.clientsCount);

  // Handle disconnect event
  socket.on("disconnect", () => {
    io.emit("connectedUsersCount", io.engine.clientsCount);
  });

  // Handle the request for the count of connected users
  socket.on("requestConnectedUsersCount", () => {
    socket.emit("connectedUsersCount", io.engine.clientsCount);
  });
});
const path = require("path");
const bodyParser = require("body-parser");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filename = file.fieldname + "-" + uniqueSuffix + fileExtension;
    cb(null, filename);
  },
});
const fileFilter = function (req, file, cb) {
  // Check if the file format is jpg or png
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG and PNG file formats are allowed"), false); // Reject the file
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  "/public/images",
  express.static(path.join(__dirname, "public", "images"))
);
app.use(express.json());

app.get("/", async function (req, res) {
  const weatherData = await getWeatherFromWeatherbit("Tel Aviv");
  const mensClothing = (await Product.find({ gender: "Mens" })).splice(0, 4);
  const womensClothing = (await Product.find({ gender: "Womens" })).splice(
    0,
    4
  );
  res.render("index.ejs", {
    loggedIn: req.session.userId,
    mensClothing,
    womensClothing,
    weather: weatherData,
  });
});

app.get("/products", async function (req, res) {
  const {
    WhiteCount,
    BlackCount,
    YellowCount,
    GreenCount,
    PinkCount,
    BlueCount,
    TshirtCount,
    jeansCount,
    ShoesCount,
    JacketsCount,
    SCount,
    MCount,
    LCount,
    MensCount,
    WomensCount,
  } = await aggregateValues();

  const products = await Product.find();
  res.render("products.ejs", {
    loggedIn: req.session.userId,
    products,
    WhiteCount,
    BlackCount,
    YellowCount,
    GreenCount,
    PinkCount,
    BlueCount,
    TshirtCount,
    jeansCount,
    ShoesCount,
    JacketsCount,
    SCount,
    MCount,
    LCount,
    MensCount,
    WomensCount,
  });
});

async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.session.userId);
    if (user.role === "admin") {
      return next();
    } else {
      res.status(403).send("Forbidden: You do not have the right permissions.");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

const mapController = require("./Controller/mapController.js");
app.get("/store-locations", mapController.getLocations);

app.get("/contact", function (req, res) {
  res.render("contact.ejs", { loggedIn: req.session.userId });
});

app.get("/about", function (req, res) {
  res.render("about.ejs", { loggedIn: req.session.userId });
});

app.get("/profile", async function (req, res) {
  const userId = req.session.userId;
  const userDetails = await User.findById(userId);
  const orders = await Orders.find({ userId: req.session.userId });
  res.render("profile.ejs", {
    loggedIn: req.session.userId,
    orders,
    userDetails,
  });
});

app.get("/admin", isAdmin, async function (req, res) {
  try {
    const products = await Product.find();
    const ordersWithUser = await Orders.find().populate("userId", "fullname");

    const transformedOrders = ordersWithUser.map((order) => {
      const productTitles = order.products.map(
        (productObj) => productObj.product.title
      );
      return {
        ...order._doc,
        userName: order.userId.fullname,
        productTitles,
      };
    });

    res.render("admin.ejs", {
      loggedIn: req.session.userId,
      products,
      orders: transformedOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const userController = require("./Controller/userController");
app.put("/user/changeFullname", userController.ChangeFullname);
app.put("/user/changePassword", userController.ChangePassword);
app.put("/user/changeEmail", userController.ChangeEmail);
app.put("/user/changePhone", userController.ChangePhone);
app.put("/user/changeAdress", userController.ChangeAddress);

const authController = require("./Controller/authController");
app.get("/logout", authController.Logout);
app.post("/register", authController.Register);
app.post("/login", authController.Login);
app.get("/login", authController.LoginPage);
app.get("/register", authController.RegisterPage);

const adminController = require("./Controller/adminController");
app.get("/admin/products", adminController.getProductList);
app.post(
  "/admin/create",
  upload.single("imagePath"),
  adminController.createProduct
);
app.post("/admin/update-product", adminController.updateProduct);
app.post("/admin/delete-product", adminController.deleteProduct);
app.get("/admin", adminController.adminPage);
app.get("/admin/orders", adminController.getOrders);

const cartController = require("./Controller/cartController.js");
app.get("/cart", cartController.getCartPage);
app.get("/cart/items", cartController.getCartItems);
app.post("/cart/order", cartController.PlaceOrder);
app.post("/cart/:productId", cartController.addCart);
app.post("/cart/:index/:quantity", cartController.changeAmount);
app.delete("/cart/:deleteIndex", cartController.removeFromCart);
app.get("/cart/clear", cartController.ClearCart);

const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1/SKL", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

http.listen(3000, function () {
  console.log("Server is running on port 3000");
});

async function aggregateValues() {
  const Colors = await Product.aggregate([
    {
      $group: {
        _id: "$color",
        count: { $sum: 1 },
      },
    },
  ]);
  const Categories = await Product.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);
  const Sizes = await Product.aggregate([
    {
      $group: {
        _id: "$size",
        count: { $sum: 1 },
      },
    },
  ]);
  const Genders = await Product.aggregate([
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ]);

  const WhiteCount = Colors.find((item) => item._id === "White")?.count || 0;
  const BlackCount = Colors.find((item) => item._id === "Black")?.count || 0;
  const YellowCount = Colors.find((item) => item._id === "Yellow")?.count || 0;
  const GreenCount = Colors.find((item) => item._id === "Green")?.count || 0;
  const PinkCount = Colors.find((item) => item._id === "Pink")?.count || 0;
  const BlueCount = Colors.find((item) => item._id === "Blue")?.count || 0;

  const TshirtCount =
    Categories.find((item) => item._id === "T-shirts")?.count || 0;
  const jeansCount =
    Categories.find((item) => item._id === "jeans")?.count || 0;
  const ShoesCount =
    Categories.find((item) => item._id === "Shoes")?.count || 0;
  const JacketsCount =
    Categories.find((item) => item._id === "Jackets")?.count || 0;

  const SCount = Sizes.find((item) => item._id === "S")?.count || 0;
  const MCount = Sizes.find((item) => item._id === "M")?.count || 0;
  const LCount = Sizes.find((item) => item._id === "L")?.count || 0;

  const MensCount = Genders.find((item) => item._id === "Mens")?.count || 0;
  const WomensCount = Genders.find((item) => item._id === "Womens")?.count || 0;
  return {
    WhiteCount,
    BlackCount,
    YellowCount,
    GreenCount,
    PinkCount,
    BlueCount,
    TshirtCount,
    jeansCount,
    ShoesCount,
    JacketsCount,
    SCount,
    MCount,
    LCount,
    MensCount,
    WomensCount,
  };
}

function getWeatherFromWeatherbit(city) {
  const apiKey = "ad4f584dd4374d1c9ec8cc391daf0445"; // החלף את המחרוזת הזו במפתח ה-API שלך מ-Weatherbit
  const url = `https://api.weatherbit.io/v2.0/current?city=${encodeURIComponent(
    city
  )}&key=${apiKey}&lang=he`;

  return axios
    .get(url)
    .then((response) => {
      return response.data.data[0];
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      throw error;
    });
}
