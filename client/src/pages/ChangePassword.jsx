import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!form.currentPassword || !form.newPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      setSaving(true);

      await api.put("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess("Your password was changed successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while changing your password.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-page contact-page">
      <header className="page-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginBottom: 12,
            fontSize: 15,
            color: "#2F6FED",
            cursor: "pointer",
          }}
        >
          ‹ Back
        </button>
        <p className="section-eyebrow">SECURITY</p>
        <h1>Change password</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="app-card contact-section">
          <div className="contact-grid">
            <label className="contact-field">
              <span>Current password</span>
              <input
                className="field-input"
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </label>

            <label className="contact-field">
              <span>New password</span>
              <input
                className="field-input"
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="At least 8 characters"
              />
            </label>

            <label className="contact-field">
              <span>Confirm new password</span>
              <input
                className="field-input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </label>
          </div>
        </section>

        {error && (
          <p className="message-error contact-message" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="message-success contact-message" role="status">
            {success}
          </p>
        )}

        <div className="contact-actions">
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="button button-brand contact-save-button"
            disabled={saving}
          >
            {saving ? "Saving..." : "Change password"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;