import React from 'react';
import { Trophy, RotateCcw, Download, Star } from 'lucide-react';
import { UserInput } from '../types';

interface ResultScreenProps {
  score: number;
  total: number;
  input: UserInput;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, total, input, onRestart }) => {
  const percentage = (score / total) * 100;
  
  let grade = 'C';
  let color = 'text-gray-400';
  let message = '조금 더 노력해보세요!';

  if (percentage === 100) {
    grade = 'S';
    color = 'text-accent-gold';
    message = '전설적인 영웅의 탄생!';
  } else if (percentage >= 60) {
    grade = 'A';
    color = 'text-accent-green';
    message = '훌륭한 모험이었어요!';
  } else if (percentage >= 30) {
    grade = 'B';
    color = 'text-blue-400';
    message = '던전을 무사히 빠져나왔군요.';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-2xl mx-auto p-6 space-y-8 bg-dungeon-900 animate-fade-in">
      
      <div className="text-center space-y-2">
        <Trophy size={64} className={`mx-auto ${color} drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-bounce`} />
        <h1 className="text-3xl font-black text-white">퀘스트 완료!</h1>
        <p className="text-dungeon-300">{message}</p>
      </div>

      <div className="bg-dungeon-800 w-full p-8 rounded-3xl shadow-2xl border border-dungeon-600 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-dungeon-500 via-accent-gold to-dungeon-500" />
        
        <div className="space-y-4">
          <div>
            <p className="text-dungeon-400 text-sm uppercase tracking-widest font-bold">Rank</p>
            <p className={`text-8xl font-black ${color} drop-shadow-xl`}>{grade}</p>
          </div>
          
          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                size={24} 
                className={i < score ? "text-accent-gold fill-current" : "text-dungeon-600"} 
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <h3 className="text-dungeon-100 font-bold flex items-center">
          <Download size={16} className="mr-2" /> 획득한 아이템 (단어)
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {input.words.map((word, idx) => (
            <div key={idx} className="bg-dungeon-700 p-4 rounded-xl border border-dungeon-600 flex justify-between items-center">
              <span className="font-bold text-white">{word}</span>
              <span className="text-xs text-accent-green bg-green-900/50 px-2 py-1 rounded">획득함</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-4 w-full pt-4">
        <button 
          onClick={onRestart}
          className="flex-1 flex justify-center items-center bg-dungeon-600 hover:bg-dungeon-500 text-white font-bold py-4 rounded-xl transition"
        >
          <RotateCcw size={20} className="mr-2" /> 다시하기
        </button>
        <button 
          onClick={() => alert("부모님께 자랑하기 기능은 준비중입니다!")}
          className="flex-1 flex justify-center items-center bg-accent-gold hover:bg-yellow-400 text-dungeon-900 font-black py-4 rounded-xl transition"
        >
          자랑하기
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
