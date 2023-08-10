const User = require("../Models/UserModel");

exports.Logout = async (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.LoginPage = async (req, res) => {
  res.render("login.ejs", { loggedIn: req.session.userId });
};
exports.RegisterPage = async (req, res) => {
  res.render("register.ejs", { loggedIn: req.session.userId });
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).send("Invalid email or password");
  }
  req.session.userId = user._id;
  res.redirect("/");

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
    
    // Save the user to the database
    await user.save();

    // Set the session
    req.session.userId = user._id;
    req.session.save();

    // Redirect to the home page
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during registration");
  }
};
