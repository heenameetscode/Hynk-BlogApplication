import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { fetchMyBlogs, deleteBlog } from "../services/blogService";
import { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Dashboard.css";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadMyBlogs() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyBlogs();
      setBlogs(data.blogs);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget._id);
      toast.success("Blog deleted successfully");
      setBlogs((prev) => prev.filter((b) => b._id !== deleteTarget._id));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <section className="dashboard">
      <h1>Welcome, {user?.name}</h1>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-value">{blogs.length}</span>
          <span className="stat-label">Total Blogs</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{blogs.length}</span>
          <span className="stat-label">Published Blogs</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{user?.createdAt ? formatDate(user.createdAt) : "—"}</span>
          <span className="stat-label">Account Created</span>
        </div>
      </div>

      <div className="section-header">
        <h2>My Blogs</h2>
        <Link to="/create-blog" className="btn btn-primary">
          + New Blog
        </Link>
      </div>

      {loading && <Loader label="Loading your blogs…" />}

      {!loading && error && <EmptyState title="Couldn't load your blogs" description={error} />}

      {!loading && !error && blogs.length === 0 && (
        <EmptyState
          title="You haven't published anything yet"
          description="Your published blogs will show up here."
          action={
            <Link to="/create-blog" className="btn btn-primary">
              Write your first blog
            </Link>
          }
        />
      )}

      {!loading && !error && blogs.length > 0 && (
        <div className="my-blogs-table">
          {blogs.map((blog) => (
            <div key={blog._id} className="my-blog-row">
              <div className="my-blog-info">
                <span className="my-blog-title">{blog.title}</span>
                <span className="my-blog-meta">
                  {blog.category} • {formatDate(blog.createdAt)}
                </span>
              </div>
              <div className="my-blog-actions">
                <Link to={`/blogs/${blog._id}`} className="btn btn-ghost btn-sm">
                  View
                </Link>
                <Link to={`/edit-blog/${blog._id}`} className="btn btn-outline btn-sm">
                  Edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(blog)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this blog?"
        description={`"${deleteTarget?.title}" will be permanently removed. This cannot be undone.`}
        confirmLabel={deleting ? "Deleting…" : "Delete"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}
