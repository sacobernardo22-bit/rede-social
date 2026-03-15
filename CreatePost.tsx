import React, { useState } from 'react';
import { Image, Video, Smile, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CreatePost = () => {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaUrl) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorUid: profile?.uid,
        authorName: profile?.displayName,
        authorPhoto: profile?.photoURL,
        content: content,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp()
      });
      setContent('');
      setMediaUrl('');
      setMediaType('none');
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex gap-4">
        <img 
          src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
          className="w-12 h-12 rounded-full object-cover"
          alt="My profile"
        />
        <form onSubmit={handlePost} className="flex-1 space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`O que você está pensando, ${profile?.displayName?.split(' ')[0]}?`}
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-slate-400 min-h-[100px]"
          />
          
          {mediaUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              {mediaType === 'image' ? (
                <img src={mediaUrl} className="w-full max-h-96 object-cover" alt="Preview" />
              ) : (
                <video src={mediaUrl} className="w-full max-h-96 object-cover" controls />
              )}
              <button 
                onClick={() => { setMediaUrl(''); setMediaType('none'); }}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <Smile className="w-4 h-4 rotate-45" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => {
                  const url = prompt('Insira a URL da imagem:');
                  if (url) { setMediaUrl(url); setMediaType('image'); }
                }}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
              >
                <Image className="w-5 h-5 text-green-500" />
                <span className="hidden sm:inline">Foto</span>
              </button>
              <button 
                type="button"
                onClick={() => {
                  const url = prompt('Insira a URL do vídeo:');
                  if (url) { setMediaUrl(url); setMediaType('video'); }
                }}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
              >
                <Video className="w-5 h-5 text-indigo-500" />
                <span className="hidden sm:inline">Vídeo</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium">
                <Smile className="w-5 h-5 text-yellow-500" />
                <span className="hidden sm:inline">Sentimento</span>
              </button>
            </div>
            
            <button
              type="submit"
              disabled={loading || (!content.trim() && !mediaUrl)}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <span className="hidden sm:inline">Publicar</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
