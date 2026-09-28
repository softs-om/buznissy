import { useEffect, useState } from "react";
import ManagementHeader from "../components/ManagementHeader";
import { useBusiness } from "../context/useBusiness";
import { getBusiness, updateBusiness } from "../services/api";
import { useNavigate } from "react-router-dom";

function BusinessDetails() {
  const { activeBusiness, refreshActiveBusiness } = useBusiness();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    industry: "",
    businessType: "",
    description: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBusiness = async () => {
      if (!activeBusiness?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await getBusiness(activeBusiness.id);

        const business = response.data?.business || response.data;

        setForm({
          name: business?.name || "",
          industry: business?.industry || "",
          businessType: business?.businessType || "",
          description: business?.description || "",
          logo: business?.logo || "",
        });
      } catch (error) {
        console.error("Could not load business:", error);
        setMessage("Could not load business information.");
      } finally {
        setLoading(false);
      }
    };

    loadBusiness();
  }, [activeBusiness?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSave = async () => {
    if (!activeBusiness?.id) return;

    try {
      setSaving(true);
      setMessage("");

      await updateBusiness(activeBusiness.id, form);

      await refreshActiveBusiness();

      setMessage("Business information saved.");
    } catch (error) {
      console.error("Could not update business:", error);
      setMessage("Could not save business information.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="app-screen">
        <div className="app-page management-page">
          <p>Loading business...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title="Business information"
          description="Manage your public business details."
        />

        {/* BUSINESS LOGO */}
        <section className="business-details-profile">
          <div className="business-store-logo">
            {form.logo ? (
              <img src={form.logo} alt={`${form.name} logo`} />
            ) : (
              form.name?.charAt(0)?.toUpperCase() || "B"
            )}
          </div>

          <div>
            <strong>{form.name || "Your business"}</strong>
            <p>{form.industry || "Business"}</p>
          </div>
        </section>

        {/* MAIN INFORMATION */}
        <section className="details-card business-edit-card">
          <label className="business-edit-field">
            <span>Business name</span>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Business name"
            />
          </label>

          <label className="business-edit-field">
            <span>Industry</span>

            <input
              type="text"
              name="industry"
              value={form.industry}
              onChange={handleChange}
              placeholder="e.g. Beauty, IT, Restaurant"
            />
          </label>

          <label className="business-edit-field">
            <span>Business type</span>

            <input
              type="text"
              name="businessType"
              value={form.businessType}
              readOnly
              aria-readonly="true"
            />
          </label>

          <label className="business-edit-field business-description-field">
            <span>Description</span>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell customers about your business..."
              rows="4"
            />
          </label>
        </section>

        <button
          type="button"
          className="button button-primary management-save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>

        {message && <p className="business-save-message">{message}</p>}

        {/* CONTACT */}
        <section className="business-menu-section">
          <p className="business-menu-label">CONTACT</p>

          <div className="business-menu-group">
      
            <button
              type="button"
              className="business-menu-row"
              onClick={() => navigate("/contact-information")}
            >
              <span className="business-menu-text">
                <strong>Contact information</strong>
                <small>Phone, email and WhatsApp</small>
              </span>

              <span className="business-menu-arrow">›</span>
            </button>

            <button type="button" className="business-menu-row">
              <span className="business-menu-text">
                <strong>Location</strong>
                <small>Address, city and country</small>
              </span>

              <span className="business-menu-arrow">›</span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default BusinessDetails;
