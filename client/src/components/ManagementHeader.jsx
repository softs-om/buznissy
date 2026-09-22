import { useNavigate } from "react-router-dom";

function ManagementHeader({ title, description }) {
  const navigate = useNavigate();

  return (
    <header className="management-header">
      <button
        type="button"
        className="management-back"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ←
      </button>

      <div>
        <h1>{title}</h1>

        {description && (
          <p>{description}</p>
        )}
      </div>
    </header>
  );
}

export default ManagementHeader;