import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ChangeEmail() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    email: "",
    confirmEmail: "",
    currentPassword: "",
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

    const email = form.email.trim().toLowerCase();
    const confirmEmail = form.confirmEmail.trim().toLowerCase();

    if (!email || !form.currentPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (email !== confirmEmail) {
      setError("The two email addresses do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/auth/email", {
        email,
        currentPassword: form.currentPassword,
      });

      // Keep the locally stored user in sync so every screen shows the new email.
      const updatedUser = {
        ...storedUser,
        email: response.data?.user?.email || email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setForm({ email: "", confirmEmail: "", currentPassword: "" });
      setSuccess(
        `Your email is now ${updatedUser.email}. Use it the next time you log in.`,
      );
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while changing your email.",
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
        <h1>Change email</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="app-card contact-section">
          <div className="contact-section-heading">
            <div>
              <h2>Login email</h2>
              <p>
                This is the email you log in with. Current:{" "}
                {storedUser.email || "—"}
              </p>
            </div>
          </div>

          <div className="contact-grid">
            <label className="contact-field">
              <span>New email</span>
              <input
                className="field-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                autoCapitalize="none"
                placeholder="name@example.com"
              />
            </label>

            <label className="contact-field">
              <span>Confirm new email</span>
              <input
                className="field-input"
                type="email"
                name="confirmEmail"
                value={form.confirmEmail}
                onChange={handleChange}
                autoComplete="off"
                autoCapitalize="none"
              />
            </label>

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
            {saving ? "Saving..." : "Change email"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangeEmail;