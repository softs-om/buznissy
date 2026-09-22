import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  getCategories,
  updateCategory,
  getMyBusinesses,
} from "../services/api";

import ManagementHeader from "../components/ManagementHeader";

function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editing = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [businessId, setBusinessId] = useState(null);

useEffect(() => {
  const loadBusiness = async () => {
    try {
      const response = await getMyBusinesses();
      const business = response.data?.[0];

      if (business) {
        setBusinessId(business.id);
      } else {
        setError("No business found.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load business.");
    }
  };

  loadBusiness();
}, []);

  useEffect(() => {
    if (!editing || !businessId) return;

    const loadCategory = async () => {
      try {
        const response = await getCategories(businessId);

        const category = response.data.find(
          (currentCategory) => currentCategory.id === id,
        );

        if (!category) {
          setError("Category could not be found.");
          return;
        }

        setName(category.name || "");
        setDescription(category.description || "");
      } catch (err) {
        console.error(err);
        setError("Could not load category.");
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [businessId, editing, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!businessId) {
      setError("Business information could not be found.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editing) {
        await updateCategory(id, data);
      } else {
        await createCategory({
          ...data,
          businessId,
        });
      }

      navigate("/business/items");
    } catch (err) {
      console.error(err);

      setError(err.response?.data?.message || "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="app-screen">
        <div className="app-page management-page">
          <p>Loading category...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title={editing ? "Edit Category" : "New Category"}
          description={
            editing
              ? "Update how this category appears."
              : "Organize your products and services."
          }
        />

        <form className="management-form" onSubmit={handleSubmit}>
          <div className="setup-field">
            <label className="field-label" htmlFor="category-name">
              Category name
            </label>

            <input
              id="category-name"
              type="text"
              className="field-input"
              placeholder="e.g. Hair Services"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className="setup-field">
            <label className="field-label" htmlFor="category-description">
              Description
              <span className="text-muted"> (optional)</span>
            </label>

            <textarea
              id="category-description"
              className="field-input setup-textarea"
              placeholder="Describe what customers can find here"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="4"
              maxLength={300}
            />
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <div className="setup-actions">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => navigate("/business/items")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="button button-brand setup-primary-action"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Create category"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CategoryForm;
