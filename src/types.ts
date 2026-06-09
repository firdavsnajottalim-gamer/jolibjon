export interface WordPair {
  id: string;
  english: string;
  uzbek: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  exampleEn?: string;
  exampleUz?: string;
}

export interface Visitor {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  loggedInAt: string;
  score: number;
}

export interface Theme {
  id: string;
  nameEn: string;
  nameUz: string;
  bgClass: string;
  bgImage?: string;
  cardClass: string;
  textColor: string;
  accentColor: string;
  primaryBtn: string;
}

export type AppLanguage = 'en' | 'uz';

export interface GameScore {
  gameId: string;
  playerName: string;
  score: number;
  date: string;
}
