const jwt = require('jsonwebtoken');
const User = require('../model/User.model');
const TransactionPin = require("../model/TransactionPin")

const isLoggin = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user = user; 
      next();
    } catch (error) {
      return res.status(403).json({ error: "Invalid token" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: "You are not an admin" });
    }
  
    next();
  };
  
  const isVerified = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    if (!req.user.isVerified) {
      return res.status(403).json({ error: "Your account is not verified" });
    }
  
    next();
  };
  

const toggleAvailability = async (req, res, next) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if(user.availability){
        user.availability = false
    }

    user.availability = true;

    await user.save();

    res.status(200).json({ message: "Availability updated successfully", user: user });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkUserPin = async (req, res, next) => {
  const userPin = await TransactionPin.findOne({ user: req.user._id });
  req.session.requestedUrl = req.originalUrl;
  if (!userPin) {
    return res.status(400).json({error: "Set your transaction pin to continue"})
  }
  next();
};


  

module.exports = {
    isLoggin,
    isAdmin,
    isVerified,
    toggleAvailability,
    checkUserPin
};
