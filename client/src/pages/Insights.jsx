import { useMemo, useState } from "react";

function Insights() {
  // DEMO DATA ONLY — replace with API data later
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: "Domain & Hosting",
      amount: 42,
      date: "2026-09-16",
      description: "Hosting and client domains",
    },
    {
      id: 2,
      title: "Software Subscriptions",
      amount: 28,
      date: "2026-09-10",
      description: "Development and design tools",
    },
    {
      id: 3,
      title: "Marketing",
      amount: 65,
      date: "2026-09-05",
      description: "Social media promotion and advertising",
    },
  ]);

  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    date: "",
    description: "",
  });

  const revenue = 1420;

  const totalExpenses = useMemo(
    () =>
      expenses.reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0,
      ),
    [expenses],
  );

  const netProfit = revenue - totalExpenses;

  const revenueData = [
    { month: "Apr", amount: 720 },
    { month: "May", amount: 860 },
    { month: "Jun", amount: 790 },
    { month: "Jul", amount: 1050 },
    { month: "Aug", amount: 1200 },
    { month: "Sep", amount: 1420 },
  ];

  const maxRevenue = Math.max(...revenueData.map((item) => item.amount));

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;

    setNewExpense((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAddExpense = (event) => {
    event.preventDefault();

    if (!newExpense.title || !newExpense.amount || !newExpense.date) {
      return;
    }

    setExpenses((current) => [
      {
        id: Date.now(),
        ...newExpense,
        amount: Number(newExpense.amount),
      },
      ...current,
    ]);

    setNewExpense({
      title: "",
      amount: "",
      date: "",
      description: "",
    });

    setShowExpenseForm(false);
  };

  const formatDate = (date) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="app-page insights-page">
      <header className="page-header insights-header">
        <div>
          <p className="section-eyebrow">PERFORMANCE</p>
          <h1>Insights</h1>
          <p>Understand how your business is performing.</p>
        </div>

        <span className="demo-badge">Demo data</span>
      </header>

      {/* PERIOD */}
      <div className="insights-period">
        <span>This month</span>
        <span>⌄</span>
      </div>

      {/* STATISTICS */}
      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">↗</span>
            <span className="positive-stat">+18.3%</span>
          </div>

          <p>Revenue</p>
          <h2>{revenue.toLocaleString()} OMR</h2>
          <span className="stat-caption">Compared with last month</span>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">◎</span>
            <span className="positive-stat">+14.6%</span>
          </div>

          <p>Net profit</p>
          <h2>{netProfit.toLocaleString()} OMR</h2>
          <span className="stat-caption">After recorded expenses</span>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">□</span>
          </div>

          <p>Projects</p>
          <h2>12</h2>
          <span className="stat-caption">9 completed · 3 active</span>
        </article>

        <article className="stat-card">
          <div className="stat-card-top">
            <span className="stat-icon">−</span>
          </div>

          <p>Expenses</p>
          <h2>{totalExpenses.toLocaleString()} OMR</h2>
          <span className="stat-caption">{expenses.length} recorded expenses</span>
        </article>
      </section>

      {/* REVENUE CHART */}
      <section className="insights-section">
        <div className="insights-section-heading">
          <div>
            <p className="section-eyebrow">OVERVIEW</p>
            <h2>Revenue overview</h2>
          </div>

          <span className="trend-label">↗ Growing</span>
        </div>

        <div className="revenue-chart">
          {revenueData.map((item) => (
            <div className="chart-column" key={item.month}>
              <div className="chart-bar-area">
                <div
                  className="chart-bar"
                  style={{
                    height: `${Math.max(
                      18,
                      (item.amount / maxRevenue) * 100,
                    )}%`,
                  }}
                />
              </div>

              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BUSINESS BREAKDOWN */}
      <section className="insights-section">
        <div className="insights-section-heading">
          <div>
            <p className="section-eyebrow">SERVICES</p>
            <h2>Business breakdown</h2>
          </div>
        </div>

        <div className="breakdown-list">
          <div className="breakdown-item">
            <div>
              <span>Web Development</span>
              <strong>48%</strong>
            </div>
            <div className="breakdown-track">
              <div style={{ width: "48%" }} />
            </div>
          </div>

          <div className="breakdown-item">
            <div>
              <span>Social Media</span>
              <strong>27%</strong>
            </div>
            <div className="breakdown-track">
              <div style={{ width: "27%" }} />
            </div>
          </div>

          <div className="breakdown-item">
            <div>
              <span>Design</span>
              <strong>15%</strong>
            </div>
            <div className="breakdown-track">
              <div style={{ width: "15%" }} />
            </div>
          </div>

          <div className="breakdown-item">
            <div>
              <span>Other</span>
              <strong>10%</strong>
            </div>
            <div className="breakdown-track">
              <div style={{ width: "10%" }} />
            </div>
          </div>
        </div>
      </section>

      {/* EXPENSES */}
      <section className="insights-section">
        <div className="insights-section-heading">
          <div>
            <p className="section-eyebrow">EXPENSES</p>
            <h2>Money out</h2>
            <p>Track where your business spends money.</p>
          </div>

          <button
            type="button"
            className="small-action-button"
            onClick={() => setShowExpenseForm(true)}
          >
            + Add
          </button>
        </div>

        <div className="expense-list">
          {expenses.map((expense) => (
            <article className="expense-item" key={expense.id}>
              <div className="expense-main">
                <div className="expense-icon">−</div>

                <div>
                  <h3>{expense.title}</h3>
                  <p>{formatDate(expense.date)}</p>
                  {expense.description && <span>{expense.description}</span>}
                </div>
              </div>

              <strong>{Number(expense.amount).toFixed(3)} OMR</strong>
            </article>
          ))}
        </div>
      </section>

      {/* SMART INSIGHTS */}
      <section className="insights-section smart-section">
        <div className="insights-section-heading">
          <div>
            <p className="section-eyebrow">SMART INSIGHTS</p>
            <h2>What we're noticing</h2>
            <p>Demo recommendations based on recent activity.</p>
          </div>
        </div>

        <div className="smart-insights-list">
          <article className="smart-insight-card">
            <div className="smart-insight-icon">↗</div>
            <div>
              <span>PERFORMANCE</span>
              <h3>Revenue is growing</h3>
              <p>
                Revenue is 18.3% higher than the previous period. Your recent
                growth trend is positive.
              </p>
            </div>
          </article>

          <article className="smart-insight-card">
            <div className="smart-insight-icon">★</div>
            <div>
              <span>TOP SERVICE</span>
              <h3>Web development is leading</h3>
              <p>
                Web development currently generates the largest share of
                Softs' revenue at approximately 48%.
              </p>
            </div>
          </article>

          <article className="smart-insight-card prediction-card">
            <div className="smart-insight-icon">⌁</div>
            <div>
              <span>PREDICTION</span>
              <h3>Next month could be stronger</h3>
              <p>
                If the current trend continues, revenue could reach
                approximately 1,550–1,700 OMR next month.
              </p>
            </div>
          </article>

          <article className="smart-insight-card">
            <div className="smart-insight-icon">✦</div>
            <div>
              <span>RECOMMENDATION</span>
              <h3>Review recurring software costs</h3>
              <p>
                Review development and design subscriptions regularly to reduce
                unnecessary recurring expenses.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ADD EXPENSE MODAL */}
      {showExpenseForm && (
        <div
          className="expense-modal-overlay"
          onClick={() => setShowExpenseForm(false)}
        >
          <div
            className="expense-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="expense-modal-handle" />

            <div className="expense-modal-header">
              <div>
                <p className="section-eyebrow">NEW EXPENSE</p>
                <h2>Add expense</h2>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() => setShowExpenseForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddExpense}>
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  value={newExpense.title}
                  onChange={handleExpenseChange}
                  placeholder="e.g. Hosting"
                  required
                />
              </label>

              <label>
                Amount
                <div className="amount-input">
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    step="0.001"
                    value={newExpense.amount}
                    onChange={handleExpenseChange}
                    placeholder="0.000"
                    required
                  />
                  <span>OMR</span>
                </div>
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={newExpense.date}
                  onChange={handleExpenseChange}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={newExpense.description}
                  onChange={handleExpenseChange}
                  placeholder="What was this expense for?"
                  rows="3"
                />
              </label>

              <div className="expense-modal-actions">
                <button
                  type="button"
                  className="button expense-cancel-button"
                  onClick={() => setShowExpenseForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="button button-primary">
                  Add expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Insights;