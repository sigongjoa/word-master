import React, { useState } from 'react';
import { UserInput, Genre } from '../types';
import { Sword, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

interface InputScreenProps {
  onStart: (data: UserInput) => void;
}

const PRESET_WORDS = [
  ["추상화", "알고리즘", "자료구조"],
  ["광합성", "생태계", "먹이사슬"],
  ["민주주의", "투표", "선거"],
  ["비유", "운율", "심상"]
];

const InputScreen: React.FC<InputScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [genre, setGenre] = useState<Genre>(Genre.FANTASY);
  const [words, setWords] = useState<string[]>(['', '', '']);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value;
    setWords(newWords);
  };

  const handleAutoRecommend = () => {
    const randomSet = PRESET_WORDS[Math.floor(Math.random() * PRESET_WORDS.length)];
    setWords([...randomSet]);
  };

  const handleSubmit = () => {
    // Basic validation
    const filteredWords = words.filter(w => w.trim() !== '');
    if (!name.trim() || filteredWords.length < 1) {
      alert("이름과 최소 1개의 단어를 입력해주세요!");
      return;
    }
    onStart({ name, genre, words: filteredWords });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="w-24 h-24 bg-dungeon-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-dungeon-500">
          <img src="https://picsum.photos/200" alt="Character" className="w-full h-full rounded-full object-cover opacity-80" />
        </div>
        <h1 className="text-3xl font-black text-white drop-shadow-md">
          워드 마스터 <span className="text-dungeon-300 block text-xl font-bold mt-1">나만의 소설 던전</span>
        </h1>
        <p className="text-dungeon-300 text-sm">오늘의 모험을 떠날 준비가 되었나요?</p>
      </div>

      <div className="w-full space-y-6 bg-dungeon-800 p-6 rounded-2xl shadow-xl border border-dungeon-600">
        {/* Input 1: Name */}
        <div className="space-y-2">
          <label className="flex items-center text-dungeon-100 font-bold text-sm">
            <Sword size={16} className="mr-2 text-accent-gold" /> 주인공 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 김철수"
            className="w-full bg-dungeon-900 border border-dungeon-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-dungeon-400 focus:outline-none transition"
          />
        </div>

        {/* Input 2: Words */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="flex items-center text-dungeon-100 font-bold text-sm">
              <BookOpen size={16} className="mr-2 text-accent-gold" /> 오늘의 무기 (단어)
            </label>
            <button
              onClick={handleAutoRecommend}
              className="text-xs text-dungeon-400 hover:text-white flex items-center transition"
            >
              <RefreshCw size={12} className="mr-1" /> 자동 추천
            </button>
          </div>
          <div className="grid gap-3">
            {words.map((word, idx) => (
              <input
                key={idx}
                type="text"
                value={word}
                onChange={(e) => handleWordChange(idx, e.target.value)}
                placeholder={`단어 ${idx + 1}`}
                className="w-full bg-dungeon-900 border border-dungeon-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-dungeon-400 focus:outline-none transition"
              />
            ))}
          </div>
        </div>

        {/* Input 3: Genre */}
        <div className="space-y-2">
          <label className="flex items-center text-dungeon-100 font-bold text-sm">
            <Sparkles size={16} className="mr-2 text-accent-gold" /> 던전 테마 (장르)
          </label>
          <div className="grid grid-cols-1 gap-2">
            {Object.values(Genre).map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`p-3 rounded-xl text-left text-sm font-medium transition border ${
                  genre === g
                    ? 'bg-dungeon-600 border-accent-gold text-white shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                    : 'bg-dungeon-900 border-transparent text-dungeon-300 hover:bg-dungeon-700'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-dungeon-500 to-dungeon-400 hover:from-dungeon-400 hover:to-dungeon-300 text-white font-black py-4 rounded-xl shadow-lg transform transition active:scale-95 flex justify-center items-center text-lg"
        >
          ⚔️ 모험 시작하기
        </button>
      </div>
    </div>
  );
};

export default InputScreen;
