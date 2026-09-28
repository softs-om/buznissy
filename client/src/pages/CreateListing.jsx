import { useNavigate } from "react-router-dom";
import { useBusiness } from "../context/useBusiness";

function CreateListing() {
  const navigate = useNavigate();
  const { activeBusiness } = useBusiness();

  const businessType = activeBusiness?.businessType;

  const handleCreate = () => {
    if (businessType === "TRADER") {
      navigate("/create-product");
      return;
    }

    if (businessType === "ENTREPRENEUR") {
      navigate("/create-entrepreneur-service");
      return;
    }

    if (businessType === "INFLUENCER") {
      navigate("/create-influencer-service");
    }
  };

  return (
    <main className="app-screen">
      <div className="app-page">
        <button
          type="button"
          className="page-back-button"
          onClick={() => navigate(-1)}
        >
          ‹
        </button>

        <p className="eyebrow">CREATE</p>

        <h1>
          {businessType === "TRADER"
            ? "Add product"
            : "Add service"}
        </h1>

        <p>
          {businessType === "TRADER"
            ? "Add a new product to your business."
            : "Create a new service for your customers."}
        </p>

        <button
          type="button"
          className="button button-primary"
          onClick={handleCreate}
        >
          {businessType === "TRADER"
            ? "Create product"
            : "Create service"}
        </button>
      </div>
    </main>
  );
}

export default CreateListing;