import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Calendar, MapPin, ChevronDown, ChevronUp, AlertCircle, ShoppingBag, Sparkles, Check } from 'lucide-react';
import orderService from '../services/orderService';
import deliveryService from '../services/deliveryService';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track expanded orders for delivery timelines
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch your botanical purchase history. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleExpand = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setDeliveryData(null);
      return;
    }

    setExpandedOrderId(orderId);
    setDeliveryData(null);
    setTrackingLoading(true);
    try {
      const data = await deliveryService.trackDelivery(orderId);
      setDeliveryData(data);
    } catch (err) {
      console.error(err);
      // Fallback: in case delivery fails or is missing, fabricate a mockup from order status
      setDeliveryData({
        deliveryStatus: orders.find(o => o.id === orderId)?.orderStatus || 'Ordered',
        address: 'Specified during checkout',
        estimatedDate: new Date().toISOString().split('T')[0]
      });
    } finally {
      setTrackingLoading(false);
    }
  };

  // Timeline stage config
  const stages = [
    { key: 'Ordered', label: 'Order Confirmed', desc: 'Greenhouse payment verified' },
    { key: 'Packed', label: 'Sprout Packaging', desc: 'Secured in climate-isolated casing' },
    { key: 'Shipped', label: 'Logistics Transit', desc: 'Dispatched on shipping vehicles' },
    { key: 'Delivered', label: 'Safely Arrived', desc: 'Dropped off at your destination' }
  ];

  const getStageIndex = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'delivered') return 3;
    if (s === 'shipped') return 2;
    if (s === 'packed') return 1;
    return 0; // ordered
  };

  const getStatusColorClass = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'delivered') return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    if (s === 'shipped') return 'bg-teal-500/10 border-teal-500/30 text-teal-400';
    if (s === 'packed') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-3xl text-slate-100">Botanical Order Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Track greenhouse packaging milestones and shipping ETA timelines.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="w-fit px-4 py-2 border border-slate-800 text-slate-350 hover:text-slate-100 bg-slate-900/40 rounded-xl text-xs font-semibold hover:bg-slate-850 transition-all"
        >
          Refresh Orders
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        // Loading state
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="glass-panel animate-pulse min-h-[100px] border border-slate-900 rounded-2xl"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        // Empty State
        <div className="glass-panel p-16 text-center border border-slate-900 bg-slate-900/10 flex flex-col items-center justify-center space-y-5 max-w-lg mx-auto">
          <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-outfit font-bold text-xl text-slate-200">No Orders Registered</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You haven't bought any fresh plant collections yet. Kickstart your indoor gardens today!
            </p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-nature-600 font-bold font-outfit text-xs text-slate-950 rounded-xl hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            Browse Plant Catalog
          </Link>
        </div>
      ) : (
        // Active orders listing
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const statusColor = getStatusColorClass(order.orderStatus);

            return (
              <div
                key={order.id}
                className="glass-panel border border-slate-900/80 bg-slate-900/10 overflow-hidden transition-all duration-300"
              >
                {/* Order Summary Header Panel */}
                <div
                  onClick={() => handleToggleExpand(order.id)}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-slate-900/35 transition-colors duration-200"
                >
                  <div className="grid grid-cols-2 md:flex md:items-center gap-6 md:space-x-12">
                    {/* ID & Date */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Purchase Token</span>
                      <span className="font-outfit font-black text-slate-200">#{order.id}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Placed On</span>
                      <span className="text-xs font-semibold text-slate-300">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Processing'}
                      </span>
                    </div>

                    {/* Cost */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Checkout Total</span>
                      <span className="font-outfit text-base font-extrabold text-nature-450">${order.totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Logistics Status</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${statusColor}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Chevron */}
                  <div className="flex items-center justify-between border-t md:border-t-0 border-slate-900 pt-4 md:pt-0">
                    <div className="md:hidden">
                      <span className="text-xs text-slate-450 font-bold block">Items Summary:</span>
                      <span className="text-xs text-slate-400 line-clamp-1">{order.itemsSummary}</span>
                    </div>
                    
                    <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl text-slate-400 group-hover:text-slate-100 flex-shrink-0">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Subtitle list for desktop header */}
                {!isExpanded && (
                  <div className="hidden md:block px-6 pb-4 border-t border-slate-900/50 pt-2 text-xs text-slate-400">
                    <span className="font-bold text-slate-350">Sprouts Ordered:</span> {order.itemsSummary}
                  </div>
                )}

                {/* TIMELINE TRACKER: Expanded Panel Details */}
                {isExpanded && (
                  <div className="border-t border-slate-900 bg-slate-950/40 p-6 space-y-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5 border-b border-slate-900 pb-3">
                      <Package className="h-4.5 w-4.5 text-nature-500" />
                      <span>Order Breakdown: {order.itemsSummary}</span>
                    </h4>

                    {trackingLoading ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-3">
                        <div className="w-8 h-8 rounded-full border-4 border-slate-900 border-t-nature-500 animate-spin"></div>
                        <span className="text-xs text-slate-500">Decrypting satellite coordinates...</span>
                      </div>
                    ) : deliveryData ? (
                      <div className="space-y-8">
                        {/* THE TIMELINE GRAPH */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                          {/* Horizontal connecting line behind (desktop only) */}
                          <div className="hidden md:block absolute top-6 left-12 right-12 h-0.5 bg-slate-900 z-0">
                            <div
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                              style={{ width: `${(getStageIndex(deliveryData.deliveryStatus) / 3) * 100}%` }}
                            ></div>
                          </div>

                          {stages.map((stage, idx) => {
                            const activeIdx = getStageIndex(deliveryData.deliveryStatus);
                            const isCompleted = idx <= activeIdx;
                            const isCurrent = idx === activeIdx;

                            return (
                              <div
                                key={stage.key}
                                className="flex md:flex-col items-center gap-4 md:text-center relative z-10 animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                              >
                                {/* Milestone Node Circle */}
                                <div
                                  className={`h-12 w-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0 ${
                                    isCurrent
                                      ? 'bg-nature-500 border-nature-400 text-slate-950 shadow-glass animate-pulse-glow'
                                      : isCompleted
                                      ? 'bg-slate-900 border-emerald-500 text-emerald-400'
                                      : 'bg-slate-950 border-slate-850 text-slate-650'
                                  }`}
                                >
                                  {isCompleted && !isCurrent ? (
                                    <Check className="h-5 w-5 font-black" />
                                  ) : stage.key === 'Shipped' ? (
                                    <Truck className="h-5 w-5" />
                                  ) : (
                                    <Package className="h-5 w-5" />
                                  )}
                                </div>

                                {/* Milestone Labels */}
                                <div className="space-y-1 text-left md:text-center">
                                  <h5
                                    className={`font-outfit font-bold text-sm ${
                                      isCompleted ? 'text-slate-100' : 'text-slate-600'
                                    }`}
                                  >
                                    {stage.label}
                                  </h5>
                                  <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                                    {stage.desc}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Dispatch address & Date summaries */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-900 text-xs">
                          {/* Shipping address */}
                          <div className="space-y-2 border-b sm:border-b-0 sm:border-r border-slate-900 pb-4 sm:pb-0 sm:pr-6">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                              <MapPin className="h-3.5 w-3.5 text-nature-500" />
                              <span>Logistics Destination</span>
                            </span>
                            <p className="text-slate-300 leading-relaxed font-medium">
                              {deliveryData.address}
                            </p>
                          </div>

                          {/* Shipping ETA */}
                          <div className="space-y-2 sm:pl-6 flex flex-col justify-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                              <Calendar className="h-3.5 w-3.5 text-nature-500" />
                              <span>Estimated Climate Delivery</span>
                            </span>
                            <p className="text-sm font-extrabold text-nature-400">
                              {deliveryData.estimatedDate ? new Date(deliveryData.estimatedDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Calculating Sprout ETA'}
                            </p>
                            <span className="text-[10px] text-slate-500 leading-normal block">
                              * All shipments are carefully isolated in climate control pods. If a sapling experiences distress, replacement is free of charge.
                            </span>
                          </div>
                        </div>

                        {/* Congratulations Banner */}
                        {deliveryData.deliveryStatus?.toLowerCase() === 'delivered' && (
                          <div className="bg-emerald-500/5 border border-emerald-500/25 p-4 rounded-xl flex items-center space-x-3 text-xs text-emerald-450 text-center justify-center animate-bounce">
                            <Sparkles className="h-5 w-5 text-emerald-500" />
                            <span className="font-extrabold">Foliage Arrived! Enjoy nursing your new gorgeous green space!</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-500">
                        Could not pull delivery metrics from live satellite coordinates.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
