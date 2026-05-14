"use client";

import { useState, useEffect } from "react";
import {
  Car as CarIcon, Users, Calendar, TrendingUp, TrendingDown,
  DollarSign, Package, Clock, CheckCircle, AlertCircle,
  Search, MessageSquare, Bell, MoreHorizontal, RefreshCw,
  ChevronLeft, ChevronRight, Zap, BarChart2, Wind, Thermometer, Wifi,
} from "lucide-react";
import "./dashboard.css";
import Link from "next/link";

type Stats = {
  inventory: { total: number; available: number; reserved: number; sold: number; totalValue: number };
  inquiries: { total: number; new: number };
  appointments: { total: number; pending: number; upcoming: { id: number; clientName: string; scheduledAt: string; status: string; car: { name: string; make: string; model: string; image: string | null } }[] };
  revenue: { thisMonth: number; lastMonth: number; growth: number; soldThisMonth: number };
  recentInquiries: { id: number; name: string; email: string; createdAt: string; status: string; car: { name: string; make: string; image: string | null } }[];
  recentCars: { id: number; name: string; make: string; model: string; year: number; price: number; status: string; fuelType: string; image: string | null; createdAt: string }[];
  topCars: { id: number; name: string; make: string; model: string; price: number; fuelType: string; image: string | null; status: string; createdAt: string }[];
};



function Sparkline({ color, up }: { color: string; up: boolean }) {
  const pts = up
    ? "0,44 30,38 60,30 90,22 120,16 150,10 180,6 200,2"
    : "0,8 30,14 60,22 90,28 120,34 150,38 180,42 200,46";
  return (
    <svg className="dash-sparkline" viewBox="0 0 200 54" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" points={pts} />
      <polygon fill={`url(#sg-${color.replace("#","")})`}
        points={`0,54 ${pts} 200,54`} />
      <circle cx="200" cy={up ? "2" : "46"} r="4" fill={color} />
    </svg>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setStats(data);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const featured = stats?.recentCars[featuredIdx] ?? null;

  if (loading) return (
    <div className="dash-root" style={{ alignItems: "center", justifyContent: "center", minHeight: "100%" }}>
      <div className="dash-loading">
        <div className="dash-loading-dot" />
        <span className="dash-loading-text">Loading dashboard…</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="dash-root" style={{ alignItems: "center", justifyContent: "center", minHeight: "100%", gap: 12 }}>
      <AlertCircle size={28} style={{ color: "var(--d-red)" }} />
      <p style={{ color: "var(--d-muted)", fontSize: 13 }}>{error}</p>
      <button className="dash-view-all-btn" onClick={() => load()}>Retry</button>
    </div>
  );

  const inv = stats!.inventory;
  const rev = stats!.revenue;

  return (
    <div className="dash-root">
      {/* ── Navbar ── */}
      <header className="dash-navbar">
        <span className="dash-navbar-title">Dashboard</span>
        <div style={{ flex: 1 }} />
        <div className="dash-navbar-actions">
          <button
            className="dash-icon-btn"
            onClick={() => load(true)}
            title="Refresh"
            style={{ opacity: refreshing ? 0.5 : 1 }}
          >
            <RefreshCw size={15} style={refreshing ? { animation: "spin 1s linear infinite" } : {}} />
          </button>
          <Link href="/admin/cars" className="dash-icon-btn" title="Inventory">
            <CarIcon size={15} />
          </Link>
          <div className="dash-avatar">A</div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="dash-body">

        {/* ══ TOP ROW: Revenue | Inventory Value | Recent Listing ══ */}
        <div className="dash-top-row">

          {/* Revenue This Month */}
          <div className="dash-stat-card">
            <div className="dash-stat-card-header">
              <span className="dash-stat-card-label">Revenue This Month</span>
              <div className="dash-stat-card-actions">
                <span className={`dash-pct-badge${rev.growth < 0 ? " neg" : ""}`}>
                  {rev.growth >= 0 ? "↑" : "↓"} {Math.abs(rev.growth)}%
                </span>
              </div>
            </div>
            <div className="dash-stat-value">{fmt(rev.thisMonth)}</div>
            <div className="dash-stat-sub">
              {rev.soldThisMonth} vehicle{rev.soldThisMonth !== 1 ? "s" : ""} sold ·{" "}
              Last month: {fmt(rev.lastMonth)}
            </div>
            <Sparkline color="#22c55e" up={rev.growth >= 0} />
          </div>

          {/* Inventory Value */}
          <div className="dash-stat-card">
            <div className="dash-stat-card-header">
              <span className="dash-stat-card-label">Available Inventory</span>
              <div className="dash-stat-card-actions">
                <span className="dash-pct-badge">{inv.available} units</span>
              </div>
            </div>
            <div className="dash-stat-value">{fmt(inv.totalValue)}</div>
            <div className="dash-stat-sub">
              {inv.reserved} reserved · {inv.sold} sold · {inv.total} total
            </div>
            <Sparkline color="#b8965a" up={true} />
          </div>

          {/* Recent Car Listing */}
          <div className="dash-listing-card">
            <div className="dash-listing-card-header">
              <span className="dash-listing-card-title">Recent Additions</span>
              <div className="dash-listing-nav">
                <button className="dash-nav-arrow"
                  onClick={() => setFeaturedIdx(i => Math.max(0, i - 1))}>
                  <ChevronLeft size={14} />
                </button>
                <button className="dash-nav-arrow active"
                  onClick={() => setFeaturedIdx(i => Math.min((stats?.recentCars.length ?? 1) - 1, i + 1))}>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
            <div className="dash-car-image-wrap">
              {featured?.image
                ? <img src={featured.image} alt={featured.name} />
                : <div className="dash-car-image-placeholder"><CarIcon size={40} strokeWidth={1} /><span>{featured?.name ?? "No vehicles"}</span></div>
              }
              {featured && (
                <div className="dash-car-name-overlay">{featured.make} {featured.model}</div>
              )}
            </div>

          </div>
        </div>

        {/* ══ SECOND ROW: 4 KPI Cards ══ */}
        <div className="dash-kpi-row">
          {[
            { icon: Package,      label: "Total Inventory", value: inv.total,                          sub: `${inv.available} available`,     color: "#b8965a" },
            { icon: Users,        label: "Inquiries",       value: stats!.inquiries.total,             sub: `${stats!.inquiries.new} unread`,  color: "#8b5cf6" },
            { icon: Calendar,     label: "Appointments",    value: stats!.appointments.total,          sub: `${stats!.appointments.pending} pending`, color: "#06b6d4" },
            { icon: CheckCircle,  label: "Sold",            value: inv.sold,                           sub: `${rev.soldThisMonth} this month`, color: "#22c55e" },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="dash-kpi-card">
                <div className="dash-kpi-icon" style={{ background: `${k.color}18`, color: k.color }}>
                  <Icon size={20} />
                </div>
                <div className="dash-kpi-body">
                  <p className="dash-kpi-label">{k.label}</p>
                  <p className="dash-kpi-value">{k.value}</p>
                  <p className="dash-kpi-sub">{k.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══ THIRD ROW: Upcoming Appointments + Recent Inquiries ══ */}
        <div className="dash-dual-row">

          {/* Upcoming Appointments */}
          <div className="dash-table-card">
            <div className="dash-table-card-header">
              <div className="dash-table-card-titles">
                <span className="dash-table-card-title">Upcoming Appointments</span>
                <span className="dash-table-card-sub">Next scheduled test drives &amp; viewings</span>
              </div>
              <Link href="/admin/appointments" className="dash-view-all-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                View All
              </Link>
            </div>
            {stats!.appointments.upcoming.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--d-muted)", fontSize: 13 }}>
                No upcoming appointments
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats!.appointments.upcoming.map(a => (
                      <tr key={a.id}>
                        <td>
                          <div className="dash-car-cell">
                            {a.car.image
                              ? <img src={a.car.image} alt={a.car.name} className="dash-car-thumb" />
                              : <div className="dash-car-thumb-placeholder"><CarIcon size={14} /></div>
                            }
                            <span className="dash-car-name">{a.car.name}</span>
                          </div>
                        </td>
                        <td style={{ color: "var(--d-text)", fontSize: 13 }}>{a.clientName}</td>
                        <td style={{ color: "var(--d-muted)", fontSize: 12 }}>{fmtDate(a.scheduledAt)}</td>
                        <td>
                          <span className={`dash-status-badge ${a.status === "approved" ? "delivered" : a.status === "completed" ? "delivered" : "waiting"}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="dash-table-card">
            <div className="dash-table-card-header">
              <div className="dash-table-card-titles">
                <span className="dash-table-card-title">Recent Inquiries</span>
                <span className="dash-table-card-sub">Latest customer interest &amp; messages</span>
              </div>
              <span className="dash-pct-badge" style={{ padding: "4px 10px", borderRadius: 50, fontSize: 11 }}>
                {stats!.inquiries.new} new
              </span>
            </div>
            {stats!.recentInquiries.length === 0 ? (
              <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--d-muted)", fontSize: 13 }}>
                No inquiries yet
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Customer</th>
                      <th>Received</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats!.recentInquiries.map(inq => (
                      <tr key={inq.id}>
                        <td>
                          <div className="dash-car-cell">
                            {inq.car.image
                              ? <img src={inq.car.image} alt={inq.car.name} className="dash-car-thumb" />
                              : <div className="dash-car-thumb-placeholder"><CarIcon size={14} /></div>
                            }
                            <span className="dash-car-name">{inq.car.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="dash-customer-name">{inq.name}</div>
                          <div className="dash-customer-email">{inq.email}</div>
                        </td>
                        <td style={{ color: "var(--d-muted)", fontSize: 11 }}>{timeAgo(inq.createdAt)}</td>
                        <td>
                          <span className={`dash-status-badge ${inq.status === "new" ? "waiting" : "delivered"}`}>
                            {inq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* ══ BOTTOM: Top Cars by Value ══ */}
        <div className="dash-table-card">
          <div className="dash-table-card-header">
            <div className="dash-table-card-titles">
              <span className="dash-table-card-title">Top Cars by Value</span>
              <span className="dash-table-card-sub">Highest priced vehicles in your sold inventory</span>
            </div>
            <Link href="/admin/cars" className="dash-view-all-btn" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
              Manage Inventory
            </Link>
          </div>
          {stats!.topCars.length === 0 ? (
            <div style={{ padding: "32px 24px", textAlign: "center", color: "var(--d-muted)", fontSize: 13 }}>
              No sold vehicles yet — start adding inventory in{" "}
              <Link href="/admin/cars" style={{ color: "var(--d-gold)" }}>Car Listing</Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Car Model</th>
                    <th>Type</th>
                    <th>Date Added</th>
                    <th>Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats!.topCars.map((car) => (
                    <tr key={car.id}>
                      <td>
                        <div className="dash-car-cell">
                          {car.image
                            ? <img src={car.image} alt={car.name} className="dash-car-thumb" />
                            : <div className="dash-car-thumb-placeholder"><CarIcon size={14} /></div>
                          }
                          <span className="dash-car-name">{car.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "var(--d-muted)", fontSize: 12 }}>{car.fuelType} Car</td>
                      <td style={{ color: "var(--d-muted)", fontSize: 11 }}>{fmtDate(car.createdAt)}</td>
                      <td style={{ fontWeight: 600, color: "var(--d-text)" }}>{fmt(car.price)}</td>
                      <td>
                        <span className={`dash-status-badge ${
                          car.status === "available" ? "delivered"
                          : car.status === "reserved" ? "waiting"
                          : "cancelled"
                        }`}>
                          {car.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>{/* end dash-body */}
    </div>
  );
}
