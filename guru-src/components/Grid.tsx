import React from 'react';
import type { PuzzleDef } from '../types';
import { Cube } from './Cube';
import { Theme } from '../themes';

interface GridProps {
  puzzle: PuzzleDef;
  gridState: { faceIndex: number; isRevealed: boolean }[][];
  onCubeClick: (row: number, col: number) => void;
  theme: Theme;
}

export const Grid: React.FC<GridProps> = ({ puzzle, gridState, onCubeClick, theme }) => {
  const gridSize = puzzle.length;

  return (
    <div 
      className="grid gap-3 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl"
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
    </div>
  );
};