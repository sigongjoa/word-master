import React, { useState, useEffect } from 'react';
import { QuizItem } from '../types';
import { Heart, AlertTriangle } from 'lucide-react';

interface QuizScreenProps {
  quizzes: QuizItem[];
  onComplete: (score: number) => void;
}

const BOSS_HP_MAX = 100;

const QuizScreen: React.FC<QuizScreenProps> = ({ quizzes, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bossHp, setBossHp] = useState(BOSS_HP_MAX);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);

  const currentQuiz = quizzes[currentIndex];
  const damagePerHit = BOSS_HP_MAX / quizzes.length;

  const handleAnswer = (selectedIndex: number) => {
    if (showFeedback) return; // Prevent double click

    const isCorrect = selectedIndex === currentQuiz.correctAnswerIndex;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setShowFeedback('CORRECT');
      setIsAttacking(true);
      setTimeout(() => {
        setBossHp((prev) => Math.max(0, prev - damagePerHit));
        setIsAttacking(false);
      }, 200);
    } else {
      setShowFeedback('WRONG');
    }

    // Delay for feedback animation
    setTimeout(() => {
      setShowFeedback(null);
      if (currentIndex < quizzes.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Finish
        onComplete(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-dungeon-900 p-4 relative overflow-hidden">
      
      {/* Boss Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Health Bar */}
        <div className="w-full max-w-xs absolute top-4 z-10">
           <div className="flex justify-between text-xs font-bold text-red-400 mb-1 px-1">
             <span>BOSS</span>
             <span>{Math.round(bossHp)}/{BOSS_HP_MAX}</span>
           </div>
           <div className="w-full h-4 bg-dungeon-800 border border-dungeon-600 rounded-full overflow-hidden shadow-inner">
             <div 
               className="h-full bg-red-500 transition-all duration-500 ease-out"
               style={{ width: `${bossHp}%` }}
             />
           </div>
        </div>

        {/* Boss Image with Animation */}
        <div className={`relative w-64 h-64 transition-transform duration-100 ${isAttacking ? 'animate-shake brightness-150' : 'animate-pulse-slow'}`}>
          {/* Placeholder Monster */}
          <img 
            src="https://picsum.photos/seed/bossmonster/400" 
            alt="Boss" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]"
            style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
          />
          
          {/* Attack Effect Overlay */}
          {showFeedback === 'CORRECT' && (
            <div className="absolute inset-0 flex items-center justify-center animate-ping">
              <span className="text-6xl font-black text-yellow-400 drop-shadow-lg">HIT!</span>
            </div>
          )}
           {showFeedback === 'WRONG' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-gray-500 drop-shadow-lg">MISS...</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Area */}
      <div className="bg-dungeon-800 rounded-t-3xl p-6 shadow-2xl border-t border-dungeon-600 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-dungeon-700 text-dungeon-100 px-3 py-1 rounded-full text-xs font-bold">
            Quest {currentIndex + 1}/{quizzes.length}
          </span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
               <Heart key={i} size={16} className={i < (3 - (currentIndex - score)) ? "text-red-500 fill-current" : "text-dungeon-600"} />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
          {currentQuiz.question}
        </h3>

        <div className="space-y-3">
          {currentQuiz.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={showFeedback !== null}
              className={`w-full p-4 rounded-xl text-left font-bold transition-all transform active:scale-98 border-2
                ${showFeedback === null 
                  ? 'bg-dungeon-900 border-dungeon-700 hover:border-dungeon-500 text-dungeon-100' 
                  : idx === currentQuiz.correctAnswerIndex 
                    ? 'bg-green-900 border-green-500 text-green-100' 
                    : showFeedback === 'WRONG' && idx !== currentQuiz.correctAnswerIndex // Just generic disabled style
                      ? 'opacity-50 bg-dungeon-900 border-dungeon-700'
                      : 'bg-dungeon-900 border-dungeon-700'
                }
              `}
            >
              <span className="mr-2 text-dungeon-400">{idx + 1}.</span> {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
