export interface ParticleInterface {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type PositiveInteger = number extends infer T
  ? T extends number
    ? T extends 0
      ? never
      : T
    : never
  : never;

export interface QuadTree {
  boundary: Rectangle;
  capacity: PositiveInteger;
  points: ParticleInterface[];
  massTotal: number;
  massCenterX: number | null;
  massCenterY: number | null;
  insert: (particle: ParticleInterface) => boolean;
  gravity: () => void;
  divided: boolean;
  depth: number;
  maxDepth: number;
  northwest?: QuadTree;
  northeast?: QuadTree;
  southeast?: QuadTree;
  southwest?: QuadTree;
}
