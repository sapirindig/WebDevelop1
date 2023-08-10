

const User = require("../Models/UserModel");



exports.LoginPage = async (req, res) => {
  res.render("login.ejs");
};
exports.RegisterPage = async (req, res) => {
  res.render("register.ejs");
};
exports.Register = async (req, res) => {
  try {
    const { email, password, fullname,phone,adress } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }


    
    const user = new User({
      fullname,
      email,
      password,
      phone,
      adress,
      isAdmin: false,
    });
    
    await user.save();

  
    // Redirect to the home page
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during registration");
  }
};
exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  res.redirect("/");

};
