const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
// JWTs are stateless, so "logout" is really just a client-side signal - this
// endpoint exists for a consistent API surface and future blacklist support.
function logout(req, res) {
  res.json({ message: "Logged out successfully" });
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ user: req.user.toSafeObject() });
}

module.exports = { register, login, logout, getMe };
