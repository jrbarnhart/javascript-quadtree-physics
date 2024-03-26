import { ParticlesHook } from "./useParticles";

const animate = ({
  particles,
  canvasWidth,
  canvasHeight,
  ctx,
  drawQuadtree,
}: {
  particles: ParticlesHook;
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  drawQuadtree: boolean;
}) => {
  // Create the quadtree from particles
  /*   const boundary: QuadtreeBoundary = {
    x: 0,
    y: 0,
    height: canvasHeight,
    width: canvasWidth,
  }; */

  // Erase canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  /*   // Draw particles using the new state.
  particles.forEach((particle) => {
    ctx.beginPath(); // Begin path for drawing the particle
    ctx.arc(particle.x, particle.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = particle.color; // Set fill style for the particle
    ctx.fill(); // Fill the particle shape
  }); */

  for (let i = 0; i < particles.data.length / particles.dataElements; i++) {
    const dataIndex = i * particles.dataElements;
    const colorIndex = i * particles.colorElements;

    ctx.beginPath();
    ctx.arc(
      particles.data[dataIndex],
      particles.data[dataIndex + 1],
      2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = `rgba(${particles.colors[colorIndex]}, ${
      particles.colors[colorIndex + 1]
    }, ${particles.colors[colorIndex + 2]}, ${
      particles.colors[colorIndex + 3]
    })`;
    ctx.fill();
  }

  // Draw the quadTree cells
  /*   const drawRects = (quadTree: Quadtree) => {
    ctx.strokeRect(
      quadTree.boundary.x,
      quadTree.boundary.y,
      quadTree.boundary.width,
      quadTree.boundary.height
    );

    for (const child of quadTree.children) {
      drawRects(child);
    }
  }; */

  if (drawQuadtree) {
    ctx.strokeStyle = "white";
    // drawRects(quadTree);
    ctx.strokeStyle = "transparent";
  }
};

export default animate;
