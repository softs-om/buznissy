import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import Input from "../components/Input";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const response = await axios.post(
        "http://localhost:5001/api/auth/register",
        {
          ...form,
          role: "OWNER",
        },
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-screen">
      <div className="app-container">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mt-8">
          <p className="text-small text-muted">Buznissy</p>

          <h1 className="text-title mt-3">Create your merchant account</h1>

          <p className="text-body text-muted mt-2">
            Start building your online store.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <Input
              id="name"
              name="name"
              type="text"
              label="Full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />

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
              autoComplete="new-password"
              minLength="8"
              required
              helperText="Use at least 8 characters."
            />

            {message && (
              <p role="alert" className="message-error">
                {message}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-small text-muted mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;