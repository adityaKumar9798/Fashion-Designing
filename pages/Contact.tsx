
import React, { useState } from 'react';
import { dbService } from '../firebase';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dbService.addMessage(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-20">
          <div className="w-full lg:w-1/3">
            <h1 className="text-5xl font-serif mb-8">Get in Touch</h1>
            <p className="text-zinc-500 leading-relaxed mb-12">
              Whether you have a question about our collections, shipping, or need personal styling advice, our team is here to assist you.
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Our Studio</h3>
                <p className="text-zinc-600 text-sm">123 Fashion Ave, Paris, FR</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Email Us</h3>
                <p className="text-zinc-600 text-sm">hello@yashvistudio.com</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2">Call Us</h3>
                <p className="text-zinc-600 text-sm">+33 (0) 1 23 45 67 89</p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            {success ? (
              <div className="bg-zinc-50 p-12 text-center h-full flex flex-col items-center justify-center border border-zinc-100">
                <div className="w-16 h-16 bg-zinc-900 text-white rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif mb-4">Message Sent</h2>
                <p className="text-zinc-500 mb-8">Thank you for reaching out. We will get back to you shortly.</p>
                <button onClick={() => setSuccess(false)} className="text-xs font-bold tracking-widest uppercase border-b border-zinc-900 pb-1">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-b border-zinc-200 focus:border-zinc-900 outline-none py-4 transition-all text-zinc-900 bg-transparent"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-b border-zinc-200 focus:border-zinc-900 outline-none py-4 transition-all text-zinc-900 bg-transparent"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2">Your Message</label>
                  <textarea 
                    required
                    rows={6}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border-b border-zinc-200 focus:border-zinc-900 outline-none py-4 transition-all resize-none text-zinc-900 bg-transparent"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="bg-zinc-900 text-white px-12 py-5 text-xs font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
