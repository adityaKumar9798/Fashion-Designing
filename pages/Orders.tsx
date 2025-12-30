
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dbService } from '../firebase';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../App';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      dbService.getOrders().then(allOrders => {
        const userOrders = allOrders.filter(o => o.userId === user.uid);
        setOrders(userOrders.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
      });
    }
  }, [user]);

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DELIVERED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case OrderStatus.CANCELLED: return 'bg-rose-50 text-rose-700 border-rose-100';
      case OrderStatus.SHIPPED: return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  const downloadInvoice = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 12px;">
          <div style="font-weight: 600; color: #18181b;">${item.name}</div>
          <div style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Size: ${item.selectedSize}</div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 12px; text-align: center; color: #18181b;">${item.quantity}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 12px; text-align: right; color: #18181b;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f4f4f5; font-size: 12px; text-align: right; font-weight: 600; color: #18181b;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Montserrat:wght@300;400;600&display=swap');
          body { font-family: 'Montserrat', sans-serif; color: #18181b; margin: 0; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; border-bottom: 2px solid #18181b; padding-bottom: 20px; }
          .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; letter-spacing: 0.2em; text-transform: uppercase; }
          .invoice-label { text-transform: uppercase; letter-spacing: 0.4em; font-size: 10px; color: #a1a1aa; font-weight: 600; }
          .details-grid { display: grid; grid-cols: 2; display: flex; justify-content: space-between; margin-bottom: 60px; }
          .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #71717a; margin-bottom: 12px; font-weight: 600; }
          .address-box { font-size: 12px; line-height: 1.6; color: #27272a; max-width: 250px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #a1a1aa; padding-bottom: 12px; border-bottom: 1px solid #e4e4e7; }
          .summary { margin-left: auto; width: 300px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 12px; }
          .total-row { display: flex; justify-content: space-between; padding: 16px 0; border-top: 1px solid #18181b; margin-top: 8px; font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; }
          .footer { margin-top: 80px; text-align: center; border-top: 1px solid #f4f4f5; padding-top: 40px; }
          .footer-text { font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.2em; line-height: 2; }
          .auth-seal { margin-top: 20px; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 14px; opacity: 0.5; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">Yashvi <span style="font-weight: 300;">Studio</span></div>
            <div style="font-size: 10px; color: #71717a; margin-top: 8px; letter-spacing: 0.1em;">Luxury Atelier & Concept Store</div>
          </div>
          <div style="text-align: right;">
            <div class="invoice-label">Official Tax Invoice</div>
            <div style="font-size: 14px; font-weight: 600; margin-top: 8px;">Order #${order.id}</div>
            <div style="font-size: 11px; color: #71717a; margin-top: 4px;">Issued on ${dateStr}</div>
          </div>
        </div>

        <div class="details-grid">
          <div>
            <div class="section-title">Shipping To</div>
            <div class="address-box">
              <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.zipCode}<br>
              India
            </div>
          </div>
          <div style="text-align: right;">
            <div class="section-title">Sold By</div>
            <div class="address-box">
              <strong>YASHVI Studio HQ</strong><br>
              A-110, DLF Cyber City<br>
              Gurugram, Haryana 122002<br>
              GSTIN: 07AABCM8201C1Z4
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Unit Price</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span style="color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px;">Subtotal</span>
            <span>₹${order.total.toLocaleString('en-IN')}</span>
          </div>
          <div class="summary-row">
            <span style="color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px;">Shipping</span>
            <span style="color: #059669; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 9px;">Complimentary</span>
          </div>
          <div class="summary-row">
            <span style="color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; font-size: 10px;">Tax (GST 12%)</span>
            <span>Included</span>
          </div>
          <div class="total-row">
            <span>Total Amount</span>
            <span>₹${order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div class="footer">
          <div class="footer-text">
            Thank you for choosing YASHVI Studio.<br>
            Each piece is crafted with care to elevate your unique style.<br>
            For support: hello@yashvistudio.com | +91 123 456 7890
          </div>
          <div class="auth-seal">Authenticity Guaranteed & Hand-Packed with Precision</div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            // window.close(); // Uncomment to auto-close after print
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-t-2 border-zinc-900 rounded-full animate-spin mb-4" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400">Retrieving Archive</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-20">
          <h1 className="text-5xl md:text-6xl font-serif mb-4 tracking-tight">Order History</h1>
          <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em]">Your Curated Collection</p>
        </motion.header>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 border border-zinc-100 bg-zinc-50/50">
            <p className="text-zinc-500 mb-8 uppercase tracking-[0.2em] text-xs font-light">Your order archive is empty.</p>
            <Link to="/dresses" className="inline-block bg-zinc-900 text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all">Explore Collection</Link>
          </motion.div>
        ) : (
          <div className="space-y-16">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-zinc-100 pb-8">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-serif">Order #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusStyles(order.status)}`}>{order.status}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-3">
                      <div className="text-left md:text-right">
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Total Value</p>
                        <p className="text-2xl font-serif text-zinc-900">₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                      <button 
                        onClick={() => downloadInvoice(order)}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest bg-zinc-50 border border-zinc-200 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-all rounded-sm"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                        Download Invoice
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-12 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 items-center bg-zinc-50/50 p-4 border border-zinc-100/50 hover:border-zinc-200 transition-colors">
                            <div className="w-16 h-20 bg-zinc-100 flex-shrink-0 overflow-hidden">
                              <img src={item.imageUrl} alt="" className="w-full h-full object-cover grayscale" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-medium text-zinc-900 truncate">{item.name}</p>
                              <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                              <p className="text-[11px] font-bold text-zinc-900 mt-2">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
