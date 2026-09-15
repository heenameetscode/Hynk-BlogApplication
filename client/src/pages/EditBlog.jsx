import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fetchBlogById, updateBlog } from "../services/blogService";
import { getErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import "./BlogFormPage.css";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBlog() {
      setLoading(true);
      try {
        const data = await fetchBlogById(id);
        if (cancelled) return;

        if (data.blog.author?._id !== user?.id) {
          setError("You can only edit your own blogs.");
        } else {
          setBlog(data.blog);
        }
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
  }, [id, user]);

  async function handleSubmit(form) {
    setSubmitting(true);
    try {
      await updateBlog(id, form);
      toast.success("Blog updated successfully");
      navigate(`/blogs/${id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader label="Loading blog…" />;

  if (error || !blog) {
    return (
      <EmptyState
        title="Can't edit this blog"
        description={error}
        action={
          <Link to="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </Link>
        }
      />
    );
  }

  return (
    <section className="blog-form-page">
      <h1>Edit Blog</h1>
      <p className="blog-form-subtitle">Update your story and republish it.</p>
      <BlogForm
        initialValues={{
          title: blog.title,
          image: blog.image || "",
          category: blog.category,
          excerpt: blog.excerpt,
          content: blog.content,
        }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </section>
  );
}
