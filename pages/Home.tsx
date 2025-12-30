
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dbService } from '../firebase';
import { Product } from '../types';

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
    title: "Elegance That Defines You",
    subtitle: "Premium Fashion Curated by Yashvi"
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop",
    title: "The Midnight Collection",
    subtitle: "Sophistication in Every Stitch"
  },
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop",
    title: "Minimalist Essentials",
    subtitle: "Timeless Silhouettes for Modern Living"
  },
  {
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1920&auto=format&fit=crop",
    title: "Artistry in Motion",
    subtitle: "New Arrivals for the Season"
  }
];

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [displayedFeatured, setDisplayedFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [firstSlideLoaded, setFirstSlideLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  useEffect(() => {
    const img = new Image();
    img.src = HERO_SLIDES[0].image;
    img.onload = () => {
      setFirstSlideLoaded(true);
    };
    
    const timer = setTimeout(() => {
      HERO_SLIDES.slice(1).forEach(slide => {
        const bgImg = new Image();
        bgImg.src = slide.image;
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    dbService.getProducts().then(products => {
      // Priority filter for featured items
      const feat = products.filter(p => p.featured);
      setFeatured(feat);
      // Initially show first 3 products
      setDisplayedFeatured(feat.slice(0, PRODUCTS_PER_PAGE));
      setHasMore(feat.length > PRODUCTS_PER_PAGE);
      setLoading(false);
    });
  }, []);

  const loadMoreProducts = () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = nextPage * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + 6; // Load 6 more dresses
      const nextProducts = featured.slice(startIndex, endIndex);
      
      if (nextProducts.length > 0) {
        setDisplayedFeatured(prev => [...prev, ...nextProducts]);
        setPage(nextPage);
        setHasMore(startIndex + nextProducts.length < featured.length);
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

    const sentinel = document.getElementById('home-scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, loadingMore, page, featured]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.98
    })
  };

  return (
    <div className="overflow-hidden">
      <section className="relative h-[95vh] w-full flex items-center justify-center overflow-hidden bg-zinc-900">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.6 },
              scale: { duration: 8, ease: "linear" } 
            }}
            className="absolute inset-0 bg-zinc-800"
          >
            {/* Fix: changed fetchpriority to fetchPriority for React compatibility */}
            <img 
              src={HERO_SLIDES[currentSlide].image} 
              alt="" 
              className={`w-full h-full object-cover transition-opacity duration-1000 ${firstSlideLoaded ? 'opacity-100' : 'opacity-0'}`}
              fetchPriority={currentSlide === 0 ? "high" : "auto"}
              loading={currentSlide === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-6xl md:text-9xl text-white font-serif mb-6 tracking-tight drop-shadow-lg">
                {HERO_SLIDES[currentSlide].title}
              </h1>
              <p className="text-lg md:text-2xl text-white/90 font-light mb-12 tracking-[0.3em] uppercase drop-shadow-md">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link to="/dresses" className="bg-white text-zinc-900 px-10 py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-zinc-100 transition-all shadow-xl">
              Shop Collection
            </Link>
            <Link to="/about" className="bg-transparent border border-white text-white px-10 py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-zinc-900 transition-all backdrop-blur-sm">
              Our Vision
            </Link>
          </motion.div>
        </div>

        <button onClick={prevSlide} className="absolute left-4 md:left-8 z-20 p-4 text-white/40 hover:text-white transition-all group">
          <svg className="w-8 h-8 md:w-10 md:h-10 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button onClick={nextSlide} className="absolute right-4 md:right-8 z-20 p-4 text-white/40 hover:text-white transition-all group">
          <svg className="w-8 h-8 md:w-10 md:h-10 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className="group py-4 px-1"
            >
              <div className={`h-[2px] transition-all duration-500 ${
                currentSlide === idx ? 'w-12 bg-white' : 'w-6 bg-white/30 group-hover:bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">Featured Pieces</h2>
            <div className="w-12 h-0.5 bg-zinc-900 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="animate-pulse">
                  <div className="bg-zinc-200 aspect-[3/4] mb-4" />
                  <div className="h-4 bg-zinc-200 w-3/4 mb-2" />
                  <div className="h-4 bg-zinc-200 w-1/4" />
                </div>
              ))
            ) : (
              displayedFeatured.map((product) => (
                <motion.div key={product.id} whileHover={{ y: -10 }} className="group">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 mb-6">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">{product.category}</p>
                      <h3 className="text-lg font-serif mb-2">{product.name}</h3>
                      <p className="text-zinc-900 font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
          
          {/* Infinite scroll loading indicator */}
          <div className="flex justify-center py-8">
            {loadingMore ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-zinc-900"></div>
                <span className="text-zinc-500 text-sm">Loading more dresses...</span>
              </div>
            ) : hasMore ? (
              <div id="home-scroll-sentinel" className="h-1 w-full"></div>
            ) : null}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/dresses" className="inline-block text-xs font-bold tracking-widest uppercase border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all">
              View All Collection
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-24 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop" 
              alt="Editorial" 
              className="w-full h-[600px] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-5xl font-serif mb-8 leading-tight">Crafted with precision, worn with confidence.</h2>
            <p className="text-zinc-600 leading-relaxed mb-8">
              At Yashvi Studio, we believe that fashion is a form of self-expression. Each piece in our collection is meticulously designed to celebrate the strength and elegance of the modern woman.
            </p>
            <Link to="/about" className="bg-zinc-900 text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all">
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
