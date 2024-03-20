import { ParticleInterface, QuadTree } from "./defs";
import createQuadTree from "./createQuadtreeOld";
import createRectangle from "./createRectangle";

const animate = ({
  particles,
  canvasWidth,
  canvasHeight,
  ctx,
  drawQuadtree,
}: {
  particles: ParticleInterface[];
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  drawQuadtree: boolean;
}) => {
  // Create the quadtree from particles
  const boundary = createRectangle(
    canvasWidth / 2,
    canvasHeight / 2,
    canvasHeight,
    canvasWidth
  );
  const quadTree = createQuadTree(boundary, 1);

  /*   // Brute force gravity
  const maxVelocity = 0.1;
  // For each particle
  particles.forEach((particle) => {
    // Insert particle into quadtree
    quadTree.insert(particle);

    // Calc gravitational force
    const gravity = calculateGravity(particle, particles);
    // Move particle using force, clamping to min/max values
    // Update velocity based on force
    particle.vx = Math.max(
      -maxVelocity,
      Math.min(particle.vx + gravity.x / particle.mass, maxVelocity)
    );
    particle.vy = Math.max(
      -maxVelocity,
      Math.min(particle.vy + gravity.y / particle.mass, maxVelocity)
    );
    // Update position based on velocity
    particle.x += particle.vx;
    particle.y += particle.vy;
    // Reverse velocity on boundary collision
    if (particle.x < 0 || particle.x > canvasWidth) {
      particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > canvasHeight) {
      particle.vy *= -1;
    }
  }); */
  particles.forEach((particle) => {
    quadTree.insert(particle);
  });
  quadTree.gravity();

  // Erase canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw particles using the new state.
  // !!!!Sync/jitter issues from async state updates? Seems fine, but monitor this.!!!!
  particles.forEach((particle) => {
    ctx.beginPath(); // Begin path for drawing the particle
    ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = particle.color; // Set fill style for the particle
    ctx.fill(); // Fill the particle shape
  });

  // Draw the quadTree cells
  const drawRects = (quadTree: QuadTree) => {
    ctx.strokeRect(
      quadTree.boundary.left,
      quadTree.boundary.top,
      quadTree.boundary.width,
      quadTree.boundary.height
    );
    if (quadTree.northwest) {
      drawRects(quadTree.northwest);
    }
    if (quadTree.northeast) {
      drawRects(quadTree.northeast);
    }
    if (quadTree.southeast) {
      drawRects(quadTree.southeast);
    }
    if (quadTree.southwest) {
      drawRects(quadTree.southwest);
    }
  };

  if (drawQuadtree) {
    ctx.strokeStyle = "white";
    drawRects(quadTree);
    ctx.strokeStyle = "transparent";
  }
};

export default animate;
