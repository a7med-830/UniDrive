"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "./page-styles.css";
import { allCars } from "@/lib/cars";

// ─── ANIMATED BRAND LOGOS ────────────────────────────────────────────────────
function AnimatedLogosBar() {
  const logos = [
    { name: "Aston Martin", file: "aston-martin-alt-svgrepo-com.svg" },
    { name: "Audi", file: "audi-svgrepo-com.svg" },
    { name: "Rolls-Royce", file: "rolls-royce-svgrepo-com.svg" },
    { name: "Mercedes", file: "mercedes-benz-svgrepo-com.svg" },
    { name: "Ferrari", file: "ferrari-svgrepo-com.svg" },
    { name: "Porsche", file: "porsche-svgrepo-com.svg" },
    { name: "Bentley", file: "bentley-svgrepo-com.svg" },
    { name: "BMW", file: "bmw-svgrepo-com.svg" },
    { name: "Cadillac", file: "cadillac-svgrepo-com.svg" },
    { name: "Lexus", file: "lexus-svgrepo-com.svg" },
    { name: "Maserati", file: "maserati-svgrepo-com.svg" },
    { name: "Genesis", file: "genesis-svgrepo-com.svg" },
    { name: "Maybach", file: "maybach-svgrepo-com.svg" },
  ];

  return (
    <section id="brands" style={{
      background: "var(--dark1)",
      padding: "clamp(40px, 8vw, 60px) clamp(16px, 5vw, 40px)",
      overflow: "hidden",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      scrollMarginTop: "50vh",
    }}>
      <style>{`
        @keyframes scrollLogoBar {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .logos-container {
          display: flex;
          gap: 60px;
          animation: scrollLogoBar 40s linear infinite;
        }
        
        .logo-item {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 14px;
          min-width: 140px;
          opacity: 0.85;
          transition: opacity 0.3s ease, transform 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        
        .logo-item:hover {
          opacity: 1;
          transform: translateY(-4px);
        }
        
        .logo-img-wrap {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .logo-item img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          display: block;
          filter: brightness(1.2) saturate(0) invert(0.85);
          transition: filter 0.3s ease;
        }
        
        .logo-item:hover img {
          filter: brightness(1.15) saturate(1.2) invert(0.8);
        }
        
        .logo-name {
          font-family: var(--font-body);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: #b0b0b0;
          text-transform: uppercase;
          text-align: center;
          transition: color 0.3s ease;
          font-weight: 500;
        }
        
        .logo-item:hover .logo-name {
          color: #ffffff;
        }
      `}</style>
      
      <div style={{
        maxWidth: "100%",
        overflow: "hidden",
        position: "relative",
      }}>
        <div className="logos-container">
          {logos.map((logo, i) => (
            <Link key={i} href={`/inventory?brand=${encodeURIComponent(logo.name)}`} className="logo-item">
              <div className="logo-img-wrap">
                <img
                  src={`/svg car logos/${logo.file}`}
                  alt={logo.name}
                  title={logo.name}
                />
              </div>
              <span className="logo-name">{logo.name}</span>
            </Link>
          ))}
          {/* Duplicate for seamless looping */}
          {logos.map((logo, i) => (
            <Link key={`dup-${i}`} href={`/inventory?brand=${encodeURIComponent(logo.name)}`} className="logo-item">
              <div className="logo-img-wrap">
                <img
                  src={`/svg car logos/${logo.file}`}
                  alt={logo.name}
                  title={logo.name}
                />
              </div>
              <span className="logo-name">{logo.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── useIntersectionObserver hook ────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}


const heroSlides = [
  {
    id: "Mercedes", 
    img: "/Images-home/6ca3bb49af970e54f445948e1ce21c9d.jpg",
    title: "Mercedes‑Maybach S‑Class ",
    sub: "SOFT KIT — ATELIER",
    tag: "Mercedes‑Maybach", 
  },
  {
    id: "UNIDRIVE-rolls-phantom", 
    img: "/Images-home/1b68f3d98661e13530dc0bbda4e2cefe.jpg",
    eyebrow: "NEW ARRIVAL",
    title: "ULTRA LUXURY\nCULLINAN II",
    sub: "FULL BODY KIT",
    tag: "ROLLS-ROYCE",
  },
  {
    id: "porsche-panamera", 
    img: "/Images-home/3cba9a2c6693afff6d71cfa1f7d8a0f2.jpg",
    eyebrow: "EXCLUSIVE",
    title: "Porsche Panamera",
    sub: "CARBON EDITION",
    tag: "Porsche Panamera",
  },
  {
    id: "cadillac", 
    img: "/Images-home/cad.jpg",
    eyebrow: "LIMITED",
    title: "Cadillac Escalade",
    sub: "WIDEBODY PROGRAM",
    tag: "Cadillac",
  },
];

// ─── CARS DATA ────────────────────────────────────────────────────────────────
const cars = [
  { id: 18, img: "/Images-home/339a5f9521cd849ed1b2a1ecd705752b.jpg", title: "Cadillac Escalade", tag: "NEW" },
  { id: 10, img: "/audi/a8/f.jpg", title: "Audi A8", tag: "NEW" },
  { id: 8, img: "/Images-home/d62bc60c4881c50ccf46c4bbd01cdb42.jpg", title: "Lexus LC", tag: "NEW" },
  { id: 4,  img: "/Ferrari/Ferrari Purosangue/photo1.jpg", title: "Ferrari PUROSANGUE", tag: "NEW" },
  { id: 34, img: "/Images-home/3e9b06168ed4cb828e16b2a348724f20.jpg", title: "Range Rover", tag: "NEW" },
];

// ─── NEWS DATA ────────────────────────────────────────────────────────────────
const news = [
  {
    img: "/Images-home/photo-1514867644123-6385d58d3cd4.jpg",
    date: "FEBRUARY 13, 2026",
    title: "THE FERRARI PUROSANGUE SOFT KIT",
    cat: "BODY KITS",
  },
  {
    img: "/Images-home/7e34ae620a79e76916992147175aa522.jpg",
    date: "JANUARY 28, 2026",
    title: "Porsche Taycan Turbo S",
    cat: "NEWS",
  },
  {
    img: "/Images-home/bef83415d0cba15db605a5d1294e3771.jpg",
    date: "JANUARY 09, 2026",
    title: "CULLINAN SERIES II — LINEA D'ARABO COLLECTION",
    cat: "ATELIER",
  },
];

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLeft = ["BRANDS", "CARS FOR SALE", "CONFIGURATOR"];
  const navRight = ["INVENTORY", "FIND A DEALER", "CONTACT"];


  const getLink = (item: string) => {
    if (item === "INVENTORY") return "/inventory";
    if (item === "FIND A DEALER") return "/dealers"; 
    return "#";
  };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(0,0,0,0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 0.5s ease, border-color 0.5s ease, backdrop-filter 0.5s ease",
        padding: "0 clamp(16px, 5vw, 40px)",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* LEFT NAV */}
          <nav className="desktop-nav" style={{ display: "flex", gap: 36 }}>
            {navLeft.map(item => (
              <Link key={item} href={ item === "BRANDS" ? "#brands" : item === "CARS FOR SALE" ? "/inventory" : "#" } className="nav-link" style={{
                fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
                letterSpacing: "0.14em", color: "var(--text-light)",
                textDecoration: "none", textTransform: "uppercase",
                transition: "color 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = "var(--white)"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = "var(--text-light)"}
              >{item}</Link>
            ))}
          </nav>

          {/* LOGO */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "0.22em", color: "var(--white)", fontWeight: 600 }}>
              UNIDRIVE
            </div>
          </div>

          {/* RIGHT NAV + ICONS */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 36 }}>
            {navRight.map(item => (
              <Link 
                key={item} 
                href={item === "INVENTORY" ? "/inventory" : item === "CONTACT" ? "/contact" : item === "FIND A DEALER" ? "/contact" : "#"} 
                className="nav-link" 
                style={{
                  fontFamily: "var(--font-body)", fontSize: 10, fontWeight: 500,
                  letterSpacing: "0.14em", color: "var(--text-light)",
                  textDecoration: "none", textTransform: "uppercase",
              }}>{item}</Link>
            ))}
            <div style={{ display: "flex", gap: 16, marginLeft: 8 }}>
              <button style={{ background: "none", border: "none", color: "var(--text-mid)", cursor: "pointer", padding: 4, display: "flex" }}><SearchIcon /></button>
              <Link href="/admin/login" style={{ color: "var(--text-mid)", padding: 4, display: "flex" }}><UserIcon /></Link>
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(true)}
            style={{ background: "none", border: "none", color: "var(--white)", cursor: "pointer", display: "none", marginLeft: "auto" }}>
            <MenuIcon />
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu mobile-menu-overlay`} onClick={() => setMobileOpen(false)}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: mobileOpen ? "block" : "none" }} />
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`} style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "280px",
        background: "var(--dark2)", zIndex: 201, padding: "80px 40px 40px",
      }}>
        <button onClick={() => setMobileOpen(false)} style={{
          position: "absolute", top: 24, right: 24,
          background: "none", border: "none", color: "var(--white)", cursor: "pointer",
        }}><CloseIcon /></button>
        
        {[...navLeft, ...navRight].map(item => {
          let href = "#";
          if (item === "BRANDS") href = "#brands";
          if (item === "CARS FOR SALE") href = "/inventory";
          if (item === "INVENTORY") href = "/inventory";
          if (item === "FIND A DEALER" || item === "CONTACT") href = "/contact";
          
          return (
            <Link 
              key={item} 
              href={href} 
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block", fontFamily: "var(--font-body)", fontSize: 11,
                letterSpacing: "0.16em", color: "var(--text-light)", textDecoration: "none",
                textTransform: "uppercase", marginBottom: 28, borderBottom: "1px solid var(--border)",
                paddingBottom: 28, transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = "var(--white)"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = "var(--text-light)"}
            >{item}</Link>
          );
        })}
      </div>
    </>
  );
}

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────
function HeroSlider() {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (idx: number) => {
    setPrev(active);
    setActive(idx);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % heroSlides.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const slide = heroSlides[active];

  return (
    <section style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#000" }}>
      {heroSlides.map((s, i) => (
        <div key={i} className={`hero-slide ${i === active ? "active" : ""}`}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img src={s.img} alt={s.title} className="hero-img"
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* Dark gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
          }} />
        </div>
      ))}

      {/* TEXT CONTENT */}
      <div key={active} style={{
        position: "absolute", bottom: "18%", left: "7%", maxWidth: 640,
      }}>
        <div className="animate-fadeUp opacity-0" style={{ animationDelay: "0.1s",
          fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.3em",
          color: "var(--gold)", marginBottom: 18, fontWeight: 500,
        }}>{slide.eyebrow} — {slide.tag}</div>

        <h1 className="animate-fadeUp opacity-0" style={{ animationDelay: "0.25s",
          fontFamily: "var(--font-display)", fontSize: "clamp(36px, 6vw, 80px)",
          fontWeight: 700, lineHeight: 1.05, letterSpacing: "0.04em",
          color: "var(--white)", whiteSpace: "pre-line", marginBottom: 16,
        }}>{slide.title}</h1>

        <div className="animate-fadeUp opacity-0" style={{ animationDelay: "0.4s",
          fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.25em",
          color: "var(--text-mid)", marginBottom: 40, fontWeight: 400,
        }}>{slide.sub}</div>

        
        <div className="animate-fadeUp opacity-0" style={{ animationDelay: "0.55s" }}>
          <Link href={`/cars/${slide.id}`} className="btn-outline">
            DISCOVER NOW 
          </Link>
        </div>
      </div>

      {/* DOTS */}
      <div style={{
        position: "absolute", bottom: "8%", left: "7%",
        display: "flex", gap: 8, alignItems: "center",
      }}>
        {heroSlides.map((_, i) => (
          <div key={i} className={`hero-dot ${i === active ? "active" : ""}`}
            onClick={() => goTo(i)} style={{ cursor: "pointer" }} />
        ))}
      </div>

      {/* SLIDE COUNTER */}
      <div style={{
        position: "absolute", bottom: "8%", right: "6%",
        fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.2em",
        color: "var(--text-dim)",
      }}>
        <span style={{ color: "var(--white)", fontSize: 13 }}>0{active + 1}</span>
        {" / "}0{heroSlides.length}
      </div>

      {/* SCROLL HINT */}
      <div id = "scroll" style={{
        position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        fontFamily: "var(--font-body)", fontSize: 8, letterSpacing: "0.25em",
        color: "var(--text-dim)",
      }}>
        <div style={{
          width: 1, height: 48,
          background: "linear-gradient(to bottom, transparent, var(--text-dim))",
        }} />
        SCROLL
      </div>
    </section>
  );
}

// ─── FIND YOUR DREAM MODEL ────────────────────────────────────────────────────
function FindModel() {
  const ref = useReveal();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // Get unique brands from allCars
  const brands = Array.from(new Set(allCars.map(car => car.make))).sort();

  // Filter models based on selected brand
  const availableModels = selectedBrand
    ? Array.from(new Set(
        allCars
          .filter(car => car.make === selectedBrand)
          .map(car => car.model)
      )).sort()
    : [];

  // Reset model when brand changes
  useEffect(() => {
    setSelectedModel("");
  }, [selectedBrand]);

  const handleSearch = () => {
    if (!selectedBrand) {
      alert("Please select a brand");
      return;
    }

    const params = new URLSearchParams();
    params.append("brand", selectedBrand);
    if (selectedModel) {
      params.append("model", selectedModel);
    }

    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <section style={{ background: "var(--dark2)", padding: "clamp(60px, 8vw, 100px) clamp(16px, 5vw, 40px)" }}>
      <div ref={ref} className="reveal" style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3.5vw, 40px)", letterSpacing: "0.08em", color: "var(--white)", marginBottom: 48, fontWeight: 500 }}>
          FIND YOUR DREAM MODEL
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", alignItems: "stretch" }}>
          <div className="select-wrap" style={{ flex: "1 1 220px", minWidth: 180 }}>
            <select 
              className="custom-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">SELECT BRAND</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="select-wrap" style={{ flex: "1 1 220px", minWidth: 180 }}>
            <select 
              className="custom-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
            >
              <option value="">SELECT MODEL</option>
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
          <button 
            className="btn-solid"
            onClick={handleSearch}
            style={{ flex: "0 0 auto", alignSelf: "stretch", padding: "0 40px", opacity: selectedBrand ? 1 : 0.5, cursor: selectedBrand ? "pointer" : "not-allowed" }}
          >
            SEARCH
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── LATEST ADDITIONS CAROUSEL ────────────────────────────────────────────────
function LatestCarousel() {
  const [offset, setOffset] = useState(0);
  const [visCount, setVisCount] = useState(3);
  const ref = useReveal();

  useEffect(() => {
    const handle = () => setVisCount(window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  const maxOffset = Math.max(0, cars.length - visCount);

  return (
    <section style={{ background: "var(--black)", padding: "clamp(80px, 12vw, 100px) clamp(16px, 5vw, 40px)" }}>
      {/* Header row */}
      <div ref={ref} className="reveal" style={{ maxWidth: 1360, margin: "0 auto 56px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", marginBottom: 12 }}>
            COLLECTION
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 36px)", letterSpacing: "0.06em", color: "var(--white)", fontWeight: 500 }}>
            LATEST ADDITIONS
          </h2>
        </div>
        <a href="#" className="btn-outline" style={{ fontSize: 9 }}>VIEW ALL MODELS</a>
      </div>

      {/* Carousel */}
      <div style={{ maxWidth: 1360, margin: "0 auto", overflow: "hidden" }}>
        <div style={{
          display: "flex", gap: 20,
          transform: `translateX(calc(-${offset} * (100% / ${visCount} + 20px / ${visCount})))`,
          transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {cars.map((car, i) => (
            <div key={i} className="card-root" style={{
              flex: `0 0 calc(${100 / visCount}% - ${20 * (visCount - 1) / visCount}px)`,
              cursor: "pointer",
            }}>
              <div className="card-img-wrap" style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", marginBottom: 18 }}>
                <img src={car.img} alt={car.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <Link href={`/inventory/${car.id}`} className="card-overlay" style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  textDecoration: "none",
                }}>
                  <span className="btn-outline" style={{ fontSize: 9, padding: "10px 24px" }}>DISCOVER</span>
                </Link>
                <div style={{
                  position: "absolute", top: 14, left: 14,
                  fontFamily: "var(--font-body)", fontSize: 8, letterSpacing: "0.2em",
                  color: "var(--black)", background: "var(--white)",
                  padding: "5px 10px", fontWeight: 600,
                }}>{car.tag}</div>
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.14em", color: "var(--text-light)", fontWeight: 500 }}>
                {car.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ maxWidth: 1360, margin: "40px auto 0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button className="carousel-arrow" onClick={() => setOffset(Math.max(0, offset - 1))}
          style={{ opacity: offset === 0 ? 0.35 : 1 }}>
          <ChevronLeft />
        </button>
        <button className="carousel-arrow" onClick={() => setOffset(Math.min(maxOffset, offset + 1))}
          style={{ opacity: offset >= maxOffset ? 0.35 : 1 }}>
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

// ─── NEWS & EVENTS ────────────────────────────────────────────────────────────
function NewsSection() {
  const ref = useReveal();
  return (
    <section style={{ background: "var(--dark2)", padding: "clamp(80px, 12vw, 100px) clamp(16px, 5vw, 40px)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        <div ref={ref} className="reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 52, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)", marginBottom: 12 }}>PRESS</div>
            
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3vw, 36px)", letterSpacing: "0.06em", color: "#ffffff", fontWeight: 500 }}>
              NEWS & EVENTS
            </h2>
          </div>
          <a href="#" className="btn-outline" style={{ fontSize: 9, color: "#ffffff" }}>SEE ALL</a>
        </div>

        <div>
          {news.map((item, i) => (
            <div key={i} className="news-item" style={{ display: "flex", alignItems: "center", gap: 28, padding: "28px 0", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              
              
              <div style={{ flex: "0 0 200px", height: 130, overflow: "hidden" }}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }} />
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 16, marginBottom: 8, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", color: "var(--text-dim)", fontWeight: 400 }}>
                    {item.date}
                  </span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.2em", color: "var(--gold)", fontWeight: 500 }}>
                    {item.cat}
                  </span>
                </div>
                
                
                <h3 className="news-title" style={{ fontFamily: "var(--font-body)", fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 500, letterSpacing: "0.08em", color: "#ffffff" }}>
                  {item.title}
                </h3>
              </div>
              
          
              <div style={{ flex: "0 0 auto", color: "#ffffff" }}>
                <ChevronRight />
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ─── VISUAL CATEGORIES (SPLIT) ────────────────────────────────────────────────
function SplitCategories() {
  return (
    <section style={{ display: "flex", height: "clamp(360px, 50vw, 640px)" }}>
      {/* ALL CARS */}
      <Link href="/inventory" style={{ flex: 1, textDecoration: "none" }}>
        <div className="split-panel" style={{ flex: 1, position: "relative", cursor: "pointer", overflow: "hidden", height: "100%" }}>
          <img src="/Images-home/ff74324e3edafd5db62bfae27ed91351.jpg"
            alt="All Cars" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.4)" }} />
            <h3 className="split-label" style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(18px, 3vw, 32px)",
              letterSpacing: "0.18em", color: "rgba(255,255,255,0.85)", fontWeight: 500,
            }}>ALL CARS</h3>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </Link>

      {/* Divider */}
      <div style={{ width: 1, background: "var(--black)", flexShrink: 0 }} />

      {/* SERVICES */}
      <Link href="/contact" style={{ flex: 1, textDecoration: "none" }}>
        <div className="split-panel" style={{ flex: 1, position: "relative", cursor: "pointer", overflow: "hidden", height: "100%" }}>
          <img src="/Images-home/photo-1558618666-fcd25c85cd64.jpg"
            alt="Rims" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.4)" }} />
            <h3 className="split-label" style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(18px, 3vw, 32px)",
              letterSpacing: "0.18em", color: "rgba(255,255,255,0.85)", fontWeight: 500,
            }}>SERVICES</h3>
            <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.4)" }} />
          </div>
        </div>
      </Link>
    </section>
  );
}


// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CTABanner() {
  const ref = useReveal();
  return (
    <section style={{ position: "relative", height: 420, overflow: "hidden" }}>
      <img src="/Images-home/photo-1503376780353-7e6692767b70.jpg"
        alt="CTA" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
      <div ref={ref} className="reveal" style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 20, textAlign: "center", padding: "0 20px",
      }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.3em", color: "var(--gold)" }}>
          BESPOKE EXPERIENCE
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 4vw, 52px)", letterSpacing: "0.06em", color: "var(--white)", fontWeight: 500 }}>
          CHOOSE YOUR DREAM CAR
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.08em", color: "var(--text-mid)", maxWidth: 480, lineHeight: 1.9, fontWeight: 300 }}>
          Every detail crafted to your specification. Begin your personal journey into the world of automotive excellence.
        </p>
        <a href="/contact" className="btn-outline">CONTACT US NOW</a>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "MODELS", links: ["ALL CARS", "BODY KITS", "INTERIOR", "SERVICES", "ACCESSORIES"] },
    { title: "COMPANY", links: ["ABOUT US", "ATELIER", "CONFIGURATOR", "CAREERS", "PRESS"] },
    { title: "SUPPORT", links: ["FIND A DEALER", "CONTACT", "FAQ", "SHIPPING", "WARRANTY"] },
    { title: "LEGAL", links: ["IMPRINT", "PRIVACY POLICY", "TERMS OF USE", "COOKIES"] },
  ];

  const TwitterX = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.737l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  const YouTube = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
  const Facebook = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  const Instagram = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );

  return (
    <footer className="footer-container" style={{ background: "var(--dark2)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Top: Logo + columns */}
        <div className="footer-grid" style={{ marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: "0.22em", color: "var(--white)", fontWeight: 600, marginBottom: 8 }}>
              UNIDRIVE
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.3em", color: "var(--text-dim)", marginBottom: 20 }}>INDIVIDUALIZATION</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-dim)", lineHeight: 1.9, maxWidth: 220, fontWeight: 300, letterSpacing: "0.03em" }}>
              The world's leading name in automotive individualization and bespoke luxury modification.
            </p>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.22em", color: "var(--white)", fontWeight: 600, marginBottom: 24 }}>
                {col.title}
              </div>
              {col.links.map(link => (
                <a key={link} href="#" className="footer-link">{link}</a>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 9, letterSpacing: "0.12em", color: "var(--text-dim)" }}>
            © 2026 UNIDRIVE. ALL RIGHTS RESERVED.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[<TwitterX key="x" />, <YouTube key="yt" />, <Facebook key="fb" />, <Instagram key="ig" />].map((Icon, i) => (
              <div key={i} className="social-icon">{Icon}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1000ms = 1 second
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen Overlay */}
      <div className={`loader-container ${!loading ? 'hidden' : ''}`}>
         <div className="loader-text">UNIDRIVE</div>
      </div>

      {/* Main App Content */}
      <div style={{ background: "var(--black)", minHeight: "100vh" }}>
        <Header />
        <main>
          <HeroSlider />
          <AnimatedLogosBar />
          <FindModel />
          <LatestCarousel />
          <NewsSection />
          <SplitCategories />
          <CTABanner />
        </main>
        <Footer />
      </div>
    </>
  );
}