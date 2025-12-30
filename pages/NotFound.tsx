
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-9xl font-serif text-zinc-100 mb-8 select-none">404</h1>
        <h2 className="text-4xl font-serif mb-4">Page Lost in Elegance</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mb-12">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-zinc-900 text-white px-12 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
