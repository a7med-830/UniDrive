"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Search,
  Plus,
  Pencil,
  Trash2,
  Activity,
  Award,
  Car as CarIcon,
  ChevronRight,
  Filter,
  Download
} from "lucide-react";

type Car = {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  price: number;
  fuelType: string;
  status: string;
  body?: string | null;
  color?: string | null;
  mileage?: string | null;
  mpg?: string | null;
  badge?: string | null;
  trim?: string | null;
  engine?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;
  seats?: number | null;
  description?: string | null;
  features?: string[];
  image?: string | null;
  images?: string[];
};

const initialForm = {
  name: "",
  make: "",
  model: "",
  year: 2024,
  price: 50000,
  fuelType: "Petrol",
  status: "available",
  body: "",
  color: "",
  mileage: "",
  mpg: "",
  badge: "",
  trim: "",
  engine: "",
  transmission: "",
  drivetrain: "",
  seats: 5,
  description: "",
  features: "",
  image: "",
  images: "",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | null>(null);
  const [formData, setFormData] = useState(initialForm);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars?limit=1000");
      if (res.ok) {
        const data = await res.json();
        setCars(data);
      }
    } catch (err) {
      console.error("Failed to fetch cars", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleOpenModal = (car?: Car) => {
    if (car) {
      setEditingCarId(car.id);
      setFormData({
        name: car.name,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        fuelType: car.fuelType,
        status: car.status,
        body: car.body || "",
        color: car.color || "",
        mileage: car.mileage || "",
        mpg: car.mpg || "",
        badge: car.badge || "",
        trim: car.trim || "",
        engine: car.engine || "",
        transmission: car.transmission || "",
        drivetrain: car.drivetrain || "",
        seats: car.seats || 5,
        description: car.description || "",
        features: car.features ? car.features.join(", ") : "",
        image: car.image || "",
        images: car.images ? car.images.join(", ") : "",
      });
    } else {
      setEditingCarId(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCarId(null);
    setFormData(initialForm);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCars();
      } else {
        alert("Failed to delete car");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = editingCarId !== null;
      const url = isEdit ? `/api/cars/${editingCarId}` : `/api/cars`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          year: Number(formData.year),
          price: Number(formData.price),
          seats: Number(formData.seats),
          features: formData.features.split(",").map(s => s.trim()).filter(Boolean),
          images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        handleCloseModal();
        fetchCars();
      } else {
        const data = await res.json();
        alert(`Error: ${JSON.stringify(data.error)}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save car");
    }
  };

  const filteredCars = cars.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.make.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-20 animate-in fade-in duration-1000">
      
      {/* Header Info */}
      <div className="mb-16 py-6 pb-4">
        <div className="text-[#b8965a] font-bold tracking-[0.4em] text-[10px] mb-4 uppercase">FLEET & INVENTORY</div>
        <h1 className="text-5xl font-serif text-white tracking-wide font-medium">Automotive Portfolio</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { label: "TOTAL UNITS", val: cars.length, icon: Award, color: "#b8965a" },
          { label: "AVAILABLE", val: cars.filter(c => c.status === "available").length, icon: TrendingUp, color: "#ffffff" },
          { label: "RESERVED", val: cars.filter(c => c.status === "reserved").length, icon: Activity, color: "#5a5a5a" },
          { label: "SOLD OUT", val: cars.filter(c => c.status === "sold").length, icon: XCircle, color: "#b8965a" }
        ].map((stat, i) => (
          <div key={i} className="admin-stat-card bg-[#080808] border border-white/5 px-8 py-7 relative group hover:border-[#b8965a]/30 transition-all duration-700">
            <div className="flex justify-between items-start gap-3 mb-4">
              <stat.icon size={22} className="admin-stat-icon text-[#333] group-hover:text-[#b8965a] transition-colors duration-700 shrink-0" />
              <div className="text-[10px] font-bold text-[#333] tracking-[0.2em] leading-none">{String(i+1).padStart(2, '0')}</div>
            </div>
            <p className="admin-stat-label text-[#5a5a5a] text-[10px] font-bold uppercase tracking-[0.24em] mb-4">{stat.label}</p>
            <p className="admin-stat-value text-white font-serif text-4xl leading-none tracking-tight">{stat.val}</p>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b8965a] group-hover:w-full transition-all duration-700"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#080808] border border-white/5 min-w-0">
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 p-10 border-b border-white/5">
          <div className="flex items-center gap-6">
             <div className="font-serif text-2xl text-white tracking-wide">Current Inventory</div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="admin-toolbar-search relative min-w-0">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#b8965a] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="FILTER MODELS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-toolbar-search-input bg-transparent border-b border-white/10 text-[11px] tracking-[0.16em] text-white pl-10 pr-5 py-3 focus:outline-none focus:border-[#b8965a] transition-all w-72 placeholder:text-[#444]"
              />
            </div>
            
            <button
              onClick={() => handleOpenModal()}
              className="admin-primary-cta flex items-center justify-center bg-white hover:bg-[#b8965a] hover:text-white text-black px-7 py-3.5 text-[11px] font-black tracking-[0.16em] transition-all active:scale-95 shrink-0 min-h-[46px]"
            >
              <Plus size={15} className="mr-3 shrink-0" />
              ADD VEHICLE
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black text-[#444] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em]">Vehicle & Model</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em]">Specifications</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em]">Availability</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em]">Valuation</th>
                <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-[0.3em] text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="px-6 py-5 text-center">
                       <Activity className="text-[#b8965a] animate-pulse mx-auto mb-6" size={32} />
                       <p className="text-[#333] font-bold uppercase tracking-[0.4em] text-[9px]">Initializing Inventory Database</p>
                    </td>
                 </tr>
              ) : filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-white/[0.01] transition-all duration-500 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-24 h-16 bg-black border border-white/5 overflow-hidden relative transition-all duration-700">
                         {car.image ? (
                           <img src={car.image} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-[#050505]"><CarIcon size={20} className="text-[#1a1a1a]" /></div>
                         )}
                         <div className="absolute inset-0 border border-white/0 group-hover:border-[#b8965a]/20 transition-all duration-700"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-xl text-white tracking-wide group-hover:text-[#b8965a] transition-colors duration-500">{car.name}</p>
                        <p className="text-[9px] text-[#5a5a5a] font-bold uppercase tracking-[0.3em] mt-2">{car.make} • {car.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-3">
                       <span className="text-white text-[11px] font-medium tracking-widest">
                          YEAR: {car.year}
                       </span>
                       <span className="text-[#444] text-[9px] font-bold uppercase tracking-[0.2em]">{car.fuelType} ENGINE</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-3 px-0 py-2 text-[9px] font-bold uppercase tracking-[0.25em] ${
                      car.status === "available" 
                        ? "text-[#b8965a]" 
                        : car.status === "reserved" 
                        ? "text-[#888]" 
                        : "text-[#444]"
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${
                        car.status === "available" ? "bg-[#b8965a] shadow-[0_0_8px_#b8965a]" 
                        : "bg-current"
                      }`} />
                      {car.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-white font-serif text-2xl tracking-wide">${car.price.toLocaleString()}</p>
                    <p className="text-[8px] text-[#333] font-bold uppercase tracking-[0.3em] mt-2">MSRP VALUATION</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-6">
                      <button 
                        onClick={() => handleOpenModal(car)}
                        className="text-[#333] hover:text-white transition-colors p-2"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(car.id)}
                        className="text-[#333] hover:text-[#b8965a] transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with sharp luxury style */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/65 flex items-center justify-center p-4 z-[100] animate-in fade-in duration-500">
          <div className="admin-modal-panel bg-black border border-white/10 w-full max-w-2xl shadow-[0_0_100px_rgba(184,150,90,0.05)]">
            <div className="admin-modal-header p-10 border-b border-white/5 flex justify-between items-end">
              <div>
                <div className="text-[#b8965a] font-bold tracking-[0.4em] text-[8px] mb-4 uppercase">INVENTORY MANAGEMENT</div>
                <h2 className="text-3xl font-serif text-white tracking-wide">
                  {editingCarId ? "Update Model" : "Initialize Model"}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="text-[#444] hover:text-white transition-all pb-1 p-2">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-modal-form p-10 space-y-8">
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Brand</label>
                  <input type="text" required value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest placeholder:text-[#222]" placeholder="e.g. FERRARI" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Model</label>
                  <input type="text" required value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. PUROSANGUE" />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Marketing Title</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[13px] font-serif tracking-wide focus:!border-[#b8965a] text-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Year</label>
                  <input type="number" required min={1900} max={2100} value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Price (USD)</label>
                  <input type="number" required min={1} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[13px] font-serif focus:!border-[#b8965a] text-white" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Fuel Type</label>
                  <select value={formData.fuelType} onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest uppercase">
                    <option value="Petrol" className="bg-black">Petrol</option>
                    <option value="Electric" className="bg-black">Electric</option>
                    <option value="Hybrid" className="bg-black">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Availability</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest uppercase">
                    <option value="available" className="bg-black">Available</option>
                    <option value="reserved" className="bg-black">Reserved</option>
                    <option value="sold" className="bg-black">Sold Out</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Body Type</label>
                  <input type="text" value={formData.body} onChange={(e) => setFormData({ ...formData, body: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. SUV" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Exterior Color</label>
                  <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. Black" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Mileage</label>
                  <input type="text" value={formData.mileage} onChange={(e) => setFormData({ ...formData, mileage: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. New" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Fuel Economy (MPG)</label>
                  <input type="text" value={formData.mpg} onChange={(e) => setFormData({ ...formData, mpg: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. 18 city / 25 hwy" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Trim</label>
                  <input type="text" value={formData.trim} onChange={(e) => setFormData({ ...formData, trim: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. Premium Luxury" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Badge</label>
                  <input type="text" value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. New Arrival" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Engine</label>
                  <input type="text" value={formData.engine} onChange={(e) => setFormData({ ...formData, engine: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. 4.0L Twin-Turbo V8" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Transmission</label>
                  <input type="text" value={formData.transmission} onChange={(e) => setFormData({ ...formData, transmission: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. 8-Speed Automatic" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Drivetrain</label>
                  <input type="text" value={formData.drivetrain} onChange={(e) => setFormData({ ...formData, drivetrain: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" placeholder="e.g. AWD" />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Seats</label>
                  <input type="number" min={1} value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value || "1") })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white" />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Primary Asset URL</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="/IMAGES/CARS/MODEL.JPG OR HTTPS://IMAGE-STORAGE.COM/MODEL.JPG" className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[10px] tracking-[0.1em] focus:!border-[#b8965a] text-white" />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Additional Photos (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="HTTPS://.../IMG1.JPG, HTTPS://.../IMG2.JPG, HTTPS://.../IMG3.JPG"
                    className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[10px] tracking-[0.08em] focus:!border-[#b8965a] text-white placeholder:text-[#333]"
                  />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Features (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Adaptive Suspension, Premium Audio, Panoramic Roof"
                    className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[10px] tracking-[0.08em] focus:!border-[#b8965a] text-white placeholder:text-[#333]"
                  />
                </div>
                <div className="col-span-2 space-y-3">
                  <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-wide resize-none"
                    placeholder="Short vehicle overview..."
                  />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-8">
                <button type="button" onClick={handleCloseModal} className="admin-modal-secondary-btn text-[10px] font-bold uppercase tracking-[0.24em] text-[#444] hover:text-white transition-all">
                  DISCARD
                </button>
                <button type="submit" className="admin-modal-primary-btn text-[10px] font-bold uppercase tracking-[0.24em] text-[#b8965a] hover:text-white transition-all">
                  {editingCarId ? "COMMIT UPDATES" : "INITIALIZE ASSET"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
