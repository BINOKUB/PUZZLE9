import React from 'react';
import type { PuzzleDef } from '../types';
import { Cube } from './Cube';
import { Theme } from '../themes';

interface GridProps {
  puzzle: PuzzleDef;
  gridState: { faceIndex: number; isRevealed: boolean }[][];
  onCubeClick: (row: number, col: number) => void;
  theme: Theme;
  showErrorLines: boolean;
}

export const Grid: React.FC<GridProps> = ({ puzzle, gridState, onCubeClick, theme, showErrorLines }) => {
  const gridSize = puzzle.length;

  const getLineColor = (r1: number, c1: number, r2: number, c2: number): string => {
    const val1 = puzzle[r1][c1].possibleFaces[gridState[r1][c1].faceIndex];
    const val2 = puzzle[r2][c2].possibleFaces[gridState[r2][c2].faceIndex];
    
    const correctVal1 = puzzle[r1][c1].correctFace;
    const correctVal2 = puzzle[r2][c2].correctFace;

    const expectedDiff = correctVal2 - correctVal1;
    const actualDiff = val2 - val1;

    return actualDiff === expectedDiff ? 'bg-green-500/70' : 'bg-red-500/70';
  };

  return (
    <div 
      className="relative grid gap-3 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl"
      style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
    >
      {puzzle.map((row, r) =>
        row.map((cubeDef, c) => {
          const state = gridState[r][c];
          const displayValue = cubeDef.isClue
            ? cubeDef.correctFace
            : state.isRevealed
            ? cubeDef.possibleFaces[state.faceIndex]
            : '?';
          
          return (
            <Cube
              key={`${r}-${c}`}
              displayValue={displayValue}
              isClue={cubeDef.isClue}
              onClick={() => onCubeClick(r, c)}
              theme={theme}
            />
          );
        })
      )}

      {showErrorLines && (
        <div className="absolute inset-0 grid gap-3 p-4 pointer-events-none" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
          {puzzle.map((row, r) =>
            row.map((_, c) => (
              <div key={`${r}-${c}-lines`} className="relative w-full h-full">
                {/* Horizontal line */}
                {c < gridSize - 1 && (
                  <div className={`
                    absolute top-1/2 left-1/2 -translate-y-1/2
                    h-[3px] rounded-full
                    ${getLineColor(r, c, r, c + 1)}
                  `}
                  style={{ width: 'calc(100% + 0.75rem)' }} // 0.75rem is gap-3
                  />
                )}
                {/* Vertical line */}
                {r < gridSize - 1 && (
                  <div className={`
                    absolute top-1/2 left-1/2 -translate-x-1/2
                    w-[3px] rounded-full
                    ${getLineColor(r, c, r + 1, c)}
                  `}
                  style={{ height: 'calc(100% + 0.75rem)' }} // 0.75rem is gap-3
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
