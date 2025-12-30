
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../../firebase';
import { Product, ContactMessage, Order } from '../../types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ products: 0, users: 0, messages: 0, orders: 0, revenue: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const p = await dbService.getProducts();
      const u = await dbService.getUsers();
      const m = await dbService.getMessages();
      const o = await dbService.getOrders();
      
      const totalRevenue = o.reduce((acc, order) => acc + order.total, 0);

      setStats({ 
        products: p.length, 
        users: u.length, 
        messages: m.length,
        orders: o.length,
        revenue: totalRevenue
      });

      setRecentProducts([...p].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4));
      setRecentMessages([...m].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4));
      setRecentOrders([...o].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4));
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif">Management Console</h1>
            <p className="text-zinc-400 text-xs uppercase tracking-widest mt-2">Executive Overview</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/admin/orders" className="bg-zinc-900 text-white px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all">Order Fulfillment</Link>
            <Link to="/admin/products" className="bg-white border border-zinc-200 px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:border-zinc-900 transition-all">Catalog Manager</Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Total Revenue</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-serif">₹{stats.revenue.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-green-500 uppercase tracking-widest">Gross</span>
            </div>
          </div>
          <div className="bg-white p-6 border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Orders</h3>
            <p className="text-3xl font-serif">{stats.orders}</p>
          </div>
          <div className="bg-white p-6 border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Inventory</h3>
            <p className="text-3xl font-serif">{stats.products}</p>
          </div>
          <div className="bg-white p-6 border border-zinc-100 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Inquiries</h3>
            <p className="text-3xl font-serif">{stats.messages}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <section>
            <h2 className="text-xl font-serif mb-6">Recent Sales</h2>
            <div className="bg-white border border-zinc-100 shadow-sm overflow-hidden">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center gap-4 p-4 border-b border-zinc-50 last:border-none hover:bg-zinc-50 transition-colors">
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium text-zinc-900">{order.userName}</h4>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">#{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-zinc-900">₹{order.total.toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-zinc-300 uppercase tracking-widest">{order.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-zinc-400 text-xs uppercase tracking-widest">No sales yet</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
