const express = require("express");
const {
  getBlogs,
  getMyBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect } = require("../middleware/auth");
const { validateBlog } = require("../middleware/validate");

const router = express.Router();

// NOTE: /mine must be declared before /:id so it isn't swallowed by the
// dynamic id route.
router.get("/mine", protect, getMyBlogs);

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", protect, validateBlog, createBlog);
router.put("/:id", protect, validateBlog, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
