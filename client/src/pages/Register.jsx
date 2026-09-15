import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./AuthForm.css";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function Register() {
  const { register, authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [formError, setFormError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    if (!form.name.trim()) return "Full name is required.";
    if (!EMAIL_RE.test(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");

    try {
      await register(form);
      toast.success("Registration successful — welcome to Hynk!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
    }
  }

  return (
    <section className="auth-section">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Join Hynk and start writing today</p>

        {formError && <div className="form-error-banner">{formError}</div>}

        <label className="field">
          <span>Full Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jordan Rivera"
            autoComplete="name"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </label>

        <label className="field">
          <span>Confirm Password</span>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={authLoading}>
          {authLoading ? "Creating account…" : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}
