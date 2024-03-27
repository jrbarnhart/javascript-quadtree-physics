// This is a bad way to do this due to the many to many comparison. Instead use a quad tree approach.

import { ParticleInterface } from "./defs";

const calculateAttraction = (
  p1: ParticleInterface,
  p2: ParticleInterface,
  G: number
) => {
  const gravityDeadzone = 1;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const distSq = dx * dx + dy * dy;
  const dist = Math.sqrt(distSq);
  const force = (G * p1.mass * p2.mass) / distSq;
  if (dist > gravityDeadzone) {
    const fx = -(force * (dx / dist));
    const fy = -(force * (dy / dist));
    return { x: fx, y: fy };
  }
  return { x: 0, y: 0 };
};

const calculateGravity = (
  targetParticle: ParticleInterface,
  particles: ParticleInterface[]
) => {
  const netForce = { x: 0, y: 0 };

  particles.forEach((particle) => {
    if (!(targetParticle.x === particle.x && targetParticle.y === particle.y)) {
      const attractionForce = calculateAttraction(targetParticle, particle, 3);
      netForce.x += attractionForce.x;
      netForce.y += attractionForce.y;
    }
  });

  return netForce;
};

export default calculateGravity;
