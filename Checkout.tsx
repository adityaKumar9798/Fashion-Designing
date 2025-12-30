
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, useAuth } from '../App';
import { dbService } from '../firebase';

const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [finalOrder, setFinalOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProcessing(true);
    
    // Simulate payment processing
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-serif mb-4">Order Confirmed</h1>
          <p className="text-zinc-500 mb-8 font-light text-sm tracking-wide leading-relaxed">
            Thank you for choosing YASHVI Studio. Your order <span className="font-bold text-zinc-900">#{finalOrder.id}</span> has been placed successfully and is being prepared for shipment.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/orders" className="inline-block bg-zinc-900 text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all">
              Track Order
            </Link>
            <Link to="/" className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
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
            <h1 className="text-4xl font-serif mb-12">Checkout</h1>
            
            <form onSubmit={handleSubmit} className="space-y-12">
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

              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 border-b border-zinc-200 pb-2">Payment Details</h3>
                <div className="bg-white p-6 border border-zinc-200 space-y-4">
                  <div className="relative">
                    <input 
                      required 
                      placeholder="Card Number" 
                      className="w-full border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all"
                      maxLength={16}
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                       <div className="w-8 h-5 bg-zinc-100 rounded"></div>
                       <div className="w-8 h-5 bg-zinc-100 rounded"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="MM / YY" className="border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" value={formData.expiry} onChange={(e) => setFormData({...formData, expiry: e.target.value})} />
                    <input required placeholder="CVC" className="border border-zinc-200 p-4 text-sm outline-none focus:border-zinc-900 transition-all" maxLength={3} value={formData.cvc} onChange={(e) => setFormData({...formData, cvc: e.target.value})} />
                  </div>
                </div>
              </section>

              <button 
                type="submit"
                disabled={processing}
                className="w-full bg-zinc-900 text-white py-6 text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
              >
                {processing ? 'Processing Securely...' : `Pay $${cartTotal}`}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-96">
            <div className="sticky top-24 space-y-8">
              <div className="bg-white p-8 border border-zinc-200">
                <h2 className="text-[10px] font-bold uppercase tracking-widest mb-6 border-b border-zinc-100 pb-4">Order Summary</h2>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto no-scrollbar mb-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                      <img src={item.imageUrl} alt="" className="w-12 h-16 object-cover bg-zinc-50" />
                      <div className="flex-grow">
                        <h4 className="text-xs font-medium text-zinc-900 line-clamp-1">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">Size: {item.selectedSize} × {item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium">${item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-6 border-t border-zinc-100 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Shipping</span>
                    <span className="text-green-600 uppercase tracking-widest text-[10px] font-bold">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-serif pt-4 border-t border-zinc-100">
                    <span>Total</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {processing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-24 h-24 mb-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-zinc-900 rounded-full"
              />
              <div className="absolute inset-2 border-t border-zinc-200 rounded-full opacity-50" />
            </div>
            <h2 className="text-2xl font-serif mb-2">Processing Payment</h2>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em]">Please do not refresh the page</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
