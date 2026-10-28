import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 dark:text-gray-200">

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <div
        className={`min-h-screen transition-[margin] duration-200
          ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}
      >
        <Navbar
          onMenuClick={() => {
            if (window.innerWidth < 1024) {
              setMobileOpen((prev) => !prev);
            } else {
              setCollapsed((prev) => !prev);
            }
          }}
        />

        <main className="min-h-[calc(100vh-8rem)] p-4 sm:p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}