import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fetchBlogs } from "../services/blogService";
import { getErrorMessage } from "../services/api";
import "./Blogs.css";

const CATEGORIES = ["All", "Technology", "Lifestyle", "Travel", "Food", "Business", "Health", "Other"];

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // debounce the search box so we don't fire a request on every keystroke
  useEffect(() => {
    const handle = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchBlogs({ search, category, page, limit: 9 });
        if (!cancelled) {
          setBlogs(data.blogs);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBlogs();
    return () => {
      cancelled = true;
    };
  }, [search, category, page]);

  return (
    <section className="section blogs-page">
      <div className="section-header">
        <h2>All Blogs</h2>
      </div>

      <div className="blogs-toolbar">
        <input
          type="search"
          placeholder="Search blogs by title or content…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="blogs-search"
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="blogs-category"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading && <Loader label="Loading blogs…" />}

      {!loading && error && <EmptyState title="Couldn't load blogs" description={error} />}

      {!loading && !error && blogs.length === 0 && (
        <EmptyState
          title="No blogs found"
          description="Try a different search term or category."
        />
      )}

      {!loading && !error && blogs.length > 0 && (
        <>
          <div className="blog-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
