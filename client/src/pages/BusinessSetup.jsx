import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

const STORAGE_KEY = "buznissyBusinessSetup";

const emptyListing = {
  id: Date.now(),
  type: "PRODUCT",
  name: "",
  price: "",
  description: "",
  quantity: "",
  duration: "",
  image: null,
};

const initialData = {
  name: "",
  sellingType: "",
  industry: "",
  description: "",

  logo: null,
  coverImage: null,
  theme: "minimal",

  listings: [{ ...emptyListing }],

  language: "both",
  currency: "OMR",
};

const stepContent = {
  1: {
    title: "Tell us about your business",
    description: "Start with the basic information about your business.",
  },
  2: {
    title: "Build your brand",
    description: "Add your identity and choose how your website should feel.",
  },
  3: {
    title: "Add what you sell",
    description: "Add your first products or services. You can add more later.",
  },
  4: {
    title: "Store settings",
    description: "Choose the essentials customers will use on your website.",
  },
  5: {
    title: "Your website is ready",
    description: "Preview your storefront before choosing a plan.",
  },
};

function BusinessSetup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return 1;

    try {
      return JSON.parse(saved).step || 1;
    } catch {
      return 1;
    }
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialData;

    try {
      const parsed = JSON.parse(saved);

      return {
        ...initialData,
        ...parsed.formData,

        // Files cannot be restored from localStorage.
        logo: null,
        coverImage: null,

        listings: parsed.formData?.listings?.map((listing) => ({
          ...listing,
          image: null,
        })) || [{ ...emptyListing }],
      };
    } catch {
      return initialData;
    }
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const progress = `${step * 20}%`;

  const saveProgress = (showMessage = true) => {
    const safeData = {
      ...formData,
      logo: null,
      coverImage: null,
      listings: formData.listings.map((listing) => ({
        ...listing,
        image: null,
      })),
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        formData: safeData,
      }),
    );

    if (showMessage) {
      setSavedMessage("Progress saved");

      window.setTimeout(() => {
        setSavedMessage("");
      }, 1800);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      [name]: file,
    }));

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (name === "logo") {
      setLogoPreview(previewUrl);
    }

    if (name === "coverImage") {
      setCoverPreview(previewUrl);
    }
  };

  const handleListingChange = (id, field, value) => {
    setFormData((previous) => ({
      ...previous,
      listings: previous.listings.map((listing) =>
        listing.id === id ? { ...listing, [field]: value } : listing,
      ),
    }));
  };

  const handleListingImage = (id, file) => {
    setFormData((previous) => ({
      ...previous,
      listings: previous.listings.map((listing) =>
        listing.id === id
          ? {
              ...listing,
              image: file,
              imagePreview: file ? URL.createObjectURL(file) : "",
            }
          : listing,
      ),
    }));
  };

  const addListing = () => {
    setFormData((previous) => ({
      ...previous,
      listings: [
        ...previous.listings,
        {
          ...emptyListing,
          id: Date.now(),
        },
      ],
    }));
  };

  const removeListing = (id) => {
    setFormData((previous) => ({
      ...previous,
      listings: previous.listings.filter((listing) => listing.id !== id),
    }));
  };

  const handleContinue = (event) => {
    event.preventDefault();

    saveProgress(false);

    if (step < 5) {
      setStep((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveAndExit = () => {
    saveProgress(false);
    navigate("/dashboard");
  };

  const handlePlans = () => {
    saveProgress(false);
    navigate("/plans");
  };

  const themeLabel = useMemo(() => {
    const themes = {
      minimal: "Minimal",
      elegant: "Elegant",
      bold: "Bold",
    };

    return themes[formData.theme] || "Minimal";
  }, [formData.theme]);

  return (
    <main className="app-screen">
      <div className="app-container setup-container">
        {/* Top controls */}
        <div className="setup-topbar">
          <button
            type="button"
            className="setup-save-link"
            onClick={handleSaveAndExit}
          >
            Save & exit
          </button>

          <ThemeToggle />
        </div>

        {/* Progress */}
        <div className="setup-progress-header">
          <p className="text-small text-muted">Step {step} of 5</p>

          {savedMessage && (
            <p
              className="text-small"
              role="status"
              style={{ color: "var(--success)" }}
            >
              {savedMessage}
            </p>
          )}
        </div>

        <div
          className="setup-progress"
          aria-label={`Business setup progress: step ${step} of 5`}
        >
          <div className="setup-progress-value" style={{ width: progress }} />
        </div>

        {/* Dynamic heading */}
        <header className="setup-header">
          <h1 className="text-title">{stepContent[step].title}</h1>

          <p className="text-body text-muted setup-description">
            {stepContent[step].description}
          </p>
        </header>

        <form onSubmit={handleContinue}>
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="setup-field">
                <label className="field-label" htmlFor="name">
                  Business name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  className="field-input"
                  placeholder="Enter your business name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="setup-field">
                <label className="field-label" htmlFor="sellingType">
                  What do you sell?
                </label>

                <select
                  id="sellingType"
                  name="sellingType"
                  className="field-input"
                  value={formData.sellingType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select what you sell</option>
                  <option value="PRODUCT">Products</option>
                  <option value="SERVICE">Services</option>
                  <option value="BOTH">Products & Services</option>
                </select>
              </div>

              <div className="setup-field">
                <label className="field-label" htmlFor="industry">
                  Industry
                </label>

                <input
                  id="industry"
                  name="industry"
                  type="text"
                  className="field-input"
                  placeholder="e.g. Fashion, Beauty, Food"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="setup-field setup-field-last">
                <label className="field-label" htmlFor="description">
                  Business description
                </label>

                <textarea
                  id="description"
                  name="description"
                  className="field-input setup-textarea"
                  placeholder="Tell customers a little about your business"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="setup-field">
                <label className="field-label" htmlFor="logo">
                  Business logo
                </label>

                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Business logo preview"
                    className="setup-logo-preview"
                  />
                )}

                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="field-input"
                  onChange={handleFileChange}
                />
              </div>

              <div className="setup-field">
                <label className="field-label" htmlFor="coverImage">
                  Cover image
                </label>

                {coverPreview && (
                  <img
                    src={coverPreview}
                    alt="Business cover preview"
                    className="setup-cover-preview"
                  />
                )}

                <input
                  id="coverImage"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                  className="field-input"
                  onChange={handleFileChange}
                />
              </div>

              <fieldset className="setup-fieldset">
                <legend className="field-label">Website style</legend>

                <div className="theme-grid">
                  {[
                    {
                      value: "minimal",
                      label: "Minimal",
                      text: "Clean and simple",
                    },
                    {
                      value: "elegant",
                      label: "Elegant",
                      text: "Refined and polished",
                    },
                    {
                      value: "bold",
                      label: "Bold",
                      text: "Strong and expressive",
                    },
                  ].map((theme) => (
                    <label
                      key={theme.value}
                      className={`theme-option ${
                        formData.theme === theme.value
                          ? "theme-option-active"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={formData.theme === theme.value}
                        onChange={handleChange}
                        className="theme-radio"
                      />

                      <span className="text-heading">{theme.label}</span>

                      <span className="text-small text-muted">
                        {theme.text}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              {formData.listings.map((listing, index) => (
                <section className="app-card listing-card" key={listing.id}>
                  <div className="listing-card-header">
                    <h2 className="text-heading">
                      {index === 0
                        ? "Your first listing"
                        : `Listing ${index + 1}`}
                    </h2>

                    {formData.listings.length > 1 && (
                      <button
                        type="button"
                        className="setup-remove"
                        onClick={() => removeListing(listing.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="setup-field">
                    <label className="field-label">Type</label>

                    <select
                      className="field-input"
                      value={listing.type}
                      onChange={(event) =>
                        handleListingChange(
                          listing.id,
                          "type",
                          event.target.value,
                        )
                      }
                    >
                      <option value="PRODUCT">Product</option>
                      <option value="SERVICE">Service</option>
                    </select>
                  </div>

                  <div className="setup-field">
                    <label className="field-label">Image</label>

                    {listing.imagePreview && (
                      <img
                        src={listing.imagePreview}
                        alt=""
                        className="listing-image-preview"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      className="field-input"
                      onChange={(event) =>
                        handleListingImage(
                          listing.id,
                          event.target.files?.[0] || null,
                        )
                      }
                    />
                  </div>

                  <div className="setup-field">
                    <label className="field-label">Name</label>

                    <input
                      type="text"
                      className="field-input"
                      placeholder={
                        listing.type === "PRODUCT"
                          ? "Product name"
                          : "Service name"
                      }
                      value={listing.name}
                      onChange={(event) =>
                        handleListingChange(
                          listing.id,
                          "name",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="setup-field">
                    <label className="field-label">Price (OMR)</label>

                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      inputMode="decimal"
                      className="field-input"
                      placeholder="0.000"
                      value={listing.price}
                      onChange={(event) =>
                        handleListingChange(
                          listing.id,
                          "price",
                          event.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  {listing.type === "PRODUCT" ? (
                    <div className="setup-field">
                      <label className="field-label">Quantity</label>

                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        className="field-input"
                        placeholder="Available quantity"
                        value={listing.quantity}
                        onChange={(event) =>
                          handleListingChange(
                            listing.id,
                            "quantity",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div className="setup-field">
                      <label className="field-label">Duration</label>

                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. 60 minutes"
                        value={listing.duration}
                        onChange={(event) =>
                          handleListingChange(
                            listing.id,
                            "duration",
                            event.target.value,
                          )
                        }
                      />
                    </div>
                  )}

                  <div>
                    <label className="field-label">Description</label>

                    <textarea
                      className="field-input setup-textarea-small"
                      placeholder="Short description"
                      value={listing.description}
                      onChange={(event) =>
                        handleListingChange(
                          listing.id,
                          "description",
                          event.target.value,
                        )
                      }
                      rows="3"
                    />
                  </div>
                </section>
              ))}

              <button
                type="button"
                className="button button-secondary setup-add-button"
                onClick={addListing}
              >
                + Add another
              </button>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <fieldset className="setup-fieldset">
                <legend className="field-label">Store language</legend>

                <div className="setting-options">
                  {[
                    ["en", "English"],
                    ["ar", "العربية"],
                    ["both", "English + العربية"],
                  ].map(([value, label]) => (
                    <label
                      className={`setting-option ${
                        formData.language === value
                          ? "setting-option-active"
                          : ""
                      }`}
                      key={value}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={value}
                        checked={formData.language === value}
                        onChange={handleChange}
                      />

                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="setup-field">
                <label className="field-label" htmlFor="currency">
                  Currency
                </label>

                <select
                  id="currency"
                  name="currency"
                  className="field-input"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="OMR">OMR — Omani Rial</option>
                </select>
              </div>

              <section className="app-card payment-card">
                <div>
                  <p className="text-small text-muted">Customer payments</p>

                  <h2 className="text-heading payment-title">Online payment</h2>

                  <p className="text-small text-muted payment-copy">
                    Your Buznissy storefront will support secure online checkout
                    through the platform's payment integration.
                  </p>
                </div>

                <span className="payment-status">Included</span>
              </section>
            </>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <>
              <section
                className={`store-preview store-preview-${formData.theme}`}
              >
                <div className="store-preview-browser">
                  <span />
                  <span />
                  <span />
                </div>

                {coverPreview ? (
                  <img src={coverPreview} alt="" className="store-cover" />
                ) : (
                  <div className="store-cover-placeholder" />
                )}

                <div className="store-content">
                  <div className="store-profile">
                    {logoPreview ? (
                      <img src={logoPreview} alt="" className="store-logo" />
                    ) : (
                      <div className="store-logo-placeholder">
                        {formData.name?.charAt(0)?.toUpperCase() || "B"}
                      </div>
                    )}

                    <div>
                      <h2 className="text-heading">
                        {formData.name || "Your Business"}
                      </h2>

                      <p className="text-small text-muted">
                        {formData.industry || "Your industry"} · {themeLabel}
                      </p>
                    </div>
                  </div>

                  {formData.description && (
                    <p className="text-small store-description">
                      {formData.description}
                    </p>
                  )}

                  <div className="preview-listings">
                    {formData.listings
                      .filter((listing) => listing.name)
                      .map((listing) => (
                        <article className="preview-product" key={listing.id}>
                          {listing.imagePreview ? (
                            <img
                              src={listing.imagePreview}
                              alt=""
                              className="preview-product-image"
                            />
                          ) : (
                            <div className="preview-product-image preview-product-placeholder" />
                          )}

                          <div className="preview-product-content">
                            <p className="preview-product-name">
                              {listing.name}
                            </p>

                            <p className="text-small text-muted">
                              {listing.type === "PRODUCT"
                                ? "Product"
                                : "Service"}
                            </p>

                            <strong className="preview-price">
                              {listing.price || "0.000"} OMR
                            </strong>
                          </div>
                        </article>
                      ))}
                  </div>
                </div>
              </section>

              <div className="preview-ready">
                <h2 className="text-heading">Ready to launch?</h2>

                <p className="text-small text-muted">
                  Review your website above. You can go back and change anything
                  before choosing your Buznissy plan.
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="setup-actions">
            {step > 1 && (
              <button
                type="button"
                className="button button-secondary"
                onClick={handleBack}
              >
                Back
              </button>
            )}

            {step < 5 ? (
              <button
                type="submit"
                className="button button-brand setup-primary-action"
              >
                {step === 4 ? "Preview website" : "Continue"}
              </button>
            ) : (
              <button
                type="button"
                className="button button-brand setup-primary-action"
                onClick={handlePlans}
              >
                Confirm & choose plan
              </button>
            )}
          </div>

          {step < 5 && (
            <button
              type="button"
              className="setup-save-bottom"
              onClick={() => saveProgress(true)}
            >
              Save progress
            </button>
          )}
        </form>
      </div>
    </main>
  );
}

export default BusinessSetup;
