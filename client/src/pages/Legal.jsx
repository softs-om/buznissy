import { useNavigate } from "react-router-dom";

const openExternal = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const documents = [
  { label: "Terms & conditions", url: "https://buznissy.com/legal/terms" },
  { label: "Privacy policy", url: "https://buznissy.com/legal/privacy" },
  {
    label: "Merchant agreement",
    url: "https://buznissy.com/legal/merchant-agreement",
  },
  {
    label: "Cancellation & refund policy",
    url: "https://buznissy.com/legal/refunds",
  },
];

function Legal() {
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
        <p className="section-eyebrow">ABOUT</p>
        <h1>Terms & privacy</h1>
      </header>

      <section className="settings-group">
        <h2>Legal documents</h2>

        {documents.map((doc) => (
          <button
            key={doc.url}
            type="button"
            className="settings-row"
            onClick={() => openExternal(doc.url)}
          >
            <span>{doc.label}</span>
            <span>›</span>
          </button>
        ))}
      </section>
    </div>
  );
}

export default Legal;