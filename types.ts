
export enum AppPhase {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  STORY = 'STORY',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT'
}

export enum Genre {
  FANTASY = '판타지 (드래곤과 기사)',
  SF = 'SF (우주와 로봇)',
  HORROR = '학교괴담 (귀신과 좀비)',
  DETECTIVE = '추리 (탐정과 사건)'
}

export interface UserInput {
  name: string;
  genre: Genre;
  words: string[];
}

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0, 1, or 2
}

export interface GeneratedContent {
  title: string;
  story: string;
  quizzes: QuizItem[];
}

export interface GameState {
  phase: AppPhase;
  input: UserInput;
  content: GeneratedContent | null;
  quizScore: number;
  quizIndex: number;
  bossHp: number; // 0 to 100
  chapter: number; // New: Track current chapter
}
