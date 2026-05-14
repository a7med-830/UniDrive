"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Search, Plus, Pencil, Trash2, Activity, Award,
  Car as CarIcon, Filter,
} from "lucide-react";
import "./cars.css";

type Car = {
  id: number; name: string; make: string; model: string;
  year: number; price: number; fuelType: string; status: string;
  body?: string | null; color?: string | null; mileage?: string | null;
  mpg?: string | null; badge?: string | null; trim?: string | null;
  engine?: string | null; transmission?: string | null;
  drivetrain?: string | null; seats?: number | null;
  description?: string | null; features?: string[];
  image?: string | null; images?: string[];
};

const initialForm = {
  name: "", make: "", model: "", year: 2024, price: 50000,
  fuelType: "Petrol", status: "available", body: "", color: "",
  mileage: "", mpg: "", badge: "", trim: "", engine: "",
  transmission: "", drivetrain: "", seats: 5, description: "",
  features: "", image: "", images: "",
};

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars?limit=1000");
      if (res.ok) setCars(await res.json());
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCars(); }, []);

  const handleOpenModal = (car?: Car) => {
    if (car) {
      setEditingCarId(car.id);
      setFormData({
        name: car.name, make: car.make, model: car.model,
        year: car.year, price: car.price, fuelType: car.fuelType,
        status: car.status, body: car.body || "", color: car.color || "",
        mileage: car.mileage || "", mpg: car.mpg || "",
        badge: car.badge || "", trim: car.trim || "",
        engine: car.engine || "", transmission: car.transmission || "",
        drivetrain: car.drivetrain || "", seats: car.seats || 5,
        description: car.description || "",
        features: car.features ? car.features.join(", ") : "",
        image: car.image || "",
        images: car.images ? car.images.join(", ") : "",
      });
    } else {
      setEditingCarId(null);
      setFormData(initialForm);
    }
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); setEditingCarId(null); setFormData(initialForm); setActiveTab("basic");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this vehicle?")) return;
    const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
    if (res.ok) fetchCars(); else alert("Failed to delete");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = editingCarId !== null;
    const res = await fetch(isEdit ? `/api/cars/${editingCarId}` : "/api/cars", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        year: Number(formData.year), price: Number(formData.price),
        seats: Number(formData.seats),
        features: formData.features.split(",").map(s => s.trim()).filter(Boolean),
        images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
      }),
    });
    if (res.ok) { handleCloseModal(); fetchCars(); }
    else { const d = await res.json(); alert(`Error: ${JSON.stringify(d.error)}`); }
  };

  const filtered = cars.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.make.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(c.make);
    const matchStatus = selectedStatuses.length === 0 || selectedStatuses.includes(c.status);
    const matchFuel = selectedFuels.length === 0 || selectedFuels.includes(c.fuelType);
    return matchSearch && matchBrand && matchStatus && matchFuel;
  });

  const toggleFilter = (set: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    set(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const stats = [
    { label: "Total Units",  val: cars.length,                                          icon: Award,       idx: "01" },
    { label: "Available",    val: cars.filter(c => c.status === "available").length,     icon: TrendingUp,  idx: "02" },
    { label: "Reserved",     val: cars.filter(c => c.status === "reserved").length,      icon: Activity,    idx: "03" },
    { label: "Sold",         val: cars.filter(c => c.status === "sold").length,          icon: CheckCircle2,idx: "04" },
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
    fontSize: 10, fontWeight: 700, color: "var(--inv-dim)",
    textTransform: "uppercase" as const, letterSpacing: "0.2em",
  };

  return (
    <div className="inv-root">
      {/* ── Page Header ── */}
      <div className="inv-header">
        <div>
          <p className="inv-header-eyebrow">Fleet &amp; Inventory</p>
          <h1 className="inv-header-title">Automotive Portfolio</h1>
        </div>
        <button className="inv-add-btn" onClick={() => handleOpenModal()}>
          <Plus size={15} />
          Add Vehicle
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="inv-stats-grid">
        {stats.map(s => {
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

      {/* ── Inventory Table Card ── */}
      <div className="inv-table-card">
        {/* Toolbar */}
        <div className="inv-toolbar">
          <span className="inv-toolbar-title">Current Inventory</span>
          <div className="inv-toolbar-right">
            <div className="inv-search-wrap">
              <Search size={14} />
              <input
                type="text"
                placeholder="Filter models..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="inv-search-input"
              />
            </div>
            <button className="inv-filter-btn" onClick={() => setIsFilterOpen(true)}><Filter size={14} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                <th>Vehicle &amp; Model</th>
                <th>Specifications</th>
                <th>Availability</th>
                <th>Valuation</th>
                <th className="inv-th-center">Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className="inv-loading">
                      <Activity size={28} className="inv-loading-icon" />
                      <p className="inv-loading-text">Loading inventory…</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px", color: "var(--inv-muted)" }}>
                    No vehicles found
                  </td>
                </tr>
              ) : filtered.map(car => (
                <tr key={car.id} className="inv-row">
                  <td>
                    <div className="inv-car-cell">
                      <div className="inv-car-thumb-wrap">
                        {car.image
                          ? <img src={car.image} alt={car.name} className="inv-car-thumb" />
                          : <div className="inv-car-thumb-empty"><CarIcon size={18} strokeWidth={1.4} /></div>
                        }
                        <div className="inv-car-thumb-overlay" />
                      </div>
                      <div>
                        <p className="inv-car-name">{car.name}</p>
                        <p className="inv-car-sub">{car.make} · {car.model}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="inv-spec-year">Year: {car.year}</span>
                    <span className="inv-spec-fuel">{car.fuelType} Engine</span>
                  </td>
                  <td>
                    <span className={`inv-status-dot inv-status-dot--${car.status}`} />
                    <span className={`inv-status-text inv-status-text--${car.status}`}>
                      {car.status}
                    </span>
                  </td>
                  <td>
                    <p className="inv-price">${car.price.toLocaleString()}</p>
                    <p className="inv-price-sub">MSRP Valuation</p>
                  </td>
                  <td>
                    <div className="inv-actions">
                      <button className="inv-action-btn inv-action-btn--edit"
                        onClick={() => handleOpenModal(car)} title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button className="inv-action-btn inv-action-btn--del"
                        onClick={() => handleDelete(car.id)} title="Delete">
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
          <div className="inv-modal-panel">
            <div className="inv-modal-head">
              <div>
                <p className="inv-modal-eyebrow">Inventory Management</p>
                <h2 className="inv-modal-title">
                  {editingCarId ? "Update Vehicle" : "Add Vehicle"}
                </h2>
              </div>
              <button className="inv-modal-close" onClick={handleCloseModal}>
                <XCircle size={22} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="inv-modal-tabs">
              <button 
                className={`inv-tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >Basic Info</button>
              <button 
                className={`inv-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >Specifications</button>
              <button 
                className={`inv-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
                onClick={() => setActiveTab('media')}
              >Media & Details</button>
            </div>

            <form onSubmit={handleSubmit} className="inv-modal-form">
              
              {/* TAB 1: Basic Info */}
              {activeTab === 'basic' && (
                <div className="inv-form-grid">
                  {[
                    { label: "Brand",  key: "make",  ph: "e.g. Ferrari" },
                    { label: "Model",  key: "model", ph: "e.g. Purosangue" },
                  ].map(f => (
                    <div key={f.key} className="inv-field">
                      <label style={lbl}>{f.label}</label>
                      <input type="text" required placeholder={f.ph} style={inp}
                        value={(formData as any)[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                    </div>
                  ))}

                  <div className="inv-field inv-field--full">
                    <label style={lbl}>Marketing Title</label>
                    <input type="text" required style={{ ...inp, fontFamily: "var(--inv-serif)", fontSize: 15 }}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>

                  {[
                    { label: "Year",       key: "year",  type: "number" },
                    { label: "Price (USD)",key: "price", type: "number" },
                  ].map(f => (
                    <div key={f.key} className="inv-field">
                      <label style={lbl}>{f.label}</label>
                      <input type={f.type} required style={inp}
                        value={(formData as any)[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: Number(e.target.value) })} />
                    </div>
                  ))}

                  {[
                    { label: "Fuel Type",    key: "fuelType", opts: ["Petrol","Electric","Hybrid"] },
                    { label: "Availability", key: "status",   opts: ["available","reserved","sold"] },
                  ].map(f => (
                    <div key={f.key} className="inv-field">
                      <label style={lbl}>{f.label}</label>
                      <select style={inp}
                        value={(formData as any)[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}>
                        {f.opts.map(o => <option key={o} value={o} style={{ background: "#18181f" }}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: Specifications */}
              {activeTab === 'specs' && (
                <div className="inv-form-grid">
                  {[
                    { label: "Body Type",       key: "body",         ph: "e.g. SUV" },
                    { label: "Color",            key: "color",        ph: "e.g. Midnight Black" },
                    { label: "Engine",           key: "engine",       ph: "e.g. 4.0L Twin-Turbo V8" },
                    { label: "Transmission",     key: "transmission", ph: "e.g. 8-Speed Auto" },
                    { label: "Drivetrain",       key: "drivetrain",   ph: "e.g. AWD" },
                    { label: "Mileage",          key: "mileage",      ph: "e.g. New" },
                    { label: "Fuel Economy MPG", key: "mpg",          ph: "e.g. 18 city / 25 hwy" },
                    { label: "Trim",             key: "trim",         ph: "e.g. Premium Luxury" },
                    { label: "Badge",            key: "badge",        ph: "e.g. New Arrival" },
                  ].map(f => (
                    <div key={f.key} className="inv-field">
                      <label style={lbl}>{f.label}</label>
                      <input type="text" style={inp} placeholder={f.ph}
                        value={(formData as any)[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })} />
                    </div>
                  ))}
                  <div className="inv-field">
                    <label style={lbl}>Seats</label>
                    <input type="number" min={1} style={inp}
                      value={formData.seats}
                      onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value || "1") })} />
                  </div>
                </div>
              )}

              {/* TAB 3: Media & Details */}
              {activeTab === 'media' && (
                <div className="inv-form-grid">
                  <div className="inv-field inv-field--full">
                    <label style={lbl}>Primary Image URL</label>
                    <input type="text" style={inp} placeholder="/images/car.jpg or https://..."
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })} />
                  </div>

                  <div className="inv-field inv-field--full">
                    <label style={lbl}>Additional Images (comma sep.)</label>
                    <input type="text" style={inp} placeholder="https://img1.jpg, https://img2.jpg"
                      value={formData.images}
                      onChange={e => setFormData({ ...formData, images: e.target.value })} />
                  </div>

                  <div className="inv-field inv-field--full">
                    <label style={lbl}>Features (comma sep.)</label>
                    <input type="text" style={inp} placeholder="Adaptive Cruise, Premium Audio, Panoramic Roof"
                      value={formData.features}
                      onChange={e => setFormData({ ...formData, features: e.target.value })} />
                  </div>

                  <div className="inv-field inv-field--full">
                    <label style={lbl}>Description</label>
                    <textarea rows={4} style={{ ...inp, resize: "vertical" }}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Short vehicle overview..." />
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="inv-modal-footer">
                {activeTab !== 'basic' && (
                  <button type="button" className="inv-btn-cancel" style={{ marginRight: 'auto' }}
                    onClick={() => setActiveTab(activeTab === 'media' ? 'specs' : 'basic')}>
                    &larr; Back
                  </button>
                )}
                
                <button type="button" className="inv-btn-cancel" onClick={handleCloseModal}>Cancel</button>
                
                {activeTab !== 'media' ? (
                  <button type="button" className="inv-btn-submit" 
                    onClick={() => setActiveTab(activeTab === 'basic' ? 'specs' : 'media')}>
                    Next &rarr;
                  </button>
                ) : (
                  <button type="submit" className="inv-btn-submit">
                    {editingCarId ? "Save Changes" : "Add Vehicle"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* ── Filter Drawer ── */}
      {isFilterOpen && typeof document !== 'undefined' && createPortal(
        <div className="inv-filter-drawer-overlay" onClick={() => setIsFilterOpen(false)}>
          <div className="inv-filter-drawer" onClick={e => e.stopPropagation()}>
            <div className="inv-filter-drawer-head">
              <h2 className="inv-filter-drawer-title">Filter Inventory</h2>
              <button className="inv-modal-close" onClick={() => setIsFilterOpen(false)}>
                <XCircle size={22} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '10px' }}>
              <div className="inv-field">
                <label style={lbl}>Brand</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  {Array.from(new Set(cars.map(c => c.make))).filter(Boolean).map(brand => (
                    <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--inv-text)' }}>
                      <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleFilter(setSelectedBrands, brand)} style={{ accentColor: 'var(--inv-gold)', width: '16px', height: '16px' }} />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              <div className="inv-field">
                <label style={lbl}>Availability</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  {['available', 'reserved', 'sold'].map(status => (
                    <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--inv-text)', textTransform: 'capitalize' }}>
                      <input type="checkbox" checked={selectedStatuses.includes(status)} onChange={() => toggleFilter(setSelectedStatuses, status)} style={{ accentColor: 'var(--inv-gold)', width: '16px', height: '16px' }} />
                      {status}
                    </label>
                  ))}
                </div>
              </div>

              <div className="inv-field">
                <label style={lbl}>Fuel Type</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                  {['Petrol', 'Electric', 'Hybrid'].map(fuel => (
                    <label key={fuel} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--inv-text)' }}>
                      <input type="checkbox" checked={selectedFuels.includes(fuel)} onChange={() => toggleFilter(setSelectedFuels, fuel)} style={{ accentColor: 'var(--inv-gold)', width: '16px', height: '16px' }} />
                      {fuel}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="inv-modal-footer" style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <button type="button" className="inv-btn-cancel" onClick={() => { setSelectedBrands([]); setSelectedStatuses([]); setSelectedFuels([]); }}>Clear All</button>
              <button type="button" className="inv-btn-submit" onClick={() => setIsFilterOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}
