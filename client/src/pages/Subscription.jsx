import { useNavigate } from "react-router-dom";

// Same plan data as Plans.jsx — kept here so this page can show price and
// description for whichever plan name is stored in localStorage.
const plans = [
  {
    name: "Starter",
    price: "3.9",
    description: "For getting your business online.",
  },
  {
    name: "Business",
    price: "6.9",
    description: "For growing businesses.",
  },
  {
    name: "Pro",
    price: "11.9",
    description: "For businesses that need more.",
  },
];

function Subscription() {
  const navigate = useNavigate();
  const selectedPlanName = localStorage.getItem("selectedPlan");
  const currentPlan = plans.find((plan) => plan.name === selectedPlanName);

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
        <h1>Subscription</h1>
      </header>

      {currentPlan ? (
        <section className="settings-group">
          <h2>Current plan</h2>

          <div className="settings-row">
            <span>Plan</span>
            <span>{currentPlan.name}</span>
          </div>

          <div className="settings-row">
            <span>Price</span>
            <span>{currentPlan.price} OMR / month</span>
          </div>

          <div className="settings-row">
            <span>Details</span>
            <span>{currentPlan.description}</span>
          </div>

          <button
            type="button"
            className="settings-row"
            onClick={() => navigate("/plans", { state: { from: "subscription" } })}
          >
            <span>Change plan</span>
            <span>›</span>
          </button>
        </section>
      ) : (
        <section className="settings-group">
          <h2>Current plan</h2>

          <div className="settings-row">
            <span>Plan</span>
            <span>No plan selected</span>
          </div>

          <button
            type="button"
            className="settings-row"
            onClick={() => navigate("/plans", { state: { from: "subscription" } })}
          >
            <span>Choose a plan</span>
            <span>›</span>
          </button>
        </section>
      )}
    </div>
  );
}

export default Subscription;