import { useEffect, useMemo, useState } from "react";
import { getOrders, updateOrder } from "../services/api";

const demoOrders = [
  {
    id: "BZ-1048",
    customer: "Al Noor Boutique",
    initials: "AN",
    item: "Business Website",
    type: "Website Development",
    amount: 320,
    date: "22 Sep 2026",
    status: "New",
    payment: "Paid",
    email: "hello@alnoorboutique.com",
    phone: "+968 9123 4567",
    notes:
      "5-page responsive website with WhatsApp contact and product gallery.",
  },
  {
    id: "BZ-1047",
    customer: "Luma Beauty",
    initials: "LB",
    item: "Social Media Package",
    type: "Content & Marketing",
    amount: 95,
    date: "21 Sep 2026",
    status: "In Progress",
    payment: "Paid",
    email: "contact@lumabeauty.com",
    phone: "+968 9788 2145",
    notes:
      "Monthly Instagram content package including posts and story designs.",
  },
  {
    id: "BZ-1046",
    customer: "Nizwa Coffee",
    initials: "NC",
    item: "Online Menu",
    type: "Web Development",
    amount: 80,
    date: "20 Sep 2026",
    status: "In Progress",
    payment: "Pending",
    email: "orders@nizwacoffee.com",
    phone: "+968 9234 1882",
    notes: "Mobile-friendly digital menu with QR code access.",
  },
  {
    id: "BZ-1045",
    customer: "Maha Al Hinai",
    initials: "MH",
    item: "Brand Identity",
    type: "Design",
    amount: 65,
    date: "18 Sep 2026",
    status: "Completed",
    payment: "Paid",
    email: "maha@example.com",
    phone: "+968 9912 4481",
    notes: "Logo, typography and social media brand kit.",
  },
  {
    id: "BZ-1044",
    customer: "Desert Stay",
    initials: "DS",
    item: "Booking Website",
    type: "Website Development",
    amount: 280,
    date: "15 Sep 2026",
    status: "Completed",
    payment: "Paid",
    email: "hello@desertstay.com",
    phone: "+968 9544 6201",
    notes: "Accommodation website with booking request flow.",
  },
];

function Orders() {
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrders();

        const formatted = response.data.map((order) => ({
          ...order,
          id: order.id,
          displayId: order.orderNumber,
          initials: order.customer
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          status:
            order.status === "IN_PROGRESS"
              ? "In Progress"
              : order.status === "COMPLETED"
                ? "Completed"
                : "New",
          payment: order.payment === "PAID" ? "Paid" : "Pending",
          date: new Date(order.createdAt).toLocaleDateString(),
        }));

        setOrders(formatted);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrders();
  }, []);

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = ["All", "New", "In Progress", "Completed"];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.status === activeTab;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        order.customer.toLowerCase().includes(query) ||
        order.item.toLowerCase().includes(query) ||
        order.id.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, search]);

  const newOrders = orders.filter((order) => order.status === "New").length;

  const activeOrders = orders.filter(
    (order) => order.status === "In Progress",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  const totalValue = orders.reduce(
    (sum, order) => sum + Number(order.amount),
    0,
  );

  const updateOrderStatus = (id, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    );

    setSelectedOrder((current) =>
      current?.id === id ? { ...current, status } : current,
    );
  };

  const updatePayment = (id, payment) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, payment } : order,
      ),
    );

    setSelectedOrder((current) =>
      current?.id === id ? { ...current, payment } : current,
    );
  };

  return (
    <div className="app-page orders-page">
      <header className="page-header">
        <p className="section-eyebrow">MANAGE</p>
        <h1>Orders</h1>
        <p>Track and manage your customer orders.</p>
      </header>

      {/* SUMMARY */}
      <section className="order-summary-grid">
        <article>
          <span>New</span>
          <strong>{newOrders}</strong>
        </article>

        <article>
          <span>Active</span>
          <strong>{activeOrders}</strong>
        </article>

        <article>
          <span>Completed</span>
          <strong>{completedOrders}</strong>
        </article>

        <article>
          <span>Order value</span>
          <strong>{totalValue} OMR</strong>
        </article>
      </section>

      {/* SEARCH */}
      <div className="order-search">
        <span>⌕</span>
        <input
          type="search"
          placeholder="Search customer, order or service"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* FILTERS */}
      <div className="order-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      <section className="orders-section">
        <div className="orders-section-heading">
          <div>
            <p className="section-eyebrow">RECENT</p>
            <h2>{activeTab === "All" ? "All orders" : activeTab}</h2>
          </div>

          <span>{filteredOrders.length} orders</span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="orders-empty">
            <div>▤</div>
            <h3>No orders found</h3>
            <p>Try another search or filter.</p>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order) => (
              <button
                type="button"
                className="order-card"
                key={order.id}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-card-top">
                  <div className="order-customer">
                    <div className="customer-avatar">{order.initials}</div>

                    <div>
                      <h3>{order.customer}</h3>
                      <p>
                        {order.displayId} · {order.date}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`order-status status-${order.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-card-body">
                  <div>
                    <span>{order.type}</span>
                    <strong>{order.item}</strong>
                  </div>

                  <strong className="order-price">
                    {order.amount.toFixed(3)} OMR
                  </strong>
                </div>

                <div className="order-card-footer">
                  <span
                    className={
                      order.payment === "Paid"
                        ? "payment-paid"
                        : "payment-pending"
                    }
                  >
                    {order.payment === "Paid" ? "✓" : "○"} {order.payment}
                  </span>

                  <span>View order →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ORDER DETAILS BOTTOM SHEET */}
      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="order-modal-handle" />

            <div className="order-modal-heading">
              <div>
                <p className="section-eyebrow">{selectedOrder.id}</p>
                <h2>{selectedOrder.item}</h2>
              </div>

              <button type="button" onClick={() => setSelectedOrder(null)}>
                ×
              </button>
            </div>

            <div className="order-detail-customer">
              <div className="customer-avatar large">
                {selectedOrder.initials}
              </div>

              <div>
                <h3>{selectedOrder.customer}</h3>
                <p>{selectedOrder.email}</p>
                <p>{selectedOrder.phone}</p>
              </div>
            </div>

            <div className="order-detail-grid">
              <div>
                <span>Order date</span>
                <strong>{selectedOrder.date}</strong>
              </div>

              <div>
                <span>Total</span>
                <strong>{selectedOrder.amount.toFixed(3)} OMR</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedOrder.status}</strong>
              </div>

              <div>
                <span>Payment</span>
                <strong>{selectedOrder.payment}</strong>
              </div>
            </div>

            <div className="order-notes">
              <span>ORDER DETAILS</span>
              <p>{selectedOrder.notes}</p>
            </div>

            <div className="order-management-block">
              <label>Order status</label>

              <div className="status-actions">
                {["New", "In Progress", "Completed"].map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={selectedOrder.status === status ? "active" : ""}
                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="order-management-block">
              <label>Payment</label>

              <button
                type="button"
                className={`payment-action ${
                  selectedOrder.payment === "Paid" ? "paid" : ""
                }`}
                onClick={() =>
                  updatePayment(
                    selectedOrder.id,
                    selectedOrder.payment === "Paid" ? "Pending" : "Paid",
                  )
                }
              >
                {selectedOrder.payment === "Paid"
                  ? "✓ Payment received"
                  : "Mark as paid"}
              </button>
            </div>

            <button
              type="button"
              className="button button-primary order-done-button"
              onClick={() => setSelectedOrder(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
