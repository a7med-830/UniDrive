"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  Settings, 
  LogOut
} from "lucide-react";

export default function AdminLayoutClient({ 
  children, 
  session 
}: { 
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { name: "DASHBOARD", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "FLEET", path: "/admin", icon: Car },
    { name: "APPOINTMENTS", path: "/admin/appointments", icon: Calendar },
    { name: "SETTINGS", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="admin-root flex h-screen overflow-hidden bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#080808] border-r border-white/10 flex flex-col z-30">
        <Link href="/" className="p-10 flex flex-col items-center justify-center border-b border-white/5 text-center group">
          <div className="font-serif text-2xl tracking-[0.25em] text-white font-semibold transition-colors group-hover:text-[#b8965a]">
            UNIDRIVE
          </div>
        </Link>

        <nav className="admin-sidebar-nav flex-1 px-5 py-10 flex flex-col gap-3 overflow-y-auto">
          <p className="px-5 text-center text-[10px] font-bold text-[#444] uppercase tracking-[0.28em] mb-6">ADMINISTRATION</p>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-sidebar-link flex items-center justify-between px-5 py-[18px] transition-all duration-500 group min-w-0 border-l-2 ${
                  isActive
                    ? "border-[#b8965a] bg-white/5 text-white"
                    : "border-transparent text-[#888] hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <div className="admin-sidebar-link-left flex items-center gap-[18px] min-w-0">
                  <Icon size={18} className={`admin-sidebar-icon ${isActive ? "text-[#b8965a]" : "text-[#444] group-hover:text-[#888]"}`} />
                  <span className="admin-sidebar-text text-[12px] font-bold tracking-[0.14em] truncate">{item.name}</span>
                </div>
                {isActive && <div className="w-1 h-1 rounded-full bg-[#b8965a] shadow-[0_0_8px_#b8965a]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-4 mb-8 px-2">
             <div className="w-10 h-10 rounded-full border border-white/10 bg-[#111] flex items-center justify-center text-[#b8965a] font-serif text-lg shrink-0">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-white tracking-widest truncate uppercase">{session?.user?.name || "Admin"}</p>
                <p className="text-[9px] text-[#555] font-bold uppercase tracking-widest truncate mt-0.5">Super Admin</p>
              </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="admin-signout-button flex items-center justify-center gap-3 w-full px-5 py-[18px] text-[11px] font-black tracking-[0.16em] text-[#777] hover:text-[#b8965a] transition-all border border-white/10 hover:border-[#b8965a]/40 bg-white/[0.01] hover:bg-white/[0.03]"
          >
            <LogOut size={16} />
            SIGN OUT
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0 relative">
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-black min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
