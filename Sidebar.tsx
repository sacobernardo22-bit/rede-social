import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, MessageSquare, Sparkles, Settings, ShieldCheck, Bookmark, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { profile, isAdmin } = useAuth();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: User, label: 'Perfil', path: `/profile/${profile?.uid}` },
    { icon: MessageSquare, label: 'Mensagens', path: '/chat' },
    { icon: Sparkles, label: 'Nexus AI', path: '/ai-chat' },
    { icon: Users, label: 'Amigos', path: '/friends' },
    { icon: Bookmark, label: 'Salvos', path: '/saved' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              location.pathname === item.path
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </div>

      {isAdmin && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/admin"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              location.pathname === '/admin'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Painel Admin
          </Link>
        </div>
      )}

      <div className="p-4 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
        <h4 className="font-bold mb-1">Nexus Premium</h4>
        <p className="text-xs text-indigo-100 mb-3">Tenha acesso a recursos exclusivos e IA ilimitada.</p>
        <button className="w-full py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
          Saiba Mais
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
