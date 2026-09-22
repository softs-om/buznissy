import { useNavigate } from "react-router-dom";
import ManagementHeader from "../components/ManagementHeader";

function WebsiteManager() {
  const navigate = useNavigate();

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title="Website"
          description="Manage your customer-facing storefront."
        />

        <section className="website-preview-card">
          <div className="website-preview-browser">
            <span />
            <span />
            <span />
          </div>

          <div className="website-preview-content">
            <span className="website-preview-label">YOUR WEBSITE</span>
            <strong>Storefront preview</strong>
            <p>See your latest published design.</p>
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate("/storefront")}
          >
            Preview website
          </button>
        </section>

        <section className="business-menu-section">
          <p className="business-menu-label">CONTENT</p>

          <div className="business-menu-group">
            <button type="button" className="business-menu-row">
              <span className="business-menu-icon">⌂</span>

              <span className="business-menu-text">
                <strong>Homepage</strong>
                <small>Edit headline, description and cover</small>
              </span>

              <span className="business-menu-arrow">›</span>
            </button>

            <button
              type="button"
              className="business-menu-row"
              onClick={() => navigate("/business/items")}
            >
              <span className="business-menu-icon">▦</span>

              <span className="business-menu-text">
                <strong>Store content</strong>
                <small>Products, services and categories</small>
              </span>

              <span className="business-menu-arrow">›</span>
            </button>
          </div>
        </section>

        <section className="business-menu-section">
          <p className="business-menu-label">PUBLISHING</p>

          <div className="business-menu-group">
            <div className="business-menu-row non-clickable">
              <span className="business-menu-icon">✓</span>

              <span className="business-menu-text">
                <strong>Website status</strong>
                <small>Your website is currently published</small>
              </span>

              <span className="website-live-text">Live</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default WebsiteManager;