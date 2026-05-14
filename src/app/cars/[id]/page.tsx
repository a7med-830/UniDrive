// src/app/cars/[id]/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Car, getCarById, getAllCars } from "@/lib/carsData";

// ─── Tokens ───────────────────────────────────────────────────────────────────

const GOLD = "#C9A96E";
const GOLD_LIGHT = "#E2C99A";
const COPPER = "#B87333";

// ─── Sub-nav Items ────────────────────────────────────────────────────────────

const NAV_ITEMS = ["INTRODUCTION", "GALLERY", "ALTERNATIVES"] as const;
type NavSection = (typeof NAV_ITEMS)[number];

// ─── Animations ───────────────────────────────────────────────────────────────

import { Variants } from "framer-motion";
const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, 
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// ─── Component: SectionAnchor ─────────────────────────────────────────────────

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} style={{ scrollMarginTop: "80px" }} />;
}

// ─── Component: SubNav ────────────────────────────────────────────────────────

function SubNav({ active }: { active: NavSection }) {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(5,5,5,0.92)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid rgba(201,169,110,0.15)`,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between", 
        }}
      >
        {/* زرار العودة للـ Home */}
        <Link href="/" style={{
          fontSize: "18px",
          letterSpacing: "0.3em",
          fontWeight: 700,
          color: GOLD,
          textDecoration: "none",
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          UNIDRIVE
        </Link>
        <div style={{ display: "flex" }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                display: "inline-block",
                padding: "22px 32px",
                fontSize: "10px",
                letterSpacing: "0.25em",
                fontWeight: 600,
                color: active === item ? GOLD : "rgba(255,255,255,0.45)",
                borderBottom: active === item ? `2px solid ${GOLD}` : "2px solid transparent",
                textDecoration: "none",
                transition: "color 0.3s, border-color 0.3s",
                fontFamily: "'Cormorant Garamond', 'Didot', serif",
              }}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Component: HeroSection ───────────────────────────────────────────────────
function HeroSection({ car }: { car: Car }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]); // قللنا الـ parallax شوية عشان نحافظ على كادر الفيديو فوق
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000", 
      }}
    >
    
      <motion.div style={{ position: "absolute", inset: 0, y }}>
        <video
          key={car.videoUrl} 
          src={car.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </motion.div>

    
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          zIndex: 1,
        }}
      />

   
      <motion.div
        style={{ 
          opacity, 
          position: "relative", 
          zIndex: 10, 
          textAlign: "center", 
          padding: "0 24px",
          marginTop: "-15vh" 
        }}
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p variants={fadeUp} style={{ fontSize: "10px", letterSpacing: "0.4em", color: GOLD, marginBottom: "20px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
          {car.year} — UNIDRIVE EXCLUSIVE
        </motion.p>

        <motion.p variants={fadeUp} style={{ fontSize: "clamp(12px, 2vw, 15px)", letterSpacing: "0.5em", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontFamily: "'Cormorant Garamond', serif", fontWeight: 500 }}>
          {car.make}
        </motion.p>

        <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(48px, 11vw, 130px)", fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: "0.04em", lineHeight: 0.9, color: "#ffffff", marginBottom: "20px", textShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
          {car.name}
        </motion.h1>

        <motion.div variants={fadeUp} style={{ width: "50px", height: "1px", background: GOLD, margin: "0 auto 32px" }} />

        <motion.div variants={fadeUp} style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <HeroButton label="DISCOVER" href="#introduction" primary />
          <HeroButton label="PRODUCT OVERVIEW" href="#gallery" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ضيف الكود ده تحت الـ HeroSection عشان الـ Error يختفي
function HeroButton({ label, href, primary = false }: { label: string; href: string; primary?: boolean }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px 32px",
        fontSize: "10px",
        letterSpacing: "0.25em",
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 700,
        textDecoration: "none",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        border: `1px solid ${primary ? GOLD : "rgba(255,255,255,0.25)"}`,
        background: primary ? (hovered ? GOLD : "transparent") : (hovered ? "rgba(255,255,255,0.08)" : "transparent"),
        color: primary ? (hovered ? "#000" : GOLD) : (hovered ? "#fff" : "rgba(255,255,255,0.7)"),
      }}
    >
      {label}
      {primary && <span style={{ fontSize: "14px" }}>→</span>}
    </a>
  );
}

// ─── Component: IntroductionSection ──────────────────────────────────────────

function IntroductionSection({ car }: { car: Car }) {
  return (
    <section id="introduction" style={{ background: "#050505", padding: "120px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 48px" }}>
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            fontSize: "9px",
            letterSpacing: "0.45em",
            color: GOLD,
            marginBottom: "64px",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ display: "inline-block", width: "40px", height: "1px", background: GOLD }} />
          01 — INTRODUCTION
        </motion.p>

        {/* Editorial description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: "860px", marginBottom: "100px" }}
        >
          <p
            style={{
              fontSize: "clamp(24px, 3.5vw, 42px)",
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontWeight: 300,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "0.01em",
            }}
          >
            {car.description}
          </p>
        </motion.div>

        {/* Split: Image + Features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
          }}
          className="split-grid"
        >
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "relative",
              overflow: "hidden",
              aspectRatio: "4/3",
            }}
          >
            {/* Gold corner accents */}
            <div style={{ position: "absolute", top: "-1px", left: "-1px", width: "40px", height: "40px", borderTop: `1px solid ${GOLD}`, borderLeft: `1px solid ${GOLD}`, zIndex: 2 }} />
            <div style={{ position: "absolute", bottom: "-1px", right: "-1px", width: "40px", height: "40px", borderBottom: `1px solid ${GOLD}`, borderRight: `1px solid ${GOLD}`, zIndex: 2 }} />
            <img
              src={car.image}
              alt={`${car.make} ${car.name}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "brightness(0.9) contrast(1.05)",
                transition: "transform 0.8s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1.04)")}
              onMouseLeave={(e) => ((e.target as HTMLImageElement).style.transform = "scale(1)")}
            />
            {/* Price tag overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(10px)",
                padding: "12px 20px",
                border: `1px solid rgba(201,169,110,0.3)`,
              }}
            >
              <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: GOLD, marginBottom: "2px", fontFamily: "'Cormorant Garamond', serif" }}>
                STARTING FROM
              </p>
              <p style={{ fontSize: "18px", color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: "0.05em" }}>
                {car.price}
              </p>
            </div>
          </motion.div>

          {/* Features + Specs */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Features */}
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.4em",
                color: GOLD,
                marginBottom: "28px",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
              }}
            >
              EXCLUSIVE FEATURES
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 60px 0" }}>
              {car.features.map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: "13px",
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.7)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: "5px",
                      height: "5px",
                      background: GOLD,
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                  {feat}
                </motion.li>
              ))}
            </ul>

            {/* Specs grid */}
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.4em",
                color: GOLD,
                marginBottom: "24px",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
              }}
            >
              TECHNICAL DATA
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {Object.entries(car.specs).map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    background: "#050505",
                    padding: "16px 20px",
                  }}
                >
                  <p style={{ fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: "4px", fontFamily: "'Cormorant Garamond', serif" }}>
                    {k.toUpperCase()}
                  </p>
                  <p style={{ fontSize: "14px", color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .split-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Component: GallerySection ────────────────────────────────────────────────

function GallerySection({ car }: { car: Car }) {
  const [galleryPage, setGalleryPage] = useState(0);
  
  if (!car.images?.length) return null;

  // Assign column spans for masonry-like effect
  const layout = [
    { colSpan: 2, rowSpan: 2 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
  ];

  const imagesPerPage = 6;
  const totalImages = car.images.length;
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  const startIdx = galleryPage * imagesPerPage;
  const currentImages = car.images.slice(startIdx, startIdx + imagesPerPage);

  const handlePrevGallery = () => {
    if (galleryPage > 0) setGalleryPage(galleryPage - 1);
  };

  const handleNextGallery = () => {
    if (galleryPage < totalPages - 1) setGalleryPage(galleryPage + 1);
  };

  return (
    <section id="gallery" style={{ background: "#080808", padding: "120px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 48px" }}>
        {/* Header with navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "64px" }}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: "9px",
              letterSpacing: "0.45em",
              color: GOLD,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ display: "inline-block", width: "40px", height: "1px", background: GOLD }} />
            02 — GALLERY
          </motion.p>

          {/* Navigation arrows */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                onClick={handlePrevGallery}
                disabled={galleryPage === 0}
                style={{
                  padding: "8px 16px",
                  background: "none",
                  border: `1px solid ${galleryPage === 0 ? "rgba(255,255,255,0.1)" : "rgba(201,169,110,0.3)"}`,
                  cursor: galleryPage === 0 ? "not-allowed" : "pointer",
                  color: galleryPage === 0 ? "rgba(255,255,255,0.2)" : GOLD,
                  fontSize: "14px",
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (galleryPage > 0) {
                    (e.target as HTMLButtonElement).style.borderColor = GOLD;
                    (e.target as HTMLButtonElement).style.background = `rgba(201,169,110,0.05)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (galleryPage > 0) {
                    (e.target as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.3)";
                    (e.target as HTMLButtonElement).style.background = "none";
                  }
                }}
              >
                ‹
              </button>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", minWidth: "30px", textAlign: "center" }}>
                {galleryPage + 1} / {totalPages}
              </span>
              <button
                onClick={handleNextGallery}
                disabled={galleryPage === totalPages - 1}
                style={{
                  padding: "8px 16px",
                  background: "none",
                  border: `1px solid ${galleryPage === totalPages - 1 ? "rgba(255,255,255,0.1)" : "rgba(201,169,110,0.3)"}`,
                  cursor: galleryPage === totalPages - 1 ? "not-allowed" : "pointer",
                  color: galleryPage === totalPages - 1 ? "rgba(255,255,255,0.2)" : GOLD,
                  fontSize: "14px",
                  fontFamily: "'Cormorant Garamond', serif",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (galleryPage < totalPages - 1) {
                    (e.target as HTMLButtonElement).style.borderColor = GOLD;
                    (e.target as HTMLButtonElement).style.background = `rgba(201,169,110,0.05)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (galleryPage < totalPages - 1) {
                    (e.target as HTMLButtonElement).style.borderColor = "rgba(201,169,110,0.3)";
                    (e.target as HTMLButtonElement).style.background = "none";
                  }
                }}
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto",
            gap: "8px",
          }}
        >
          {currentImages.map((src, i) => {
            const l = layout[i] || { colSpan: 1, rowSpan: 1 };
            return (
              <motion.div
                key={src + galleryPage}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                style={{
                  gridColumn: `span ${l.colSpan}`,
                  gridRow: `span ${l.rowSpan}`,
                  overflow: "hidden",
                  position: "relative",
                  aspectRatio: l.rowSpan === 2 ? "1/1.15" : l.colSpan === 2 ? "16/7" : "4/3",
                  background: "#111",
                }}
              >
                <img
                  src={src}
                  alt={`${car.make} ${car.name} — ${startIdx + i + 1}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease",
                    filter: "brightness(0.88) contrast(1.05) saturate(0.9)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.transform = "scale(1.06)";
                    el.style.filter = "brightness(1) contrast(1.05) saturate(1)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.transform = "scale(1)";
                    el.style.filter = "brightness(0.88) contrast(1.05) saturate(0.9)";
                  }}
                />
                {/* Index label */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "14px",
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "'Cormorant Garamond', serif",
                    pointerEvents: "none",
                  }}
                >
                  {String(startIdx + i + 1).padStart(2, "0")}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery .grid-masonry { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Component: AlternativesSection ──────────────────────────────────────────

function AlternativesSection({ currentId, cars }: { currentId: string; cars: Car[] }) {
  const alternatives = cars.filter((c) => c.id !== currentId).slice(0, 3);

  return (
    <section id="alternatives" style={{ background: "#040404", padding: "120px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 48px" }}>
        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "72px",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "9px",
                letterSpacing: "0.45em",
                color: GOLD,
                marginBottom: "16px",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span style={{ display: "inline-block", width: "40px", height: "1px", background: GOLD }} />
              03 — ALTERNATIVES
            </p>
            <h2
              style={{
                fontSize: "clamp(32px, 5vw, 60px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
              }}
            >
              EXPLORE THE RANGE
            </h2>
          </div>
          <p
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Cormorant Garamond', serif",
              maxWidth: "280px",
              lineHeight: 1.8,
            }}
          >
            Each UNIDRIVE creation is a singular expression of transformation without compromise.
          </p>
        </motion.div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
          className="alt-grid"
        >
          {alternatives.map((alt, i) => (
            <AlternativeCard key={alt.id} car={alt} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .alt-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 601px) and (max-width: 900px) {
          .alt-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function AlternativeCard({ car, index }: { car: Car; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    // 1. غلفنا الكارت بالكامل بـ Link عشان أي مكان تدوس فيه يوديك لصفحة العربية
    <Link 
      href={`/cars/${car.id}`} 
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          cursor: "pointer",
          border: `1px solid ${hovered ? `rgba(201,169,110,0.35)` : "rgba(255,255,255,0.07)"}`,
          transition: "border-color 0.4s ease",
          background: "#090909",
          overflow: "hidden",
        }}
      >
        {/* Image Section */}
        <div style={{ overflow: "hidden", aspectRatio: "16/9", position: "relative" }}>
          <img
            src={car.image}
            alt={`${car.make} ${car.name}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              filter: hovered ? "brightness(0.95)" : "brightness(0.75) saturate(0.85)",
              transition: "transform 0.7s ease, filter 0.5s ease",
            }}
          />
          {/* Year overlay */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: GOLD,
              fontFamily: "'Cormorant Garamond', serif",
              background: "rgba(0,0,0,0.6)",
              padding: "4px 8px",
            }}
          >
            {car.year}
          </div>
        </div>

        {/* Info Section */}
        <div style={{ padding: "28px 28px 32px" }}>
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.35em",
              color: GOLD,
              marginBottom: "8px",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
            }}
          >
            {car.make}
          </p>
          <h3
            style={{
              fontSize: "clamp(22px, 3vw, 32px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              color: "#fff",
              letterSpacing: "0.06em",
              marginBottom: "6px",
              lineHeight: 1.1,
            }}
          >
            {car.name}
          </h3>
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "24px",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {car.trim}
          </p>

          {/* Discover Button Effect */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "9px",
              letterSpacing: "0.3em",
              color: hovered ? GOLD : "rgba(255,255,255,0.3)",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              transition: "color 0.3s ease",
            }}
          >
            DISCOVER
            <motion.span
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: "14px" }}
            >
              →
            </motion.span>
          </div>
        </div>

        {/* Bottom gold accent line */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            transformOrigin: "left",
          }}
        />
      </motion.div>
    </Link>
  );
}
// ─── Component: Footer ────────────────────────────────────────────────────────

function PageFooter({ car }: { car: Car }) {
  return (
    <footer
      style={{
        background: "#020202",
        borderTop: `1px solid rgba(201,169,110,0.12)`,
        padding: "60px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "18px",
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: "0.3em",
              color: GOLD,
              fontWeight: 600,
            }}
          >
            UNIDRIVE
          </p>
          <p
            style={{
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: "rgba(255,255,255,0.2)",
              marginTop: "4px",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            THE ART OF AUTOMOTIVE EXCELLENCE
          </p>
        </div>
        <p
          style={{
            fontSize: "9px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.18)",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          © {new Date().getFullYear()} — {car.make} {car.name} — ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────


export default function CarDetailPage() {
  const params = useParams<{ id: string | string[] }>();
  const carId = Array.isArray(params.id) ? params.id[0] : params.id;
  const car = carId ? getCarById(carId) : null;
  const allCars = getAllCars();
  const [activeSection, setActiveSection] = useState<NavSection>("INTRODUCTION");

  if (!car) { return notFound(); }

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const sections: { id: string; label: NavSection }[] = [
      { id: "introduction", label: "INTRODUCTION" },
      { id: "gallery", label: "GALLERY" },
      { id: "alternatives", label: "ALTERNATIVES" },
    ];
    sections.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(label); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #050505; color: #fff; -webkit-font-smoothing: antialiased; }
        ::selection { background: rgba(201,169,110,0.3); color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: ${COPPER}; }
      `}</style>

      {/* زرار عائم "Floating Button" للرجوع للـ Home يظهر في ركن الشاشة */}
      <Link
        href="/"
        style={{
          position: "fixed",
          bottom: "40px",
          left: "40px", // خليته على الشمال عشان ما يغطيش على أي محتوى مهم
          zIndex: 100,
          padding: "12px 24px",
          fontSize: "10px",
          letterSpacing: "0.2em",
          color: GOLD,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${GOLD}`,
          textDecoration: "none",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 700,
          transition: "all 0.4s ease",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.background = GOLD;
          (e.target as HTMLElement).style.color = "#000";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.background = "rgba(0,0,0,0.7)";
          (e.target as HTMLElement).style.color = GOLD;
        }}
      >
        ← BACK TO UNIDRIVE
      </Link>

      <main style={{ background: "#050505", minHeight: "100vh" }}>
        <HeroSection car={car} />
        <SubNav active={activeSection} />
        <SectionAnchor id="introduction" />
        <IntroductionSection car={car} />
        <SectionAnchor id="gallery" />
        <GallerySection car={car} />
        <SectionAnchor id="alternatives" />
        <AlternativesSection currentId={car.id} cars={allCars} />
        <PageFooter car={car} />
      </main>
    </>
  );
}