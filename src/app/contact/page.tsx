"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

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
              style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.16em", color: label === "CONTACT" ? "var(--white)" : "var(--mid)", fontWeight: label === "CONTACT" ? 500 : 400 }}>
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
          <div style={{ gridColumn: "1 / -1", maxWidth: 280 }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, letterSpacing: "0.22em", color: "var(--white)", marginBottom: 6 }}>UNIDRIVE</div>
            <div style={{ fontSize: 8, letterSpacing: "0.30em", color: "var(--dim)", marginBottom: 20 }}>INDIVIDUALIZATION</div>
            <p style={{ fontSize: 10, color: "var(--dim)", lineHeight: 2, fontWeight: 300 }}>
              Curated selection of premium and certified luxury vehicles. Every car, a masterpiece.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.h} style={{ minWidth: 140 }}>
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

// ─── Contact Form Component ───────────────────────────────────────────────────
function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="name" style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.14em", color: "var(--light)", textTransform: "uppercase" }}>Full Name</label>
        <input 
          type="text" 
          id="name" 
          required
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ width: "100%", background: "var(--black)", border: "1px solid var(--border2)", color: "var(--white)", fontFamily: "var(--sans)", fontSize: 14, padding: "14px 16px", outline: "none", letterSpacing: "0.04em", transition: "border-color 0.3s" }}
          onFocus={(e) => e.target.style.borderColor = "var(--white)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border2)"}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, minWidth: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <label htmlFor="email" style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.14em", color: "var(--light)", textTransform: "uppercase" }}>Email Address</label>
          <input 
            type="email" 
            id="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ width: "100%", background: "var(--black)", border: "1px solid var(--border2)", color: "var(--white)", fontFamily: "var(--sans)", fontSize: 14, padding: "14px 16px", outline: "none", letterSpacing: "0.04em", transition: "border-color 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "var(--white)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border2)"}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
          <label htmlFor="phone" style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.14em", color: "var(--light)", textTransform: "uppercase" }}>Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{ width: "100%", background: "var(--black)", border: "1px solid var(--border2)", color: "var(--white)", fontFamily: "var(--sans)", fontSize: 14, padding: "14px 16px", outline: "none", letterSpacing: "0.04em", transition: "border-color 0.3s" }}
            onFocus={(e) => e.target.style.borderColor = "var(--white)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border2)"}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="message" style={{ fontFamily: "var(--sans)", fontSize: 10, letterSpacing: "0.14em", color: "var(--light)", textTransform: "uppercase" }}>Your Message</label>
        <textarea 
          id="message" 
          rows={5}
          required
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          style={{ width: "100%", background: "var(--black)", border: "1px solid var(--border2)", color: "var(--white)", fontFamily: "var(--sans)", fontSize: 14, padding: "14px 16px", outline: "none", letterSpacing: "0.04em", resize: "vertical", transition: "border-color 0.3s" }}
          onFocus={(e) => e.target.style.borderColor = "var(--white)"}
          onBlur={(e) => e.target.style.borderColor = "var(--border2)"}
        ></textarea>
      </div>

      <button type="submit" className="m-btn-fill" style={{ alignSelf: "flex-start", marginTop: 8 }} disabled={status === "submitting"}>
        {status === "submitting" ? "SENDING..." : "SEND MESSAGE"}
      </button>

      {status === "success" && (
        <p style={{ color: "var(--gold)", fontSize: 12, letterSpacing: "0.08em", marginTop: 8 }}>Thank you! Your message has been sent successfully.</p>
      )}
      {status === "error" && (
        <p style={{ color: "#e05c5c", fontSize: 12, letterSpacing: "0.08em", marginTop: 8 }}>Something went wrong. Please try again or email us directly.</p>
      )}
    </form>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", fontFamily: "var(--sans)", color: "var(--white)" }}>
      <Navbar />

      {/* ── PAGE HEADER ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative", paddingTop: 120, borderBottom: "1px solid var(--border)", paddingBottom: 60, minHeight: "45vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        
        {/* Background Image & Overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="/Images-home/photo-1503376780353-7e6692767b70.jpg" alt="Contact Hero" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 100%)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1440, margin: "0 auto", padding: "0 48px", width: "100%" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "var(--dim)", marginBottom: 20 }}>
            <Link href="/" style={{ color: "var(--dim)", textDecoration: "none" }}>HOME</Link>
            <span style={{ margin: "0 12px" }}>/</span>
            <span style={{ color: "var(--light)" }}>CONTACT US</span>
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(32px, 6vw, 72px)", letterSpacing: "0.08em", fontWeight: 400, lineHeight: 1, marginBottom: 14 }}>
            CONTACT US
          </h1>
          <p style={{ fontSize: 11, color: "var(--mid)", letterSpacing: "0.10em", fontWeight: 300, maxWidth: 640, lineHeight: 1.8 }}>
            Whether you are inquiring about a specific model, booking a service appointment, or just seeking advice on your next automotive investment, our dedicated team is at your disposal.
          </p>
        </div>
      </div>

      {/* ── MAIN LAYOUT ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "clamp(60px, 8vw, 80px) clamp(16px, 5vw, 48px) clamp(80px, 12vw, 120px)", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(24px, 8vw, 8vw)", alignItems: "start" }} className="contact-grid">
        <style>{`
          @media (max-width: 900px) {
            .contact-grid {
              grid-template-columns: 1fr !important;
              padding: clamp(40px, 6vw, 60px) clamp(16px, 5vw, 30px) clamp(60px, 10vw, 100px) !important;
            }
          }
          @media (max-width: 600px) {
            .contact-grid {
              gap: 16px !important;
            }
          }
        `}</style>
        
        {/* ── INFO PANEL ────────────────────────────────────────────────────── */}
        <div style={{ background: "var(--dark1)", border: "1px solid var(--border)", padding: "clamp(28px, 6vw, 48px) clamp(20px, 5vw, 40px)", display: "flex", flexDirection: "column", gap: "clamp(24px, 5vw, 40px)" }}>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, letterSpacing: "0.1em", color: "var(--white)" }}>
            UNIDRIVE HEADQUARTERS
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ color: "var(--gold)", marginTop: 2 }}><LocationIcon /></div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Address</div>
                <div style={{ fontSize: 13, color: "var(--mid)", lineHeight: 1.6, fontWeight: 300 }}>
                  128 Automotive Avenue<br />
                  Beverly Hills<br />
                  CA 90210, USA
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ color: "var(--gold)", marginTop: 2 }}><PhoneIcon /></div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Phone</div>
                <div style={{ fontSize: 13, color: "var(--white)", lineHeight: 1.6, fontWeight: 300 }}>
                  <span style={{ color: "var(--mid)" }}>Sales:</span> +1 (800) 555-0199<br />
                  <span style={{ color: "var(--mid)" }}>Service:</span> +1 (800) 555-0198
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ color: "var(--gold)", marginTop: 2 }}><EmailIcon /></div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Email</div>
                <div style={{ fontSize: 13, color: "var(--white)", lineHeight: 1.6, fontWeight: 300 }}>
                  inquiries@unidrive.com<br />
                  support@unidrive.com
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ color: "var(--gold)", marginTop: 2 }}><ClockIcon /></div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--dim)", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Operating Hours</div>
                <div style={{ fontSize: 13, color: "var(--mid)", lineHeight: 1.6, fontWeight: 300 }}>
                  <span style={{ color: "var(--white)" }}>Mon - Fri:</span> 9:00 AM – 7:00 PM<br />
                  <span style={{ color: "var(--white)" }}>Saturday:</span> 10:00 AM – 5:00 PM<br />
                  <span style={{ color: "var(--white)" }}>Sunday:</span> Closed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FORM PANEL ────────────────────────────────────────────────────── */}
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, letterSpacing: "0.1em", color: "var(--white)", marginBottom: 12 }}>
            GET IN TOUCH
          </div>
          <div style={{ fontSize: 11, color: "var(--mid)", letterSpacing: "0.08em", marginBottom: 36, fontWeight: 300, lineHeight: 1.7 }}>
            Please fill out the form below with your details and specific inquiry. Our concierges aim to respond within 24 hours.
          </div>
          <ContactForm />
        </div>

      </div>

      <Footer />
    </div>
  );
}
