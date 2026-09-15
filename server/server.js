require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// --- CORS -------------------------------------------------------------
// CLIENT_ORIGIN can be a single origin or a comma-separated list, so both
// local dev and a deployed frontend (Vercel/Netlify) work without code
// changes.
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools (curl/Postman) which send no Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));

// --- Routes -------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ service: "Hynk API", status: "online" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "online" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

// --- Error handling (must be registered last) ---------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Hynk API listening on http://localhost:${PORT}`);
  });
});

module.exports = app;
