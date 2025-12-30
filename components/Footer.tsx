
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-serif tracking-widest mb-6 uppercase">YASHVI STUDIO</h2>
            <p className="text-zinc-500 max-w-sm leading-relaxed text-sm font-light">
              Curating premium fashion for the modern woman. Our studio focuses on elegance, quality, and timeless design that speaks to your unique style.
            </p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-zinc-400">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-xs uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors">Home</Link></li>
              <li><Link to="/dresses" className="text-xs uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors">Collections</Link></li>
              <li><Link to="/about" className="text-xs uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="text-xs uppercase tracking-widest text-zinc-600 hover:text-zinc-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6 text-zinc-400">Connect</h3>
            <div className="flex space-x-4 mb-8">
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
              <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-zinc-400">Newsletter</h3>
            <div className="flex border-b border-zinc-200">
              <input type="email" placeholder="Your Email" className="bg-transparent py-2 text-xs outline-none w-full" />
              <button className="text-[10px] uppercase font-bold tracking-widest text-zinc-900">Join</button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-400 tracking-[0.2em] uppercase">
          <p>&copy; 2025 YASHVI Studio. All Rights Reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
