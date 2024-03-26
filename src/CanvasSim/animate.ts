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

  // Draw the particles
  for (let i = 0; i < particles.data.length / particles.dataElements; i++) {
    const dataIndex = i * particles.dataElements;
    const colorIndex = i * particles.colorElements;

    let x = particles.data[dataIndex];
    let y = particles.data[dataIndex + 1];
    let vx = particles.data[dataIndex + 2];
    let vy = particles.data[dataIndex + 3];
    const r = particles.data[dataIndex + 5];
    const rColor = particles.colors[colorIndex];
    const gColor = particles.colors[colorIndex + 1];
    const bColor = particles.colors[colorIndex + 2];
    const aColor = particles.colors[colorIndex + 3];

    // Reverse x and y velocity when over boundary
    if (x + r > canvasWidth) {
      particles.data[dataIndex] = canvasWidth - r - 1;
      particles.data[dataIndex + 2] = vx * -1;
    } else if (x - r < 0) {
      particles.data[dataIndex] = r + 1;
      particles.data[dataIndex + 2] = vx * -1;
    }
    if (y + r > canvasHeight) {
      particles.data[dataIndex + 1] = canvasHeight - r - 1;
      particles.data[dataIndex + 3] = vy * -1;
    } else if (y - r < 0) {
      particles.data[dataIndex + 1] = r + 1;
      particles.data[dataIndex + 3] = vy * -1;
    }

    x = particles.data[dataIndex];
    vx = particles.data[dataIndex + 2];
    y = particles.data[dataIndex + 1];
    vy = particles.data[dataIndex + 3];

    // Update x and y position based on velocity
    particles.data[dataIndex] += vx;
    particles.data[dataIndex + 1] += vy;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(${rColor}, ${gColor}, ${bColor}, ${aColor})`;
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
