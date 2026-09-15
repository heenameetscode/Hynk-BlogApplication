import { Link } from "react-router-dom";
import "./BlogCard.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220'%3E%3Crect width='100%25' height='100%25' fill='%23eef1f6'/%3E%3C/svg%3E";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogCard({ blog }) {
  return (
    <article className="blog-card">
      <Link to={`/blogs/${blog._id}`} className="blog-card-image-link">
        <img
          src={blog.image || FALLBACK_IMAGE}
          alt={blog.title}
          className="blog-card-image"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <span className="blog-card-category">{blog.category}</span>
      </Link>

      <div className="blog-card-body">
        <h3 className="blog-card-title">
          <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h3>
        <p className="blog-card-excerpt">{blog.excerpt}</p>

        <div className="blog-card-meta">
          <span>{blog.author?.name || "Unknown author"}</span>
          <span>•</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <Link to={`/blogs/${blog._id}`} className="blog-card-readmore">
          Read More →
        </Link>
      </div>
    </article>
  );
}
