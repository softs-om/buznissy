import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="app-screen">
      <div className="app-container flex min-h-screen flex-col">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            <p className="text-small text-muted">Welcome to Buznissy</p>

            <h1 className="text-display mt-3">Ready to build your business?</h1>

            <p className="text-body text-muted mt-4">
              Create your business, add your products or services, and start
              building your online presence.
            </p>

            <div className="mt-10 space-y-3">
              <button
                type="button"
                className="button button-primary w-full"
                onClick={() => navigate("/business-setup")}
              >
                Start creating my business
              </button>

              <button
                type="button"
                className="button button-secondary w-full"
                onClick={() => navigate("/home")}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Welcome;
