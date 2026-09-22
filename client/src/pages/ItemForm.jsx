import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { createService, updateService, getServices } from "../services/api";

function ItemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const editing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [serviceType, setServiceType] = useState("SERVICE");
  const [price, setPrice] = useState("");

  // Only start in loading state when editing AND
  // we actually have the category needed to load the item.
  const [loading, setLoading] = useState(Boolean(id && categoryId));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD ITEM WHEN EDITING
  // --------------------------------------------------

  useEffect(() => {
    if (!editing || !categoryId) {
      return;
    }

    let cancelled = false;

    const loadItem = async () => {
      try {
        const response = await getServices(categoryId);

        if (cancelled) return;

        const item = response.data.find((currentItem) => currentItem.id === id);

        if (!item) {
          setError("Item could not be found.");
          return;
        }

        setTitle(item.title || "");
        setDescription(item.description || "");
        setServiceType(item.serviceType || "SERVICE");
        setPrice(item.price ?? "");
      } catch (err) {
        if (cancelled) return;

        console.error("Failed to load item:", err);
        setError("Could not load item.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadItem();

    return () => {
      cancelled = true;
    };
  }, [editing, id, categoryId]);

  // --------------------------------------------------
  // SAVE ITEM
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a name.");
      return;
    }

    if (!categoryId) {
      setError(
        "Category information is missing. Please go back and select a category.",
      );
      return;
    }

    if (price !== "" && Number(price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        title: title.trim(),
        description: description.trim() || null,
        serviceType,
        price: price === "" ? null : Number(price),
        categoryId,
      };

      if (editing) {
        await updateService(id, data);
      } else {
        await createService(data);
      }

      navigate("/business/items");
    } catch (err) {
      console.error("Failed to save item:", err);

      setError(err.response?.data?.message || "Could not save this item.");
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="app-screen">
        <div className="app-page">
          <p>Loading item...</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  return (
    <main className="app-screen">
      <div className="app-page">
        <header className="page-header">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ←
          </button>

          <div>
            <h1>{editing ? "Edit item" : "Add item"}</h1>

            <p>
              {editing
                ? "Update your product or service."
                : "Add something your business sells."}
            </p>
          </div>
        </header>

        <form className="management-form" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          {/* TYPE */}

          <label>
            Type
            <select
              value={serviceType}
              onChange={(event) => setServiceType(event.target.value)}
            >
              <option value="PRODUCT">Product</option>

              <option value="SERVICE">Service</option>
            </select>
          </label>

          {/* NAME */}

          <label>
            Name
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={
                serviceType === "PRODUCT"
                  ? "e.g. Hair Oil"
                  : "e.g. Hair Styling"
              }
              required
            />
          </label>

          {/* DESCRIPTION */}

          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional description"
              rows="4"
            />
          </label>

          {/* PRICE */}

          <label>
            Price (OMR)
            <input
              type="number"
              min="0"
              step="0.001"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="0.000"
            />
          </label>

          {/* SAVE */}

          <button
            type="submit"
            className="button button-primary"
            disabled={saving || !categoryId}
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Add item"}
          </button>

          {!categoryId && (
            <p className="form-error">
              No category was selected. Go back and add the item from inside a
              category.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default ItemForm;
