import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Post } from '../types';
import { Users, FileText, Shield, Trash2, AlertCircle, BarChart3, CheckCircle2 } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'stats'>('stats');
  const [adminPassword, setAdminPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[]);
    });

    const unsubscribePosts = onSnapshot(collection(db, 'posts'), (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[]);
      setLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePosts();
    };
  }, []);

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl">
          <Shield className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Acesso Restrito</h2>
          <p className="text-slate-500">Insira a senha de administrador para continuar.</p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <input 
            type="password" 
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Senha de Admin"
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
          <button 
            onClick={() => {
              if (adminPassword === 'Aquario12') {
                setIsUnlocked(true);
              } else {
                alert('Senha incorreta!');
              }
            }}
            className="py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Desbloquear Painel
          </button>
        </div>
      </div>
    );
  }

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta publicação?')) {
      await deleteDoc(doc(db, 'posts', postId));
    }
  };

  const handleToggleAdmin = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await updateDoc(doc(db, 'users', user.uid), { role: newRole });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-600" />
          Painel de Administração
        </h1>
        <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Estatísticas
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Usuários
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Publicações
          </button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Total de Usuários</h3>
            <p className="text-3xl font-bold mt-1">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-green-500">+5%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Publicações Totais</h3>
            <p className="text-3xl font-bold mt-1">{posts.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-red-500">-2%</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Denúncias Ativas</h3>
            <p className="text-3xl font-bold mt-1">0</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Usuário</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Cargo</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.photoURL} className="w-8 h-8 rounded-full" alt="" />
                      <span className="font-bold text-sm">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggleAdmin(user)}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      {user.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <img src={post.authorPhoto} className="w-10 h-10 rounded-xl" alt="" />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{post.authorName}</h4>
                  <p className="text-xs text-slate-500 truncate">{post.content}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeletePost(post.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
