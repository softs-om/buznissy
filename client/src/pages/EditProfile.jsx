import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EditProfile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [name, setName] = useState(storedUser.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = name.trim();

    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put("/auth/profile", { name: trimmed });

      // Keep the locally stored user in sync so every screen shows the new name.
      const updatedUser = {
        ...storedUser,
        name: response.data?.user?.name || trimmed,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while saving your name.",
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
        <p className="section-eyebrow">ACCOUNT</p>
        <h1>Edit name</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="app-card contact-section">
          <div className="contact-grid">
            <label className="contact-field">
              <span>Name</span>
              <input
                className="field-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                maxLength={100}
                autoComplete="name"
              />
            </label>
          </div>
        </section>

        {error && (
          <p className="message-error contact-message" role="alert">
            {error}
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
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;