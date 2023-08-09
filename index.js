const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const mongoose = require("mongoose");


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", async function (req, res) {
  res.render("index.ejs" );
});

app.get("/about", async function (req, res) {
  res.render("about.ejs" );
});
app.get("/products", async function (req, res) {
  res.render("products.ejs" );
});








const authController = require("./Controller/authController");

app.get("/login", authController.LoginPage);
app.get("/register", authController.RegisterPage);
app.post("/register", authController.Register);














http.listen(3000, function () {
    console.log("Server is running on port 3000");
  });
  

  mongoose
  .connect("mongodb://0.0.0.0:27017/WebDevelop_1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
