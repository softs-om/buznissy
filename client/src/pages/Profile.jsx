import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
        </div>
      </section>

      <section className="settings-group">
        <h2>Account</h2>

        <button type="button" className="settings-row">
          <span>Profile information</span>
          <span>›</span>
        </button>

        <button type="button" className="settings-row">
          <span>Subscription</span>
          <span>›</span>
        </button>

        <button type="button" className="settings-row">
          <span>Notifications</span>
          <span>›</span>
        </button>
      </section>

      <section className="settings-group">
        <h2>App</h2>

        <div className="settings-row">
          <span>Appearance</span>
          <ThemeToggle />
        </div>

        <button type="button" className="settings-row">
          <span>Language</span>
          <span>English ›</span>
        </button>

        <button type="button" className="settings-row">
          <span>Help & support</span>
          <span>›</span>
        </button>
      </section>

      <button
        type="button"
        className="profile-logout"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}

export default Profile;