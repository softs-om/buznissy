import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBusiness } from "../context/useBusiness";
import { createService, getCategories } from "../services/api";

function CreateEntrepreneurService() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activeBusiness } = useBusiness();

  const passedCategoryId = searchParams.get("categoryId");

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    serviceType: "",
    categoryId: "",
    duration: "",
    conditions: "",
    price: "",
    discount: "",
    location: "",
    sampleLink: "",
  });

  const [addOns, setAddOns] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [customFields, setCustomFields] = useState([]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!activeBusiness?.id) return;

    const loadCategories = async () => {
      try {
        const response = await getCategories(activeBusiness.id);
        const loadedCategories = response.data || [];

        setCategories(loadedCategories);

        // Automatically select the category from Products & Services
        if (passedCategoryId) {
          setForm((current) => ({
            ...current,
            categoryId: passedCategoryId,
          }));
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Could not load categories.");
      }
    };

    loadCategories();
  }, [activeBusiness?.id, passedCategoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a service title.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createService({
        title: form.title.trim(),
        description: form.description.trim() || null,
        serviceType: "SERVICE",
        price: form.price === "" ? null : Number(form.price),
        categoryId: form.categoryId,
      });

      navigate("/business/items");
    } catch (err) {
      console.error("Failed to create service:", err);
      setError(err.response?.data?.message || "Could not create service.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-screen">
      <div className="app-page create-listing-page">
        <button
          type="button"
          className="page-back-button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          ‹
        </button>

        <header className="create-listing-header">
          <p className="management-eyebrow">SERVICE</p>
          <h1>Create service</h1>
          <p>Add a service customers can view and book.</p>
        </header>

        <form className="create-listing-form" onSubmit={handleSubmit}>
          <section className="create-form-section">
            <h2>Basic information</h2>

            <label>
              <span>Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Hair styling"
              />
            </label>

            <label>
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your service"
                rows="5"
              />
            </label>

            <label>
              <span>Type of service</span>
              <input
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                placeholder="e.g. Consultation, therapy, meeting"
              />
            </label>

            <label>
              <span>Category</span>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="create-form-section">
            <h2>Availability</h2>

            <label>
              <span>Duration</span>

              <div className="input-with-suffix">
                <input
                  type="number"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="60"
                />
                <span>min</span>
              </div>
            </label>

            <label>
              <span>Location</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Add location or address"
              />
            </label>

            <div className="dynamic-block">
              <div className="dynamic-heading">
                <span>Available time slots</span>

                <button
                  type="button"
                  onClick={() =>
                    setTimeSlots([
                      ...timeSlots,
                      { date: "", startTime: "", endTime: "" },
                    ])
                  }
                >
                  + Add slot
                </button>
              </div>

              {timeSlots.map((slot, index) => (
                <div className="slot-row" key={index}>
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => {
                      const updated = [...timeSlots];
                      updated[index].date = e.target.value;
                      setTimeSlots(updated);
                    }}
                  />

                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => {
                      const updated = [...timeSlots];
                      updated[index].startTime = e.target.value;
                      setTimeSlots(updated);
                    }}
                  />

                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => {
                      const updated = [...timeSlots];
                      updated[index].endTime = e.target.value;
                      setTimeSlots(updated);
                    }}
                  />

                  <button
                    type="button"
                    className="remove-dynamic"
                    onClick={() =>
                      setTimeSlots(timeSlots.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="create-form-section">
            <h2>Pricing</h2>

            <label>
              <span>Price (OMR)</span>
              <input
                type="number"
                step="0.001"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.000"
              />
            </label>

            <label>
              <span>Discount (%)</span>
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Optional"
              />
            </label>

            <div className="dynamic-block">
              <div className="dynamic-heading">
                <span>Additional features</span>

                <button
                  type="button"
                  onClick={() =>
                    setAddOns([...addOns, { name: "", price: "" }])
                  }
                >
                  + Add feature
                </button>
              </div>

              {addOns.map((addOn, index) => (
                <div className="addon-row" key={index}>
                  <input
                    placeholder="Feature name"
                    value={addOn.name}
                    onChange={(e) => {
                      const updated = [...addOns];
                      updated[index].name = e.target.value;
                      setAddOns(updated);
                    }}
                  />

                  <input
                    type="number"
                    step="0.001"
                    placeholder="Price"
                    value={addOn.price}
                    onChange={(e) => {
                      const updated = [...addOns];
                      updated[index].price = e.target.value;
                      setAddOns(updated);
                    }}
                  />

                  <button
                    type="button"
                    className="remove-dynamic"
                    onClick={() =>
                      setAddOns(addOns.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="create-form-section">
            <h2>Media & details</h2>

            <label>
              <span>Photos & videos</span>
              <input type="file" accept="image/*,video/*" multiple />
            </label>

            <label>
              <span>Sample link (optional)</span>
              <input
                type="url"
                name="sampleLink"
                value={form.sampleLink}
                onChange={handleChange}
                placeholder="https://"
              />
            </label>

            <label>
              <span>Conditions</span>
              <textarea
                name="conditions"
                value={form.conditions}
                onChange={handleChange}
                placeholder="Add conditions or requirements"
                rows="4"
              />
            </label>
          </section>

          <section className="create-form-section">
            <div className="dynamic-heading">
              <div>
                <h2>More information</h2>
                <small>Add anything specific to your service.</small>
              </div>

              <button
                type="button"
                onClick={() =>
                  setCustomFields([...customFields, { title: "", value: "" }])
                }
              >
                + Add more
              </button>
            </div>

            {customFields.map((field, index) => (
              <div className="custom-field-row" key={index}>
                <input
                  placeholder="Title"
                  value={field.title}
                  onChange={(e) => {
                    const updated = [...customFields];
                    updated[index].title = e.target.value;
                    setCustomFields(updated);
                  }}
                />

                <input
                  placeholder="Information"
                  value={field.value}
                  onChange={(e) => {
                    const updated = [...customFields];
                    updated[index].value = e.target.value;
                    setCustomFields(updated);
                  }}
                />

                <button
                  type="button"
                  className="remove-dynamic"
                  onClick={() =>
                    setCustomFields(customFields.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="create-form-actions">
            <button
              type="button"
              className="button create-cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button create-save-button"
              disabled={saving}
            >
              {saving ? "Creating..." : "Create service"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateEntrepreneurService;
