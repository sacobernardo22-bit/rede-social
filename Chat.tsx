import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Message, UserProfile } from '../types';
import { Send, Image, Smile, MoreVertical, Search, Phone, Video, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const Chat = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock users for the sidebar
  const contacts = [
    { uid: '1', displayName: 'João Silva', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', lastMsg: 'Tudo bem por aí?', time: '10:30', online: true },
    { uid: '2', displayName: 'Maria Souza', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', lastMsg: 'Viu o novo post?', time: '09:15', online: false },
    { uid: '3', displayName: 'Pedro Santos', photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', lastMsg: 'Valeu!', time: 'Ontem', online: true },
  ];

  const [activeContact, setActiveContact] = useState(contacts[0]);

  useEffect(() => {
    if (!profile) return;

    // For demo, we use a global 'public-chat' or similar
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input.trim();
    setInput('');

    try {
      await addDoc(collection(db, 'messages'), {
        chatId: 'global', // Demo simplification
        senderUid: profile?.uid,
        text: text,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
      {/* Contacts Sidebar */}
      <div className="hidden md:flex flex-col w-80 border-r border-slate-100 dark:border-slate-800">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-4">Mensagens</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar conversas..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.uid}
              onClick={() => setActiveContact(contact)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4 ${
                activeContact.uid === contact.uid ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-transparent'
              }`}
            >
              <div className="relative">
                <img src={contact.photoURL} className="w-12 h-12 rounded-2xl object-cover" alt={contact.displayName} />
                {contact.online && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-900"></span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm truncate">{contact.displayName}</h4>
                  <span className="text-[10px] text-slate-400">{contact.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <img src={activeContact.photoURL} className="w-10 h-10 rounded-xl object-cover" alt={activeContact.displayName} />
            <div>
              <h3 className="font-bold text-sm">{activeContact.displayName}</h3>
              <p className="text-[10px] text-green-500 font-medium">Online agora</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderUid === profile?.uid ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.senderUid === profile?.uid 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {msg.text}
                <div className={`text-[9px] mt-1 text-right ${msg.senderUid === profile?.uid ? 'text-indigo-100' : 'text-slate-400'}`}>
                  {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'HH:mm') : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Smile className="w-6 h-6" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Image className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite uma mensagem..."
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
