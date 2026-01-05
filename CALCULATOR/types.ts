export type Language = 'en' | 'fr' | 'es' | 'de';
export type Theme = 'nebula' | 'sunset' | 'forest' | 'ocean';
export type GameState = 'start' | 'playing' | 'gameOver';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'guru';

export interface DifficultySetting {
  minDigits: number;
  maxDigits: number;
  // Time is either a fixed number or dynamic based on digits
  time?: number;
  dynamicTime?: {
    base: number;
    perDigit: number;
  };
}

export interface ThemeConfig {
  gradient: string;
  panelBg: string;
  textColor: string;
  accentColor: string;
  buttonBg: string;
  buttonHoverBg: string;
  inputBg: string;
  inputBorder: string;
  focusRing: string;
}

export interface Translations {
  title: string;
  description: string;
  start_game: string;
  game_over: string;
  score: string;
  high_score: string;
  play_again: string;
  your_answer: string;
  select_theme: string;
  select_language: string;
  select_difficulty: string;
  difficulty_easy: string;
  difficulty_medium: string;
  difficulty_hard: string;
  difficulty_guru: string;
  level: string;
  time: string;
  share_score: string;
  share_text: string;
  copied_to_clipboard: string;
  how_to_play: string;
  how_to_play_title: string;
  how_to_play_goal: string;
  how_to_play_calc: string;
  how_to_play_example_title: string;
  how_to_play_example_text: string;
  how_to_play_game: string;
  got_it: string;
  [key: string]: string;
}

export type SoundName = 'click' | 'correct' | 'wrong' | 'tick';
export type PlaySoundFunction = (sound: SoundName) => void;