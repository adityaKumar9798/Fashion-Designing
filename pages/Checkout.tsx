
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, useAuth } from '../App';
import { dbService } from '../firebase';

type PaymentMethod = 'card' | 'upi';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [finalOrder, setFinalOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    upiId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProcessing(true);
    
    setTimeout(async () => {
      try {
        const order = await dbService.addOrder({
          userId: user.uid,
          userName: user.name,
          items: cart,
          total: cartTotal,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode
          }
        });
        setFinalOrder(order);
        setProcessing(false);
        setSuccess(true);
        clearCart();
      } catch (err) {
        console.error(err);
        setProcessing(false);
      }
    }, 2500);
  };

  if (cart.length === 0 && !success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif mb-6">Your bag is empty</h1>
        <Link to="/dresses" className="text-zinc-900 border-b border-zinc-900 pb-1 text-xs font-bold uppercase tracking-widest">Return to Shop</Link>
      </div>
    );
  }

  if (success && finalOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-serif mb-4">Order Confirmed</h1>
          <p className="text-zinc-500 mb-8 font-light text-sm tracking-wide leading-relaxed">
            Thank you for choosing YASHVI Studio. Your order <span className="font-bold text-zinc-900">#{finalOrder.id}</span> has been placed successfully and is being prepared for shipment.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/orders" className="inline-block bg-zinc-900 text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-lg">
              Track Order
            </Link>
            <Link to="/" className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold hover:text-zinc-900 transition-colors">
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow">
            <h1 className="text-5xl font-serif mb-12">Checkout</h1>
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="space-y-12">
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 border-b border-zinc-200 pb-2">Contact Information</h3>
                  <div className="space-y-6">
                    <input 
                      required 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full bg-white border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 border-b border-zinc-200 pb-2">Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input required placeholder="First Name" className="bg-white border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                    <input required placeholder="Last Name" className="bg-white border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                  <input required placeholder="Street Address" className="w-full bg-white border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all mb-4" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="City" className="bg-white border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    <input required placeholder="Zip Code" className="bg-white border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" value={formData.zipCode} onChange={(e) => setFormData({...formData, zipCode: e.target.value})} />
                  </div>
                </section>
              </div>

              <section className="bg-white p-8 border border-zinc-200 rounded-lg shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 border-b border-zinc-100 pb-4 text-center">Payment Gateway</h3>
                <div className="flex gap-4 mb-10 bg-zinc-50 p-1 rounded-lg">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-md flex items-center justify-center gap-2 ${paymentMethod === 'card' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    Credit / Debit Card
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('upi')} className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all rounded-md flex items-center justify-center gap-2 ${paymentMethod === 'upi' ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-600'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                    UPI / QR Scanner
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === 'card' ? (
                    <motion.div key="card-payment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                      <div className="relative">
                        <input required={paymentMethod === 'card'} placeholder="Card Number" className="w-full border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" maxLength={16} value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-30 grayscale">
                          <img src="https://cdn-icons-png.flaticon.com/128/349/349221.png" alt="Visa" className="w-6" />
                          <img src="https://cdn-icons-png.flaticon.com/128/349/349228.png" alt="Mastercard" className="w-6" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input required={paymentMethod === 'card'} placeholder="MM / YY" className="border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                        <input required={paymentMethod === 'card'} placeholder="CVC" className="border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" maxLength={3} value={formData.cvc} onChange={(e) => setFormData({...formData, cvc: e.target.value})} />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="upi-payment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center space-y-8 py-4">
                      <div className="relative group p-6 bg-zinc-50 border border-zinc-100 rounded-xl shadow-inner">
                        <div className="w-48 h-48 bg-white border border-zinc-200 flex items-center justify-center relative overflow-hidden">
                          <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-0.5 bg-zinc-900/10 z-10" />
                          <div className="w-40 h-40 opacity-80 flex flex-col gap-1 p-2">
                            {Array.from({length: 12}).map((_, i) => (
                              <div key={i} className="flex gap-1 flex-1">
                                {Array.from({length: 12}).map((_, j) => (
                                  <div key={j} className={`flex-1 rounded-sm ${Math.random() > 0.4 ? 'bg-zinc-900' : 'bg-transparent'}`} />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-4 text-center">Scan with any UPI app</p>
                      </div>
                      <div className="w-full">
                        <input required={paymentMethod === 'upi'} type="text" placeholder="yourname@bank" className="w-full border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all text-center uppercase tracking-widest" value={formData.upiId} onChange={(e) => setFormData({...formData, upiId: e.target.value})} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <button type="submit" disabled={processing} className="w-full bg-zinc-900 text-white py-6 text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all disabled:opacity-50 shadow-xl active:scale-[0.98]">
                {processing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  `Authorize Payment: ₹${cartTotal.toLocaleString('en-IN')}`
                )}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-96">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-8 border border-zinc-200 rounded-lg shadow-sm">
                <h2 className="text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">Manifest Summary</h2>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar mb-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                      <div className="w-12 h-16 bg-zinc-50 overflow-hidden">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-xs font-medium text-zinc-900 line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Size: {item.selectedSize} × {item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium text-zinc-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-6 border-t border-zinc-100 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span className="uppercase tracking-widest text-[9px]">Subtotal</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span className="uppercase tracking-widest text-[9px]">Shipping</span>
                    <span className="text-emerald-600 uppercase tracking-widest text-[9px] font-bold">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-2xl font-serif pt-4 border-t border-zinc-100 text-zinc-900">
                    <span>Total</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {processing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-md flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-t-2 border-zinc-900 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-lg text-zinc-400">YS</span>
              </div>
            </div>
            <h2 className="text-3xl font-serif mb-3">Securing Your Order</h2>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.4em] max-w-xs leading-loose">
              Validating payment with your provider.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
