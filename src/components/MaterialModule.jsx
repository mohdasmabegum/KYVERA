import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { 
  Package, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ShoppingCart, 
  Truck, 
  CheckSquare, 
  Search, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ListTodo,
  AlertTriangle
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

  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabFilter, setActiveTabFilter] = useState('ALL');

  // Form State - Material Request
  const [requestData, setRequestData] = useState({
    materialName: '',
    quantity: '1 pcs',
    projectName: '',
    priority: 'Quick'
  });

  // Form State - New Inventory Item
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'Hardware',
    qty: 10,
    unit: 'pcs',
    minQty: 5,
    location: 'Rack A-1'
  });

  const isInventoryManager = ['INVENTORY', 'CEO', 'COORDINATOR'].includes(currentUser.id);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    submitMaterialRequest({
      ...requestData,
      empId: currentUser.empId,
      empName: currentUser.name,
      dept: currentUser.dept
    });
    setIsReqModalOpen(false);
    setRequestData({ materialName: '', quantity: '1 pcs', projectName: '', priority: 'Quick' });
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleAddItemSubmit = (e) => {
    e.preventDefault();
    addInventoryItem({
      ...newItemData,
      qty: Number(newItemData.qty),
      minQty: Number(newItemData.minQty)
    });
    setIsAddItemModalOpen(false);
    setNewItemData({ name: '', category: 'Hardware', qty: 10, unit: 'pcs', minQty: 5, location: 'Rack A-1' });
  };

  // Filter requests that are "Pending for Order" for the Inventory To-Do Reminder List
  const pendingForOrderList = materialRequests.filter(m => 
    m.availability === 'Out of Stock' && (m.status === 'Pending' || m.status === 'Accepted' || m.status === 'Pending for Order')
  );

  const filteredRequests = materialRequests.filter(req => {
    const matchesSearch = 
      req.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTabFilter === 'ALL') return matchesSearch;
    return matchesSearch && req.status === activeTabFilter;
  });

  const getPriorityBadge = (priority) => {
    if (priority === 'Emergency') return 'badge-emergency';
    if (priority === 'Quick') return 'badge-important';
    return 'badge-general';
  };

  const getStatusBadge = (status) => {
    if (status === 'Completed' || status === 'Handed Over') return 'badge-success';
    if (status === 'Ordered') return 'badge-general';
    if (status === 'Pending for Order') return 'badge-important';
    if (status === 'Rejected') return 'badge-emergency';
    return 'badge-pending';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Package size={16} /> Material Requisition & Inventory Portal
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Material Requests & Supply Operations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Submit material requests, manage stock availability, and handle inventory handover.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isInventoryManager && (
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="kyvera-btn-secondary text-xs"
            >
              <Plus size={15} /> Add Stock Item
            </button>
          )}
          
          <button
            onClick={() => exportToExcel(materialRequests, `Kyvera_Material_Requests_${Date.now()}.csv`)}
            className="kyvera-btn-secondary text-xs"
          >
            <FileSpreadsheet size={15} className="text-emerald-400" /> Export CSV
          </button>

          <button
            onClick={() => setIsReqModalOpen(true)}
            className="kyvera-btn-primary text-xs"
          >
            <Plus size={16} /> Request Material
          </button>
        </div>
      </div>

      {/* Inventory Reminder To-Do List for Pending Orders (User Specific Requirement #9) */}
      {pendingForOrderList.length > 0 && (
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/40 bg-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ListTodo size={16} /> Inventory To-Do Reminder: Pending for Order ({pendingForOrderList.length})
            </span>
            <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-semibold">
              Action Needed: Place Vendor Orders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingForOrderList.map((item) => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-white">{item.materialName} ({item.quantity})</div>
                  <div className="text-[10px] text-slate-400">Req By: {item.empName} ({item.dept}) • Project: {item.projectName}</div>
                  <span className="text-[9px] font-bold text-amber-400">Status: Pending for Order</span>
                </div>

                {isInventoryManager && (
                  <button
                    onClick={() => updateMaterialStatus(item.id, 'Ordered', currentUser.name, { availability: 'Out of Stock - Order Placed' })}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold shadow-md cursor-pointer"
                  >
                    Place Order Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stock Overview Bar */}
      <div className="rounded-2xl glass-panel p-4 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers size={14} className="text-cyan-400" /> Live Inventory Stock Status
          </span>
          <span className="text-[11px] text-slate-400">Total Catalog Items: {inventory.length}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {inventory.map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-white truncate max-w-[150px]">{item.name}</div>
                <div className="text-[10px] text-slate-400">{item.category} • {item.location}</div>
                <div className="text-[11px] font-extrabold text-cyan-300 mt-1">
                  Qty: {item.qty} {item.unit}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                item.qty > item.minQty ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                item.qty > 0 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="rounded-2xl glass-panel p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by User ID, Name, Dept, or Material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="kyvera-input pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['ALL', 'Pending', 'Accepted', 'Pending for Order', 'Ordered', 'Handed Over'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveTabFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeTabFilter === status
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Request Cards List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No material requests found.
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-xl glass-card border border-slate-800/80 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-white">{req.materialName}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-bold">
                        Qty/Units: {req.quantity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPriorityBadge(req.priority)}`}>
                        {req.priority} Requirement
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      Dept Request by <span className="font-bold text-white">{req.empName}</span> (ID: {req.empId}) • <span className="text-slate-400">Dept: {req.dept}</span>
                    </div>

                    <div className="text-xs text-slate-400">
                      Project: <span className="text-slate-200 font-semibold">{req.projectName}</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Request Date: {req.requestDate}
                    </span>
                  </div>
                </div>

                {/* Status Timeline / Steps */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <Clock size={12} className="text-cyan-400" /> Accepted By: {req.acceptedBy || 'Pending'}
                    </span>
                    {req.orderDate && (
                      <span className="flex items-center gap-1 text-amber-300">
                        <ShoppingCart size={12} /> Order Date: {req.orderDate}
                      </span>
                    )}
                    {req.handoverDate && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckSquare size={12} /> Handover: {req.handoverDate}
                      </span>
                    )}
                  </div>

                  {/* Inventory Manager Decision Controls (Available vs Not Available -> Pending for Order) */}
                  {isInventoryManager && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateMaterialStatus(req.id, 'Accepted', currentUser.name, { availability: 'Available at Moment' })}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                          >
                            Accept & Available (Issue Stock)
                          </button>
                          <button
                            onClick={() => updateMaterialStatus(req.id, 'Pending for Order', currentUser.name, { availability: 'Out of Stock' })}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                          >
                            Not Available (Add to To-Do List)
                          </button>
                        </>
                      )}

                      {req.status === 'Pending for Order' && (
                        <button
                          onClick={() => updateMaterialStatus(req.id, 'Ordered', currentUser.name, { availability: 'Out of Stock - Order Placed' })}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                        >
                          Place Vendor Order Now
                        </button>
                      )}

                      {req.status === 'Accepted' && (
                        <button
                          onClick={() => {
                            updateMaterialStatus(req.id, 'Handed Over', currentUser.name);
                            confetti({ particleCount: 30 });
                          }}
                          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                        >
                          Mark Handed Over
                        </button>
                      )}

                      {req.status === 'Ordered' && (
                        <button
                          onClick={() => updateMaterialStatus(req.id, 'Handed Over', currentUser.name, { availability: 'Received & Handed Over' })}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                        >
                          Order Received & Hand Over
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit Material Request Modal */}
      <Modal
        isOpen={isReqModalOpen}
        onClose={() => setIsReqModalOpen(false)}
        title="Department Material Request Form"
        icon={Package}
      >
        <form onSubmit={handleRequestSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department Name *</label>
              <input
                type="text"
                disabled
                value={currentUser.dept}
                className="kyvera-input bg-slate-900 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">User ID *</label>
              <input
                type="text"
                disabled
                value={currentUser.empId}
                className="kyvera-input bg-slate-900 text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Type of Material *</label>
              <input
                type="text"
                required
                placeholder="e.g. Microcontroller Dev Boards (STM32)"
                value={requestData.materialName}
                onChange={(e) => setRequestData({ ...requestData, materialName: e.target.value })}
                className="kyvera-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">No. of Units / Length *</label>
              <input
                type="text"
                required
                placeholder="e.g. 5 units or 20 meters"
                value={requestData.quantity}
                onChange={(e) => setRequestData({ ...requestData, quantity: e.target.value })}
                className="kyvera-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">For Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. KYVERA Gateway Assembly"
              value={requestData.projectName}
              onChange={(e) => setRequestData({ ...requestData, projectName: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Type of Requirement *</label>
            <select
              value={requestData.priority}
              onChange={(e) => setRequestData({ ...requestData, priority: e.target.value })}
              className="kyvera-input"
            >
              <option value="Quick">Quick</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsReqModalOpen(false)}
              className="kyvera-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="kyvera-btn-primary text-xs"
            >
              Submit to Inventory
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Stock Item Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Add Inventory Stock Item"
        icon={Layers}
      >
        <form onSubmit={handleAddItemSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. DIN-Rail Relay 12V"
              value={newItemData.name}
              onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
              className="kyvera-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <input
                type="text"
                value={newItemData.category}
                onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Warehouse Location</label>
              <input
                type="text"
                value={newItemData.location}
                onChange={(e) => setNewItemData({ ...newItemData, location: e.target.value })}
                className="kyvera-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Qty *</label>
              <input
                type="number"
                required
                min="0"
                value={newItemData.qty}
                onChange={(e) => setNewItemData({ ...newItemData, qty: e.target.value })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Unit</label>
              <input
                type="text"
                value={newItemData.unit}
                onChange={(e) => setNewItemData({ ...newItemData, unit: e.target.value })}
                className="kyvera-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Threshold</label>
              <input
                type="number"
                min="1"
                value={newItemData.minQty}
                onChange={(e) => setNewItemData({ ...newItemData, minQty: e.target.value })}
                className="kyvera-input"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddItemModalOpen(false)}
              className="kyvera-btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="kyvera-btn-primary text-xs"
            >
              Save Stock Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
