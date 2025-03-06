const User = require("../models/User");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register user.
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "User already exists!!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.create({
      username,
      password: hashPassword,
    });
    res.json({
      msg: "User Registered Successfully!!",
    });
  } catch (error) {
    next(error);
  }
});

// Login user.
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User does not exists!" });
    }

    const validate = await bcrypt.compare(password, user.password);
    if (!validate) {
      return res.status(400).json({ msg: "Invalid username or password!" });
    } else {
      const token = await jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET
      );
      res
        .setHeader("X-token", token)
        .json({ msg: "User logged in successfully!" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
