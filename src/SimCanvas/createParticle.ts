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
  };

  return particle;
};

export default createParticle;
