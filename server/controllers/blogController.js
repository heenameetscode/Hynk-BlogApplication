const Blog = require("../models/Blog");

// GET /api/blogs?search=&category=&page=&limit=
async function getBlogs(req, res, next) {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search && search.trim()) {
      // simple case-insensitive match on title or content, works without a
      // text index being built yet and gives partial-word matches
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ title: regex }, { content: regex }, { excerpt: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 9));

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name profileImage")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Blog.countDocuments(filter),
    ]);

    res.json({
      blogs,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/blogs/mine  (protected - the logged-in user's own blogs)
async function getMyBlogs(req, res, next) {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });
    res.json({ blogs });
  } catch (err) {
    next(err);
  }
}

// GET /api/blogs/:id
async function getBlogById(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name profileImage email");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ blog });
  } catch (err) {
    next(err);
  }
}

// POST /api/blogs  (protected)
async function createBlog(req, res, next) {
  try {
    const { title, content, excerpt, image, category } = req.body;

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      image,
      category,
      author: req.user._id,
    });

    const populated = await blog.populate("author", "name profileImage");
    res.status(201).json({ message: "Blog published successfully", blog: populated });
  } catch (err) {
    next(err);
  }
}

// PUT /api/blogs/:id  (protected, owner only)
async function updateBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own blogs" });
    }

    const { title, content, excerpt, image, category } = req.body;
    Object.assign(blog, {
      title: title ?? blog.title,
      content: content ?? blog.content,
      excerpt: excerpt ?? blog.excerpt,
      image: image ?? blog.image,
      category: category ?? blog.category,
    });

    await blog.save();
    const populated = await blog.populate("author", "name profileImage");
    res.json({ message: "Blog updated successfully", blog: populated });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/blogs/:id  (protected, owner only)
async function deleteBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own blogs" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = { getBlogs, getMyBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
