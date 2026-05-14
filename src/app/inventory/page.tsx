"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Car } from "@/lib/cars";

// ─── Constants ────────────────────────────────────────────────────────────────
const BRANDS       = ["Aston Martin","Audi","Bentley","BMW","Cadillac","Ferrari","Genesis","Land Rover","Lamborghini","Lexus","Maserati","Mercedes","Porsche","Rolls-Royce","Tesla"];
const BODY_STYLES  = ["Sedan", "SUV", "Coupe", "Truck", "Wagon"];
const COLORS       = ["Black", "White", "Silver", "Blue", "Gray", "Red"];
const FUEL_TYPES   = ["Petrol", "Electric", "Hybrid"];
const YEARS        = [2025, 2024, 2023];
const PRICE_RANGES = [
  { label: "Under $40k",     min: 0,     max: 40000 },
  { label: "$40k – $50k",   min: 40000, max: 50000 },
  { label: "$50k – $60k",   min: 50000, max: 60000 },
  { label: "Over $60k",     min: 60000, max: Infinity },
];
const STATUSES       = ["available", "reserved", "sold"];

// ─── Navbar (shared) ──────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.7)",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
      backdropFilter: "blur(16px)",
      padding: "0 clamp(16px, 5vw, 48px)",
      transition: "background 0.4s, border-color 0.4s",
    }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, letterSpacing: "0.26em", color: "var(--white)", textDecoration: "none", fontWeight: 400 }}>
          UNIDRIVE
        </Link>
        <div className="m-desktop" style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {[["INVENTORY", "/inventory"], ["ABOUT", "/#about"], ["CONTACT", "/contact"]].map(([label, href]) => (
            <Link key={label} href={href} className="m-nav-link"
              style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.16em", color: label === "INVENTORY" ? "var(--white)" : "var(--mid)", fontWeight: label === "INVENTORY" ? 500 : 400 }}>
              {label}
            </Link>
          ))}
        </div>
        <Link href="/" className="m-mobile" style={{ display: "none", fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "0.16em", color: "var(--mid)", textDecoration: "none" }}>
          ← HOME
        </Link>
      </div>
    </nav>
  );
}

// ─── Footer (shared) ──────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { h: "VEHICLES",  links: ["ALL CARS", "NEW ARRIVALS", "CERTIFIED", "ELECTRIC"] },
    { h: "COMPANY",   links: ["ABOUT US", "ATELIER", "CAREERS", "PRESS"] },
    { h: "SUPPORT",   links: ["CONTACT", "DEALER FINDER", "FAQ", "WARRANTY"] },
  ];
  return (
    <footer className="footer-container" style={{ background: "var(--dark1)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: 56 }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "0.22em", color: "var(--white)", marginBottom: 6 }}>UNIDRIVE</div>
            <div style={{ fontSize: 8, letterSpacing: "0.30em", color: "var(--dim)", marginBottom: 20 }}>INDIVIDUALIZATION</div>
            <p style={{ fontSize: 10, color: "var(--dim)", lineHeight: 2, maxWidth: 240, fontWeight: 300 }}>
              Curated selection of premium and certified luxury vehicles. Every car, a masterpiece.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "var(--light)", fontWeight: 500, marginBottom: 22 }}>{col.h}</div>
              {col.links.map(l => <a key={l} href="#" className="m-footer-link">{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.10em", color: "var(--dim)" }}>© 2026 UNIDRIVE · ALL RIGHTS RESERVED</span>
          <span style={{ fontSize: 9, letterSpacing: "0.10em", color: "var(--dim)" }}>UNIVERSITY PROJECT</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Filter panel ─────────────────────────────────────────────────────────────
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "0.20em", color: "var(--light)", textTransform: "uppercase", fontWeight: 500 }}>{title}</span>
        <span style={{ color: "var(--dim)", fontSize: 8, transform: open ? "scaleY(-1)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && <div style={{ paddingBottom: 14, display: "flex", flexDirection: "column", gap: 9 }}>{children}</div>}
    </div>
  );
}

function Check({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{
          width: 13, height: 13, border: `1px solid ${checked ? "var(--white)" : "var(--dim)"}`,
          background: checked ? "var(--white)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "all 0.2s",
        }} onClick={onChange}>
          {checked && <span style={{ color: "var(--black)", fontSize: 8, fontWeight: 700 }}>✓</span>}
        </span>
        <span style={{ fontFamily: "var(--sans)", fontSize: 10, color: checked ? "var(--white)" : "var(--mid)", letterSpacing: "0.04em", transition: "color 0.2s" }}>{label}</span>
      </div>
      <span style={{ fontSize: 9, color: "var(--dim)", minWidth: 20, textAlign: "right" }}>{count}</span>
    </label>
  );
}

// ─── Main inventory component ─────────────────────────────────────────────────
function InventoryContent() {
  const searchParams = useSearchParams();

  const [searchText,      setSearchText]      = useState("");
  const [selectedBrands,  setSelectedBrands]  = useState<string[]>([]);
  const [selectedBodies,  setSelectedBodies]  = useState<string[]>([]);
  const [selectedColors,  setSelectedColors]  = useState<string[]>([]);
  const [selectedYears,   setSelectedYears]   = useState<number[]>([]);
  const [selectedPrices,  setSelectedPrices]  = useState<string[]>([]);
  const [selectedFuels,   setSelectedFuels]   = useState<string[]>([]);
  const [selectedStatuses,setSelectedStatuses]= useState<string[]>([]);
  const [sortBy,          setSortBy]          = useState("price_asc");
  const [filteredCars,    setFilteredCars]    = useState<Car[]>([]);
  const [totalCount,      setTotalCount]      = useState(0);
  const [loading,         setLoading]         = useState(true);
  const [mobileOpen,      setMobileOpen]      = useState(false);

  useEffect(() => {
    const b = searchParams.get("brand");
    if (b) setSelectedBrands([b]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeFilters = [...selectedBrands, ...selectedBodies, ...selectedColors, ...selectedYears.map(String), ...selectedPrices, ...selectedFuels, ...selectedStatuses];

  const fetchFromAPI = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBrands.length === 1) params.set("brand", selectedBrands[0]);
      if (selectedBodies.length  === 1) params.set("body",  selectedBodies[0]);
      if (selectedFuels.length   === 1) params.set("fuel",  selectedFuels[0]);
      if (selectedStatuses.length=== 1) params.set("status",selectedStatuses[0]);
      if (selectedYears.length   === 1) params.set("year",  String(selectedYears[0]));
      if (selectedPrices.length  === 1) {
        const p = PRICE_RANGES.find(p => p.label === selectedPrices[0]);
        if (p) { params.set("minPrice", String(p.min)); if (p.max !== Infinity) params.set("maxPrice", String(p.max)); }
      }
      if (searchText.trim()) params.set("search", searchText.trim());
      params.set("sort", sortBy);

      const res = await fetch(`/api/cars?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data: Car[] = await res.json();

      // Client-side multi-select refinement for multiple selections
      let refined = data;
      if (selectedBrands.length > 1) refined = refined.filter(c => selectedBrands.includes(c.make));
      if (selectedBodies.length  > 1) refined = refined.filter(c => selectedBodies.includes(c.body));
      if (selectedFuels.length   > 1) refined = refined.filter(c => selectedFuels.includes(c.fuelType));
      if (selectedStatuses.length> 1) refined = refined.filter(c => selectedStatuses.includes(c.status));
      if (selectedYears.length   > 1) refined = refined.filter(c => selectedYears.includes(c.year));
      if (selectedColors.length)       refined = refined.filter(c => selectedColors.includes(c.color));
      if (selectedPrices.length  > 1) {
        refined = refined.filter(c => selectedPrices.some(l => {
          const p = PRICE_RANGES.find(p => p.label === l);
          return p ? c.price >= p.min && c.price < p.max : false;
        }));
      }

      setFilteredCars(refined);
      setTotalCount(refined.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchText, selectedBrands, selectedBodies, selectedColors, selectedYears, selectedPrices, selectedFuels, selectedStatuses, sortBy]);

  useEffect(() => { fetchFromAPI(); }, [fetchFromAPI]);

  function toggle<T>(arr: T[], v: T): T[] { return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]; }
  // Count helpers — approximate from current results since we no longer have the full static array
  const count = (_key: string, v: string | number) => filteredCars.filter(c => Object.values(c).includes(v)).length;
  const countP = (l: string) => { const p = PRICE_RANGES.find(p => p.label === l); return p ? filteredCars.filter(c => c.price >= p.min && c.price < p.max).length : 0; };
  const countF = (f: string) => filteredCars.filter(c => c.fuelType === f).length;
  const countS = (s: string) => filteredCars.filter(c => c.status === s).length;
  function clearAll() { setSearchText(""); setSelectedBrands([]); setSelectedBodies([]); setSelectedColors([]); setSelectedYears([]); setSelectedPrices([]); setSelectedFuels([]); setSelectedStatuses([]); }
  function remove(l: string) { setSelectedBrands(p => p.filter(x => x !== l)); setSelectedBodies(p => p.filter(x => x !== l)); setSelectedColors(p => p.filter(x => x !== l)); setSelectedYears(p => p.filter(x => String(x) !== l)); setSelectedPrices(p => p.filter(x => x !== l)); setSelectedFuels(p => p.filter(x => x !== l)); setSelectedStatuses(p => p.filter(x => x !== l)); }

  const sidebar = (
    <>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input type="text" placeholder="Search model, brand…" value={searchText} onChange={e => setSearchText(e.target.value)}
          style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid var(--border2)", color: "var(--white)", fontFamily: "var(--sans)", fontSize: 10, padding: "8px 0", outline: "none", letterSpacing: "0.06em" }}
        />
        {searchText && <button onClick={() => setSearchText("")} style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--dim)", cursor: "pointer" }}>✕</button>}
      </div>
      <FilterSection title="Brand">
        {BRANDS.map(b => <Check key={b} label={b} count={count("make", b)} checked={selectedBrands.includes(b)} onChange={() => setSelectedBrands(toggle(selectedBrands, b))} />)}
      </FilterSection>
      <FilterSection title="Body Style">
        {BODY_STYLES.map(b => <Check key={b} label={b} count={count("body", b)} checked={selectedBodies.includes(b)} onChange={() => setSelectedBodies(toggle(selectedBodies, b))} />)}
      </FilterSection>
      <FilterSection title="Fuel Type">
        {FUEL_TYPES.map(f => <Check key={f} label={f} count={countF(f)} checked={selectedFuels.includes(f)} onChange={() => setSelectedFuels(toggle(selectedFuels, f))} />)}
      </FilterSection>
      <FilterSection title="Year">
        {YEARS.map(y => <Check key={y} label={String(y)} count={count("year", y)} checked={selectedYears.includes(y)} onChange={() => setSelectedYears(toggle(selectedYears, y))} />)}
      </FilterSection>
      <FilterSection title="Price">
        {PRICE_RANGES.map(r => <Check key={r.label} label={r.label} count={countP(r.label)} checked={selectedPrices.includes(r.label)} onChange={() => setSelectedPrices(toggle(selectedPrices, r.label))} />)}
      </FilterSection>
      <FilterSection title="Color">
        {COLORS.map(col => <Check key={col} label={col} count={count("color", col)} checked={selectedColors.includes(col)} onChange={() => setSelectedColors(toggle(selectedColors, col))} />)}
      </FilterSection>
      <FilterSection title="Status">
        {STATUSES.map(s => <Check key={s} label={s.toUpperCase()} count={countS(s)} checked={selectedStatuses.includes(s)} onChange={() => setSelectedStatuses(toggle(selectedStatuses, s))} />)}
      </FilterSection>
    </>
  );

  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", fontFamily: "var(--sans)", color: "var(--white)" }}>
      <Navbar />

      {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 68, borderBottom: "1px solid var(--border)", padding: "110px 48px 44px" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--dim)", marginBottom: 20 }}>
            <Link href="/" style={{ color: "var(--dim)", textDecoration: "none" }}>HOME</Link>
            <span style={{ margin: "0 12px" }}>/</span>
            <span style={{ color: "var(--light)" }}>INVENTORY</span>
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 6vw, 72px)", letterSpacing: "0.08em", fontWeight: 400, lineHeight: 1, marginBottom: 14 }}>
            VEHICLES
          </h1>
          <p style={{ fontSize: 11, color: "var(--mid)", letterSpacing: "0.10em", fontWeight: 300 }}>
            {loading ? "Loading..." : `${totalCount} CARS AVAILABLE`}
          </p>
        </div>
      </div>

      {/* ── LAYOUT ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "48px 48px", display: "flex", gap: 48, alignItems: "flex-start" }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside style={{ width: 220, flexShrink: 0, position: "sticky", top: 88 }} className="m-desktop">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 14, letterSpacing: "0.10em", fontWeight: 400 }}>FILTER</span>
            {activeFilters.length > 0 && (
              <button onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 8, letterSpacing: "0.15em", color: "var(--dim)", textTransform: "uppercase" }}>
                CLEAR ALL
              </button>
            )}
          </div>
          {sidebar}
        </aside>

        {/* ── MAIN ────────────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Mobile filter button */}
          <button className="m-mobile" onClick={() => setMobileOpen(true)}
            style={{ display: "none", width: "100%", fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "0.18em", padding: "13px", border: "1px solid var(--border2)", background: "none", color: "var(--white)", cursor: "pointer", marginBottom: 20, textTransform: "uppercase" }}>
            FILTER {activeFilters.length > 0 && `(${activeFilters.length})`}
          </button>

          {/* Mobile overlay */}
          {mobileOpen && (
            <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)" }} onClick={() => setMobileOpen(false)} />
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "var(--dark1)", overflow: "auto", padding: "32px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <span style={{ fontFamily: "var(--serif)", fontSize: 14, letterSpacing: "0.10em" }}>FILTER</span>
                  <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "var(--mid)", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                {sidebar}
                <button onClick={() => setMobileOpen(false)} className="m-btn-fill" style={{ width: "100%", textAlign: "center", marginTop: 24 }}>
                  VIEW {filteredCars.length} RESULTS
                </button>
              </div>
            </div>
          )}

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--mid)" }}>
              <span style={{ color: "var(--white)", fontFamily: "var(--serif)", fontSize: 16 }}>{filteredCars.length}</span>
              {" "}RESULTS
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ background: "transparent", border: "none", color: "var(--mid)", fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "0.12em", cursor: "pointer", outline: "none", textTransform: "uppercase" }}>
              <option value="price_asc" style={{ background: "#000" }}>PRICE: LOW – HIGH</option>
              <option value="price_desc" style={{ background: "#000" }}>PRICE: HIGH – LOW</option>
              <option value="year_desc" style={{ background: "#000" }}>YEAR: NEWEST</option>
              <option value="year_asc" style={{ background: "#000" }}>YEAR: OLDEST</option>
            </select>
          </div>

          {/* Active chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {activeFilters.map(f => (
                <button key={f} onClick={() => remove(f)} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid var(--border2)", color: "var(--light)", fontFamily: "var(--sans)", fontSize: 8, letterSpacing: "0.14em", padding: "5px 10px", cursor: "pointer", textTransform: "uppercase" }}>
                  {f} <span style={{ color: "var(--dim)", fontSize: 9 }}>×</span>
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          {filteredCars.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center", borderTop: "1px solid var(--border)" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 12, fontWeight: 400 }}>NO VEHICLES FOUND</p>
              <p style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.10em", marginBottom: 28 }}>ADJUST YOUR FILTERS TO SEE MORE RESULTS</p>
              <button onClick={clearAll} className="m-btn">CLEAR ALL FILTERS</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 2, background: "var(--border)" }}>
              {filteredCars.map(car => (
                <Link key={car.id} href={`/inventory/${car.id}`} style={{ textDecoration: "none", color: "inherit", background: "var(--black)", display: "block", overflow: "hidden" }}
                  onMouseEnter={e => { const img = (e.currentTarget as HTMLElement).querySelector("img"); if (img) img.style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { const img = (e.currentTarget as HTMLElement).querySelector("img"); if (img) img.style.transform = "scale(1)"; }}>

                  {/* Image */}
                  <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9" }}>
                    <img src={car.image} alt={car.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }} />
                    {/* Status pill */}
                    <span style={{ position: "absolute", top: 12, left: 12, fontSize: 7, letterSpacing: "0.18em", padding: "4px 10px", textTransform: "uppercase", background: "rgba(0,0,0,0.75)", color: "var(--light)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
                      {car.status}
                    </span>
                  </div>

                  {/* Title row */}
                  <div style={{ padding: "18px 18px 14px", borderBottom: "0px solid var(--border)" }}>
                    <div style={{ fontSize: 8, letterSpacing: "0.22em", color: "var(--mid)", textTransform: "uppercase", marginBottom: 5 }}>{car.make} · {car.year}</div>
                    <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, letterSpacing: "0.06em", fontWeight: 400, color: "var(--white)" }}>{car.name.toUpperCase()}</h3>
                    <p style={{ fontSize: 9, color: "var(--dim)", letterSpacing: "0.08em", marginTop: 3 }}>{car.trim} · {car.body}</p>
                  </div>

                  {/* Price + CTA row */}
                  <div className="card-actions" style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="card-price-block">
                      <p style={{ fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "0.04em", color: "var(--white)" }}>${car.price.toLocaleString()}</p>
                      <p style={{ fontSize: 8, color: "var(--dim)", letterSpacing: "0.12em", marginTop: 2 }}>MSRP</p>
                    </div>
                    <span className="m-btn btn-details" style={{ fontSize: 8, padding: "9px 18px" }}>DETAILS</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#000" }} />}>
      <InventoryContent />
    </Suspense>
  );
}
