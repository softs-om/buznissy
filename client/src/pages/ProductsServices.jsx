import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagementHeader from "../components/ManagementHeader";

import {
  getCategories,
  getProducts,
  getServices,
  deleteCategory,
  deleteProduct,
  deleteService,
} from "../services/api";

import { Pencil, Trash2, Tag } from "lucide-react";
import { useBusiness } from "../context/useBusiness";

function ProductsServices() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addMenuCategory, setAddMenuCategory] = useState(null);
  const [sortBy, setSortBy] = useState("category");
  const [sortDirection, setSortDirection] = useState("asc");
  const { activeBusiness } = useBusiness();
  const businessType = activeBusiness?.businessType;

  const isTrader = businessType === "TRADER";
  const isEntrepreneur = businessType === "ENTREPRENEUR";
  const isInfluencer = businessType === "INFLUENCER";

  const canUseProducts = isTrader || isEntrepreneur || isInfluencer;

  const canUseServices = isEntrepreneur || isInfluencer;
  // --------------------------------------------------
  // LOAD BUSINESS + CATEGORIES + ITEMS
  // --------------------------------------------------

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");

        // Get the logged-in user's business
        if (!activeBusiness?.id) {
          setError("Business information could not be found.");
          return;
        }

        const businessId = activeBusiness.id;

        // Get categories
        const categoryResponse = await getCategories(businessId);
        const loadedCategories = categoryResponse.data || [];

        setCategories(loadedCategories);

        // If there are no categories, stop here
        if (loadedCategories.length === 0) {
          setItems([]);
          return;
        }

        // Get services + products for every category
        const serviceRequests = loadedCategories.map((category) =>
          getServices(category.id),
        );

        const productRequests = loadedCategories.map((category) =>
          getProducts(category.id),
        );

        const [serviceResponses, productResponses] = await Promise.all([
          Promise.all(serviceRequests),
          Promise.all(productRequests),
        ]);

        const loadedServices = serviceResponses.flatMap((response) =>
          (response.data || []).map((service) => ({
            ...service,
            itemType: "SERVICE",
          })),
        );

        const loadedProducts = productResponses.flatMap((response) =>
          (response.data || []).map((product) => ({
            ...product,
            itemType: "PRODUCT",
          })),
        );

        setItems([...loadedServices, ...loadedProducts]);
      } catch (err) {
        console.error("Failed to load products/services:", err);
        setError("Could not load your products and services.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [activeBusiness?.id, activeBusiness?.businessType]);

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
      const item = items.find((currentItem) => currentItem.id === itemId);

      if (item?.itemType === "PRODUCT") {
        await deleteProduct(itemId);
      } else {
        await deleteService(itemId);
      }
      setItems((current) => current.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error("Failed to delete item:", err);
      window.alert("Could not delete item.");
    }
  };

  const allItems = items.map((item) => {
    const category = categories.find(
      (category) => category.id === item.categoryId,
    );

    return {
      ...item,
      categoryName: category?.name || "",
    };
  });

  const tabItems = allItems.filter((item) => {
    if (activeTab === "products") {
      return item.itemType === "PRODUCT";
    }

    if (activeTab === "services") {
      return item.itemType === "SERVICE";
    }

    return true;
  });

  const sortedItems = [...tabItems].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "category") {
      comparison = (a.categoryName || "").localeCompare(b.categoryName || "");
    }

    if (sortBy === "name") {
      comparison = (a.title || "").localeCompare(b.title || "");
    }

    if (sortBy === "price") {
      comparison = Number(a.price || 0) - Number(b.price || 0);
    }

    if (sortBy === "discount") {
      comparison = Number(a.discount || 0) - Number(b.discount || 0);
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const goToCreateService = (categoryId = null) => {
    if (isTrader) {
      return;
    }

    const query = categoryId ? `?categoryId=${categoryId}` : "";

    if (isInfluencer) {
      navigate(`/create-influencer-service${query}`);
      return;
    }

    if (isEntrepreneur) {
      navigate(`/create-entrepreneur-service${query}`);
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
          {[
            "categories",
            ...(canUseProducts ? ["products"] : []),
            ...(canUseServices ? ["services"] : []),
          ].map((tab) => (
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

        {activeTab === "categories" && (
          <button
            type="button"
            className="add-category-button"
            onClick={() => navigate("/business/categories/new")}
          >
            ＋ Category
          </button>
        )}

        {activeTab === "products" && (
          <button
            type="button"
            className="add-category-button"
            onClick={() => navigate("/create-product")}
          >
            ＋ Product
          </button>
        )}

        {activeTab === "services" && (
          <button
            type="button"
            className="add-category-button"
            onClick={() => goToCreateService()}
          >
            ＋ Service
          </button>
        )}

        {activeTab !== "categories" && (
          <div className="items-sort-bar">
            <span>Sort by</span>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="category">Category</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="discount">Discount</option>
            </select>

            <button
              type="button"
              className="sort-direction-button"
              onClick={() =>
                setSortDirection((current) =>
                  current === "asc" ? "desc" : "asc",
                )
              }
              aria-label={
                sortDirection === "asc" ? "Ascending order" : "Descending order"
              }
            >
              {sortDirection === "asc" ? "↑" : "↓"}
            </button>
          </div>
        )}

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
              Create your first category to organize your products and services.
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

        {!loading &&
          !error &&
          categories.length > 0 &&
          activeTab === "categories" && (
            <section className="category-list">
              {categories.map((category) => {
                const categoryItems = items.filter(
                  (item) => item.categoryId === category.id,
                );

                const expanded = expandedCategories[category.id] === true;

                const visibleItems = expanded
                  ? categoryItems
                  : categoryItems.slice(0, 3);

                return (
                  <article className="category-card" key={category.id}>
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
                            navigate(`/business/categories/${category.id}/edit`)
                          }
                          aria-label={`Edit ${category.name}`}
                          title="Edit"
                        >
                          <Pencil size={17} strokeWidth={2} />
                        </button>

                        <button
                          type="button"
                          className="category-delete-button"
                          onClick={() => handleDeleteCategory(category.id)}
                          title="Delete"
                        >
                          <Trash2 size={17} strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    {/* Category Items */}

                    <div className="category-items">
                      {categoryItems.length === 0 ? (
                        <p className="text-small text-muted">
                          No {activeTab === "all" ? "items" : activeTab} in this
                          category yet.
                        </p>
                      ) : (
                        visibleItems.map((item) => (
                          <article className="category-item" key={item.id}>
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
                                onClick={() => goToCreateService(category.id)}
                                aria-label={`Edit ${item.title}`}
                                title="Edit"
                              >
                                <Pencil size={17} strokeWidth={2} />
                              </button>

                              <button
                                type="button"
                                className="item-delete-button"
                                onClick={() => handleDeleteItem(item.id)}
                                aria-label={`Delete ${item.title}`}
                                title="Delete"
                              >
                                <Trash2 size={17} strokeWidth={2} />
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
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expanded
                          ? "Show less"
                          : `Show ${categoryItems.length - 3} more`}
                      </button>
                    )}

                    {/* Add Item */}

                    <div className="category-add-wrapper">
                      <button
                        type="button"
                        className="category-add-item"
                        onClick={() =>
                          setAddMenuCategory(
                            addMenuCategory === category.id
                              ? null
                              : category.id,
                          )
                        }
                      >
                        ＋ Item
                      </button>

                      {addMenuCategory === category.id && (
                        <div className="category-add-menu">
                          {canUseServices && (
                            <button
                              type="button"
                              onClick={() => goToCreateService(category.id)}
                            >
                              ＋ Service
                            </button>
                          )}

                          {canUseProducts && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/create-product?categoryId=${category.id}`,
                                )
                              }
                            >
                              ＋ Product
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        {!loading && !error && activeTab !== "categories" && (
          <section className="sorted-items-list">
            {sortedItems.length === 0 ? (
              <div className="management-empty">
                <p>
                  No {activeTab === "products" ? "products" : "services"} yet.
                </p>
              </div>
            ) : (
              sortedItems.map((item) => (
                <article className="category-item" key={item.id}>
                  <div className="category-item-info">
                    <p className="category-item-type">{item.categoryName}</p>

                    <h3>{item.title}</h3>

                    {item.description && (
                      <p className="text-small text-muted">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="category-item-side">
                    <strong>
                      {item.price != null ? `${item.price} OMR` : "No price"}
                    </strong>

                    {Number(item.discount) > 0 && (
                      <Tag size={17} strokeWidth={2} aria-label="Discount" />
                    )}

                    <button
                      type="button"
                      className="item-edit-button"
                      onClick={() =>
                        navigate(
                          `/business/items/${item.id}/edit?categoryId=${item.categoryId}`,
                        )
                      }
                      aria-label={`Edit ${item.title}`}
                      title="Edit"
                    >
                      <Pencil size={17} strokeWidth={2} />
                    </button>

                    <button
                      type="button"
                      className="item-delete-button"
                      onClick={() => handleDeleteItem(item.id)}
                      aria-label={`Delete ${item.title}`}
                      title="Delete"
                    >
                      <Trash2 size={17} strokeWidth={2} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductsServices;
