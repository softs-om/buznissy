import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../components/Button";
import Input from "../components/Input";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to log in. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-screen">
      <div className="app-container flex min-h-screen flex-col">

        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            <p className="text-small text-muted">Buznissy</p>

            <h1 className="text-title mt-3">
              Welcome back
            </h1>

            <p className="text-body text-muted mt-2">
              Log in to manage your business.
            </p>

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
            >
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-small underline"
                >
                  Forgot password?
                </Link>
              </div>

              {message && (
                <p role="alert" className="message-error">
                  {message}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <p className="text-small text-muted mt-6 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Login;