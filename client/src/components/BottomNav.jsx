import { NavLink } from "react-router-dom";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H15v-6H9v6H3.5a.5.5 0 0 1-.5-.5z" />
  </svg>
);

const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 3h12v18H6z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

const BusinessIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 9h16l-1.5-5h-13z" />
    <path d="M5 9v11h14V9M9 20v-6h6v6" />
  </svg>
);

const InsightsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c.8-4.5 3.5-7 8-7s7.2 2.5 8 7" />
  </svg>
);

const tabs = [
  { path: "/home", label: "Home", Icon: HomeIcon },
  { path: "/orders", label: "Orders", Icon: OrdersIcon },
  { path: "/business", label: "Business", Icon: BusinessIcon },
  { path: "/insights", label: "Insights", Icon: InsightsIcon },
  { path: "/profile", label: "Profile", Icon: ProfileIcon },
];

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? "active" : ""}`
          }
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;