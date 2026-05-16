"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Car,
  Users,
  CreditCard,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  BarChart2,
  Calendar,
} from "lucide-react";
import "./sidebar.css";

export default function AdminLayoutClient({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  const mainNav = [
    { name: "Dashboard",    path: "/admin",              icon: LayoutDashboard },
    { name: "Car Listing",  path: "/admin/cars",         icon: Car },
    { name: "Appointments", path: "/admin/appointments", icon: Calendar },
    { name: "News & Events", path: "/admin/news",        icon: MessageSquare },
  ];

  const bottomNav = [
    { name: "Help", action: () => setIsHelpOpen(true), icon: HelpCircle },
  ];

  const renderLink = (item: any) => {
    const Icon = item.icon;
    
    if (item.action) {
      return (
        <a key={item.name} href="#" onClick={(e) => { e.preventDefault(); item.action(); }} className="sb-link">
          <div className="sb-link-left">
            <Icon size={18} className="sb-link-icon" />
            <span className="sb-link-text">{item.name}</span>
          </div>
        </a>
      );
    }

    const isActive = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
    return (
      <Link key={item.path} href={item.path}
        className={`sb-link${isActive ? " sb-link--active" : ""}`}>
        <div className="sb-link-left">
          <Icon size={18} className="sb-link-icon" />
          <span className="sb-link-text">{item.name}</span>
        </div>
        {"badge" in item && item.badge ? (
          <span className="sb-badge">{item.badge}</span>
        ) : isActive ? (
          <span className="sb-active-dot" />
        ) : null}
      </Link>
    );
  };

  return (
    <div className="admin-root sb-shell">
      {/* ── Sidebar ── */}
      <aside className="sb-sidebar">
        {/* Logo */}
        <Link href="/" className="sb-logo">
          <div className="sb-logo-inner">
            <span className="sb-logo-wordmark">UNIDRIVE</span>
          </div>
        </Link>

        {/* Main nav */}
        <nav className="sb-nav sb-nav--main">
          {mainNav.map(renderLink)}
        </nav>

        {/* Divider */}
        <div className="sb-divider" />

        {/* Bottom nav */}
        <nav className="sb-nav sb-nav--bottom">
          {bottomNav.map(renderLink)}
        </nav>

        {/* User footer */}
        <div className="sb-user">
          <div className="sb-user-avatar">
            {session?.user?.name?.charAt(0) || "A"}
          </div>
          <div className="sb-user-info">
            <p className="sb-user-name">{session?.user?.name || "Admin"}</p>
            <p className="sb-user-role">Admin</p>
          </div>
          <button
            className="sb-signout"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className="sb-content">
        {children}
      </div>

      {isHelpOpen && (
        <div onClick={() => setIsHelpOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'invFade 0.2s ease' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#08080a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '32px', width: '90%', maxWidth: '500px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '24px', letterSpacing: '0.04em', margin: 0 }}>Admin Dashboard Guide</h2>
            
            <div style={{ fontSize: '13px', lineHeight: 1.6, color: '#8a8a9a', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p><strong style={{ color: '#fff' }}>Dashboard:</strong> View key metrics, recent sales, upcoming appointments, and new inquiries at a glance.</p>
              <p><strong style={{ color: '#fff' }}>Car Listing:</strong> Manage the dealership's fleet. Add new vehicles, upload images, set prices, and update their availability status.</p>
              <p><strong style={{ color: '#fff' }}>Appointments:</strong> Review and manage test drive requests and showroom visits booked by clients.</p>
              <div style={{ padding: '16px', background: '#18181f', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '8px' }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: '#b8965a' }}>For technical support or feature requests, contact the development team.</p>
              </div>
            </div>

            <button onClick={() => setIsHelpOpen(false)} style={{ marginTop: '10px', background: '#ffffff', color: '#000000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }}>
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
