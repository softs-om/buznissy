import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Welcome() {
  return (
    <main className="app-screen">
      <div className="app-container flex min-h-screen flex-col">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            <p className="text-small text-muted">Buznissy</p>

            <h1 className="text-display mt-3">
              Build your business online
            </h1>

            <p className="text-body text-muted mt-4">
              Create your store, publish it, and start receiving orders.
            </p>

            <div className="mt-10 space-y-3">
              <Link to="/register" className="button button-primary w-full">
                Create merchant account
              </Link>

              <Link to="/login" className="button button-secondary w-full">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Welcome;