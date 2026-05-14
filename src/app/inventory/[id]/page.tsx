"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { Car } from "@/lib/cars";

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.7)",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.08)" : "transparent"}`,
      backdropFilter: "blur(16px)", padding: "0 clamp(16px, 5vw, 48px)",
      transition: "background 0.4s, border-color 0.4s",
    }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontFamily: "var(--serif)", fontSize: 20, letterSpacing: "0.26em", color: "var(--white)", textDecoration: "none", fontWeight: 400 }}>
          UNIDRIVE
        </Link>
        <div className="m-desktop" style={{ display: "flex", gap: 40 }}>
          {[["INVENTORY", "/inventory"], ["ABOUT", "/#about"], ["CONTACT", "/#contact"]].map(([l, h]) => (
            <Link key={l} href={h} className="m-nav-link"
              style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.16em", color: "var(--mid)", textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
        <Link href="/inventory" className="m-mobile" style={{ display: "none", fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "0.14em", color: "var(--mid)", textDecoration: "none" }}>
          ← INVENTORY
        </Link>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { h: "VEHICLES", links: ["ALL CARS", "NEW ARRIVALS", "CERTIFIED"] },
    { h: "COMPANY",  links: ["ABOUT US", "CAREERS", "PRESS"] },
    { h: "SUPPORT",  links: ["CONTACT", "FAQ", "WARRANTY"] },
  ];
  return (
    <footer className="footer-container" style={{ background: "var(--dark1)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 20, letterSpacing: "0.22em", marginBottom: 6 }}>UNIDRIVE</div>
            <div style={{ fontSize: 8, letterSpacing: "0.28em", color: "var(--dim)", marginBottom: 16 }}>INDIVIDUALIZATION</div>
            <p style={{ fontSize: 10, color: "var(--dim)", lineHeight: 2, maxWidth: 220, fontWeight: 300 }}>Premium and certified luxury vehicles. Every car, a masterpiece.</p>
          </div>
          {cols.map(col => (
            <div key={col.h}>
              <div style={{ fontSize: 9, letterSpacing: "0.20em", color: "var(--light)", fontWeight: 500, marginBottom: 20 }}>{col.h}</div>
              {col.links.map(l => <a key={l} href="#" className="m-footer-link">{l}</a>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.10em", color: "var(--dim)" }}>© 2026 UNIDRIVE · ALL RIGHTS RESERVED</span>
          <span style={{ fontSize: 9, letterSpacing: "0.10em", color: "var(--dim)" }}>UNIVERSITY PROJECT</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────
export default function CarDetailPage() {
  const params = useParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const res = await fetch(`/api/cars/${id}`);
        if (!res.ok) {
          setCar(null);
          return;
        }
        const data = await res.json();
        const carData = {
          ...data,
          body: data.body ?? "",
          color: data.color ?? "",
          mileage: data.mileage ?? "",
          mpg: data.mpg ?? "",
          image: data.image ?? "",
          images: Array.isArray(data.images) ? data.images : [],
          badge: data.badge ?? "",
          trim: data.trim ?? "",
          engine: data.engine ?? "",
          transmission: data.transmission ?? "",
          drivetrain: data.drivetrain ?? "",
          seats: data.seats ?? 0,
          description: data.description ?? "",
          features: Array.isArray(data.features) ? data.features : [],
        } as Car;
        setCar(carData);
        if (carData.images && carData.images.length > 0) {
          setActiveImage(carData.images[0]);
        } else if (carData.image) {
          setActiveImage(carData.image);
        }
      } catch {
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [params.id]);

  const [activeImage, setActiveImage] = useState(car?.images?.[0] ?? "");
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [form, setForm]               = useState({ name: "", email: "", phone: "", message: "", scheduledAt: "" });
  const [submitted, setSubmitted]     = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayImage, setOverlayImage] = useState("");
  const [overlayImageIndex, setOverlayImageIndex] = useState(0);

  const THUMBNAILS_PER_PAGE = 4;
  const totalImages = car?.images?.length ?? 0;
  const totalPages = Math.ceil(totalImages / THUMBNAILS_PER_PAGE);
  const currentThumbnails = car?.images?.slice(thumbnailIndex, thumbnailIndex + THUMBNAILS_PER_PAGE) ?? [];

  const handlePrevThumbnails = () => {
    const allImages = car?.images ?? [];
    const currentIndex = allImages.indexOf(activeImage);
    const newIndex = currentIndex === 0 ? allImages.length - 1 : currentIndex - 1;
    setActiveImage(allImages[newIndex] ?? "");
    // Scroll thumbnail to show selected image
    const newThumbnailIndex = Math.max(0, Math.floor(newIndex / THUMBNAILS_PER_PAGE) * THUMBNAILS_PER_PAGE);
    setThumbnailIndex(Math.min(newThumbnailIndex, Math.max(0, totalImages - THUMBNAILS_PER_PAGE)));
  };

  const handleNextThumbnails = () => {
    const allImages = car?.images ?? [];
    const currentIndex = allImages.indexOf(activeImage);
    const newIndex = currentIndex === allImages.length - 1 ? 0 : currentIndex + 1;
    setActiveImage(allImages[newIndex] ?? "");
    // Scroll thumbnail to show selected image
    const newThumbnailIndex = Math.max(0, Math.floor(newIndex / THUMBNAILS_PER_PAGE) * THUMBNAILS_PER_PAGE);
    setThumbnailIndex(Math.min(newThumbnailIndex, Math.max(0, totalImages - THUMBNAILS_PER_PAGE)));
  };

  const handleOverlayPrev = () => {
    const newIndex = overlayImageIndex === 0 ? totalImages - 1 : overlayImageIndex - 1;
    setOverlayImageIndex(newIndex);
    setOverlayImage(car?.images?.[newIndex] ?? "");
  };

  const handleOverlayNext = () => {
    const newIndex = overlayImageIndex === totalImages - 1 ? 0 : overlayImageIndex + 1;
    setOverlayImageIndex(newIndex);
    setOverlayImage(car?.images?.[newIndex] ?? "");
  };

  const openOverlay = (image: string) => {
    const index = car?.images?.indexOf(image) ?? 0;
    setOverlayImageIndex(index);
    setOverlayImage(image);
    setShowOverlay(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car?.id,
          clientName: form.name,
          clientEmail: form.email,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          status: "under reviewing",
          notes: `Phone: ${form.phone}\nMessage: ${form.message}`
        })
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  // ── Input style ──────────────────────────────────────────────────────────────
  const inp: React.CSSProperties = {
    width: "100%", background: "transparent",
    border: "none", borderBottom: "1px solid rgba(255,255,255,0.15)",
    color: "var(--white)", fontFamily: "var(--sans)", fontSize: 11,
    padding: "10px 0", outline: "none", letterSpacing: "0.04em",
    transition: "border-color 0.2s",
  };
  const lbl: React.CSSProperties = {
    display: "block", fontSize: 8, letterSpacing: "0.22em",
    color: "var(--dim)", textTransform: "uppercase", marginBottom: 6, fontWeight: 500,
  };

  // ── Not found ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--black)", fontFamily: "var(--sans)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 10, letterSpacing: "0.14em", color: "var(--dim)" }}>LOADING VEHICLE...</p>
    </div>
  );

  if (!car) return (
    <div style={{ minHeight: "100vh", background: "var(--black)", fontFamily: "var(--sans)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 40px" }}>
      <Navbar />
      <p style={{ fontFamily: "var(--serif)", fontSize: 28, letterSpacing: "0.06em", marginBottom: 12, fontWeight: 400 }}>VEHICLE NOT FOUND</p>
      <p style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.10em", marginBottom: 32 }}>WE COULDN&apos;T FIND A VEHICLE WITH THAT ID</p>
      <Link href="/inventory" className="m-btn">← BACK TO INVENTORY</Link>
    </div>
  );

  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", fontFamily: "var(--sans)", color: "var(--white)" }}>
      <Navbar />

      {activeImage && (
        <div style={{ position: "relative", width: "100%", height: "70vh", minHeight: 420, overflow: "hidden", cursor: "pointer" }}
          onClick={() => openOverlay(activeImage)}>
          <img src={activeImage} alt={car.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.3s" }} />
          {/* Dark gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)" }} />
          {/* Expand button */}
          <button
            onClick={(e) => { e.stopPropagation(); openOverlay(activeImage); }}
            style={{
              position: "absolute",
              bottom: 48,
              right: 48,
              padding: "12px 20px",
              fontSize: 11,
              letterSpacing: "0.12em",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "rgba(255,255,255,0.8)",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              backdropFilter: "blur(4px)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.15)";
              (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,1)";
              (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
              (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
              (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.3)";
            }}
          >
            ⛶ EXPAND
          </button>
          {/* Hero text */}
          <div style={{ position: "absolute", bottom: 48, left: 48, right: 48 }}>
            <div style={{ fontSize: 8, letterSpacing: "0.28em", color: "var(--mid)", marginBottom: 10 }}>
              {car.make.toUpperCase()} · {car.year}
            </div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(28px, 5vw, 64px)", letterSpacing: "0.06em", fontWeight: 400, lineHeight: 1.05, marginBottom: 10 }}>
              {car.name.toUpperCase()}
            </h1>
            <p style={{ fontSize: 10, color: "var(--mid)", letterSpacing: "0.14em" }}>{car.trim} · {car.body}</p>
          </div>
          {/* Badge */}
          <span style={{ position: "absolute", top: 88, left: 48, fontSize: 7, letterSpacing: "0.20em", padding: "5px 12px", textTransform: "uppercase", background: "rgba(0,0,0,0.75)", color: "var(--light)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(4px)" }}>
            {car.badge}
          </span>
        </div>
      )}

      {/* ── THUMBNAIL STRIP ───────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, background: "var(--dark1)", padding: "2px 0", position: "relative" }}>
        {/* Left Arrow */}
        <button
          onClick={handlePrevThumbnails}
          style={{
            padding: "0 16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: "100px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
          }}
        >
          ‹
        </button>

        {/* Thumbnails */}
        <div style={{ display: "flex", gap: 2, flex: 1, overflow: "hidden" }}>
          {currentThumbnails.map((img, i) => (
            <button key={thumbnailIndex + i} onClick={() => setActiveImage(img)}
              style={{ padding: 0, background: "none", border: "none", cursor: "pointer", flex: "1 1 0", aspectRatio: "16/9", overflow: "hidden", opacity: activeImage === img ? 1 : 0.45, outline: activeImage === img ? "1px solid rgba(255,255,255,0.5)" : "none", outlineOffset: -1, transition: "opacity 0.2s" }}>
              {img && <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNextThumbnails}
          style={{
            padding: "0 16px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.6)",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: "100px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
          }}
        >
          ›
        </button>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div className="details-content" style={{ maxWidth: 1440, margin: "0 auto" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 9, letterSpacing: "0.16em", color: "var(--dim)", marginBottom: 48 }}>
          <Link href="/" style={{ color: "var(--dim)", textDecoration: "none" }}>HOME</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <Link href="/inventory" style={{ color: "var(--dim)", textDecoration: "none" }}>INVENTORY</Link>
          <span style={{ margin: "0 10px" }}>/</span>
          <span style={{ color: "var(--light)" }}>{car.year} {car.name.toUpperCase()}</span>
        </div>

        {/* ── TWO COLUMNS ─────────────────────────────────────────────────── */}
        <div className="details-grid" style={{ marginBottom: 80 }}>

          {/* LEFT: Specs + Features */}
          <div>

            {/* Price block */}
            <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: 32, marginBottom: 40 }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 4vw, 52px)", letterSpacing: "0.04em", fontWeight: 400, marginBottom: 6 }}>
                ${car.price.toLocaleString()}
              </p>
              <p style={{ fontSize: 9, color: "var(--dim)", letterSpacing: "0.16em" }}>MSRP — EXCLUDING TAXES AND FEES</p>
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: "var(--mid)", lineHeight: 2, letterSpacing: "0.04em", fontWeight: 300, maxWidth: 560, marginBottom: 48 }}>
              {car.description}
            </p>

            {/* Specs table */}
            <div style={{ marginBottom: 48 }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "0.08em", fontWeight: 400, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                SPECIFICATIONS
              </h2>
              <div className="specs-grid">
                {[
                  { label: "ENGINE",       value: car.engine },
                  { label: "TRANSMISSION", value: car.transmission },
                  { label: "DRIVETRAIN",   value: car.drivetrain },
                  { label: "MILEAGE",      value: car.mileage === "New" ? "Brand New" : `${car.mileage} mi` },
                  { label: "FUEL ECONOMY", value: car.mpg },
                  { label: "SEATING",      value: `${car.seats} Passengers` },
                  { label: "EXTERIOR",     value: car.color },
                  { label: "BODY",         value: car.body },
                ].map((s, i) => (
                  <div key={s.label} className={`spec-item ${i % 2 === 0 ? "spec-left" : "spec-right"}`}>
                    <p style={{ fontSize: 8, letterSpacing: "0.22em", color: "var(--dim)", marginBottom: 6 }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: "var(--light)", letterSpacing: "0.04em", fontWeight: 400 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: 18, letterSpacing: "0.08em", fontWeight: 400, marginBottom: 24, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                FEATURES & OPTIONS
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 0 }}>
                {car.features.map((feature) => (
                  <div key={feature} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--dim)", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "var(--mid)", letterSpacing: "0.04em" }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Enquiry panel */}
          <div>
            <div style={{ position: "sticky", top: 88, border: "1px solid var(--border)", padding: "36px 28px" }}>
              <p style={{ fontFamily: "var(--serif)", fontSize: 20, letterSpacing: "0.08em", fontWeight: 400, marginBottom: 6 }}>ENQUIRE</p>
              <p style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.08em", marginBottom: 28, lineHeight: 1.8, fontWeight: 300 }}>
                Book a test drive or request more information about this vehicle.
              </p>

              {submitted ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "0.06em", marginBottom: 10 }}>REQUEST SENT</p>
                  <p style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.06em", lineHeight: 1.8, marginBottom: 24 }}>
                    Thank you, <strong style={{ color: "var(--light)" }}>{form.name}</strong>.<br />
                    We&apos;ll be in touch at {form.email} within 24 hours.
                  </p>
                  <Link href="/inventory" className="m-btn" style={{ display: "block", textAlign: "center" }}>← ALL VEHICLES</Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <label style={lbl}>Full Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Smith" style={inp}
                      onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.5)"}
                      onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.15)"} />
                  </div>
                  <div>
                    <label style={lbl}>Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" style={inp}
                      onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.5)"}
                      onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.15)"} />
                  </div>
                  <div>
                    <label style={lbl}>Phone</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" style={inp}
                      onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.5)"}
                      onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.15)"} />
                  </div>
                  <div>
                    <label style={lbl}>Scheduled Date & Time *</label>
                    <input type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={handleChange} required style={{...inp, colorScheme: "dark"}}
                      onFocus={e => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.5)"}
                      onBlur={e  => (e.target as HTMLInputElement).style.borderBottomColor = "rgba(255,255,255,0.15)"} />
                  </div>
                  <div>
                    <label style={lbl}>Message</label>
                    <textarea name="message" rows={3} onChange={handleChange}
                      value={form.message || `Hi, I'm interested in the ${car.year} ${car.name} (${car.trim}). Please contact me to arrange a test drive.`}
                      style={{ ...inp, resize: "none" }}
                      onFocus={e => (e.target as HTMLTextAreaElement).style.borderBottomColor = "rgba(255,255,255,0.5)"}
                      onBlur={e  => (e.target as HTMLTextAreaElement).style.borderBottomColor = "rgba(255,255,255,0.15)"} />
                  </div>
                  <button type="submit" className="m-btn-fill" style={{ width: "100%", textAlign: "center", padding: "15px" }}>
                    SEND ENQUIRY
                  </button>
                  <p style={{ fontSize: 8, color: "var(--dim)", textAlign: "center", letterSpacing: "0.08em", lineHeight: 1.8 }}>
                    BY SUBMITTING YOU AGREE TO BE CONTACTED BY OUR TEAM.
                  </p>
                </form>
              )}

              {/* Phone CTA */}
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--border)", textAlign: "center" }}>
                <a href="tel:+1234567890" className="m-btn" style={{ width: "100%", display: "block", textAlign: "center" }}>
                  CALL US DIRECTLY
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, textAlign: "center" }}>
          <Link href="/inventory" className="m-nav-link" style={{ fontFamily: "var(--sans)", fontSize: 9, letterSpacing: "0.18em", color: "var(--dim)", textDecoration: "none", textTransform: "uppercase" }}>
            ← BACK TO ALL VEHICLES
          </Link>
        </div>
      </div>

      {/* ── LIGHTBOX OVERLAY ────────────────────────────────────────────── */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setShowOverlay(false)}
        >
          <div
            style={{
              position: "relative",
              maxWidth: "70vw",
              maxHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {overlayImage && (
              <img
                src={overlayImage}
                alt="Expanded view"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            )}
            
            {/* Left Arrow */}
            {totalImages > 1 && (
              <button
                onClick={handleOverlayPrev}
                style={{
                  position: "absolute",
                  left: "-60px",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 32,
                  cursor: "pointer",
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                ‹
              </button>
            )}

            {/* Right Arrow */}
            {totalImages > 1 && (
              <button
                onClick={handleOverlayNext}
                style={{
                  position: "absolute",
                  right: "-60px",
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 32,
                  cursor: "pointer",
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                ›
              </button>
            )}

            {/* Image Counter */}
            <div
              style={{
                position: "absolute",
                bottom: "-50px",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 12,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.08em",
                fontFamily: "var(--sans)",
              }}
            >
              {overlayImageIndex + 1} / {totalImages}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowOverlay(false)}
              style={{
                position: "absolute",
                top: "-50px",
                right: 0,
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: 28,
                cursor: "pointer",
                padding: 0,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,1)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
