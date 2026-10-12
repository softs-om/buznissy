import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useBusiness } from "../context/useBusiness";

function Profile() {
  const navigate = useNavigate();
  const { activeBusiness } = useBusiness();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const planName = localStorage.getItem("selectedPlan");
  // Shown under the email, only the parts we actually have.
  const businessLine = [
    activeBusiness?.name,
    planName ? `${planName} plan` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Rows that don't have a real screen yet route here, carrying their own
  // title. One shared "coming soon" page instead of a blank one per section.
  const goComingSoon = (feature) => {
    navigate("/coming-soon", { state: { feature } });
  };

  return (
    <div className="app-page">
      <header className="page-header">
        <p className="section-eyebrow">ACCOUNT</p>
        <h1>Profile</h1>
      </header>

      <section className="profile-summary">
        <div className="profile-avatar">
          {(user.name || "M").charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{user.name || "Merchant"}</strong>
          <p>{user.email || "Buznissy account"}</p>
          {businessLine && <p>{businessLine}</p>}
        </div>
      </section>

      <section className="settings-group">
        <h2>Account</h2>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/profile-information")}
        >
          <span>Profile information</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/security")}
        >
          <span>Security</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => goComingSoon("Payment & billing")}
        >
          <span>Payment & billing</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/subscription")}
        >
          <span>Subscription</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => goComingSoon("Notifications")}
        >
          <span>Notifications</span>
          <span>›</span>
        </button>
      </section>

      <section className="settings-group">
        <h2>Business</h2>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/contact-information")}
        >
          <span>Connected accounts</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => goComingSoon("Team members")}
        >
          <span>Team members</span>
          <span>›</span>
        </button>
      </section>

      <section className="settings-group">
        <h2>Data & privacy</h2>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/download-data")}
        >
          <span>Download my data</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => goComingSoon("Delete account")}
        >
          <span>Delete account</span>
          <span>›</span>
        </button>
      </section>

      <section className="settings-group">
        <h2>App</h2>

        <div className="settings-row">
          <span>Appearance</span>
          <ThemeToggle />
        </div>

        <button
          type="button"
          className="settings-row"
          onClick={() => goComingSoon("Language")}
        >
          <span>Language</span>
          <span>English ›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/help-support")}
        >
          <span>Help & support</span>
          <span>›</span>
        </button>
      </section>

      <section className="settings-group">
        <h2>About</h2>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/legal")}
        >
          <span>Terms & privacy policy</span>
          <span>›</span>
        </button>

        <div className="settings-row">
          <span>Version</span>
          <span>1.0.0</span>
        </div>
      </section>

      <button type="button" className="profile-logout" onClick={handleLogout}>
        Log out
      </button>
    </div>
  );
}

export default Profile;