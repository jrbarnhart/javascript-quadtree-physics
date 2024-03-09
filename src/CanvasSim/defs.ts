export interface ParticleInterface {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
  move: (force: { x: number; y: number }) => void;
}
