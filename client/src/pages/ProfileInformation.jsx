import { useNavigate } from "react-router-dom";

function ProfileInformation() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="app-page">
      <header className="page-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            marginBottom: 12,
            fontSize: 15,
            color: "#2F6FED",
            cursor: "pointer",
          }}
        >
          ‹ Back
        </button>
        <p className="section-eyebrow">ACCOUNT</p>
        <h1>Profile information</h1>
      </header>

      <section className="settings-group">
        <h2>Details</h2>

        <div className="settings-row">
          <span>Name</span>
          <span>{user.name || "Merchant"}</span>
        </div>

        <div className="settings-row">
          <span>Email</span>
          <span>{user.email || "Buznissy account"}</span>
        </div>

        <button
          type="button"
          className="settings-row"
          onClick={() => navigate("/edit-profile")}
        >
          <span>Edit name</span>
          <span>›</span>
        </button>
      </section>
    </div>
  );
}

export default ProfileInformation;