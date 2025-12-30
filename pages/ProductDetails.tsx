
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { dbService } from '../firebase';
import { Product } from '../types';
import { useCart } from '../App';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      dbService.getProducts().then(products => {
        const found = products.find(p => p.id === id);
        setProduct(found || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading product...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center flex-col gap-4">
    <p>Product not found.</p>
    <Link to="/dresses" className="text-zinc-900 border-b border-zinc-900">Return to shop</Link>
  </div>;

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[3/4] overflow-hidden bg-zinc-100">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 mb-4">{product.category}</p>
            <h1 className="text-5xl font-serif mb-6">{product.name}</h1>
            <p className="text-2xl font-light mb-8">₹{product.price.toLocaleString('en-IN')}</p>
            
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-widest mb-4">Select Size</p>
              <div className="flex gap-4">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border flex items-center justify-center text-sm transition-all ${selectedSize === size ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-transparent text-zinc-600 border-zinc-200 hover:border-zinc-900'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all ${added ? 'bg-green-600 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
            >
              {added ? 'Added to Bag' : 'Add to Shopping Bag'}
            </button>

            <div className="mt-12 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-zinc-100 pb-2">Description</h3>
                <p className="text-zinc-600 leading-relaxed text-sm">{product.description}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-zinc-100 pb-2">Material & Care</h3>
                <p className="text-zinc-500 text-xs">Premium blend fabric. Dry clean only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
