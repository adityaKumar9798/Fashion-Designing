
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dbService } from '../firebase';
import { Product } from '../types';

const AllDresses: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    dbService.getProducts().then(data => {
      setProducts(data);
      setFilteredProducts(data);
      // Initially show first 8 products
      setDisplayedProducts(data.slice(0, PRODUCTS_PER_PAGE));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => b.createdAt - a.createdAt);

    setFilteredProducts(result);
    // Reset displayed products when filters change
    setDisplayedProducts(result.slice(0, PRODUCTS_PER_PAGE));
    setPage(1);
    setHasMore(result.length > PRODUCTS_PER_PAGE);
  }, [category, sortBy, products]);

  const loadMoreProducts = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = nextPage * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + 6; // Load 6 more dresses
      const nextProducts = filteredProducts.slice(startIndex, endIndex);
      
      if (nextProducts.length > 0) {
        setDisplayedProducts(prev => [...prev, ...nextProducts]);
        setPage(nextPage);
        setHasMore(startIndex + nextProducts.length < filteredProducts.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 500);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loadingMore, page, filteredProducts]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-serif mb-4">Our Collection</h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs">{filteredProducts.length} Results</p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 py-4 border-y border-zinc-100">
          <div className="flex flex-wrap gap-4">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs uppercase tracking-widest px-4 py-2 border ${category === cat ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-transparent text-zinc-500 border-zinc-200'} transition-all`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs uppercase tracking-widest border-none focus:ring-0 bg-transparent py-2"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-zinc-200 mb-4 rounded-md" />
                <div className="h-4 bg-zinc-200 w-3/4 mb-2" />
                <div className="h-4 bg-zinc-200 w-1/4" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500">No dresses found in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {displayedProducts.map((product) => (
                <motion.div layout key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-zinc-900">{product.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Loading indicator and scroll sentinel */}
            <div className="flex justify-center py-8">
              {loadingMore ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900"></div>
                  <span className="text-zinc-500 text-sm">Loading more dresses...</span>
                </div>
              ) : hasMore ? (
                <div id="scroll-sentinel" className="h-1 w-full"></div>
              ) : (
                <p className="text-zinc-500 text-sm">No more dresses to show</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllDresses;
