import type { PuzzleDef, CubeDef } from '../types';

// Helper to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const generatePuzzle = (gridSize: number, numClues: number): { puzzle: PuzzleDef, horizontalStep: number, verticalStep: number } => {
  // Determine direction with a 75% chance for inverted directions
  const horizontalStep = Math.random() < 0.75 ? -1 : 1;
  const verticalStep = Math.random() < 0.75 ? -9 : 9;
  
  // 1. Generate the solution grid
  const solutionGrid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  // Increased start value range to avoid negative numbers with new directions
  const startValue = Math.floor(Math.random() * (500 - 100 + 1)) + 100;

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      solutionGrid[r][c] = startValue + (c * horizontalStep) + (r * verticalStep);
    }
  }

  // 2. Select random clue positions, ensuring they are not in the same row or column
  const cluePositions = new Set<string>();
  const clues: { r: number; c: number }[] = [];
  while (clues.length < numClues) {
    const r = Math.floor(Math.random() * gridSize);
    const c = Math.floor(Math.random() * gridSize);

    const positionKey = `${r},${c}`;
    if (cluePositions.has(positionKey)) {
      continue; // Position already taken
    }

    // Check against existing clues
    let conflict = false;
    for (const clue of clues) {
      if (clue.r === r || clue.c === c) {
        conflict = true;
        break;
      }
    }

    if (!conflict) {
      clues.push({ r, c });
      cluePositions.add(positionKey);
    }
  }


  // 3. Build the PuzzleDef
  const puzzleDef: PuzzleDef = [];
  for (let r = 0; r < gridSize; r++) {
    const row: CubeDef[] = [];
    for (let c = 0; c < gridSize; c++) {
      const correctFace = solutionGrid[r][c];
      const isClue = cluePositions.has(`${r},${c}`);
      
      let possibleFaces: number[];

      if (isClue) {
        possibleFaces = [correctFace];
      } else {
        const faces = new Set<number>([correctFace]);
        // Generate 3 distractors
        while (faces.size < 4) {
          // A simple way to create plausible distractors is to use the step values
          const distractorOffset = (Math.floor(Math.random() * 20) - 10) * (Math.random() > 0.5 ? Math.abs(verticalStep) : Math.abs(horizontalStep)) ;
          // Make sure offset is not 0
          if (distractorOffset === 0) continue; 
          
          const distractor = correctFace + distractorOffset;
          if (distractor > 0) { // Ensure positive numbers
             faces.add(distractor);
          }
        }
        possibleFaces = shuffleArray(Array.from(faces));
      }

      row.push({
        possibleFaces,
        correctFace,
        isClue,
      });
    }
    puzzleDef.push(row);
  }

  return { puzzle: puzzleDef, horizontalStep, verticalStep };
};
