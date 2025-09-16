
import type { PuzzleDef } from '../types';

/*
  Solution Grid for this puzzle:
  [ 25, 26, 27, 28 ]
  [ 34, 35, 36, 37 ]
  [ 43, 44, 45, 46 ]
  [ 52, 53, 54, 55 ]
*/

export const level1: PuzzleDef = [
  [
    { possibleFaces: [16, 25, 34, 26], correctFace: 25, isClue: false },
    { possibleFaces: [26, 17, 35, 27], correctFace: 26, isClue: false },
    { possibleFaces: [18, 27, 28, 36], correctFace: 27, isClue: false },
    { possibleFaces: [28], correctFace: 28, isClue: true },
  ],
  [
    { possibleFaces: [34, 25, 43, 35], correctFace: 34, isClue: false },
    { possibleFaces: [44, 26, 35, 36], correctFace: 35, isClue: false },
    { possibleFaces: [36, 27, 45, 37], correctFace: 36, isClue: true },
    { possibleFaces: [46, 37, 28, 38], correctFace: 37, isClue: false },
  ],
  [
    { possibleFaces: [43], correctFace: 43, isClue: true },
    { possibleFaces: [35, 44, 53, 45], correctFace: 44, isClue: false },
    { possibleFaces: [45, 36, 54, 46], correctFace: 45, isClue: false },
    { possibleFaces: [37, 46, 55, 47], correctFace: 46, isClue: false },
  ],
  [
    { possibleFaces: [52, 43, 61, 53], correctFace: 52, isClue: false },
    { possibleFaces: [44, 53, 62, 54], correctFace: 53, isClue: false },
    { possibleFaces: [54, 45, 63, 55], correctFace: 54, isClue: false },
    { possibleFaces: [46, 55, 64, 56], correctFace: 55, isClue: false },
  ],
];
