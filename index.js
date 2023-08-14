const Product = require("./Models/ProductModel");


const express = require("express");
const session = require("express-session");

const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1/WebDevelop_1", // MongoDB connection URI
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
  });})

const path = require("path");
const mongoose = require("mongoose");

app.set("views", path.join(__dirname, "Views"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));


































app.get("/", async function (req, res) {
  const mensClothing = (await Product.find({ gender: "Mens" })).splice(0,8);
  const womensClothing = (await Product.find({ gender: "Womens" })).splice(0,8);
  res.render("index.ejs", { loggedIn: req.session.userId, mensClothing ,womensClothing});
});


app.get("/contact", async function (req, res) {
  res.render("contact.ejs",{ loggedIn: req.session.userId} );
});

app.get("/about", async function (req, res) {
  res.render("about.ejs",{ loggedIn: req.session.userId} );
});

app.get("/products", async function (req, res) {
  res.render("products.ejs",{ loggedIn: req.session.userId} );
});
app.get("/cart", async function (req, res) {
  res.render("cart.ejs",{ loggedIn: req.session.userId} );
});

app.get("/profile", async function (req, res) {
  res.render("profile.ejs",{ loggedIn: req.session.userId} );
});





const authController = require("./Controller/authController");
app.get("/register", authController.RegisterPage);
app.get("/login", authController.LoginPage);
app.get("/logout", authController.Logout);
app.post("/register", authController.Register);
app.post("/login", authController.Login);














http.listen(3000, function () {
    console.log("Server is running on port 3000");
  });
  

  mongoose
  .connect("mongodb://127.0.0.1/WebDevelop_1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
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