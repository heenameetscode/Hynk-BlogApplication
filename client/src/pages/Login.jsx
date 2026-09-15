import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./AuthForm.css";

export default function Login() {
  const { login, authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!form.email || !form.password) {
      setFormError("Please enter both email and password.");
      return;
    }

    try {
      await login(form);
      toast.success("Login successful");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message);
      toast.error(err.message);
    }
  }

  return (
    <section className="auth-section">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Log in to continue to Hynk</p>

        {formError && <div className="form-error-banner">{formError}</div>}

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
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="btn btn-primary btn-block" disabled={authLoading}>
          {authLoading ? "Logging in…" : "Login"}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}
