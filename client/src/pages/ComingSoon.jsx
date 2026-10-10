import { useLocation, useNavigate } from "react-router-dom";

function ComingSoon() {
  const navigate = useNavigate();
  const location = useLocation();
  const feature = location.state?.feature || "This feature";

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
        <p className="section-eyebrow">COMING SOON</p>
        <h1>{feature}</h1>
      </header>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 14,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#EEF2FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#2F6FED" strokeWidth="1.6" />
            <path
              d="M12 7v5l3.5 2"
              stroke="#2F6FED"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p style={{ color: "#6B7280", fontSize: 15, maxWidth: 280, margin: 0 }}>
          {feature} is on its way. We are working on it and it will be ready
          soon.
        </p>
      </div>
    </div>
  );
}

export default ComingSoon;