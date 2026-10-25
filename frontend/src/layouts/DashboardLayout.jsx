import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      {/* Desktop Sidebar (hidden on mobile, fixed on md+) */}
      <div className="hidden md:block md:w-64 md:shrink-0">
        <div className="fixed inset-y-0 w-64">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="h-full w-64 bg-[#173B57] text-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-white text-xl p-1"
              >
                ✕
              </button>
            </div>
            <Sidebar onNavigate={() => setMobileSidebarOpen(false)} isMobile />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar for dashboard toggle */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#173B57]"
          >
            <span>☰</span>
            <span>Dashboard Menu</span>
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
