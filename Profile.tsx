import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile, Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/PostCard';
import { Edit3, MapPin, Calendar, Link as LinkIcon, Users, Grid, Bookmark, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Profile = () => {
  const { uid } = useParams();
  const { profile: myProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');

  useEffect(() => {
    if (!uid) return;

    const fetchProfile = async () => {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setEditBio(data.bio || '');
      }
    };

    const q = query(
      collection(db, 'posts'),
      where('authorUid', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    });

    fetchProfile();
    return () => unsubscribePosts();
  }, [uid]);

  const handleUpdateBio = async () => {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), { bio: editBio });
    setIsEditing(false);
  };

  if (!profile) return <div className="text-center py-12">Usuário não encontrado.</div>;

  const isMyProfile = myProfile?.uid === uid;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
          {profile.coverURL && <img src={profile.coverURL} className="w-full h-full object-cover" alt="Cover" />}
          {isMyProfile && (
            <button className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors">
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16 mb-6">
            <div className="relative">
              <img 
                src={profile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.uid}`} 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
                alt={profile.displayName}
              />
              {isMyProfile && (
                <button className="absolute bottom-2 right-2 p-1.5 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              <p className="text-slate-500 text-sm">@{profile.email.split('@')[0]}</p>
            </div>

            <div className="flex gap-2">
              {isMyProfile ? (
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors"
                >
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                    Seguir
                  </button>
                  <button className="px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors">
                    Mensagem
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-2">
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Conte um pouco sobre você..."
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 text-sm font-bold text-slate-500">Cancelar</button>
                  <button onClick={handleUpdateBio} className="px-4 py-1.5 text-sm font-bold bg-indigo-600 text-white rounded-lg">Salvar</button>
                </div>
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 max-w-2xl">{profile.bio || 'Nenhuma biografia disponível.'}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                Brasil
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Entrou em {profile.createdAt ? format(new Date(profile.createdAt), 'MMMM yyyy', { locale: ptBR }) : 'Março 2024'}
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-indigo-600 hover:underline">nexus.social/{profile.email.split('@')[0]}</a>
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white">{profile.followingCount || 0}</span>
                <span className="text-slate-500 text-sm">Seguindo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 dark:text-white">{profile.followersCount || 0}</span>
                <span className="text-slate-500 text-sm">Seguidores</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button className="px-8 py-4 text-sm font-bold border-b-2 border-indigo-600 text-indigo-600 flex items-center gap-2">
          <Grid className="w-4 h-4" />
          Publicações
        </button>
        <button className="px-8 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Curtidas
        </button>
        <button className="px-8 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2">
          <Bookmark className="w-4 h-4" />
          Salvos
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-500">Nenhuma publicação ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
