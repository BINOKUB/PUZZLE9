import React from 'react';
import { Theme } from '../themes';

interface CubeProps {
  displayValue: number | '?';
  isClue: boolean;
  onClick: () => void;
  theme: Theme;
}

export const Cube: React.FC<CubeProps> = ({ displayValue, isClue, onClick, theme }) => {
  const cubeBaseClasses = "aspect-square flex items-center justify-center text-base md:text-xl lg:text-2xl font-bold rounded-xl shadow-lg select-none";

  return (
    <div
      className={`${cubeBaseClasses} ${isClue ? theme.clueCube : theme.interactiveCube}`}
      onClick={isClue ? undefined : onClick}
    >
        <span className="transition-opacity duration-300">
            {displayValue}
        </span>
    </div>
  );
};