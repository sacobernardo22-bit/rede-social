import React from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StoryBar = () => {
  const { profile } = useAuth();

  // Mock stories for demo
  const stories = [
    { id: 1, name: 'João Silva', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
    { id: 2, name: 'Maria Souza', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
    { id: 3, name: 'Pedro Santos', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    { id: 4, name: 'Ana Oliveira', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
    { id: 5, name: 'Lucas Lima', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    { id: 6, name: 'Carla Costa', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800">
          <img 
            src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.uid}`} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            alt="My story"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
        </div>
        <span className="text-[10px] font-medium text-slate-500">Seu Story</span>
      </div>

      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group">
          <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
            <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-white dark:border-slate-900">
              <img 
                src={story.photo} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                alt={story.name}
              />
            </div>
          </div>
          <span className="text-[10px] font-medium text-slate-500 truncate w-16 text-center">{story.name.split(' ')[0]}</span>
        </div>
      ))}
    </div>
  );
};

export default StoryBar;
