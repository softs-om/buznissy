import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../context/useBusiness";

function Business() {
  const navigate = useNavigate();

  const {
    businesses,
    activeBusiness: business,
    switchBusiness,
    loadingBusinesses: loading,
  } = useBusiness();

  const [showBusinessMenu, setShowBusinessMenu] = useState(false);

  if (loading) {
    return <div className="app-page">Loading...</div>;
  }

  if (!business) {
  return (
    <div className="app-page business-page">
      <div className="business-empty-state">
        <div className="business-empty-icon" aria-hidden="true">
          +
        </div>

        <h1>Create your business</h1>

        <p>
          Set up your business to start adding products or services,
          customize your website, and receive orders.
        </p>

        <button
          type="button"
          className="button button-primary"
          onClick={() => navigate("/business-setup")}
        >
          Create your business now
        </button>
      </div>
    </div>
  );
}

  const businessName = business.name;
  const industry = business.industry || "Business";

  return (
    <div className="app-page business-page">
      {/* ================= HEADER ================= */}

      <header className="page-header">
        <p className="section-eyebrow">YOUR STORE</p>

        <div className="business-title-switcher">
          <button
            type="button"
            className="business-title-button"
            onClick={() => setShowBusinessMenu((current) => !current)}
            aria-expanded={showBusinessMenu}
            aria-haspopup="menu"
          >
            <h1>{businessName}</h1>

            <span
              className={`business-switcher-chevron ${
                showBusinessMenu ? "open" : ""
              }`}
              aria-hidden="true"
            >
              ⌄
            </span>
          </button>

          {/* ================= BUSINESS SWITCHER ================= */}

          {showBusinessMenu && (
            <div className="business-switcher-menu" role="menu">
              <p className="business-switcher-label">SWITCH BUSINESS</p>

              {businesses.map((item) => {
                const isActive = item.id === business.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    className={isActive ? "active" : ""}
                    role="menuitem"
                    onClick={() => {
                      switchBusiness(item);
                      setShowBusinessMenu(false);
                    }}
                  >
                    <span className="business-switcher-business">
                      <span className="business-switcher-avatar">
                        {item.logo ? (
                          <img src={item.logo} alt={`${item.name} logo`} />
                        ) : (
                          item.name.charAt(0).toUpperCase()
                        )}
                      </span>

                      <span className="business-switcher-details">
                        <strong>{item.name}</strong>
                        <small>{item.industry || "Business"}</small>
                      </span>
                    </span>

                    {isActive && (
                      <span
                        className="business-switcher-check"
                        aria-label="Selected"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <p>Manage what your customers see.</p>
      </header>

      {/* ================= STORE CARD ================= */}

      <section className="business-store-card">
        <div className="business-store-top">
          <div className="business-store-logo">
            {business.logo ? (
              <img
                src={business.logo}
                alt={`${businessName} logo`}
                className="business-store-logo-image"
              />
            ) : (
              businessName.charAt(0).toUpperCase()
            )}
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
          onClick={() => navigate(`/order/${business.id}`)}
        >
          <span>
            <strong>View your website</strong>
            <small>See what your customers see</small>
          </span>

          <span aria-hidden="true">↗</span>
        </button>
      </section>

      {/* ================= STORE ================= */}

      <section className="business-menu-section">
        <p className="business-menu-label">STORE</p>

        <div className="business-menu-group">
          {/* Products & Services */}

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

          {/* Website */}

          <button
            type="button"
            className="business-menu-row"
            onClick={() => navigate("/business/website")}
          >
            <span className="business-menu-icon">⌘</span>

            <span className="business-menu-text">
              <strong>Website & domain</strong>
              <small>Customize your website and domain</small>
            </span>

            <span className="business-menu-arrow">›</span>
          </button>
        </div>
      </section>

      {/* ================= BUSINESS ================= */}

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
