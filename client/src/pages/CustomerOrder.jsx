import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createOrder, getPublicBusiness } from "../services/api";
import "../styles/customer-store.css";

function CustomerOrder() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [form, setForm] = useState({
    customer: "",
    email: "",
    phone: "",
    item: "",
    amount: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        const response = await getPublicBusiness(businessId);
        setBusiness(response.data);
      } catch (error) {
        console.error("Could not load business:", error);
      } finally {
        setLoadingBusiness(false);
      }
    };

    loadBusiness();
  }, [businessId]);

  const selectService = (service) => {
    setForm((prev) => ({
      ...prev,
      item: service.title,
      amount: service.price,
    }));

    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loadingBusiness) {
    return (
      <main className="customer-store-loading">
        <div className="customer-store-spinner"></div>
        <p>Loading store...</p>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="customer-store-loading">
        <p>Store could not be found.</p>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createOrder({
        ...form,
        amount: Number(form.amount),
        businessId,
        orderNumber: `BZ-${Date.now()}`,
      });

      setMessage("Order placed successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not place order.");
    }
  };

  return (
    <main className="storefront">
      {/* Header */}
      <header className="storefront-header">
        <div className="store-brand">
          {business?.logo ? (
            <img
              src={business.logo}
              alt={`${business.name} logo`}
              className="store-logo"
            />
          ) : (
            <div className="store-logo-placeholder">
              {business?.name?.charAt(0)}
            </div>
          )}

          <strong>{business?.name}</strong>
        </div>

        <button className="store-menu-button" type="button">
          ☰
        </button>
      </header>

      {/* Navigation */}
      <nav className="store-nav">
        <a href="#home">Home</a>
        <a href="#shop">Shop</a>
        <a href="#about">About us</a>
        <a href="#contact">Contact</a>
        <a href="#account">Account</a>
        <a href="#settings">Settings</a>
      </nav>

      {/* Hero */}
      <section className="store-hero">
        <div className="store-hero-content">
          <span className="store-eyebrow">WELCOME TO</span>

          <h1>{business?.name}</h1>

          {business?.description && <p>{business.description}</p>}

          <a href="#shop" className="store-primary-btn">
            Explore services
          </a>
        </div>

        {business?.coverImage && (
          <img src={business.coverImage} alt="" className="store-cover" />
        )}
      </section>

      <section className="store-catalog" id="shop">
        <div className="catalog-heading">
          <span>WHAT WE OFFER</span>
          <h2>Products & Services</h2>
        </div>

        {business?.categories?.map((category) => (
          <div className="catalog-category" key={category.id}>
            <div className="category-heading">
              <h3>{category.name}</h3>

              {category.description && <p>{category.description}</p>}
            </div>

            <div className="service-grid">
              {category.services?.map((service) => (
                <article className="service-card" key={service.id}>
                  <div>
                    <span className="service-type">{service.serviceType}</span>

                    <h4>{service.title}</h4>

                    {service.description && <p>{service.description}</p>}
                  </div>

                  <div className="service-card-bottom">
                    <strong>{Number(service.price).toFixed(3)} OMR</strong>

                    <button
                      type="button"
                      onClick={() => selectService(service)}
                    >
                      Order
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Order */}
      <section className="store-order-section" id="order">
        <div className="store-section-heading">
          <span>ORDER</span>
          <section className="order-section" id="order">
          <h2>Place your order</h2>
          </section>
        </div>

        <form className="store-order-form" onSubmit={handleSubmit}>
          <input
            placeholder="Your name"
            required
            onChange={(e) => setForm({ ...form, customer: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            placeholder="Item or service"
            required
            onChange={(e) => setForm({ ...form, item: e.target.value })}
          />

          <input
            type="number"
            placeholder="Amount (OMR)"
            required
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <textarea
            placeholder="Notes"
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button type="submit" className="store-primary-button">
            Place order
          </button>

          {message && <p className="store-order-message">{message}</p>}
        </form>
      </section>
    </main>
  );
}

export default CustomerOrder;
