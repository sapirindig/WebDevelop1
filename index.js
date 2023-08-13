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


const path = require("path");
const mongoose = require("mongoose");

app.set("views", path.join(__dirname, "Views"));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));


app.get("/", async function (req, res) {
  res.render("index.ejs",{ loggedIn: req.session.userId} );
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
