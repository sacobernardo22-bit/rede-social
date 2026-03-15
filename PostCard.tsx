import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { profile } = useAuth();
  const [liked, setLiked] = useState(false); // Simplified for demo
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
      likesCount: increment(liked ? -1 : 1)
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={post.authorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorUid}`} 
            className="w-10 h-10 rounded-full object-cover"
            alt={post.authorName}
          />
          <div>
            <h4 className="font-bold text-sm">{post.authorName}</h4>
            <p className="text-xs text-slate-500">
              {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: ptBR }) : 'Agora mesmo'}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <MoreHorizontal className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="px-4 pb-3">
        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.mediaUrl && (
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-800">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} className="w-full h-full object-cover" alt="Post content" />
          ) : (
            <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
          )}
        </div>
      )}

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-slate-600 dark:text-slate-400 hover:text-red-500'}`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
          {post.likesCount || 0}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          {post.commentsCount || 0}
        </button>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-green-600 transition-colors">
          <Share2 className="w-5 h-5" />
          Compartilhar
        </button>
      </div>

      {showComments && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-3">
            <img 
              src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
              className="w-8 h-8 rounded-full object-cover"
              alt="My profile"
            />
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Escreva um comentário..." 
                className="w-full pl-4 pr-10 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
