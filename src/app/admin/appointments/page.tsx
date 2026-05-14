"use client";

import { useState, useEffect } from "react";
import { 
  Search,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  XCircle,
  Clock,
  CheckCircle2,
  Filter,
  User,
  Car as CarIcon,
  Activity
} from "lucide-react";

type Car = {
  make: string;
  model: string;
  name: string;
};

type Appointment = {
  id: number;
  carId: number;
  clientName: string;
  clientEmail: string | null;
  scheduledAt: string;
  status: string;
  notes: string | null;
  car?: Car;
};

const initialForm = {
  carId: "",
  clientName: "",
  clientEmail: "",
  scheduledAt: "",
  notes: "",
  status: "pending",
};

export default function AppointmentsDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        carId: String(app.carId),
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
            carId: parseInt(formData.carId),
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
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments.filter(app => 
    app.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.car?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-20 animate-in fade-in duration-1000">
      
      {/* Header Info */}
      <div className="mb-16">
        <div className="text-[#b8965a] font-bold tracking-[0.4em] text-[10px] mb-4 uppercase">CLIENT SERVICES</div>
        <h1 className="text-5xl font-serif text-white tracking-wide font-medium">Test Drive Schedules</h1>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { label: "TOTAL TESTS", val: appointments.length, icon: CalendarDays },
          { label: "PENDING", val: appointments.filter(a => a.status === "pending").length, icon: Clock },
          { label: "APPROVED", val: appointments.filter(a => a.status === "approved").length, icon: CheckCircle2 },
          { label: "CANCELLED", val: appointments.filter(a => a.status === "cancelled").length, icon: XCircle }
        ].map((stat, i) => (
          <div key={i} className="bg-[#080808] border border-white/5 p-8 relative group hover:border-[#b8965a]/30 transition-all duration-700">
            <div className="flex justify-between items-start mb-8">
              <stat.icon size={20} className="text-[#333] group-hover:text-[#b8965a] transition-colors duration-700" />
              <div className="text-[10px] font-bold text-[#333] tracking-[0.2em]">{String(i+1).padStart(2, '0')}</div>
            </div>
            <p className="text-[#5a5a5a] text-[9px] font-bold uppercase tracking-[0.3em] mb-3">{stat.label}</p>
            <p className="text-white font-serif text-4xl tracking-tight">{stat.val}</p>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#b8965a] group-hover:w-full transition-all duration-700"></div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-[#080808] border border-white/5 min-w-0">
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 p-10 border-b border-white/5">
          <div className="flex items-center gap-6">
             <div className="font-serif text-2xl text-white tracking-wide">Client Ledger</div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="admin-toolbar-search relative min-w-0">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#333] group-focus-within:text-[#b8965a] transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH CLIENTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-toolbar-search-input bg-transparent border-b border-white/10 text-[11px] tracking-[0.16em] text-white pl-10 pr-5 py-3 focus:outline-none focus:border-[#b8965a] transition-all w-72 placeholder:text-[#444]"
              />
            </div>
            
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center bg-white hover:bg-[#b8965a] hover:text-white text-black px-10 py-4 text-[10px] font-black tracking-[0.2em] transition-all active:scale-95 shrink-0"
            >
              <Plus size={14} className="mr-3" />
              NEW BOOKING
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-black text-[#444] border-b border-white/5">
              <tr>
                <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.3em]">Client Information</th>
                <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.3em]">Vehicle Model</th>
                <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.3em]">Scheduled Window</th>
                <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.3em]">Status</th>
                <th className="px-10 py-8 text-[9px] font-bold uppercase tracking-[0.3em] text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                       <Activity className="text-[#b8965a] animate-pulse mx-auto mb-6" size={32} />
                       <p className="text-[#333] font-bold uppercase tracking-[0.4em] text-[9px]">Synchronizing Appointments</p>
                    </td>
                 </tr>
              ) : filteredAppointments.map((app) => (
                <tr key={app.id} className="hover:bg-white/[0.01] transition-all duration-500 group">
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-10 min-w-0">
                      <div className="w-14 h-14 bg-black border border-white/5 flex items-center justify-center text-[#333] group-hover:text-[#b8965a] transition-all duration-700 relative">
                         <User size={24} />
                         <div className="absolute inset-0 border border-white/0 group-hover:border-[#b8965a]/20 transition-all duration-700"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-serif text-xl text-white tracking-wide group-hover:text-[#b8965a] transition-colors duration-500">{app.clientName}</p>
                        <p className="text-[9px] text-[#5a5a5a] font-bold uppercase tracking-[0.3em] mt-2">{app.clientEmail || "NO EMAIL PROVIDED"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-4">
                       <CarIcon size={14} className="text-[#333]" />
                       <span className="text-white text-[11px] font-medium tracking-widest uppercase">
                          {app.car ? `${app.car.make} ${app.car.model}` : `MODEL ID: #${app.carId}`}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <p className="text-white text-[11px] font-medium tracking-widest uppercase">{new Date(app.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    <p className="text-[8px] text-[#333] font-bold uppercase tracking-[0.3em] mt-2">CONFIRMED SLOT</p>
                  </td>
                  <td className="px-10 py-10">
                    <div className={`inline-flex items-center gap-3 px-0 py-2 text-[9px] font-bold uppercase tracking-[0.25em] ${
                      app.status === "approved" || app.status === "completed"
                        ? "text-[#b8965a]" 
                        : app.status === "pending" 
                        ? "text-[#888]" 
                        : "text-[#444]"
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${
                        app.status === "approved" || app.status === "completed" ? "bg-[#b8965a] shadow-[0_0_8px_#b8965a]" 
                        : "bg-current"
                      }`} />
                      {app.status}
                    </div>
                  </td>
                  <td className="px-10 py-10 text-center">
                    <div className="flex items-center justify-center gap-6">
                      {app.status === "pending" && (
                        <button 
                          onClick={() => updateStatus(app.id, "approved")} 
                          className="text-[#b8965a] hover:text-white text-[9px] font-black uppercase tracking-widest transition-all p-2"
                        >
                          APPROVE
                        </button>
                      )}
                      <button 
                        onClick={() => handleOpenModal(app)}
                        className="text-[#333] hover:text-white transition-colors p-2"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(app.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[100] animate-in fade-in duration-500">
          <div className="bg-black border border-white/10 w-full max-w-lg shadow-[0_0_100px_rgba(184,150,90,0.05)]">
            <div className="p-12 border-b border-white/5 flex justify-between items-end">
              <div>
                <div className="text-[#b8965a] font-bold tracking-[0.4em] text-[8px] mb-4 uppercase">CLIENT RELATIONSHIP</div>
                <h2 className="text-3xl font-serif text-white tracking-wide">
                  {editingId ? "Update Booking" : "Register Booking"}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="text-[#444] hover:text-white transition-all pb-1">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              {!editingId && (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Target Asset ID</label>
                    <input type="number" required value={formData.carId} onChange={(e) => setFormData({ ...formData, carId: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Client Full Name</label>
                    <input type="text" required value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Contact Email</label>
                    <input type="email" value={formData.clientEmail} onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest placeholder:text-[#222]" placeholder="CLIENT@EXAMPLE.COM" />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Scheduled Window</label>
                <input type="datetime-local" required value={formData.scheduledAt} onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white [color-scheme:dark]" />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Relationship Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest uppercase">
                  <option value="pending" className="bg-black">Pending Review</option>
                  <option value="approved" className="bg-black">Approved</option>
                  <option value="completed" className="bg-black">Completed</option>
                  <option value="cancelled" className="bg-black">Cancelled</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-bold text-[#444] uppercase tracking-[0.3em] pl-1">Internal Notes</label>
                <textarea rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full !bg-transparent !border-white/10 !border-0 !border-b !rounded-none px-0 py-3 text-[11px] focus:!border-[#b8965a] text-white tracking-widest" />
              </div>

              <div className="pt-12 flex justify-end gap-10">
                <button type="button" onClick={handleCloseModal} className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#333] hover:text-white transition-all">
                  DISCARD
                </button>
                <button type="submit" className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#b8965a] hover:text-white transition-all">
                  {editingId ? "COMMIT UPDATES" : "REGISTER BOOKING"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
