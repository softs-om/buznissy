import { useNavigate } from "react-router-dom";

function ManagementHeader({ title, description, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate(-1);
  };

  return (
    <header className="management-header">
      <button
        type="button"
        className="management-back-button"
        onClick={handleBack}
        aria-label="Go back"
      >
        ‹
      </button>

      <div className="management-header-content">
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>
    </header>
  );
}

export default ManagementHeader;