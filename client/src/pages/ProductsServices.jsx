import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagementHeader from "../components/ManagementHeader";

import {
  getMyBusinesses,
  getCategories,
  getServices,
  deleteCategory,
  deleteService,
} from "../services/api";

function ProductsServices() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD BUSINESS + CATEGORIES + ITEMS
  // --------------------------------------------------

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");

        // Get the logged-in user's business
        const businessResponse = await getMyBusinesses();
        const businesses = businessResponse.data;

        if (!businesses || businesses.length === 0) {
          setError("Business information could not be found.");
          return;
        }

        const businessId = businesses[0].id;

        // Get categories
        const categoryResponse = await getCategories(businessId);
        const loadedCategories = categoryResponse.data || [];

        setCategories(loadedCategories);

        // If there are no categories, stop here
        if (loadedCategories.length === 0) {
          setItems([]);
          return;
        }

        // Get items for every category
        const serviceRequests = loadedCategories.map((category) =>
          getServices(category.id),
        );

        const serviceResponses = await Promise.all(serviceRequests);

        const loadedItems = serviceResponses.flatMap(
          (response) => response.data || [],
        );

        setItems(loadedItems);
      } catch (err) {
        console.error("Failed to load products/services:", err);
        setError("Could not load your products and services.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // --------------------------------------------------
  // SHOW MORE / SHOW LESS
  // --------------------------------------------------

  const toggleCategory = (categoryId) => {
    setExpandedCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  };

  // --------------------------------------------------
  // TAB FILTER
  // --------------------------------------------------

  const matchesTab = (item) => {
    if (activeTab === "all") {
      return true;
    }

    if (activeTab === "products") {
      return item.serviceType === "PRODUCT";
    }

    if (activeTab === "services") {
      return item.serviceType === "SERVICE";
    }

    return true;
  };

  // --------------------------------------------------
  // DELETE CATEGORY
  // --------------------------------------------------

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = window.confirm(
      "Delete this category and all of its items?",
    );

    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);

      setCategories((current) =>
        current.filter((category) => category.id !== categoryId),
      );

      setItems((current) =>
        current.filter((item) => item.categoryId !== categoryId),
      );
    } catch (err) {
      console.error("Failed to delete category:", err);
      window.alert("Could not delete category.");
    }
  };

  // --------------------------------------------------
  // DELETE ITEM
  // --------------------------------------------------

  const handleDeleteItem = async (itemId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item?",
    );

    if (!confirmed) return;

    try {
      await deleteService(itemId);

      setItems((current) =>
        current.filter((item) => item.id !== itemId),
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
      window.alert("Could not delete item.");
    }
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title="Products & Services"
          description="Manage everything your business sells."
        />

        {/* Tabs */}

        <div className="item-tabs">
          {["all", "products", "services"].map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Add Category */}

        <button
          type="button"
          className="add-category-button"
          onClick={() => navigate("/business/categories/new")}
        >
          <span>＋</span>
          Add category
        </button>

        {/* Loading */}

        {loading && (
          <section className="management-empty">
            <p>Loading your items...</p>
          </section>
        )}

        {/* Error */}

        {!loading && error && (
          <section className="management-empty">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </section>
        )}

        {/* No Categories */}

        {!loading && !error && categories.length === 0 && (
          <section className="management-empty">
            <h2>No categories yet</h2>

            <p>
              Create your first category to organize your products
              and services.
            </p>

            <button
              type="button"
              className="button button-primary"
              onClick={() => navigate("/business/categories/new")}
            >
              Create category
            </button>
          </section>
        )}

        {/* Categories */}

        {!loading && !error && categories.length > 0 && (
          <section className="category-list">
            {categories.map((category) => {
              const categoryItems = items.filter(
                (item) =>
                  item.categoryId === category.id &&
                  matchesTab(item),
              );

              const expanded =
                expandedCategories[category.id] === true;

              const visibleItems = expanded
                ? categoryItems
                : categoryItems.slice(0, 3);

              return (
                <article
                  className="category-card"
                  key={category.id}
                >
                  {/* Category Header */}

                  <div className="category-card-header">
                    <div>
                      <h2>{category.name}</h2>

                      {category.description && (
                        <p className="text-small text-muted">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <div className="category-actions">
                      <button
                        type="button"
                        className="category-edit-button"
                        onClick={() =>
                          navigate(
                            `/business/categories/${category.id}/edit`,
                          )
                        }
                        aria-label={`Edit ${category.name}`}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="category-delete-button"
                        onClick={() =>
                          handleDeleteCategory(category.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Category Items */}

                  <div className="category-items">
                    {categoryItems.length === 0 ? (
                      <p className="text-small text-muted">
                        No{" "}
                        {activeTab === "all"
                          ? "items"
                          : activeTab}{" "}
                        in this category yet.
                      </p>
                    ) : (
                      visibleItems.map((item) => (
                        <article
                          className="category-item"
                          key={item.id}
                        >
                          <div className="category-item-info">
                            <p className="category-item-type">
                              {item.serviceType === "PRODUCT"
                                ? "Product"
                                : "Service"}
                            </p>

                            <h3>{item.title}</h3>

                            {item.description && (
                              <p className="text-small text-muted">
                                {item.description}
                              </p>
                            )}
                          </div>

                          <div className="category-item-side">
                            <strong>
                              {item.price != null
                                ? `${item.price} OMR`
                                : "No price"}
                            </strong>

                            <button
                              type="button"
                              className="item-edit-button"
                              onClick={() =>
                                navigate(
                                  `/business/items/${item.id}/edit?categoryId=${category.id}`,
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="item-delete-button"
                              onClick={() =>
                                handleDeleteItem(item.id)
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </article>
                      ))
                    )}
                  </div>

                  {/* Show More */}

                  {categoryItems.length > 3 && (
                    <button
                      type="button"
                      className="category-show-button"
                      onClick={() =>
                        toggleCategory(category.id)
                      }
                    >
                      {expanded
                        ? "Show less"
                        : `Show ${categoryItems.length - 3} more`}
                    </button>
                  )}

                  {/* Add Item */}

                  <button
                    type="button"
                    className="category-add-item"
                    onClick={() =>
                      navigate(
                        `/business/items/new?categoryId=${category.id}`,
                      )
                    }
                  >
                    ＋ Add item
                  </button>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductsServices;