import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { updateProfile } from "../services/userService";
import { getErrorMessage } from "../services/api";
import "./Profile.css";

const FALLBACK_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Crect width='100%25' height='100%25' rx='60' fill='%23dbe3f0'/%3E%3C/svg%3E";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Profile() {
  const { user, updateStoredUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: user?.name || "", profileImage: user?.profileImage || "" });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const data = await updateProfile(form);
      updateStoredUser(data.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  }

  return (
    <section className="profile-page">
      <h1>Your Profile</h1>

      <div className="profile-card">
        <img
          src={form.profileImage || FALLBACK_AVATAR}
          alt={user?.name}
          className="profile-avatar"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />

        <div className="profile-static-info">
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Joined:</strong> {user?.createdAt ? formatDate(user.createdAt) : "—"}
          </p>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </label>

        <label className="field">
          <span>Profile Image URL</span>
          <input
            type="text"
            name="profileImage"
            value={form.profileImage}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </label>

        <div className="profile-actions">
          <button type="submit" className="btn btn-primary save-changes" disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </section>
  );
}
