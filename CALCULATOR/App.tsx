import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import `SoundName` from `./types` as it is defined there.
import type { Language, Theme, GameState, SoundName, Difficulty } from './types';
import { TRANSLATIONS, THEMES } from './constants';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
// FIX: Remove `SoundName` from this import as it is not exported from `./utils/audio`.
import { playAudio } from './utils/audio';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('binokub_lang');
    return (savedLang as Language) || 'fr';
  });
  
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('binokub_theme');
    return (savedTheme as Theme) || 'nebula';
  });

  const [difficulty, setDifficulty] = useState<Difficulty>(() => {
    const savedDifficulty = localStorage.getItem('binokub_difficulty');
    return (savedDifficulty as Difficulty) || 'easy';
  });

  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedSound = localStorage.getItem('binokub_sound_enabled');
    return savedSound ? JSON.parse(savedSound) : true;
  });

  useEffect(() => {
    localStorage.setItem('binokub_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('binokub_theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('binokub_difficulty', difficulty);
  }, [difficulty]);
  
  useEffect(() => {
    localStorage.setItem('binokub_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const playSound = useCallback((sound: SoundName) => {
    if (soundEnabled) {
      playAudio(sound);
    }
  }, [soundEnabled]);

  const handleStartGame = useCallback(() => {
    setScore(0);
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setGameState('gameOver');
  }, []);
  
  const handleReturnToStart = useCallback(() => {
    setGameState('start');
  }, []);

  const themeConfig = THEMES[theme];
  const translations = TRANSLATIONS[language];

  return (
    <main className={`min-h-screen w-full bg-gray-900 bg-gradient-to-br ${themeConfig.gradient} ${themeConfig.textColor} flex items-center justify-center p-4 transition-colors duration-500`}>
      <div className={`w-full max-w-md mx-auto ${themeConfig.panelBg} rounded-2xl shadow-2xl p-6 md:p-8 text-center`}>
        {gameState === 'start' && (
          <StartScreen 
            onStart={handleStartGame} 
            currentLang={language}
            setLang={setLanguage}
            currentTheme={theme}
            setTheme={setTheme}
            currentDifficulty={difficulty}
            setDifficulty={setDifficulty}
            translations={translations}
            themeConfig={themeConfig}
            playSound={playSound}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />
        )}
        {gameState === 'playing' && (
          <GameScreen 
            onGameOver={handleGameOver} 
            themeConfig={themeConfig}
            translations={translations}
            playSound={playSound}
            difficulty={difficulty}
          />
        )}
        {gameState === 'gameOver' && (
          <GameOverScreen 
            score={score} 
            onRestart={handleReturnToStart}
            translations={translations}
            themeConfig={themeConfig}
            playSound={playSound}
          />
        )}
      </div>
       <div className="fixed bottom-4 right-4 text-xs text-white/30 font-mono select-none">
        REV 1.7
      </div>
    </main>
  );
};

export default App;