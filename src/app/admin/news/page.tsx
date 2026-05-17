"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Plus, Trash2, XCircle, Activity, Pencil } from "lucide-react";
import "../cars/cars.css";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminNews() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);

  // News form state
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("NEWS");
  const [newsImage, setNewsImage] = useState("");
  const [newsDate, setNewsDate] = useState("");
  const [newsFile, setNewsFile] = useState<File | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
      setNews(Array.isArray(data) ? data : []);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleOpenModal = (article?: any) => {
    if (article) {
      setEditingNewsId(article.id);
      setNewsTitle(article.title);
      setNewsCategory(article.category || "");
      setNewsImage(article.image || "");
      setNewsDate(article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : "");
    } else {
      setEditingNewsId(null);
      setNewsTitle("");
      setNewsCategory("NEWS");
      setNewsImage("");
      setNewsDate("");
    }
    setNewsFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNewsId(null);
    setNewsTitle("");
    setNewsCategory("NEWS");
    setNewsImage("");
    setNewsDate("");
    setNewsFile(null);
  };

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingNews(true);
    let finalImageUrl = newsImage;

    try {
      if (newsFile) {
        const formData = new FormData();
        formData.append("file", newsFile);
        const uploadRes = await fetch("/api/news/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          finalImageUrl = uploadData.url;
        }
      }

      const isEdit = editingNewsId !== null;
      const url = isEdit ? `/api/news?id=${editingNewsId}` : "/api/news";
      
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newsTitle,
          category: newsCategory,
          image: finalImageUrl,
          publishedAt: newsDate || new Date().toISOString()
        })
      });

      if (res.ok) {
        handleCloseModal();
        load();
      } else {
        alert("Failed to add news");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding news");
    } finally {
      setIsAddingNews(false);
    }
  };

  const handleDeleteNews = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    try {
      const res = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        load();
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    fontSize: 10, fontWeight: 700, color: "var(--inv-dim)",
    textTransform: "uppercase" as const, letterSpacing: "0.2em",
  };

  return (
    <div className="inv-root">
      {/* ── Page Header ── */}
      <div className="inv-header">
        <div>
          <p className="inv-header-eyebrow">Press &amp; Media</p>
          <h1 className="inv-header-title">News &amp; Events</h1>
        </div>
        <button className="inv-add-btn" onClick={handleOpenModal}>
          <Plus size={15} />
          Add Article
        </button>
      </div>

      {/* ── News Table Card ── */}
      <div className="inv-table-card">
        <div className="inv-toolbar">
          <span className="inv-toolbar-title">Published Articles</span>
        </div>

        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Article Title</th>
                <th>Category</th>
                <th>Date</th>
                <th className="inv-th-center">Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <div className="inv-loading">
                      <Activity size={28} className="inv-loading-icon" />
                      <p className="inv-loading-text">Loading news…</p>
                    </div>
                  </td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "40px", color: "var(--inv-muted)" }}>
                    No news articles found
                  </td>
                </tr>
              ) : news.map(item => (
                <tr key={item.id} className="inv-row">
                  <td>
                    <div className="inv-car-cell">
                      <div className="inv-car-thumb-wrap">
                        {item.image
                          ? <img src={item.image} alt={item.title} className="inv-car-thumb" style={{ objectFit: "cover" }} />
                          : <div className="inv-car-thumb-empty"><MessageSquare size={18} strokeWidth={1.4} /></div>
                        }
                        <div className="inv-car-thumb-overlay" />
                      </div>
                      <div>
                        <p className="inv-car-name">{item.title}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="inv-spec-year">{item.category || "NEWS"}</span>
                  </td>
                  <td>
                    <span className="inv-spec-year">{fmtDate(item.publishedAt)}</span>
                  </td>
                  <td>
                    <div className="inv-actions">
                      <button className="inv-action-btn inv-action-btn--edit"
                        onClick={() => handleOpenModal(item)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="inv-action-btn inv-action-btn--del"
                        onClick={() => handleDeleteNews(item.id)} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="inv-modal-overlay">
          <div className="inv-modal-panel" style={{ maxWidth: 600 }}>
            <div className="inv-modal-head">
              <div>
                <p className="inv-modal-eyebrow">Press &amp; Media</p>
                <h2 className="inv-modal-title">{editingNewsId ? "Edit Article" : "Add Article"}</h2>
              </div>
              <button className="inv-modal-close" onClick={handleCloseModal}>
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleAddNews} className="inv-modal-form">
              <div className="inv-form-grid" style={{ gridTemplateColumns: "1fr" }}>
                <div className="inv-field inv-field--full">
                  <label style={lbl}>Article Title</label>
                  <input type="text" required placeholder="The new Lamborghini Aventador SVJ" style={inp}
                    value={newsTitle} onChange={e => setNewsTitle(e.target.value)} />
                </div>

                <div className="inv-form-grid" style={{ gap: 24 }}>
                  <div className="inv-field">
                    <label style={lbl}>Category</label>
                    <input type="text" placeholder="e.g. BODY KITS" style={inp}
                      value={newsCategory} onChange={e => setNewsCategory(e.target.value)} />
                  </div>
                  <div className="inv-field">
                    <label style={lbl}>Date</label>
                    <input type="date" style={{ ...inp, colorScheme: "dark" }}
                      value={newsDate} onChange={e => setNewsDate(e.target.value)} />
                  </div>
                </div>

                <div className="inv-field inv-field--full">
                  <label style={lbl}>Image URL or File</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    <input type="text" placeholder="https://..." style={{ ...inp, flex: 1 }}
                      value={newsImage} onChange={e => { setNewsImage(e.target.value); setNewsFile(null); }} />
                    <label style={{ ...inp, width: 140, padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", whiteSpace: "nowrap" }}>
                      {newsFile ? (newsFile.name.length > 12 ? newsFile.name.slice(0, 10) + '...' : newsFile.name) : "Upload"}
                      <input type="file" accept="image/*" style={{ position: "absolute", opacity: 0, left: 0, top: 0, width: "100%", height: "100%", cursor: "pointer" }}
                        onChange={e => { if (e.target.files?.[0]) { setNewsFile(e.target.files[0]); setNewsImage(""); } }} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="inv-modal-footer">
                <button type="button" className="inv-btn-cancel" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" disabled={isAddingNews} className="inv-btn-submit">
                  {isAddingNews ? "Saving..." : (editingNewsId ? "Save Changes" : "Add Article")}
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
