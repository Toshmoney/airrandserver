const User = require('../model/User.model.js');

const updateAccountStatus = async (req, res, next) => {
  try {
    const { userId, accountStatus } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: "You are not authorized to update account status" });
    }

    user.accountStatus = accountStatus;

    await user.save();

    res.status(200).json({ message: "Account status updated successfully", user: user });
  } catch (error) {
    console.error("Error updating account status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = updateAccountStatus;
