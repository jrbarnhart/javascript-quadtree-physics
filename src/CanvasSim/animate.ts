import { ParticleInterface, QuadTree } from "./defs";
import calculateGravity from "./calculateGravity";
import createQuadTree from "./createQuadtree";
import createRectangle from "./createRectangle";

// Vars for calculating fps
let lastFrameTime = performance.now();
let frameCount = 0;

const animate = ({
  particles,
  canvasWidth,
  canvasHeight,
  ctx,
  setFps,
}: {
  particles: ParticleInterface[];
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  setFps: (value: number | null) => void;
}) => {
  // Create the quadtree from particles
  const boundary = createRectangle(
    canvasWidth / 2,
    canvasHeight / 2,
    canvasHeight,
    canvasWidth
  );
  const quadTree = createQuadTree(boundary, 1);
  window.QuadTree = quadTree;

  // Brute force gravity
  const maxVelocity = 0.1;
  // For each particle
  particles.forEach((particle) => {
    // Insert particle into quadtree
    quadTree.insert(particle);

    // Add drag to slow particles over time
    particle.vx *= 0.95;
    particle.vy *= 0.95;
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
  });

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

  ctx.strokeStyle = "white";
  drawRects(quadTree);
  ctx.strokeStyle = "transparent";

  // Calculate fps
  const now = performance.now();
  const elapsed = now - lastFrameTime;
  frameCount++;
  if (elapsed > 1000) {
    const fps = Math.round((frameCount * 1000) / elapsed);
    setFps(fps);
    frameCount = 0;
    lastFrameTime = now;
  }
};

export default animate;
