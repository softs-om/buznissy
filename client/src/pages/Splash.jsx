import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 1800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <div
          className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-black text-3xl font-semibold text-white"
          aria-hidden="true"
        >
          B
        </div>

        <h1 className="text-3xl font-semibold text-black">Buznissy</h1>

        <p className="mt-2 text-base text-neutral-600">
          Build your business online
        </p>
      </div>
    </main>
  );
}

export default Splash;