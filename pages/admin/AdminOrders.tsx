
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../../firebase';
import { Order, OrderStatus } from '../../types';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    const data = await dbService.getOrders();
    setOrders(data.sort((a, b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  useEffect(() => { loadOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await dbService.updateOrderStatus(orderId, status);
    await loadOrders();
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
          <h1 className="text-4xl font-serif">Order Management</h1>
        </header>

        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Transaction</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Customer</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Value</th>
                <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-zinc-50/50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                  <td className="p-6">#{order.id.slice(-6)}</td>
                  <td className="p-6 font-medium">{order.userName}</td>
                  <td className="p-6 font-bold">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-zinc-100 text-[9px] font-bold uppercase tracking-widest rounded-full">{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white z-[70] shadow-2xl rounded-2xl overflow-hidden p-8">
              <h2 className="text-3xl font-serif mb-6">Order Details</h2>
              <div className="space-y-4 mb-8">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span>{item.name} (x{item.quantity})</span>
                    <span className="font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="pt-4 border-t flex justify-between text-lg font-serif">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-full bg-zinc-900 text-white py-3 text-xs font-bold uppercase tracking-widest">Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
