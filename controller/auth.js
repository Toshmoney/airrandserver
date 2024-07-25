const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User.model.js');
const Wallet = require('../model/Wallet.model.js');
const nodemailer = require("nodemailer");
const { validationResult } = require('express-validator');
const { generateCode } = require('../utils/generatecode.js');


const register = async (req, res) => {
  try {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }

    const { username, email, password, userType } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ error: "Username must be at least 3 characters long" });
    }

    if (!email || !password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Sorry, this username is taken" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      userType,
    });

    const userWallet = new Wallet({
      user: newUser._id,
    });

    await newUser.save();
    await userWallet.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the user's stored hashed password
    console.log("Stored hashed password:", user.password);

    // Compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Log the result of password comparison
    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const forgetPassword = async (req, res) => {
  try {
    // Convert incoming email to lowercase
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase();
    }

    const { email } = req.body;
    // Find a user before resetting password
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "You are not a registered user, please sign up!" });
    }

    // Generate reset code
    const code = generateCode(6);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Update user reset details
    user.resetToken = code;
    const exp = user.resetExpires = Date.now() + 3600000; // 1 hour

    // Create the email data
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset Request from AirRand',
      text: `Dear ${user.username}, use: ${code} to reset your password. It will expire at ${new Date(exp)}. Please ignore if you didn't request this!`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    await user.save();
    return res.status(201).json({ message: "Code has been sent to your registered email, please check and continue" });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, confirm, token } = req.body;

    if (!password || !confirm) {
      return res.status(400).json({ error: 'Password and confirm password are required' });
    }

    if (password !== confirm) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const user = await User.findOne({ resetToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token or token has been used!' });
    }

    if (user.resetExpires < Date.now()) {
      return res.status(400).json({ error: 'Token has expired!' });
    }

    // Hash the new password
    user.password = password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Set the new password and clear reset token and expiry
    user.password = hash;
    user.resetToken = undefined;
    user.resetExpires = undefined;

    await user.save();

    return res.status(200).json({ status: true, message: 'Password successfully reset' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
    register,
    login,
    forgetPassword,
    updatePassword
}
