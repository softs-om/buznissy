import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagementHeader from "../components/ManagementHeader";
import { getMyBusinesses, getCategories, getServices } from "../services/api";

function ProductsServices() {
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");

        const businessResponse = await getMyBusinesses();
        const businesses = businessResponse.data;

        if (!businesses || businesses.length === 0) {
          setError("Business information could not be found.");
          return;
        }

        const businessId = businesses[0].id;

        const categoryResponse = await getCategories(businessId);
        const loadedCategories = categoryResponse.data;

        setCategories(loadedCategories);

        const serviceRequests = loadedCategories.map((category) =>
          getServices(category.id),
        );

        const serviceResponses = await Promise.all(serviceRequests);

        const loadedItems = serviceResponses.flatMap(
          (response) => response.data,
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

  const toggleCategory = (categoryId) => {
    setExpandedCategories((previous) => ({
      ...previous,
      [categoryId]: !previous[categoryId],
    }));
  };

  return (
    <main className="app-screen">
      <div className="app-page management-page">
        <ManagementHeader
          title="Products & Services"
          description="Manage everything your business sells."
        />

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

        {categories.length > 0 && (
          <div className="category-chips">
            {categories.map((category) => (
              <button key={category.id} type="button" className="category-chip">
                {category.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <section className="management-empty">
            <p>Loading your items...</p>
          </section>
        ) : error ? (
          <section className="management-empty">
            <h2>Something went wrong</h2>
            <p>{error}</p>
          </section>
        ) : (
          <>
            <button
              type="button"
              className="add-category-button"
              onClick={() => navigate("/business/categories/new")}
            >
              <span>＋</span>
              Add category
            </button>

            {categories.length === 0 ? (
              <section className="management-empty">
                <h2>No categories yet</h2>
                <p>Create a category before adding products or services.</p>
              </section>
            ) : (
              <section className="category-list">
                {categories.map((category) => {
                  const categoryItems = items.filter(
                    (item) => item.categoryId === category.id,
                  );

                  const filteredItems = categoryItems.filter((item) => {
                    if (activeTab === "all") return true;

                    if (activeTab === "products") {
                      return item.serviceType === "PRODUCT";
                    }

                    if (activeTab === "services") {
                      return item.serviceType === "SERVICE";
                    }

                    return true;
                  });

                  const expanded = expandedCategories[category.id];

                  const visibleItems = expanded
                    ? filteredItems
                    : filteredItems.slice(0, 3);

                  return (
                    <article className="category-card" key={category.id}>
                      <div className="category-card-header">
                        <div>
                          <h2>{category.name}</h2>

                          {category.description && (
                            <p className="text-small text-muted">
                              {category.description}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          className="category-edit-button"
                          onClick={() =>
                            navigate(`/business/categories/${category.id}/edit`)
                          }
                          aria-label={`Edit ${category.name}`}
                        >
                          ⋯
                        </button>
                      </div>

                      <div className="category-items">
                        {visibleItems.length === 0 ? (
                          <p className="text-small text-muted">
                            No {activeTab === "all" ? "items" : activeTab} in
                            this category yet.
                          </p>
                        ) : (
                          visibleItems.map((item) => (
                            <article className="category-item" key={item.id}>
                              <div>
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
                                    navigate(`/business/items/${item.id}/edit`)
                                  }
                                >
                                  Edit
                                </button>
                              </div>
                            </article>
                          ))
                        )}
                      </div>

                      {filteredItems.length > 3 && (
                        <button
                          type="button"
                          className="category-show-button"
                          onClick={() => toggleCategory(category.id)}
                        >
                          {expanded
                            ? "Show less"
                            : `Show ${filteredItems.length - 3} more`}
                        </button>
                      )}

                      <button
                        type="button"
                        className="category-add-item"
                        onClick={() =>
                          navigate(
                            `/business/items/new?category=${category.id}`,
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
          </>
        )}
      </div>
    </main>
  );
}

export default ProductsServices;
