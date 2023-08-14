const User = require("../Models/UserModel");
exports.ChangeFullname = async (req, res) => {
  const { newFullName } = req.body;
  const userId = req.session.userId;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { fullname: newFullName },
    { new: true }
  );
};
exports.ChangePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.session.userId;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { password: newPassword },
    { new: true }
  );
};
exports.ChangeEmail = async (req, res) => {
  const { newEmail } = req.body;
  const userId = req.session.userId;
  const email = await User.findByIdAndUpdate(
    userId,
    { email: newEmail },
    { new: true }
  );
};
exports.ChangePhone = async (req, res) => {
  const { newPhone } = req.body;
  const userId = req.session.userId;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { phone: newPhone },
    { new: true }
  );
};
exports.ChangeAddress = async (req, res) => {
  const { newAdress } = req.body;
  const userId = req.session.userId;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { adress: newAdress },
    { new: true }
  );
};
