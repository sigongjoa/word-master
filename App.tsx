
import React, { useState } from 'react';
import { GameState, AppPhase, UserInput } from './types';
import { generateStoryAndQuiz, continueStory } from './services/geminiService';
import InputScreen from './components/InputScreen';
import StoryScreen from './components/StoryScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: AppPhase.INPUT,
    input: { name: '', genre: "" as any, words: [] },
    content: null,
    quizScore: 0,
    quizIndex: 0,
    bossHp: 100,
    chapter: 1
  });

  const [loadingMessage, setLoadingMessage] = useState("던전을 생성하는 중...");

  const handleStart = async (input: UserInput) => {
    setLoadingMessage("새로운 던전을 생성하는 중...");
    setGameState(prev => ({ ...prev, phase: AppPhase.LOADING, input, chapter: 1 }));
    try {
      const generatedContent = await generateStoryAndQuiz(input);
      setGameState(prev => ({
        ...prev,
        phase: AppPhase.STORY,
        content: generatedContent
      }));
    } catch (error) {
      console.error(error);
      alert("던전 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
      setGameState(prev => ({ ...prev, phase: AppPhase.INPUT }));
    }
  };

  const handleContinueStory = async (userPrompt: string) => {
    if (!gameState.content) return;
    
    setLoadingMessage("당신의 행동이 운명을 바꿉니다...");
    const previousPhase = gameState.phase;
    setGameState(prev => ({ ...prev, phase: AppPhase.LOADING }));

    try {
      // Use "Next Chapter" logic if user types something, or just generate more if empty (handled in UI)
      // For the API, we need the previous story context.
      const newContent = await continueStory(
        gameState.input, 
        gameState.content.story, 
        userPrompt || "주인공은 용기를 내어 계속 앞으로 나아갑니다."
      );
      
      setGameState(prev => ({
        ...prev,
        phase: AppPhase.STORY,
        content: newContent,
        chapter: prev.chapter + 1
      }));
    } catch (error) {
      console.error(error);
      alert("다음 이야기를 불러오는데 실패했습니다.");
      setGameState(prev => ({ ...prev, phase: previousPhase })); // Revert
    }
  };

  const handleBossBattle = () => {
    setGameState(prev => ({ ...prev, phase: AppPhase.QUIZ }));
  };

  const handleQuizComplete = (score: number) => {
    setGameState(prev => ({ ...prev, quizScore: score, phase: AppPhase.RESULT }));
  };

  const handleRestart = () => {
    setGameState({
      phase: AppPhase.INPUT,
      input: { name: '', genre: "" as any, words: [] },
      content: null,
      quizScore: 0,
      quizIndex: 0,
      bossHp: 100,
      chapter: 1
    });
  };

  return (
    <div className="min-h-screen bg-dungeon-900 text-white font-sans selection:bg-accent-gold selection:text-dungeon-900">
      <div className="max-w-md mx-auto sm:max-w-2xl min-h-screen shadow-2xl bg-dungeon-900 sm:border-x sm:border-dungeon-800">
        
        {gameState.phase === AppPhase.INPUT && (
          <InputScreen onStart={handleStart} />
        )}

        {gameState.phase === AppPhase.LOADING && (
          <div className="flex flex-col items-center justify-center h-screen p-6 text-center space-y-6 animate-pulse">
             <div className="w-20 h-20 border-4 border-dungeon-500 border-t-accent-gold rounded-full animate-spin"></div>
             <div>
               <h2 className="text-2xl font-bold text-white">{loadingMessage}</h2>
               <p className="text-dungeon-400 mt-2">AI 게임 마스터가 이야기를 짓고 있습니다.</p>
               <p className="text-dungeon-500 text-sm mt-4 italic">"{gameState.input.words.join(', ')}..."</p>
             </div>
          </div>
        )}

        {gameState.phase === AppPhase.STORY && gameState.content && (
          <StoryScreen 
            content={gameState.content} 
            targetWords={gameState.input.words}
            chapter={gameState.chapter}
            onNextChapter={handleContinueStory}
            onBossBattle={handleBossBattle}
          />
        )}

        {gameState.phase === AppPhase.QUIZ && gameState.content && (
          <QuizScreen 
            quizzes={gameState.content.quizzes} 
            onComplete={handleQuizComplete} 
          />
        )}

        {gameState.phase === AppPhase.RESULT && (
          <ResultScreen 
            score={gameState.quizScore} 
            total={gameState.content?.quizzes.length || 0}
            input={gameState.input}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default App;
