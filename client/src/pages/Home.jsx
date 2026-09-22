import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const setup = JSON.parse(localStorage.getItem("buznissySetup") || "{}");

  const businessName =
    setup?.formData?.name ||
    setup?.name ||
    user?.businessName ||
    "Your business";

  return (
    <div className="app-page home-page">
      <header className="home-header">
        <div>
          <p className="home-greeting">softs.</p>
          <h1>{businessName}</h1>
        </div>

        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
          </svg>

          <span className="notification-dot" />
        </button>
      </header>

      <section className="business-status-banner">
        <div className="status-icon">✓</div>

        <div>
          <strong>Your website is live</strong>
          <p>Everything is ready for your customers.</p>
        </div>

        <button type="button" onClick={() => navigate("/business")}>
          View
        </button>
      </section>

      <section className="home-section">
        <div className="section-title-row">
          <div>
            <p className="section-eyebrow">TODAY</p>
            <h2>softs. overview</h2>
          </div>

          <button
            className="section-link"
            type="button"
            onClick={() => navigate("/insights")}
          >
            See insights
          </button>
        </div>

        <div className="home-metrics">
          <article className="metric-card metric-main">
            <span>Sales</span>
            <strong>0.000</strong>
            <small>OMR</small>
          </article>

          <article className="metric-card">
            <span>Orders</span>
            <strong>0</strong>
            <small>Today</small>
          </article>

          <article className="metric-card">
            <span>Commission</span>
            <strong>0.000</strong>
            <small>3% · OMR</small>
          </article>
        </div>
      </section>

      <section className="home-section">
        <div className="section-title-row">
          <h2>Quick actions</h2>
        </div>

        <div className="home-actions">
          <button type="button" onClick={() => navigate("/business")}>
            <span className="action-symbol">＋</span>
            <span>Add item</span>
          </button>

          <button type="button" onClick={() => navigate("/orders")}>
            <span className="action-symbol">▤</span>
            <span>Orders</span>
          </button>

          <button type="button" onClick={() => navigate("/business")}>
            <span className="action-symbol">✎</span>
            <span>Edit site</span>
          </button>

          <button type="button" onClick={() => navigate("/insights")}>
            <span className="action-symbol">↗</span>
            <span>Insights</span>
          </button>
        </div>
      </section>

      <section className="ai-home-card">
        <div className="ai-symbol">✦</div>

        <div className="ai-card-content">
          <span className="ai-label">BUZNISSY AI</span>
          <h2>What can I help you with?</h2>
          <p>
            Ask about your business, create content or understand your
            performance.
          </p>
        </div>

        <button
          type="button"
          className="ai-open-button"
          onClick={() => navigate("/ai")}
          aria-label="Open Buznissy AI"
        >
          →
        </button>
      </section>

      <section className="home-section">
        <div className="section-title-row">
          <h2>Recent orders</h2>

          <button
            type="button"
            className="section-link"
            onClick={() => navigate("/orders")}
          >
            View all
          </button>
        </div>

        <div className="home-empty-state">
          <div className="empty-state-icon">▢</div>
          <strong>No orders yet</strong>
          <p>Your latest customer orders will appear here.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
