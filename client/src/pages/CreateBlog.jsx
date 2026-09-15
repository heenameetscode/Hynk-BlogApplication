import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../components/BlogForm";
import { createBlog } from "../services/blogService";
import { getErrorMessage } from "../services/api";
import { useToast } from "../context/ToastContext";
import "./BlogFormPage.css";

export default function CreateBlog() {
  const navigate = useNavigate();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(form) {
    setSubmitting(true);
    try {
      await createBlog(form);
      toast.success("Blog published successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="blog-form-page">
      <h1>Create a New Blog</h1>
      <p className="blog-form-subtitle">Share something worth reading.</p>
      <BlogForm submitLabel="Publish Blog" onSubmit={handleSubmit} submitting={submitting} />
    </section>
  );
}
