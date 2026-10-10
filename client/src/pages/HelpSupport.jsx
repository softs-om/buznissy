import { useNavigate } from "react-router-dom";

const SUPPORT_EMAIL = "humaid@buznissy.com";

const openExternal = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

function HelpSupport() {
  const navigate = useNavigate();

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
        <p className="section-eyebrow">APP</p>
        <h1>Help & support</h1>
      </header>

      <section className="settings-group">
        <h2>Get help</h2>

        <button
          type="button"
          className="settings-row"
          onClick={() => openExternal("https://buznissy.com/faq")}
        >
          <span>Frequently asked questions</span>
          <span>›</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => {
            window.location.href = `mailto:${SUPPORT_EMAIL}`;
          }}
        >
          <span>Email support</span>
          <span>{SUPPORT_EMAIL}</span>
        </button>

        <button
          type="button"
          className="settings-row"
          onClick={() => openExternal("https://www.instagram.com/buznissy.om")}
        >
          <span>Instagram</span>
          <span>@buznissy.om</span>
        </button>
      </section>
    </div>
  );
}

export default HelpSupport;