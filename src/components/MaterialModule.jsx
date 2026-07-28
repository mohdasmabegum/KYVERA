import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Truck, 
  ShoppingCart, 
  ListTodo,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MaterialModule = () => {
  const { 
    currentUser, 
    materialRequests, 
    inventory, 
    submitMaterialRequest, 
    updateMaterialStatus, 
    addInventoryItem,
    exportToExcel 
  } = useApp();

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    materialName: 'Microcontroller Dev Boards (STM32)',
    quantity: '1 pcs',
    projectName: '',
    priority: 'Quick'
  });

  const [newStockItem, setNewStockItem] = useState({
    name: '',
    category: 'Hardware',
    qty: 10,
    unit: 'pcs',
    minQty: 5,
    location: 'Rack A-1'
  });

  const isInventoryMgr = currentUser.id === 'INVENTORY' || currentUser.id === 'CEO' || currentUser.id === 'COORDINATOR';

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

  // Pending To-Do list for inventory manager (Not Available / Out of Stock items needing orders)
  const todoOrderList = materialRequests.filter(m => m.status === 'Pending for Order');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 uppercase tracking-wider">
            <Package size={16} /> Material & Inventory Management
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">Material Requests & Inventory</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Department material requisitions, stock catalog, and Inventory order To-Do reminder list.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => exportToExcel(inventory, `Kyvera_Inventory_${Date.now()}.csv`)}
            className="kyvera-btn-secondary text-xs"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" /> Export Stock CSV
          </button>

          {isInventoryMgr && (
            <button
              onClick={() => setIsAddStockModalOpen(true)}
              className="kyvera-btn-secondary text-xs"
            >
              <Plus size={15} /> Add Stock Item
            </button>
          )}

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={16} /> Request Material
          </button>
        </div>
      </div>

      {/* Inventory To-Do Reminder List (Pending for Order) */}
      {todoOrderList.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <ListTodo size={16} className="text-amber-600" /> Inventory To-Do Reminder List (Pending for Order)
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold">
              {todoOrderList.length} Material Orders Pending
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todoOrderList.map(item => (
              <div key={item.id} className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between font-extrabold">
                  <span className="text-slate-900">{item.materialName}</span>
                  <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                    Qty: {item.quantity}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] font-medium">
                  Requested by: <strong className="text-slate-900">{item.empName}</strong> ({item.dept}) • Project: {item.projectName}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-500">Status: <strong className="text-amber-800 font-bold">Pending for Order</strong></span>
                  {isInventoryMgr && (
                    <button
                      onClick={() => updateMaterialStatus(item.id, 'Ordered', currentUser.name, { availability: 'Order Placed' })}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart size={12} /> Place Order Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Catalog Section */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Package size={16} className="text-cyan-700" /> Current Inventory Catalog
          </span>
          <span className="text-[11px] text-slate-500 font-bold">{inventory.length} SKUs Listed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventory.map(item => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-extrabold text-slate-900">
                <span>{item.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.status === 'In Stock' ? 'badge-success' : item.status === 'Low Stock' ? 'badge-important' : 'badge-emergency'
                }`}>
                  {item.status}
                </span>
              </div>
              <div className="text-slate-600 font-medium">Category: {item.category} • Location: {item.location}</div>
              <div className="text-slate-900 font-extrabold text-sm pt-1">
                {item.qty} {item.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Requests Log */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck size={16} className="text-teal-700" /> Material Requests Log ({materialRequests.length})
          </span>
        </div>

        <div className="space-y-3">
          {materialRequests.map(req => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm">{req.materialName}</span>
                  <span className="text-slate-500 font-medium ml-2">(Qty: {req.quantity})</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 font-extrabold text-[11px] w-fit">
                  {req.status}
                </span>
              </div>

              <div className="text-slate-600 font-medium">
                Requested by: <strong className="text-slate-900">{req.empName}</strong> ({req.dept}) • Project: {req.projectName}
              </div>

              {isInventoryMgr && req.status === 'Pending' && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => updateMaterialStatus(req.id, 'Handed Over', currentUser.name, { availability: 'Available' })}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 size={13} /> In Stock (Hand Over)
                  </button>
                  <button
                    onClick={() => updateMaterialStatus(req.id, 'Pending for Order', currentUser.name, { availability: 'Out of Stock' })}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle size={13} /> Not Available (Add to To-Do Order List)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Material Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Department Material Request"
        icon={Package}
      >
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Material / Component *</label>
            <select
              value={formData.materialName}
              onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
              className="kyvera-input"
            >
              {inventory.map(i => <option key={i.id} value={i.name}>{i.name} ({i.status})</option>)}
              <option value="Other Specific Component">Other Specific Component (Custom)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">No. Of Units / Quantity *</label>
              <input
                type="text"
                required
                placeholder="e.g. 5 pcs, 20 meters"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="kyvera-input"
              >
                <option value="Quick">Quick</option>
                <option value="Emergency">Emergency</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">For Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Automation Rig"
              value={formData.projectName}
              onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            Requesting Department: <strong className="text-slate-900">{currentUser.dept}</strong> • User ID: <strong className="text-slate-900">{currentUser.empId}</strong>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Relay Module 5V"
              value={newStockItem.name}
              onChange={(e) => setNewStockItem({ ...newStockItem, name: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={newStockItem.category}
                onChange={(e) => setNewStockItem({ ...newStockItem, category: e.target.value })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Rack *</label>
              <input
                type="text"
                required
                value={newStockItem.location}
                onChange={(e) => setNewStockItem({ ...newStockItem, location: e.target.value })}
                className="kyvera-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
              <input
                type="number"
                required
                value={newStockItem.qty}
                onChange={(e) => setNewStockItem({ ...newStockItem, qty: Number(e.target.value) })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit *</label>
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
              Save Inventory Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
