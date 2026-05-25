import React, { useState, useEffect } from 'react';
import { Settings, Plus, Truck, Package, Trash2, Calendar, AlertCircle, Sparkles, Sliders, DollarSign, Layers } from 'lucide-react';
import plantService from '../services/plantService';
import deliveryService from '../services/deliveryService';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('catalog'); // catalog or shipments
  
  // Catalog states
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newPlant, setNewPlant] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    benefits: '',
    categoryId: ''
  });
  
  // Shipments states
  const [deliveries, setDeliveries] = useState([]);

  // Common UI states
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, [activeTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (activeTab === 'catalog') {
        const [plantsData, categoriesData] = await Promise.all([
          plantService.getAllPlants(),
          plantService.getCategories()
        ]);
        setPlants(plantsData);
        setCategories(categoriesData);
        if (categoriesData.length > 0 && !newPlant.categoryId) {
          setNewPlant(prev => ({ ...prev, categoryId: categoriesData[0].id }));
        }
      } else {
        const deliveriesData = await deliveryService.getAllDeliveries();
        setDeliveries(deliveriesData);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch administrative data logs.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlantFormChange = (e) => {
    const { name, value } = e.target;
    setNewPlant(prev => ({
      ...prev,
      [name]: name === 'categoryId' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleCreatePlantSubmit = async (e) => {
    e.preventDefault();
    if (!newPlant.name || !newPlant.price || !newPlant.stock || !newPlant.categoryId) {
      setError('Please fill in all mandatory plant metrics.');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const plantDto = {
        name: newPlant.name,
        description: newPlant.description,
        price: Number(newPlant.price),
        stock: Number(newPlant.stock),
        imageUrl: newPlant.imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=400',
        benefits: newPlant.benefits,
        categoryId: Number(newPlant.categoryId)
      };

      await plantService.createPlant(plantDto);
      setSuccess(`Plant specimen "${newPlant.name}" listed successfully in the greenhouse!`);
      
      // Reset form
      setNewPlant({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        benefits: '',
        categoryId: categories[0]?.id || ''
      });

      // Reload catalog list
      const plantsData = await plantService.getAllPlants();
      setPlants(plantsData);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to list the plant specimen in catalog.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePlant = async (plantId) => {
    if (!window.confirm('Are you absolutely sure you want to delete this plant listing?')) return;
    
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      await plantService.deletePlant(plantId);
      setSuccess('Plant listing deleted successfully.');
      setPlants(prev => prev.filter(p => p.id !== plantId));
    } catch (err) {
      console.error(err);
      setError('Could not delete plant listing. It may be linked to active customer orders.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdvanceShipment = async (delivery) => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    
    let nextStatus = '';
    const current = delivery.deliveryStatus?.toLowerCase() || '';

    if (current === 'ordered') nextStatus = 'Packed';
    else if (current === 'packed') nextStatus = 'Shipped';
    else if (current === 'shipped') nextStatus = 'Delivered';
    else return; // already delivered

    try {
      // Estimated delivery date shift: standard 5 days on Ordered, can retain or update
      const updated = await deliveryService.updateDelivery(
        delivery.id,
        nextStatus,
        delivery.estimatedDate
      );
      
      setSuccess(`Shipment #${delivery.id} advanced to "${nextStatus}" status successfully.`);
      
      // Update local state
      setDeliveries(prev =>
        prev.map(d => (d.id === delivery.id ? { ...d, deliveryStatus: nextStatus } : d))
      );
    } catch (err) {
      console.error(err);
      setError('Logistics dispatch shift failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColorClass = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'delivered') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (s === 'shipped') return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
    if (s === 'packed') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-slate-100 flex items-center gap-2.5">
            <Settings className="h-7 w-7 text-nature-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Greenhouse Backoffice Admin Console</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage global product listings and coordinate climate shipping dispatches.</p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center space-x-1.5 ${
              activeTab === 'catalog'
                ? 'bg-nature-500 text-slate-950 shadow-glass'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Catalog Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('shipments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center space-x-1.5 ${
              activeTab === 'shipments'
                ? 'bg-nature-500 text-slate-950 shadow-glass'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Shipments logistics</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/5 border border-emerald-500/25 p-4 rounded-xl flex items-center space-x-3 text-xs text-emerald-450">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Content Areas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-slate-900 border-t-nature-500 animate-spin"></div>
          <span className="text-xs text-slate-500">Decrypting satellite coordinates...</span>
        </div>
      ) : activeTab === 'catalog' ? (
        /* ==================== TAB 1: CATALOG MANAGER ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Add Plant Form */}
          <div className="lg:col-span-5 glass-panel p-6 border border-slate-900 bg-slate-900/10 space-y-5">
            <h2 className="font-outfit font-bold text-lg text-slate-200 flex items-center space-x-2 border-b border-slate-900 pb-3">
              <Plus className="h-5 w-5 text-nature-500" />
              <span>Register Plant Listing</span>
            </h2>

            <form onSubmit={handleCreatePlantSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block pl-1">Plant Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newPlant.name}
                  onChange={handlePlantFormChange}
                  className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                  placeholder="e.g. Aloe Vera"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block pl-1">Price ($) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-550" />
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={newPlant.price}
                      onChange={handlePlantFormChange}
                      className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl pl-8 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                      placeholder="e.g. 12.99"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block pl-1">Stock Level *</label>
                  <input
                    type="number"
                    name="stock"
                    value={newPlant.stock}
                    onChange={handlePlantFormChange}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                    placeholder="e.g. 50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block pl-1">Category Family *</label>
                  <div className="relative">
                    <Layers className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-550" />
                    <select
                      name="categoryId"
                      value={newPlant.categoryId}
                      onChange={handlePlantFormChange}
                      className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl pl-8 pr-4 py-2.5 text-xs text-slate-100 outline-none transition-all duration-300 appearance-none"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id} className="bg-slate-950 text-slate-200">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block pl-1">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={newPlant.imageUrl}
                    onChange={handlePlantFormChange}
                    className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                    placeholder="Unsplash direct link..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block pl-1">Greenhouse Description</label>
                <textarea
                  rows="2"
                  name="description"
                  value={newPlant.description}
                  onChange={handlePlantFormChange}
                  className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all duration-300 resize-none"
                  placeholder="Enter detailed botanical features..."
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block pl-1">Health Benefits (Semicolon ';' separated)</label>
                <textarea
                  rows="2"
                  name="benefits"
                  value={newPlant.benefits}
                  onChange={handlePlantFormChange}
                  className="w-full bg-slate-950/80 border border-slate-850 focus:border-nature-500/50 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-650 outline-none transition-all duration-300 resize-none"
                  placeholder="Benefit 1; Benefit 2; Benefit 3..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={actionLoading}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-nature-600 hover:brightness-110 active:scale-98 disabled:brightness-50 text-slate-950 font-bold font-outfit text-xs rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-glass"
              >
                {actionLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus className="h-4.5 w-4.5" />
                    <span>List Plant Specimen</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Active catalog list */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sliders className="h-4 w-4 text-nature-500" />
              <span>Active Greenhouse Stocks ({plants.length})</span>
            </h3>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {plants.map(plant => (
                <div
                  key={plant.id}
                  className="glass-panel p-4 border border-slate-900/80 bg-slate-900/10 flex items-center justify-between gap-4 hover:border-slate-800 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {/* preview */}
                    <div className="h-12 w-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-900 flex-shrink-0">
                      <img src={plant.imageUrl} alt={plant.name} className="h-full w-full object-cover" />
                    </div>
                    {/* title */}
                    <div className="space-y-0.5">
                      <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        {plant.category?.name}
                      </span>
                      <h4 className="font-outfit font-bold text-sm text-slate-200 leading-tight">
                        {plant.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        ${plant.price.toFixed(2)} • <span className="font-semibold text-nature-400">{plant.stock} units in stock</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePlant(plant.id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all duration-300 flex-shrink-0"
                    title="Delete listing"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== TAB 2: SHIPMENTS LOGISTICS ==================== */
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <Truck className="h-4 w-4 text-nature-500" />
            <span>Customer Shipments in Transit ({deliveries.length})</span>
          </h3>

          <div className="space-y-4">
            {deliveries.length === 0 ? (
              <div className="glass-panel p-12 text-center border border-slate-900 bg-slate-900/10 text-slate-500">
                No active delivery dispatches are registered in the logistics ledger.
              </div>
            ) : (
              deliveries.map(delivery => {
                const statusColor = getStatusColorClass(delivery.deliveryStatus);
                const currentStatus = delivery.deliveryStatus?.toLowerCase() || '';
                const isDelivered = currentStatus === 'delivered';

                return (
                  <div
                    key={delivery.id}
                    className="glass-panel p-6 border border-slate-900/80 bg-slate-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-800 transition-colors"
                  >
                    {/* Left: Info */}
                    <div className="space-y-3 flex-grow max-w-2xl">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-outfit font-black text-sm text-slate-200">
                          Shipment ID: #{delivery.id}
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-medium">
                          Linked Order: <span className="font-bold text-slate-200">#{delivery.order?.id}</span>
                        </span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${statusColor}`}>
                          {delivery.deliveryStatus}
                        </span>
                      </div>

                      {/* address and estimation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-550 uppercase font-bold tracking-wider flex items-center space-x-1">
                            <Truck className="h-3 w-3 text-nature-500" />
                            <span>Destination Address</span>
                          </span>
                          <p className="text-slate-350 leading-relaxed font-semibold">
                            {delivery.address}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-550 uppercase font-bold tracking-wider flex items-center space-x-1">
                            <Calendar className="h-3 w-3 text-nature-500" />
                            <span>Estimated Sprout ETA</span>
                          </span>
                          <p className="text-slate-350 font-bold">
                            {delivery.estimatedDate ? new Date(delivery.estimatedDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Pending calculation'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right: Logistics Shift actions */}
                    <div className="flex-shrink-0 flex items-center border-t md:border-t-0 border-slate-900 pt-4 md:pt-0">
                      {isDelivered ? (
                        <div className="px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-450 font-bold text-xs flex items-center space-x-1">
                          <span>Delivered & Closed</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdvanceShipment(delivery)}
                          disabled={actionLoading}
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-nature-600 hover:brightness-110 active:scale-95 disabled:brightness-50 text-slate-950 font-extrabold font-outfit text-xs flex items-center space-x-2 transition-all shadow-glass"
                        >
                          <Truck className="h-4 w-4" />
                          <span>
                            {currentStatus === 'ordered'
                              ? 'Advance to Packed'
                              : currentStatus === 'packed'
                              ? 'Advance to Shipped'
                              : 'Advance to Delivered'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
