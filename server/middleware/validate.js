const EMAIL_RE = /^\S+@\S+\.\S+$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates POST /api/auth/register body.
 */
function validateRegister(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!isNonEmptyString(name)) errors.push("Name is required");
  if (!isNonEmptyString(email) || !EMAIL_RE.test(email)) errors.push("A valid email is required");
  if (!isNonEmptyString(password) || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (errors.length) return res.status(400).json({ message: errors.join(", ") });
  next();
}

/**
 * Validates POST /api/auth/login body.
 */
function validateLogin(req, res, next) {
  const { email, password } = req.body;
  const errors = [];

  if (!isNonEmptyString(email) || !EMAIL_RE.test(email)) errors.push("A valid email is required");
  if (!isNonEmptyString(password)) errors.push("Password is required");

  if (errors.length) return res.status(400).json({ message: errors.join(", ") });
  next();
}

/**
 * Validates POST/PUT /api/blogs body.
 */
function validateBlog(req, res, next) {
  const { title, content, excerpt, category } = req.body;
  const errors = [];

  if (!isNonEmptyString(title)) errors.push("Title is required");
  if (!isNonEmptyString(content)) errors.push("Content is required");
  if (!isNonEmptyString(excerpt)) errors.push("Excerpt is required");
  if (!isNonEmptyString(category)) errors.push("Category is required");

  if (errors.length) return res.status(400).json({ message: errors.join(", ") });
  next();
}

module.exports = { validateRegister, validateLogin, validateBlog };
