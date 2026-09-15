import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fetchBlogs } from "../services/blogService";
import { getErrorMessage } from "../services/api";
import "./Home.css";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLatest() {
      setLoading(true);
      try {
        const data = await fetchBlogs({ page: 1, limit: 6 });
        if (!cancelled) setBlogs(data.blogs);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadLatest();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <h1>Share Your Stories With The World</h1>
          <p>
            Hynk is a clean, modern space to write what matters to you and discover stories from
            other writers.
          </p>
          <div className="hero-actions">
            <Link to="/blogs" className="btn btn-primary btn-lg">
              Explore Blogs
            </Link>
            <Link to="/create-blog" className="btn btn-outline btn-lg">
              Create Blog
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Latest Blogs</h2>
          <Link to="/blogs" className="section-link">
            View all →
          </Link>
        </div>

        {loading && <Loader label="Loading latest blogs…" />}

        {!loading && error && (
          <EmptyState title="Couldn't load blogs" description={error} />
        )}

        {!loading && !error && blogs.length === 0 && (
          <EmptyState
            title="No blogs yet"
            description="Be the first to share a story on Hynk."
            action={
              <Link to="/create-blog" className="btn btn-primary">
                Write the first blog
              </Link>
            }
          />
        )}

        {!loading && !error && blogs.length > 0 && (
          <div className="blog-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
