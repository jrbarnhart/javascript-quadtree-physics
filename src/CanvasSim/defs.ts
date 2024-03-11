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
  insert: (particle: ParticleInterface) => void;
  northwest?: QuadTree;
  northeast?: QuadTree;
  southeast?: QuadTree;
  southwest?: QuadTree;
}
