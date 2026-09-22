import { useState } from "react";
import ManagementHeader from "../components/ManagementHeader";

function ProductsServices() {
  const [activeTab, setActiveTab] = useState("all");

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

        <button type="button" className="add-item-button">
          <span>＋</span>
          Add product or service
        </button>

        <section className="management-empty">
          <div className="management-empty-icon">▦</div>

          <h2>No items yet</h2>

          <p>
            Add your first product or service and it will appear on your
            storefront.
          </p>

          <button type="button" className="button button-primary">
            Add your first item
          </button>
        </section>
      </div>
    </main>
  );
}

export default ProductsServices;