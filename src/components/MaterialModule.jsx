import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ShoppingCart, 
  ListTodo,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MaterialModule = ({ onInspectDetail }) => {
  const { 
    currentUser, 
    materialRequests, 
    inventory, 
    submitMaterialRequest, 
    updateMaterialStatus, 
    addInventoryItem,
    exportToExcel,
    departments
  } = useApp();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);

  // Exact Material Form Fields requested by user:
  // 1. Dept name, 2. User id, 3. Type of material, 4. Type of requirement (Emergency/Quick), 5. For project, 6. No. Of units of material
  const [formData, setFormData] = useState({
    dept: currentUser?.dept || 'Engineering',
    userId: currentUser?.empId || '',
    materialType: 'Microcontroller Dev Boards (STM32)',
    priority: 'Quick', // Emergency / Quick
    projectName: '',
    unitsOrLength: '5 pcs'
  });

  const [newStockItem, setNewStockItem] = useState({
    name: '',
    category: 'Hardware',
    qty: 10,
    unit: 'pcs',
    minQty: 5,
    location: 'Rack A-1'
  });

  const isInventoryMgr = currentUser?.id === 'INVENTORY' || currentUser?.id === 'CEO' || currentUser?.id === 'COORDINATOR';

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    submitMaterialRequest(formData);
    setIsRequestModalOpen(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleAddStockSubmit = (e) => {
    e.preventDefault();
    addInventoryItem(newStockItem);
    setIsAddStockModalOpen(false);
    confetti({ particleCount: 50, spread: 60 });
  };

  // Inventory To-Do list for items pending order
  const todoOrderList = materialRequests.filter(m => m.status === 'Pending for Order');

  return (
    <div className="space-y-8 w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-700 uppercase tracking-widest">
            <Package size={18} /> Material & Inventory Management
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Material Requests & Inventory</h1>
          <p className="text-sm text-slate-500 font-semibold mt-0.5">
            Department material requisitions, stock catalog, and Inventory order To-Do reminder list.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => exportToExcel(materialRequests, `Kyvera_Material_Database_Sheet_${Date.now()}.csv`)}
            className="kyvera-btn-secondary py-3 px-5 text-sm font-extrabold"
          >
            <FileSpreadsheet size={18} className="text-emerald-600" /> Export Database Sheet CSV
          </button>

          {isInventoryMgr && (
            <button
              onClick={() => setIsAddStockModalOpen(true)}
              className="kyvera-btn-secondary py-3 px-5 text-sm font-extrabold"
            >
              <Plus size={18} /> Add Stock Item
            </button>
          )}

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="kyvera-btn-primary py-3 px-6 text-sm font-extrabold shadow-md"
          >
            <Plus size={18} /> Request Material
          </button>
        </div>
      </div>

      {/* Inventory To-Do Reminder List (Pending for Order) */}
      {todoOrderList.length > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <ListTodo size={18} className="text-amber-600" /> Inventory To-Do Reminder List (Pending for Order)
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-extrabold">
              {todoOrderList.length} Material Orders Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todoOrderList.map(item => (
              <div key={item.id} className="p-5 rounded-2xl bg-white border border-amber-200 text-xs space-y-2 shadow-xs">
                <div className="flex items-center justify-between font-extrabold text-sm">
                  <span className="text-slate-900">{item.materialType}</span>
                  <span className="text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md text-xs">
                    Qty: {item.unitsOrLength}
                  </span>
                </div>
                <div className="text-slate-700 text-xs font-bold">
                  Requested by: <strong className="text-slate-900">{item.empName}</strong> ({item.dept}) • User ID: {item.empId} • Project: {item.projectName}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                  <button
                    onClick={() => onInspectDetail && onInspectDetail(item, 'material')}
                    className="text-cyan-800 font-extrabold hover:underline flex items-center gap-1 text-xs"
                  >
                    View Full Details <ArrowRight size={14} />
                  </button>

                  {isInventoryMgr && (
                    <button
                      onClick={() => updateMaterialStatus(item.id, 'Order Placed', currentUser.name)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart size={14} /> Place Order Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Catalog Section */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <span className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package size={20} className="text-cyan-700" /> Current Inventory Catalog
          </span>
          <span className="text-xs font-extrabold text-slate-500">{inventory.length} SKUs Listed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {inventory.map(item => (
            <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-extrabold text-slate-900 text-sm">
                <span>{item.name}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                  item.status === 'In Stock' ? 'badge-success' : item.status === 'Low Stock' ? 'badge-important' : 'badge-emergency'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-slate-600 font-bold">Category: {item.category} • Location: {item.location}</div>
              <div className="text-slate-900 font-extrabold text-base pt-1">
                {item.qty} {item.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Requests Log */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <span className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck size={20} className="text-teal-700" /> Material Requests Log ({materialRequests.length})
          </span>
        </div>

        <div className="space-y-4">
          {materialRequests.map(req => (
            <div key={req.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-base">{req.materialType}</span>
                  <span className="text-slate-500 font-bold ml-2">(Units/Length: {req.unitsOrLength})</span>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-cyan-100 text-cyan-900 font-extrabold text-xs w-fit">
                  {req.status}
                </span>
              </div>

              <div className="text-slate-700 font-bold text-sm">
                Requested by: <strong className="text-slate-900">{req.empName}</strong> ({req.dept}) • User ID: {req.empId} • Project: {req.projectName}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200 flex-wrap gap-2">
                <button
                  onClick={() => onInspectDetail && onInspectDetail(req, 'material')}
                  className="kyvera-btn-secondary text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
                >
                  Inspect Full Details Page <ArrowRight size={14} />
                </button>

                {isInventoryMgr && req.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateMaterialStatus(req.id, 'Handed Over', currentUser.name)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 size={14} /> In Stock (Hand Over)
                    </button>
                    <button
                      onClick={() => updateMaterialStatus(req.id, 'Pending for Order', currentUser.name)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle size={14} /> Not Available (Add to To-Do List)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Request Modal with Exact Requested Fields */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Department Material Request Form"
        icon={Package}
      >
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">1. Department Name *</label>
              <select
                value={formData.dept}
                onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                className="kyvera-input font-bold"
              >
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">2. User ID *</label>
              <input
                type="text"
                required
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                className="kyvera-input font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">3. Type of Material *</label>
            <input
              type="text"
              required
              placeholder="e.g. Microcontroller Dev Boards / Fiber Cables"
              value={formData.materialType}
              onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
              className="kyvera-input font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">4. Type of Requirement *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="kyvera-input font-bold"
              >
                <option value="Emergency">Emergency</option>
                <option value="Quick">Quick</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">6. No. Of Units / Length *</label>
              <input
                type="text"
                required
                placeholder="e.g. 5 pcs, 20 meters"
                value={formData.unitsOrLength}
                onChange={(e) => setFormData({ ...formData, unitsOrLength: e.target.value })}
                className="kyvera-input font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">5. For Project *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Automation Rig"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="kyvera-input font-bold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button type="button" onClick={() => setIsRequestModalOpen(false)} className="kyvera-btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="kyvera-btn-primary text-xs">
              Send Request to Inventory
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Stock Item Modal */}
      <Modal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        title="Add Inventory Item"
        icon={Plus}
      >
        <form onSubmit={handleAddStockSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Item Name *</label>
            <input
              type="text"
              required
              value={newStockItem.name}
              onChange={(e) => setNewStockItem({ ...newStockItem, name: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Quantity *</label>
              <input
                type="number"
                required
                value={newStockItem.qty}
                onChange={(e) => setNewStockItem({ ...newStockItem, qty: Number(e.target.value) })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-1.5">Unit *</label>
              <input
                type="text"
                required
                value={newStockItem.unit}
                onChange={(e) => setNewStockItem({ ...newStockItem, unit: e.target.value })}
                className="kyvera-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button type="button" onClick={() => setIsAddStockModalOpen(false)} className="kyvera-btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="kyvera-btn-primary text-xs">
              Save Inventory Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
