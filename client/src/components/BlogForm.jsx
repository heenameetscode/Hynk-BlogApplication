import { useState } from "react";
import "./BlogForm.css";

const CATEGORIES = ["Technology", "Lifestyle", "Travel", "Food", "Business", "Health", "Other"];

export default function BlogForm({ initialValues, submitLabel, onSubmit, submitting }) {
  const [form, setForm] = useState(
    initialValues || {
      title: "",
      image: "",
      category: CATEGORIES[0],
      excerpt: "",
      content: "",
    }
  );
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.title.trim()) return "Blog title is required.";
    if (!form.category) return "Please choose a category.";
    if (!form.excerpt.trim()) return "A short excerpt is required.";
    if (!form.content.trim()) return "Blog content cannot be empty.";
    return "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");
    onSubmit(form);
  }

  return (
    <form className="blog-form" onSubmit={handleSubmit} noValidate>
      {formError && <div className="form-error-banner">{formError}</div>}

      <label className="field">
        <span>Blog Title</span>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Give your blog a compelling title"
        />
      </label>

      <label className="field">
        <span>Blog Image URL</span>
        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <label className="field">
        <span>Category</span>
        <select name="category" value={form.category} onChange={handleChange}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Short Description / Excerpt</span>
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          rows={2}
          maxLength={300}
          placeholder="A one or two sentence summary shown on blog cards"
        />
      </label>

      <label className="field">
        <span>Blog Content</span>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={12}
          placeholder="Write your blog here…"
        />
      </label>

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? "Publishing…" : submitLabel}
      </button>
    </form>
  );
}
