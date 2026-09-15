const User = require("../models/User");
const Blog = require("../models/Blog");

// GET /api/users/profile  (protected)
async function getProfile(req, res, next) {
  try {
    const blogCount = await Blog.countDocuments({ author: req.user._id });
    res.json({
      user: req.user.toSafeObject(),
      stats: {
        totalBlogs: blogCount,
      },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/profile  (protected)
async function updateProfile(req, res, next) {
  try {
    const { name, profileImage } = req.body;

    if (name !== undefined) req.user.name = name;
    if (profileImage !== undefined) req.user.profileImage = profileImage;

    await req.user.save();

    res.json({ message: "Profile updated successfully", user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile };
