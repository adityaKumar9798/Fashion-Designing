
import React, { useState, useEffect } from 'react';
import { dbService } from '../../firebase';
import { ContactMessage } from '../../types';

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    dbService.getMessages().then(setMessages);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif mb-12">Customer Messages</h1>

        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="bg-white p-12 text-center border border-zinc-200">
              <p className="text-zinc-500 uppercase tracking-widest text-xs">No messages yet.</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="bg-white p-8 border border-zinc-200 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-serif mb-1">{msg.name}</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">{msg.email}</p>
                  </div>
                  <span className="text-[10px] text-zinc-300 uppercase tracking-widest">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-zinc-600 leading-relaxed text-sm italic">"{msg.message}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
