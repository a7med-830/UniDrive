"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  XCircle,
  Clock,
  CheckCircle2,
  User,
  Car as CarIcon,
  Activity,
} from "lucide-react";
import { formatStatusLabel } from "@/lib/booking";
import "../cars/cars.css";
import "./appointments.css";

type Car = {
  make: string;
  model: string;
  name: string;
};

type Appointment = {
  id: number;
  carId: number | null;
  clientName: string;
  clientEmail: string | null;
  scheduledAt: string;
  status: string;
  bookingType: string | null;
  contactMethod: string | null;
  notes: string | null;
  car?: Car | null;
};

const initialForm = {
  carId: "",
  clientName: "",
  clientEmail: "",
  scheduledAt: "",
  notes: "",
  status: "under reviewing",
};

function statusBadgeClass(status: string): string {
  switch (status) {
    case "under reviewing":
      return "appt-badge appt-badge--review";
    case "confirmed":
      return "appt-badge appt-badge--confirmed";
    case "completed":
      return "appt-badge appt-badge--completed";
    case "cancelled":
      return "appt-badge appt-badge--cancelled";
    default:
      return "appt-badge";
  }
}

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailApp, setDetailApp] = useState<Appointment | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<typeof initialForm>(initialForm);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenModal = (app?: Appointment) => {
    if (app) {
      setEditingId(app.id);
      setFormData({
        carId: app.carId != null ? String(app.carId) : "",
        clientName: app.clientName,
        clientEmail: app.clientEmail || "",
        scheduledAt: new Date(app.scheduledAt).toISOString().slice(0, 16),
        notes: app.notes || "",
        status: app.status,
      });
    } else {
      setEditingId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (detailApp?.id === id) setDetailApp(null);
        fetchAppointments();
      } else {
        alert("Failed to delete appointment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = editingId !== null;
      const url = isEdit ? `/api/appointments/${editingId}` : `/api/appointments`;
      const method = isEdit ? "PUT" : "POST";

      const payload = isEdit
        ? {
            status: formData.status,
            notes: formData.notes,
            scheduledAt: new Date(formData.scheduledAt).toISOString(),
          }
        : {
            carId: formData.carId ? parseInt(formData.carId) : null,
            clientName: formData.clientName,
            clientEmail: formData.clientEmail,
            scheduledAt: new Date(formData.scheduledAt).toISOString(),
            notes: formData.notes,
            status: formData.status,
          };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        handleCloseModal();
        fetchAppointments();
      } else {
        const data = await res.json();
        alert(`Error: ${JSON.stringify(data.error)}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save appointment");
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchAppointments();
        if (detailApp?.id === id) {
          setDetailApp((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter(
    (app) =>
      app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.car?.name.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (app.bookingType?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Bookings", val: appointments.length, icon: CalendarDays, idx: "01" },
    {
      label: "Under Review",
      val: appointments.filter((a) => a.status === "under reviewing").length,
      icon: Clock,
      idx: "02",
    },
    {
      label: "Confirmed",
      val: appointments.filter((a) => a.status === "confirmed").length,
      icon: CheckCircle2,
      idx: "03",
    },
    {
      label: "Cancelled",
      val: appointments.filter((a) => a.status === "cancelled").length,
      icon: XCircle,
      idx: "04",
    },
  ];

  const inp = {
    background: "var(--inv-card)",
    border: "1px solid var(--inv-border)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "var(--inv-text)",
    fontSize: 13,
    outline: "none",
    fontFamily: "var(--inv-sans)",
    width: "100%",
  } as React.CSSProperties;

  const lbl = {
    fontSize: 10,
    fontWeight: 700,
    color: "var(--inv-dim)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
  };

  return (
    <div className="inv-root">
      <div className="inv-header">
        <div>
          <p className="inv-header-eyebrow">Client Services</p>
          <h1 className="inv-header-title">Appointments</h1>
        </div>
        <button className="inv-add-btn" onClick={() => handleOpenModal()}>
          <Plus size={15} />
          New Booking
        </button>
      </div>

      <div className="inv-stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="inv-stat-card">
              <div className="inv-stat-top">
                <Icon size={20} className="inv-stat-icon" />
                <span className="inv-stat-idx">{s.idx}</span>
              </div>
              <p className="inv-stat-label">{s.label}</p>
              <p className="inv-stat-value">{s.val}</p>
              <div className="inv-stat-bar" />
            </div>
          );
        })}
      </div>

      <div className="inv-table-card">
        <div className="inv-toolbar">
          <span className="inv-toolbar-title">Client Ledger</span>
          <div className="inv-toolbar-right">
            <div className="inv-search-wrap">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search clients, vehicles, types..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inv-search-input"
              />
            </div>
          </div>
        </div>

        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Booking Type</th>
                <th>Contact</th>
                <th>Vehicle</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "80px 0", textAlign: "center" }}>
                    <Activity
                      className="inv-loading-icon"
                      size={32}
                      style={{ animation: "spin 2s linear infinite", margin: "0 auto 16px", color: "var(--inv-gold)" }}
                    />
                    <p className="inv-loading-text">Synchronizing Appointments</p>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "80px 0", textAlign: "center", color: "var(--inv-muted)" }}>
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr
                    key={app.id}
                    className="appt-row-clickable"
                    onClick={() => setDetailApp(app)}
                  >
                    <td>
                      <div className="inv-car-cell">
                        <div className="inv-car-thumb-ph" style={{ borderRadius: "50%" }}>
                          <User size={16} />
                        </div>
                        <div className="inv-car-info">
                          <span className="inv-car-name">{app.clientName}</span>
                          <span className="inv-car-meta" style={{ marginTop: 2 }}>
                            {app.clientEmail || "NO EMAIL"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--inv-text)" }}>
                        {app.bookingType || "—"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--inv-muted)" }}>
                        {app.contactMethod || "—"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <CarIcon size={14} color="var(--inv-dim)" />
                        <span style={{ fontSize: 13, color: "var(--inv-text)", fontWeight: 500 }}>
                          {app.car ? `${app.car.make} ${app.car.model}` : "General"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize: 13, color: "var(--inv-text)", fontWeight: 500 }}>
                        {new Date(app.scheduledAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </td>
                    <td>
                      <span className={statusBadgeClass(app.status)}>
                        {formatStatusLabel(app.status)}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="inv-actions">
                        {app.status === "under reviewing" && (
                          <button
                            type="button"
                            onClick={() => updateStatus(app.id, "confirmed")}
                            className="appt-quick-btn appt-quick-btn--primary"
                            style={{ padding: "4px 10px", fontSize: 9 }}
                          >
                            Confirm
                          </button>
                        )}
                        <button className="inv-action-btn" onClick={() => handleOpenModal(app)}>
                          <Pencil size={14} />
                        </button>
                        <button className="inv-action-btn" onClick={() => handleDelete(app.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detailApp && typeof document !== "undefined" && createPortal(
        <div className="appt-detail-overlay" onClick={() => setDetailApp(null)}>
          <div className="appt-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="appt-detail-head">
              <div>
                <p style={{ fontSize: 10, color: "var(--inv-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                  Appointment #{detailApp.id}
                </p>
                <h2 style={{ fontFamily: "var(--inv-serif)", fontSize: 24, margin: 0 }}>{detailApp.clientName}</h2>
                <span className={statusBadgeClass(detailApp.status)} style={{ marginTop: 12, display: "inline-block" }}>
                  {formatStatusLabel(detailApp.status)}
                </span>
              </div>
              <button type="button" className="inv-modal-close" onClick={() => setDetailApp(null)}>
                <XCircle size={22} />
              </button>
            </div>

            <div className="appt-detail-body">
              {[
                { label: "Booking Type", value: detailApp.bookingType || "Not specified" },
                { label: "Contact Method", value: detailApp.contactMethod || "Not specified" },
                { label: "Email", value: detailApp.clientEmail || "—" },
                {
                  label: "Vehicle",
                  value: detailApp.car
                    ? `${detailApp.car.make} ${detailApp.car.model} — ${detailApp.car.name}`
                    : "General / No vehicle",
                },
                {
                  label: "Scheduled",
                  value: new Date(detailApp.scheduledAt).toLocaleString([], {
                    dateStyle: "full",
                    timeStyle: "short",
                  }),
                },
                { label: "Notes", value: detailApp.notes || "No notes" },
              ].map((field) => (
                <div key={field.label} className="appt-detail-field">
                  <label>{field.label}</label>
                  <p style={{ whiteSpace: "pre-wrap" }}>{field.value}</p>
                </div>
              ))}

              <div className="appt-detail-field">
                <label>Update Status</label>
                <select
                  value={detailApp.status}
                  onChange={(e) => updateStatus(detailApp.id, e.target.value)}
                  style={inp}
                >
                  <option value="under reviewing">Under Review</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="appt-detail-actions">
              {detailApp.status === "under reviewing" && (
                <button
                  type="button"
                  className="appt-quick-btn appt-quick-btn--primary"
                  onClick={() => updateStatus(detailApp.id, "confirmed")}
                >
                  Confirm Booking
                </button>
              )}
              {detailApp.status === "confirmed" && (
                <button
                  type="button"
                  className="appt-quick-btn"
                  onClick={() => updateStatus(detailApp.id, "completed")}
                >
                  Mark Completed
                </button>
              )}
              <button
                type="button"
                className="appt-quick-btn"
                onClick={() => {
                  setDetailApp(null);
                  handleOpenModal(detailApp);
                }}
              >
                Edit Details
              </button>
              <button
                type="button"
                className="appt-quick-btn appt-quick-btn--danger"
                onClick={() => updateStatus(detailApp.id, "cancelled")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="inv-modal-overlay">
          <div className="inv-modal-panel" style={{ maxWidth: "600px" }}>
            <div className="inv-modal-head">
              <div>
                <p className="inv-modal-eyebrow">Client Relationship</p>
                <h2 className="inv-modal-title">
                  {editingId ? "Update Booking" : "Register Booking"}
                </h2>
              </div>
              <button className="inv-modal-close" onClick={handleCloseModal}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="inv-modal-form">
              <div className="inv-form-grid">
                {!editingId && (
                  <>
                    <div className="inv-field inv-field--full">
                      <label style={lbl}>Vehicle ID (optional)</label>
                      <input
                        type="number"
                        style={inp}
                        placeholder="Leave empty for general bookings"
                        value={formData.carId}
                        onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                      />
                    </div>
                    <div className="inv-field">
                      <label style={lbl}>Client Full Name</label>
                      <input
                        type="text"
                        required
                        style={inp}
                        value={formData.clientName}
                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      />
                    </div>
                    <div className="inv-field">
                      <label style={lbl}>Contact Email</label>
                      <input
                        type="email"
                        style={inp}
                        placeholder="CLIENT@EXAMPLE.COM"
                        value={formData.clientEmail}
                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div className="inv-field">
                  <label style={lbl}>Scheduled Window</label>
                  <input
                    type="datetime-local"
                    required
                    style={{ ...inp, colorScheme: "dark" }}
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  />
                </div>

                <div className="inv-field">
                  <label style={lbl}>Status</label>
                  <select
                    style={inp}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="under reviewing">Under Review</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {editingId && (
                  <div className="inv-field inv-field--full" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {formData.status === "under reviewing" && (
                      <button
                        type="button"
                        className="appt-quick-btn appt-quick-btn--primary"
                        onClick={() => setFormData({ ...formData, status: "confirmed" })}
                      >
                        Quick: Confirm
                      </button>
                    )}
                    {formData.status === "confirmed" && (
                      <button
                        type="button"
                        className="appt-quick-btn"
                        onClick={() => setFormData({ ...formData, status: "completed" })}
                      >
                        Quick: Complete
                      </button>
                    )}
                  </div>
                )}

                <div className="inv-field inv-field--full">
                  <label style={lbl}>Internal Notes</label>
                  <textarea
                    rows={3}
                    style={{ ...inp, resize: "vertical" }}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="inv-modal-footer" style={{ marginTop: "30px" }}>
                <button type="button" className="inv-btn-cancel" onClick={handleCloseModal}>
                  Discard
                </button>
                <button type="submit" className="inv-btn-submit">
                  {editingId ? "Commit Updates" : "Register Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
