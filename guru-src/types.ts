
export interface CubeDef {
  possibleFaces: number[];
  correctFace: number;
  isClue: boolean;
}

export type PuzzleDef = CubeDef[][];
