
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000&auto=format&fit=crop" 
          alt="About Yashvi Studio" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <h1 className="relative text-6xl md:text-8xl text-white font-serif tracking-tight">Our Legacy</h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif mb-8 italic">"Style is a way to say who you are without having to speak."</h2>
        <div className="w-12 h-0.5 bg-zinc-900 mx-auto mb-12" />
        
        <div className="space-y-8 text-zinc-600 leading-relaxed text-lg font-light">
          <p>
            Founded in 2025, YASHVI Studio was born from a passion for timeless elegance and modern craftsmanship. We believe that every woman deserves to feel confident, sophisticated, and uniquely herself.
          </p>
          <p>
            Our collections are carefully curated, focusing on premium fabrics, impeccable tailoring, and silhouettes that celebrate the feminine form. From ethereal silk gowns to structured minimalist pieces, each garment tells a story of artistry and attention to detail.
          </p>
          <p>
            Beyond fashion, YASHVI Studio represents a lifestyle of conscious luxury. We work with artisans who share our commitment to quality, ensuring that every piece you wear from our studio is a lasting investment in your personal legacy.
          </p>
        </div>
      </div>

      <div className="bg-zinc-50 py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">The Vision</h3>
            <p className="text-zinc-500 text-sm">To redefine modern luxury through accessible elegance and timeless design.</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">The Craft</h3>
            <p className="text-zinc-500 text-sm">Hand-picked textiles and meticulous attention to every stitch and seam.</p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4">The Woman</h3>
            <p className="text-zinc-500 text-sm">Confident, sophisticated, and unafraid to define her own version of elegance.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
