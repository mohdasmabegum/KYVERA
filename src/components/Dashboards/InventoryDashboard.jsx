import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  CheckSquare, 
  Search, 
  AlertTriangle, 
  Layers, 
  Plus, 
  Clock, 
  FileSpreadsheet 
} from 'lucide-react';

export const InventoryDashboard = () => {
  const { 
    currentUser, 
    materialRequests, 
    inventory, 
    updateMaterialStatus, 
    exportToExcel,
    setActiveTab 
  } = useApp();

  const [searchEmpId, setSearchEmpId] = useState('');

  const pendingRequests = materialRequests.filter(m => m.status === 'Pending');
  const orderedRequests = materialRequests.filter(m => m.status === 'Ordered');
  const completedHandovers = materialRequests.filter(m => m.status === 'Handed Over' || m.status === 'Completed');
  const lowStockItems = inventory.filter(i => i.qty <= i.minQty);

  const filteredRequests = materialRequests.filter(m => 
    m.empId.toLowerCase().includes(searchEmpId.toLowerCase()) ||
    m.empName.toLowerCase().includes(searchEmpId.toLowerCase()) ||
    m.materialName.toLowerCase().includes(searchEmpId.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Inventory Manager Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Package size={16} /> Inventory Operations Console
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Supply Chain Dashboard</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage incoming material requests, purchase lists, stock allocation, and handover delivery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => exportToExcel(inventory, `Kyvera_Inventory_Catalog_${Date.now()}.csv`)}
            className="kyvera-btn-secondary text-xs"
          >
            <FileSpreadsheet size={15} className="text-emerald-400" /> Export Stock Catalog
          </button>
          <button 
            onClick={() => setActiveTab('material')}
            className="kyvera-btn-primary text-xs"
          >
            Manage All Requisitions →
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-card border-l-4 border-l-amber-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Incoming Requests</div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingRequests.length}</div>
          <div className="text-[10px] text-slate-400">Needs stock check</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-blue-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Pending Vendor Orders</div>
          <div className="text-2xl font-extrabold text-cyan-400">{orderedRequests.length}</div>
          <div className="text-[10px] text-slate-400">On purchase list</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-emerald-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Completed Handovers</div>
          <div className="text-2xl font-extrabold text-emerald-400">{completedHandovers.length}</div>
          <div className="text-[10px] text-emerald-400/80 font-medium">Issued to employees</div>
        </div>

        <div className="p-4 rounded-xl glass-card border-l-4 border-l-rose-500 space-y-1">
          <div className="text-xs text-slate-400 font-semibold">Low / Out of Stock</div>
          <div className="text-2xl font-extrabold text-rose-400">{lowStockItems.length}</div>
          <div className="text-[10px] text-rose-400/80 font-medium">Restock threshold alert</div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Material Requisition Search & Actions (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Search size={16} className="text-cyan-400" /> Material Requests Search by Employee ID
              </span>
              <div className="relative max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Employee ID (e.g. MRA-005)..."
                  value={searchEmpId}
                  onChange={(e) => setSearchEmpId(e.target.value)}
                  className="kyvera-input pl-8 py-1 text-xs"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredRequests.map((req) => (
                <div key={req.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white">{req.materialName} ({req.quantity})</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold text-[10px]">
                      {req.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    Employee: <strong className="text-white">{req.empName}</strong> ({req.empId}) • Dept: {req.dept} • Project: {req.projectName}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Request Date: {req.requestDate}</span>
                    <button 
                      onClick={() => setActiveTab('material')}
                      className="text-cyan-400 hover:underline font-bold text-xs"
                    >
                      Update Status →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Low Stock Purchase List (1/3) */}
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart size={16} className="text-amber-400" /> Vendor Purchase List
              </span>
            </div>

            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{item.name}</span>
                    <span className="text-rose-400 text-[10px] bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800">
                      Qty: {item.qty}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Category: {item.category} • Location: {item.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
