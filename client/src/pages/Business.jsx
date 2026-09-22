import { useNavigate } from "react-router-dom";

function Business() {
  const navigate = useNavigate();

  const setup = JSON.parse(localStorage.getItem("buznissySetup") || "{}");

  const businessName =
    setup?.formData?.name ||
    setup?.name ||
    "Your business";

  const industry =
    setup?.formData?.industry ||
    setup?.industry ||
    "Business";

  const theme =
    setup?.formData?.theme ||
    setup?.theme ||
    "Minimal";

  return (
    <div className="app-page business-page">
      <header className="page-header">
        <p className="section-eyebrow">YOUR STORE</p>
        <h1>Business</h1>
        <p>Manage what your customers see.</p>
      </header>

      {/* Storefront */}
      <section className="business-store-card">
        <div className="business-store-top">
          <div className="business-store-logo">
            {businessName.charAt(0).toUpperCase()}
          </div>

          <div className="business-store-info">
            <strong>{businessName}</strong>
            <span>{industry}</span>
          </div>

          <span className="business-live-badge">
            <i />
            Live
          </span>
        </div>

        <button
          type="button"
          className="business-view-store"
          onClick={() => navigate("/storefront")}
        >
          <span>
            <strong>View your website</strong>
            <small>See what your customers see</small>
          </span>

          <span aria-hidden="true">↗</span>
        </button>
      </section>

      {/* Store */}
      <section className="business-menu-section">
        <p className="business-menu-label">STORE</p>

        <div className="business-menu-group">
          <button
            type="button"
            className="business-menu-row"
            onClick={() => navigate("/business/items")}
          >
            <span className="business-menu-icon">▦</span>

            <span className="business-menu-text">
              <strong>Products & Services</strong>
              <small>Manage what you sell</small>
            </span>

            <span className="business-menu-arrow">›</span>
          </button>

          <button
            type="button"
            className="business-menu-row"
            onClick={() => navigate("/business/website")}
          >
            <span className="business-menu-icon">⌘</span>

            <span className="business-menu-text">
              <strong>Website</strong>
              <small>Edit your storefront content</small>
            </span>

            <span className="business-menu-arrow">›</span>
          </button>
        </div>
      </section>

      {/* Design */}
      <section className="business-menu-section">
        <p className="business-menu-label">DESIGN</p>

        <div className="business-menu-group">
          <button
            type="button"
            className="business-menu-row"
            onClick={() => navigate("/business/theme")}
          >
            <span className="business-menu-icon gradient-icon">✦</span>

            <span className="business-menu-text">
              <strong>Theme & appearance</strong>
              <small>{theme} · Customize your storefront</small>
            </span>

            <span className="business-menu-arrow">›</span>
          </button>
        </div>
      </section>

      {/* Information */}
      <section className="business-menu-section">
        <p className="business-menu-label">BUSINESS</p>

        <div className="business-menu-group">
          <button
            type="button"
            className="business-menu-row"
            onClick={() => navigate("/business/details")}
          >
            <span className="business-menu-icon">ⓘ</span>

            <span className="business-menu-text">
              <strong>Business information</strong>
              <small>Details, contact & social links</small>
            </span>

            <span className="business-menu-arrow">›</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Business;