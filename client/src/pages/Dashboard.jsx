import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const setup = JSON.parse(localStorage.getItem("buznissySetup") || "{}");

  const businessName =
    setup?.formData?.name ||
    setup?.name ||
    user?.businessName ||
    "Your business";

  // Temporary MVP dashboard data.
  // Later these values will come from the backend.
  const totalSales = 0;
  const commission = totalSales * 0.03;
  const totalOrders = 0;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <main className="app-screen">
      <div className="app-container dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <p className="text-small text-muted">Buznissy</p>
            <h1 className="text-title">Dashboard</h1>
          </div>

          <div className="dashboard-header-actions">
            <ThemeToggle />

            <button
              type="button"
              className="button button-secondary"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </header>

        {/* Welcome */}
        <section className="dashboard-welcome">
          <p className="text-small text-muted">Welcome back</p>

          <h2 className="dashboard-business-name">
            {businessName}
          </h2>

          <p className="text-body text-muted">
            Here&apos;s what&apos;s happening with your business.
          </p>
        </section>

        {/* Quick actions */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <h3>Quick actions</h3>
          </div>

          <div className="quick-actions">
            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/business-setup")}
            >
              <span className="quick-action-icon">✦</span>

              <span>
                <strong>Edit website</strong>
                <small>Update your storefront</small>
              </span>
            </button>

            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/products")}
            >
              <span className="quick-action-icon">＋</span>

              <span>
                <strong>Add item</strong>
                <small>Add a product or service</small>
              </span>
            </button>

            <button
              type="button"
              className="quick-action-card"
              onClick={() => navigate("/storefront")}
            >
              <span className="quick-action-icon">↗</span>

              <span>
                <strong>View website</strong>
                <small>Open your public storefront</small>
              </span>
            </button>
          </div>
        </section>

        {/* Overview */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <h3>Overview</h3>
          </div>

          <div className="dashboard-stats">
            <article className="stat-card stat-card-featured">
              <p className="text-small text-muted">Total sales</p>

              <div>
                <strong className="stat-value">
                  {totalSales.toFixed(3)}
                </strong>

                <span className="stat-unit"> OMR</span>
              </div>
            </article>

            <article className="stat-card">
              <p className="text-small text-muted">Orders</p>

              <strong className="stat-value">
                {totalOrders}
              </strong>
            </article>

            <article className="stat-card">
              <p className="text-small text-muted">
                Buznissy commission
              </p>

              <div>
                <strong className="stat-value">
                  {commission.toFixed(3)}
                </strong>

                <span className="stat-unit"> OMR</span>
              </div>

              <p className="commission-note">
                3% of completed transactions
              </p>
            </article>
          </div>
        </section>

        {/* Orders */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <h3>Recent orders</h3>
              <p className="text-small text-muted">
                Your latest customer orders.
              </p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/orders")}
            >
              View all
            </button>
          </div>

          <div className="empty-orders">
            <div className="empty-orders-icon">⌑</div>

            <h4>No orders yet</h4>

            <p className="text-body text-muted">
              New customer orders will appear here.
            </p>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/storefront")}
            >
              View your website
            </button>
          </div>
        </section>

        {/* Store status */}
        <section className="store-status-card">
          <div>
            <div className="status-heading">
              <span className="status-dot" />
              <strong>Website active</strong>
            </div>

            <p className="text-small text-muted">
              Your storefront is ready for customers.
            </p>
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate("/storefront")}
          >
            View
          </button>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;