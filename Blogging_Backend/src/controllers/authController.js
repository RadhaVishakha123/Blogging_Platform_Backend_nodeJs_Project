const User = require("../models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();
const RefreshToken = require("..//models/refreshToken");
const {
  generateAccessToken,
  generateRefreshToken,
  varifyRefreshToken,
} = require("..//service/auth");
async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email & password required" });
    }
    if (!username) {
      return res.status(400).json({ message: "Username required" });
    }
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      email: email,
      password: hashPassword,
    });
    return res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err });
  }
}
async function loginUser(req, res) {
  try {
    //console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // Check empty body
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    // Check user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    // Compare password (you are not using bcrypt now, so plain text compare)
    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Create token
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    // res.cookie("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: false,
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({
      message: "Login success",
      accessToken,
      refreshToken,
      user,

    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: "Error", error: err.message });
  }
}
async function logoutUser(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      const user = varifyRefreshToken(refreshToken);
      // delete refresh token by user.id
      console.log("delete from database");
      await RefreshToken.deleteMany({ userId: user.id });
    }

    //res.clearCookie("refreshToken");
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.log("LOGOUT ERROR:", err);
    return res
      .status(500)
      .json({ message: "Logout failed", error: err.message });
  }
}

module.exports = { registerUser, loginUser, logoutUser };
