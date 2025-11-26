
import React, { useRef, useState, useEffect } from 'react';
import { GeneratedContent } from '../types';
import { ArrowRight, Scroll, Wand2, Sword, Shield, Sparkles } from 'lucide-react';

interface StoryScreenProps {
  content: GeneratedContent;
  targetWords: string[];
  chapter: number;
  onNextChapter: (prompt: string) => void;
  onBossBattle: () => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ content, targetWords, chapter, onNextChapter, onBossBattle }) => {
  const [progress, setProgress] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setProgress(0);
    }
    setUserPrompt('');
  }, [content]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll <= 0) {
        setProgress(100);
        return;
      }
      const currentProgress = (scrollTop / totalScroll) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    }
  };

  // Helper to parse bold text (marked with **)
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const word = part.slice(2, -2);
        return (
          <span key={index} className="bg-dungeon-600 text-accent-gold font-bold px-1 rounded mx-0.5 shadow-sm border-b-2 border-dungeon-400 relative group cursor-pointer hover:bg-dungeon-500 transition-colors">
            {word}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 shadow-xl">
              핵심 아이템!
            </span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleCustomAction = () => {
    if (!userPrompt.trim()) return;
    onNextChapter(userPrompt);
  };

  const handleDefaultAction = () => {
    onNextChapter("주인공은 주변을 경계하며 조심스럽게 앞으로 나아갑니다.");
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-dungeon-900 relative overflow-hidden">
      {/* Header / XP Bar */}
      <div className="sticky top-0 z-20 bg-dungeon-900/95 backdrop-blur-sm border-b border-dungeon-700 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-dungeon-300 uppercase tracking-wider flex items-center">
            <Sparkles size={12} className="mr-1 text-accent-gold" /> Chapter {chapter}
          </span>
          <span className="text-xs font-bold text-accent-gold">{Math.round(progress)}% 읽음</span>
        </div>
        <div className="w-full h-3 bg-dungeon-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dungeon-500 to-accent-green transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Scrollable Story Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 pb-64" // Padding bottom to avoid overlap with fixed footer
      >
        <div className="text-center space-y-2 mb-8">
           <div className="inline-block p-3 rounded-full bg-dungeon-800 text-accent-gold mb-2 border border-dungeon-600 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
             <Scroll size={24} />
           </div>
           <h2 className="text-2xl font-black text-white leading-tight drop-shadow-lg break-keep">
             {content.title}
           </h2>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-dungeon-100 leading-loose whitespace-pre-wrap font-serif tracking-wide">
           <p>{renderContent(content.story)}</p>
        </div>
      </div>

      {/* Footer: Interactive Actions */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dungeon-900 via-dungeon-900 to-transparent pt-12 pb-6 px-4">
        
        {/* Hint if not scrolled */}
        {progress < 90 && (
          <div className="absolute top-0 left-0 right-0 text-center pointer-events-none -mt-8 animate-bounce">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm border border-dungeon-700">
              👇 스크롤을 내려 이야기를 더 읽어보세요
            </span>
          </div>
        )}

        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {/* User Input Area */}
          <div className="bg-dungeon-800/95 backdrop-blur p-1.5 rounded-2xl border border-dungeon-600 shadow-2xl flex gap-2 items-center pl-4">
            <Wand2 size={18} className="text-accent-gold flex-shrink-0" />
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomAction()}
              placeholder="예: 마법 지팡이를 휘두른다!"
              className="flex-1 bg-transparent border-none text-white text-sm focus:ring-0 placeholder-dungeon-500 py-3"
            />
            <button
              onClick={handleCustomAction}
              disabled={!userPrompt.trim()}
              className="bg-dungeon-600 hover:bg-dungeon-500 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-xl font-bold transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDefaultAction}
              className="flex-1 py-3.5 bg-dungeon-800 hover:bg-dungeon-700 text-dungeon-300 text-sm font-bold rounded-xl border border-dungeon-700 transition flex justify-center items-center group"
            >
              <Sword size={16} className="mr-2 group-hover:text-white transition-colors" /> 
              그냥 진행하기
            </button>
            <button
              onClick={onBossBattle}
              className="flex-[1.5] py-3.5 bg-gradient-to-r from-accent-gold to-yellow-500 hover:from-yellow-400 hover:to-yellow-500 text-dungeon-900 font-black rounded-xl shadow-lg transition transform active:scale-95 flex justify-center items-center text-sm"
            >
               <Shield size={18} className="mr-2" /> 
               보스전 입장 (퀴즈)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryScreen;
