import { ParticleInterface } from "./defs";

const createParticle = ({
  x,
  y,
  vx,
  vy,
  mass,
  radius,
  color,
}: {
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
}) => {
  const particle: ParticleInterface = {
    x,
    y,
    vx,
    vy,
    mass,
    radius,
    color,
    move: (force: { x: number; y: number }) => {
      // Update velocity based on force
      particle.vx += force.x / mass;
      particle.vy += force.y / mass;
      // Update position based on velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
    },
  };

  return particle;
};

export default createParticle;
