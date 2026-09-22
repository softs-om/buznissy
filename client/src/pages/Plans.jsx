import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

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
    featured: true,
  },
  {
    name: "Pro",
    price: "11.9",
    description: "For businesses that need more.",
  },
];

function Plans() {
  const navigate = useNavigate();

  const handleSelect = (plan) => {
    // Temporary until the owner confirms real plans/prices.
    localStorage.setItem("selectedPlan", plan.name);
    navigate("/dashboard");
  };

  return (
    <main className="app-screen">
      <div className="app-container">
        <div className="setup-topbar">
          <button
            type="button"
            className="setup-save-link"
            onClick={() => navigate("/business-setup")}
          >
            Back
          </button>

          <ThemeToggle />
        </div>

        <header className="setup-header">
          <p className="text-small text-muted">
            Almost there
          </p>

          <h1 className="text-title" style={{ marginTop: "0.4rem" }}>
            Choose your plan
          </h1>

          <p className="text-body text-muted setup-description">
            Choose the plan that works for your business.
            You can change it later.
          </p>
        </header>

        <div style={{ display: "grid", gap: "1rem" }}>
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`app-card ${
                plan.featured ? "theme-option-active" : ""
              }`}
              style={{ padding: "1.25rem" }}
            >
              {plan.featured && (
                <span className="payment-status">
                  Popular
                </span>
              )}

              <h2
                className="text-heading"
                style={{ marginTop: plan.featured ? "0.75rem" : 0 }}
              >
                {plan.name}
              </h2>

              <p
                className="text-body text-muted"
                style={{ marginTop: "0.35rem" }}
              >
                {plan.description}
              </p>

              <p
                className="text-title"
                style={{ marginTop: "1rem" }}
              >
                {plan.price} OMR
                <span className="text-small text-muted">
                  {" "}
                  / month
                </span>
              </p>

              <button
                type="button"
                className={`button ${
                  plan.featured
                    ? "button-brand"
                    : "button-secondary"
                }`}
                style={{
                  width: "100%",
                  marginTop: "1.25rem",
                }}
                onClick={() => handleSelect(plan)}
              >
                Choose {plan.name}
              </button>
            </article>
          ))}
        </div>

        <p
          className="text-small text-muted"
          style={{
            marginTop: "1.25rem",
            textAlign: "center",
          }}
        >
          Development prices only. Final Buznissy plans
          will be confirmed before launch.
        </p>
      </div>
    </main>
  );
}

export default Plans;