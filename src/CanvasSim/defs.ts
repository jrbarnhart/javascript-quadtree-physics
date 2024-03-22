export interface ParticleInterface {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}

export interface QuadtreeBoundary {
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

export interface Quadtree {
  particles: ParticleInterface[];
  children: Quadtree[];
  boundary: QuadtreeBoundary;
  parent: Quadtree | undefined;
  mass: number;
  massCenter: { x: number | null; y: number | null };
  treeForce: (particles: ParticleInterface[]) => void;
}
