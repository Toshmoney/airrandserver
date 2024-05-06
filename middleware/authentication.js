const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

const isLoggin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; 
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: "Forbidden: You are not an admin" });
    }
  
    next();
  };
  
  const isVerified = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    if (!req.user.isVerified) {
      return res.status(403).json({ message: "Forbidden: Your account is not verified" });
    }
  
    next();
  };
  

const toggleAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.availability = !user.availability;

    await user.save();

    res.status(200).json({ message: "Availability updated successfully", user: user });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  

module.exports = {
    isLoggin,
    isAdmin,
    isVerified,
    toggleAvailability
};
