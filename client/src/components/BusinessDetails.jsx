import ManagementHeader from "../components/ManagementHeader";

function BusinessDetails() {
  const setup = JSON.parse(localStorage.getItem("buznissySetup") || "{}");
  const data = setup?.formData || setup || {};

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title="Business information"
          description="Manage your public business details."
        />

        <section className="details-card">
          <div className="detail-row">
            <span>Business name</span>
            <strong>{data.name || "Not added"}</strong>
          </div>

          <div className="detail-row">
            <span>Industry</span>
            <strong>{data.industry || "Not added"}</strong>
          </div>

          <div className="detail-row">
            <span>Business type</span>
            <strong>{data.businessType || "Not added"}</strong>
          </div>
        </section>

        <section className="business-menu-section">
          <p className="business-menu-label">CONTACT</p>

          <div className="business-menu-group">
            <button type="button" className="business-menu-row">
              <span className="business-menu-text">
                <strong>Contact information</strong>
                <small>Phone, email and WhatsApp</small>
              </span>

              <span className="business-menu-arrow">›</span>
            </button>

            <button type="button" className="business-menu-row">
              <span className="business-menu-text">
                <strong>Social media</strong>
                <small>Instagram, TikTok and more</small>
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

        <button
          type="button"
          className="button button-primary management-save"
        >
          Edit business information
        </button>
      </div>
    </main>
  );
}

export default BusinessDetails;