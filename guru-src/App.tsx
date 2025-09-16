import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid } from './components/Grid';
import { generatePuzzle } from './utils/puzzleGenerator';
import type { PuzzleDef } from './types';
import { getTranslator, getBrowserLanguage, languages, Language } from './i18n';
import { themes, Theme } from './themes';

type CubeState = {
  faceIndex: number;
  isRevealed: boolean;
};

type PuzzleData = {
  puzzleDef: PuzzleDef;
  horizontalStep: number;
  verticalStep: number;
};

const getInitialGridState = (puzzleDef: PuzzleDef): CubeState[][] => {
  return puzzleDef.map(row => 
    row.map(cube => ({
      faceIndex: 0,
      isRevealed: cube.isClue,
    }))
  );
};

const App: React.FC = () => {
  const [puzzleData, setPuzzleData] = useState<PuzzleData>(() => {
    const { puzzle, horizontalStep, verticalStep } = generatePuzzle(9, 2); // Always 2 clues
    return { puzzleDef: puzzle, horizontalStep, verticalStep };
  });
  const [gridState, setGridState] = useState<CubeState[][]>(() => getInitialGridState(puzzleData.puzzleDef));
  const [hasWon, setHasWon] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [language, setLanguage] = useState<Language>(getBrowserLanguage());
  
  const [themeKey, setThemeKey] = useState<string>(() => {
    return localStorage.getItem('binokubTheme') || 'guruBlue';
  });

  const currentTheme: Theme = themes[themeKey] || themes.guruBlue;

  useEffect(() => {
    localStorage.setItem('binokubTheme', themeKey);
  }, [themeKey]);
  
  const t = useMemo(() => getTranslator(language), [language]);

  // Reset grid state whenever a new puzzle is generated
  useEffect(() => {
    setGridState(getInitialGridState(puzzleData.puzzleDef));
    setHasWon(false);
  }, [puzzleData]);

  const checkWinCondition = useCallback(() => {
    const { puzzleDef } = puzzleData;
    for (let r = 0; r < puzzleDef.length; r++) {
      for (let c = 0; c < puzzleDef[r].length; c++) {
        const cubeDef = puzzleDef[r][c];
        const state = gridState[r][c];
        
        if (!state.isRevealed) return false;

        const currentValue = cubeDef.possibleFaces[state.faceIndex];
        
        if (currentValue !== cubeDef.correctFace) return false;
      }
    }
    return true;
  }, [gridState, puzzleData]);

  useEffect(() => {
    if (checkWinCondition()) {
      setHasWon(true);
    }
  }, [gridState, checkWinCondition]);

  const handleCubeClick = (row: number, col: number) => {
    if (hasWon || puzzleData.puzzleDef[row][col].isClue) return;

    setGridState(prevState => {
      const newState = prevState.map(r => r.map(c => ({ ...c })));
      const cubeState = newState[row][col];
      
      if (!cubeState.isRevealed) {
        cubeState.isRevealed = true;
      } else {
        const possibleFacesCount = puzzleData.puzzleDef[row][col].possibleFaces.length;
        cubeState.faceIndex = (cubeState.faceIndex + 1) % possibleFacesCount;
      }
      return newState;
    });
  };

  const handleReset = () => {
    const { puzzle, horizontalStep, verticalStep } = generatePuzzle(9, 2); // Always 2 clues
    setPuzzleData({ puzzleDef: puzzle, horizontalStep, verticalStep });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-500 ${currentTheme.appBg}`}>
      <header className="text-center mb-6">
        <h1 className={`text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text drop-shadow-lg ${currentTheme.headerText}`}>
          BINOKUB GURU
        </h1>
        <p className={`mt-2 text-lg transition-colors duration-500 ${currentTheme.subtitleText}`}>{t('header_subtitle')}</p>
      </header>

      <main className="w-full max-w-xl md:max-w-2xl mx-auto">
        <Grid
          puzzle={puzzleData.puzzleDef}
          gridState={gridState}
          onCubeClick={handleCubeClick}
          theme={currentTheme}
        />
      </main>

      <footer className="mt-6 flex items-center gap-4 flex-wrap justify-center">
        <button
          onClick={() => setIsHelpVisible(true)}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${currentTheme.button}`}
        >
          {t('button_how_to_play')}
        </button>
        <button
          onClick={handleReset}
          className={`px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 ${currentTheme.button}`}
        >
          {t('button_reset')}
        </button>
        <div className="flex gap-1 p-1 bg-black/20 rounded-lg backdrop-blur-sm border border-white/20">
          {languages.map(({ code, name }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${
                language === code 
                  ? currentTheme.langButtonActive 
                  : currentTheme.langButtonInactive
              }`}
              aria-label={`Switch to ${name}`}
              title={`Switch to ${name}`}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </footer>
      
      <div className="flex gap-2 mt-4 p-1 bg-black/20 rounded-lg backdrop-blur-sm border border-white/20">
        {Object.keys(themes).map(key => (
          <button
            key={key}
            onClick={() => setThemeKey(key)}
            className={`w-6 h-6 rounded-full transition-all duration-200 ${themes[key].themeSwatch} ${
              themeKey === key ? 'ring-2 ring-offset-2 ring-offset-black/20 ring-white' : 'hover:scale-110'
            }`}
            aria-label={`Switch to ${themes[key].name} theme`}
            title={`${themes[key].name}`}
          />
        ))}
      </div>


      {isHelpVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 backdrop-blur-md" onClick={() => setIsHelpVisible(false)}>
          <div className={`p-8 rounded-2xl shadow-2xl text-left border max-w-lg w-11/12 transition-colors duration-500 ${currentTheme.modalBg}`} onClick={(e) => e.stopPropagation()}>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${currentTheme.modalHeader}`}>{t('help_modal_title')}</h2>
            <ul className={`mb-6 space-y-3 text-base md:text-lg list-disc list-inside transition-colors duration-500 ${currentTheme.modalText}`}>
              <li><span className="font-bold">{t('help_goal_title')}</span> {t('help_goal_text')}</li>
              <li><span className="font-bold">{t('help_rows_title')}</span> {t('help_rows_text')}</li>
              <li><span className="font-bold">{t('help_cols_title')}</span> {t('help_cols_text')}</li>
              <li><span className="font-bold">{t('help_controls_title')}</span> {t('help_controls_text')}</li>
              <li><span className="font-bold">{t('help_clues_title')}</span> {t('help_clues_text')}</li>
            </ul>
            <button
              onClick={() => setIsHelpVisible(false)}
              className={`w-full px-8 py-3 text-white rounded-lg transition-all duration-300 font-bold shadow-lg transform hover:scale-105 ${currentTheme.modalButton}`}
            >
              {t('button_close')}
            </button>
          </div>
        </div>
      )}

      {hasWon && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10 backdrop-blur-md">
          <div className={`p-8 rounded-2xl shadow-2xl text-center border max-w-sm transition-colors duration-500 ${currentTheme.modalBg}`}>
            <h2 className={`text-3xl font-bold mb-4 transition-colors duration-500 ${currentTheme.modalHeader}`}>{t('win_modal_title')}</h2>
            <p className={`mb-6 text-lg transition-colors duration-500 ${currentTheme.modalText}`}>{t('win_modal_text')}</p>
            <button
              onClick={handleReset}
              className={`px-8 py-3 text-white rounded-lg transition-all duration-300 font-bold shadow-lg transform hover:scale-105 ${currentTheme.modalButton}`}
            >
              {t('button_play_again')}
            </button>
          </div>
        </div>
      )}
      <div className="fixed bottom-4 right-4 text-xs text-slate-400 opacity-50 select-none">
        REV 1.8
      </div>
    </div>
  );
};

export default App;
