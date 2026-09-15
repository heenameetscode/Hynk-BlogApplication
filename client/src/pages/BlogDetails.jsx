import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fetchBlogById } from "../services/blogService";
import { getErrorMessage } from "../services/api";
import "./BlogDetails.css";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBlog() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBlogById(id);
        if (!cancelled) setBlog(data.blog);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBlog();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader label="Loading blog…" />;

  if (error || !blog) {
    return (
      <EmptyState
        title="Blog not found"
        description={error || "This blog may have been removed."}
        action={
          <Link to="/blogs" className="btn btn-primary">
            Back to Blogs
          </Link>
        }
      />
    );
  }

  return (
    <article className="blog-details">
      <Link to="/blogs" className="back-link">
        ← Back to Blogs
      </Link>

      <span className="blog-details-category">{blog.category}</span>
      <h1>{blog.title}</h1>

      <div className="blog-details-meta">
        <span>By {blog.author?.name || "Unknown author"}</span>
        <span>•</span>
        <span>{formatDate(blog.createdAt)}</span>
      </div>

      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="blog-details-image"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="blog-details-content">
        {blog.content.split("\n").map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
        ))}
      </div>
    </article>
  );
}
