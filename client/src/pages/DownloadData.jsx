import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "../context/useBusiness";
import { getBusiness } from "../services/api";

function DownloadData() {
  const navigate = useNavigate();
  const { activeBusiness } = useBusiness();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      // Never export credentials, even if they ended up in the stored user.
      const { password, token, ...account } = storedUser;

      let business = null;
      if (activeBusiness?.id) {
        const response = await getBusiness(activeBusiness.id);
        business = response.data?.business || response.data;
      }

      const exportData = {
        exportedAt: new Date().toISOString(),
        account,
        plan: localStorage.getItem("selectedPlan"),
        business,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "buznissy-my-data.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setDone(true);
    } catch (err) {
      console.error("Could not export data:", err);
      setError("Could not prepare your data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <p className="section-eyebrow">DATA & PRIVACY</p>
        <h1>Download my data</h1>
      </header>

      <section className="settings-group">
        <h2>Export</h2>

        <p style={{ margin: "0 0 16px", fontSize: 15, opacity: 0.75 }}>
          Download a copy of your account details, your plan and your business
          profile (including contact information and links) as a JSON file.
        </p>

        <button
          type="button"
          className="button button-brand"
          style={{ width: "100%" }}
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? "Preparing..." : "Download my data"}
        </button>

        {done && (
          <p className="message-success" role="status" style={{ marginTop: 12 }}>
            Your file was downloaded.
          </p>
        )}

        {error && (
          <p className="message-error" role="alert" style={{ marginTop: 12 }}>
            {error}
          </p>
        )}
      </section>
    </div>
  );
}

export default DownloadData;