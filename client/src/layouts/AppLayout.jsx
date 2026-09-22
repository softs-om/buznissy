import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

function AppLayout() {
  return (
    <div className="merchant-app">
      <main className="merchant-app-content">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

export default AppLayout;