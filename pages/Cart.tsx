
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../App';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif mb-6">Your bag is empty</h1>
        <p className="text-zinc-500 mb-8 tracking-widest uppercase text-xs">Browse our collections to find your perfect match.</p>
        <Link to="/dresses" className="bg-zinc-900 text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif mb-12">Shopping Bag</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-grow space-y-8">
            {cart.map((item) => (
              <motion.div key={`${item.id}-${item.selectedSize}`} layout className="flex gap-6 pb-8 border-b border-zinc-100">
                <div className="w-24 h-32 flex-shrink-0 bg-zinc-100">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg">{item.name}</h3>
                      <p className="font-medium">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-4">Size: {item.selectedSize}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-zinc-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="px-3 py-1 text-zinc-400 hover:text-zinc-900"
                        >-</button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="px-3 py-1 text-zinc-400 hover:text-zinc-900"
                        >+</button>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-xs text-zinc-400 underline hover:text-red-500 w-fit"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-zinc-50 p-8">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-8 pb-4 border-b border-zinc-200">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className="uppercase tracking-widest text-[10px] text-green-600 font-bold">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-zinc-200 flex justify-between">
                  <span className="font-bold text-xs uppercase tracking-widest">Total</span>
                  <span className="font-bold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-zinc-900 text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all"
              >
                Proceed to Checkout
              </button>
              <p className="text-center text-[10px] text-zinc-400 mt-6 uppercase tracking-widest">
                Safe & Secure Payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
