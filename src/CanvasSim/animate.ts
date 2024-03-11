import { ParticleInterface } from "./defs";
import calculateGravity from "./calculateGravity";

const animate = ({
  particles,
  canvasX,
  canvasY,
  ctx,
}: {
  particles: ParticleInterface[];
  canvasX: number;
  canvasY: number;
  ctx: CanvasRenderingContext2D;
}) => {
  const maxVelocity = 0.08;

  // For each particle
  particles.forEach((particle) => {
    // Add drag to slow particles over time
    particle.vx *= 0.95;
    particle.vy *= 0.95;
    // Calc gravitational force
    const gravity = calculateGravity(particle, particles);
    // Move particle using force, clamping to min/max values
    // Update velocity based on force
    particle.vx += Math.min(gravity.x / particle.mass, maxVelocity);
    particle.vy += Math.min(gravity.y / particle.mass, maxVelocity);
    // Update position based on velocity
    particle.x += particle.vx;
    particle.y += particle.vy;
    // Reverse velocity on boundary collision
    if (particle.x < 0 || particle.x > canvasX) {
      particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > canvasY) {
      particle.vy *= -1;
    }
  });

  // Erase canvas
  ctx.clearRect(0, 0, canvasX, canvasY);

  // Draw particles using the new state.
  // !!!!Sync/jitter issues from async state updates? Seems fine, but monitor this.!!!!
  particles.forEach((particle) => {
    ctx.beginPath(); // Begin path for drawing the particle
    ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = particle.color; // Set fill style for the particle
    ctx.fill(); // Fill the particle shape
  });
};

export default animate;
