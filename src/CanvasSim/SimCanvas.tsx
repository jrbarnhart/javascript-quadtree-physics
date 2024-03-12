import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleInterface } from "./defs";
import createParticle from "./createParticle";
import animate from "./animate";
import useWindowSize from "./useWindowSize";
import createRectangle from "./createRectangle";
import createQuadTree from "./createQuadtree";

const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  const particles = useRef<ParticleInterface[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const windowSize = useWindowSize();

  // Define animation loop
  const animationLoop = useCallback((particles: ParticleInterface[]) => {
    if (!canvasRef.current || !contextRef.current) return;

    animate({
      particles,
      canvasX: canvasRef.current.width,
      canvasY: canvasRef.current.height,
      ctx: contextRef.current,
    });

    animationFrameRef.current = requestAnimationFrame(() => {
      animationLoop(particles);
    });
  }, []);

  // Handle clicks by creating a particle with random properties
  const handleClick = (event: React.MouseEvent) => {
    if (canvasRef.current) {
      // Get mouse position on canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Create random particle with x and y
      const newParticle = createParticle({
        x,
        y,
        vx: 0,
        vy: 0,
        mass: 1,
        radius: 2,
        color: "yellow",
      });

      // Add it to particles arraye
      particles.current.push(newParticle);
    }
  };

  // Initialize canvas by setting context ref
  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      setCanvasInitialized(true);
      console.log("Canvas intialized.");
      // Test createQuadtree
      const rect = createRectangle(
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight,
        window.innerWidth
      );
      const particles = [];
      for (let i = 0; i < 10; i++) {
        particles.push(
          createParticle({
            x: i * 10,
            y: i * 10,
            vx: 0,
            vy: 0,
            mass: 1,
            radius: 1,
            color: "white",
          })
        );
      }
      const quadTree = createQuadTree(rect, 1);
      particles.forEach((particle) => {
        quadTree.insert(particle);
      });
      console.log(particles, quadTree);
    }
  }, []);

  // Start the animation if canvas is initialized
  useEffect(() => {
    if (canvasInitialized) {
      // Start animation loop with requestAnimationFrame
      animationLoop(particles.current);
      console.log("Animation started.");
    }
  }, [animationLoop, canvasInitialized]);

  return (
    <canvas
      onClick={handleClick}
      height={windowSize.height}
      width={windowSize.width}
      className="bg-black"
      ref={canvasRef}
    ></canvas>
  );
};

export default SimCanvas;
