import { useState } from "react";
import ManagementHeader from "../components/ManagementHeader";

const themes = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Bold and contemporary",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined and premium",
  },
];

function ThemeManager() {
  const setup = JSON.parse(localStorage.getItem("buznissySetup") || "{}");

  const initialTheme =
    setup?.formData?.theme?.toLowerCase() ||
    setup?.theme?.toLowerCase() ||
    "minimal";

  const [selectedTheme, setSelectedTheme] = useState(initialTheme);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const existing =
      JSON.parse(localStorage.getItem("buznissySetup") || "{}");

    const updated = {
      ...existing,
      theme: selectedTheme,
      formData: {
        ...(existing.formData || {}),
        theme: selectedTheme,
      },
    };

    localStorage.setItem("buznissySetup", JSON.stringify(updated));

    setSaved(true);

    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title="Theme & appearance"
          description="Choose how your storefront looks."
        />

        <section className="theme-grid">
          {themes.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`theme-choice ${
                selectedTheme === theme.id ? "selected" : ""
              }`}
              onClick={() => setSelectedTheme(theme.id)}
            >
              <div className={`theme-demo theme-demo-${theme.id}`}>
                <div className="theme-demo-header" />
                <div className="theme-demo-hero" />

                <div className="theme-demo-products">
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="theme-choice-info">
                <span>
                  <strong>{theme.name}</strong>
                  <small>{theme.description}</small>
                </span>

                <i className="theme-radio" />
              </div>
            </button>
          ))}
        </section>

        <button
          type="button"
          className="button button-primary management-save"
          onClick={handleSave}
        >
          {saved ? "Saved ✓" : "Save theme"}
        </button>
      </div>
    </main>
  );
}

export default ThemeManager;