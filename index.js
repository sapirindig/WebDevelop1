const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", async function (req, res) {
  res.render("index.ejs" );
});

app.get("/login", async function (req, res) {
  res.render("login.ejs" );
});
app.get("/register", async function (req, res) {
  res.render("register.ejs" );
});
app.get("/about", async function (req, res) {
  res.render("about.ejs" );
});
app.get("/products", async function (req, res) {
  res.render("products.ejs" );
});

http.listen(3000, function () {
    console.log("Server is running on port 3000");
  });
  