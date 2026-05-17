"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Mail, Trash2, XCircle, Activity, User } from "lucide-react";
import "../cars/cars.css";
import "../appointments/appointments.css";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        if (selected?.id === id) setSelected(null);
        fetchMessages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inv-root">
      <div className="inv-header">
        <div>
          <p className="inv-header-eyebrow">Client Communications</p>
          <h1 className="inv-header-title">Contact Messages</h1>
        </div>
      </div>

      <div className="inv-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <div className="inv-stat-card">
          <div className="inv-stat-top">
            <Mail size={20} className="inv-stat-icon" />
            <span className="inv-stat-idx">01</span>
          </div>
          <p className="inv-stat-label">Total Messages</p>
          <p className="inv-stat-value">{messages.length}</p>
          <div className="inv-stat-bar" />
        </div>
      </div>

      <div className="inv-table-card">
        <div className="inv-toolbar">
          <span className="inv-toolbar-title">Inbox</span>
          <div className="inv-toolbar-right">
            <div className="inv-search-wrap">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search messages..."
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
                <th>From</th>
                <th>Message</th>
                <th>Received</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: "80px 0", textAlign: "center" }}>
                    <div className="inv-loading">
                      <Activity size={32} className="inv-loading-icon" />
                      <p className="inv-loading-text">Loading messages</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "80px 0", textAlign: "center", color: "var(--inv-muted)" }}>
                    No contact messages yet.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => (
                  <tr key={msg.id} className="appt-row-clickable" onClick={() => setSelected(msg)}>
                    <td>
                      <div className="inv-car-cell">
                        <div className="inv-car-thumb-ph" style={{ borderRadius: "50%" }}>
                          <User size={16} />
                        </div>
                        <div className="inv-car-info">
                          <span className="inv-car-name">{msg.name}</span>
                          <span className="inv-car-meta" style={{ marginTop: 2 }}>{msg.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize: 13, color: "var(--inv-muted)", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {msg.message}
                      </p>
                    </td>
                    <td>
                      <p style={{ fontSize: 13, color: "var(--inv-text)" }}>
                        {new Date(msg.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="inv-actions">
                        <button className="inv-action-btn" onClick={() => handleDelete(msg.id)}>
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

      {selected && typeof document !== "undefined" && createPortal(
        <div className="appt-detail-overlay" onClick={() => setSelected(null)}>
          <div className="appt-detail-panel" onClick={(e) => e.stopPropagation()}>
            <div className="appt-detail-head">
              <div>
                <p style={{ fontSize: 10, color: "var(--inv-gold)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
                  Message #{selected.id}
                </p>
                <h2 style={{ fontFamily: "var(--inv-serif)", fontSize: 24, margin: 0 }}>{selected.name}</h2>
              </div>
              <button type="button" className="inv-modal-close" onClick={() => setSelected(null)}>
                <XCircle size={22} />
              </button>
            </div>
            <div className="appt-detail-body">
              <div className="appt-detail-field">
                <label>Email</label>
                <p>{selected.email}</p>
              </div>
              {selected.phone && (
                <div className="appt-detail-field">
                  <label>Phone</label>
                  <p>{selected.phone}</p>
                </div>
              )}
              <div className="appt-detail-field">
                <label>Received</label>
                <p>{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
              <div className="appt-detail-field">
                <label>Message</label>
                <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{selected.message}</p>
              </div>
            </div>
            <div className="appt-detail-actions">
              <a href={`mailto:${selected.email}`} className="appt-quick-btn appt-quick-btn--primary" style={{ textDecoration: "none" }}>
                Reply via Email
              </a>
              <button type="button" className="appt-quick-btn appt-quick-btn--danger" onClick={() => handleDelete(selected.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
