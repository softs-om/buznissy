import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../context/useBusiness";
import api from "../services/api";
import { getBusiness } from "../services/api";
import ManagementHeader from "../components/ManagementHeader";

const initialForm = {
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  instagram: "",
  tiktok: "",
  snapchat: "",
  youtube: "",
  facebook: "",
  x: "",
  linkedin: "",
  googleMapsUrl: "",
};

function ContactInformation() {
  const navigate = useNavigate();
  const { activeBusiness, refreshActiveBusiness } = useBusiness();
  const [form, setForm] = useState(initialForm);
  const [customLinks, setCustomLinks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadContactInformation = async () => {
      if (!activeBusiness?.id) return;

      try {
        const response = await getBusiness(activeBusiness.id);
        const business = response.data?.business || response.data;

        setForm({
          phone: business?.phone || "",
          whatsapp: business?.whatsapp || "",
          email: business?.email || "",
          website: business?.website || "",
          instagram: business?.instagram || "",
          tiktok: business?.tiktok || "",
          snapchat: business?.snapchat || "",
          youtube: business?.youtube || "",
          facebook: business?.facebook || "",
          x: business?.x || "",
          linkedin: business?.linkedin || "",
          googleMapsUrl: business?.googleMapsUrl || "",
        });

        setCustomLinks(
          Array.isArray(business?.customLinks) ? business.customLinks : [],
        );
      } catch (error) {
        console.error("Could not load contact information:", error);
        setError("Could not load your saved contact information.");
      }
    };

    loadContactInformation();
  }, [activeBusiness?.id]);
  /* Load existing information when available */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };
  const handleFocus = (e) => {
    e.target.select();
  };

  const addCustomLink = () => {
    setCustomLinks((prev) => [
      ...prev,
      {
        label: "",
        url: "",
      },
    ]);
  };

  const updateCustomLink = (index, field, value) => {
    setCustomLinks((prev) =>
      prev.map((link, i) =>
        i === index
          ? {
              ...link,
              [field]: value,
            }
          : link,
      ),
    );
  };

  const removeCustomLink = (index) => {
    setCustomLinks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    /*
      The page can be used during setup even before a business
      has been selected/created.

      Once a business exists, save directly to the backend.
    */
    if (!activeBusiness?.id) {
      setError("No active business found.");
      return;
    }
    try {
      setSaving(true);

      const cleanedLinks = customLinks
        .filter((link) => link.label?.trim() || link.url?.trim())
        .map((link) => ({
          label: link.label?.trim() || "",
          url: link.url?.trim() || "",
        }));

      await api.put(`/businesses/${activeBusiness.id}`, {
        ...form,
        customLinks: cleanedLinks,
      });

      if (refreshActiveBusiness) {
        await refreshActiveBusiness();
      }

      setSuccess("Contact information saved successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Something went wrong while saving your information.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-page contact-page">
      {/* HEADER */}
   
      <header className="page-header">
        <ManagementHeader
          title="Contact information"
          description="Add the contact details and links customers can use to reach your business."
          onBack={() => navigate(-1)}
        />
      </header>

      <form onSubmit={handleSave}>
        {/* CONTACT DETAILS */}
        <section className="app-card contact-section">
          <div className="contact-section-heading">
            <div>
              <h2>Contact details</h2>
              <p>Choose how customers can contact your business.</p>
            </div>
          </div>

          <div className="contact-grid">
            <label className="contact-field">
              <span>Phone number</span>

              <input
                className="field-input"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="+968 9000 0000"
              />
            </label>

            <label className="contact-field">
              <span>WhatsApp</span>

              <input
                className="field-input"
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="+968 9000 0000"
              />
            </label>

            <label className="contact-field">
              <span>Email</span>

              <input
                className="field-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="hello@yourbusiness.com"
              />
            </label>

            <label className="contact-field">
              <span>Website</span>

              <input
                className="field-input"
                type="url"
                name="website"
                value={form.website}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="https://yourbusiness.com"
              />
            </label>
          </div>
        </section>

        {/* SOCIAL MEDIA */}
        <section className="app-card contact-section">
          <div className="contact-section-heading">
            <div>
              <h2>Social media</h2>
              <p>Add the social platforms your business uses.</p>
            </div>
          </div>

          <div className="contact-grid">
            <label className="contact-field">
              <span>Instagram</span>

              <input
                className="field-input"
                type="text"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="@username or profile link"
              />
            </label>

            <label className="contact-field">
              <span>TikTok</span>

              <input
                className="field-input"
                type="text"
                name="tiktok"
                value={form.tiktok}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="@username or profile link"
              />
            </label>

            <label className="contact-field">
              <span>Snapchat</span>

              <input
                className="field-input"
                type="text"
                name="snapchat"
                value={form.snapchat}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="@username or profile link"
              />
            </label>

            <label className="contact-field">
              <span>YouTube</span>

              <input
                className="field-input"
                type="text"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="Channel name or link"
              />
            </label>

            <label className="contact-field">
              <span>Facebook</span>

              <input
                className="field-input"
                type="text"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="Page name or profile link"
              />
            </label>

            <label className="contact-field">
              <span>X</span>

              <input
                className="field-input"
                type="text"
                name="x"
                value={form.x}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="@username or profile link"
              />
            </label>

            <label className="contact-field">
              <span>LinkedIn</span>

              <input
                className="field-input"
                type="text"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                onFocus={handleFocus}
                placeholder="Company page or profile link"
              />
            </label>
          </div>
        </section>

        {/* LOCATION */}
        <section className="app-card contact-section">
          <div className="contact-section-heading">
            <div>
              <h2>Location</h2>

              <p>
                Add your Google Maps location so customers can easily find you.
              </p>
            </div>
          </div>

          <label className="contact-field">
            <span>Google Maps link</span>

            <input
              className="field-input"
              type="text"
              name="googleMapsUrl"
              value={form.googleMapsUrl}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Paste your Google Maps link"
            />
          </label>
        </section>

        {/* CUSTOM LINKS */}
        <section className="app-card contact-section">
          <div className="contact-section-heading contact-custom-heading">
            <div>
              <h2>Other links</h2>

              <p>
                Add booking links, menus, portfolios, stores, or any other
                useful link.
              </p>
            </div>

            <button
              type="button"
              className="button button-secondary contact-add-button"
              onClick={addCustomLink}
            >
              + Add link
            </button>
          </div>

          {customLinks.length === 0 ? (
            <div className="contact-empty">
              <p>No additional links added yet.</p>
            </div>
          ) : (
            <div className="contact-custom-list">
              {customLinks.map((link, index) => (
                <div className="contact-custom-row" key={index}>
                  <input
                    className="field-input"
                    type="text"
                    value={link.label || ""}
                    onChange={(e) =>
                      updateCustomLink(index, "label", e.target.value)
                    }
                    placeholder="Link name"
                    aria-label={`Custom link ${index + 1} name`}
                  />

                  <input
                    className="field-input"
                    type="text"
                    value={link.url || ""}
                    onChange={(e) =>
                      updateCustomLink(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    aria-label={`Custom link ${index + 1} URL`}
                  />

                  <button
                    type="button"
                    className="contact-remove-button"
                    onClick={() => removeCustomLink(index)}
                    aria-label={`Remove custom link ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MESSAGES */}
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

        {/* ACTIONS */}
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
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactInformation;
