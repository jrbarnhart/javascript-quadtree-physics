import { useCallback, useEffect, useRef, useState } from "react";
import animate from "./animate";
import useWindowSize from "./useWindowSize";
import HeadsUpDisplay from "./HUD";
import useParticles from "./useParticles";

const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  const [particlesInitialized, setParticlesInitialized] =
    useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const windowSize = useWindowSize();

  // Particles data
  const initialParticleCount = 10;
  const particles = useParticles(initialParticleCount);

  // State for HUD
  const [totalParticles, setTotalParticles] = useState<number | null>(null);
  const [drawQuadtree, setDrawQuadtree] = useState<boolean>(false);

  // Handle clicks by creating a particle
  const handleClick = (event: React.MouseEvent) => {
    if (canvasRef.current) {
      // Get mouse position on canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.round(event.clientX - rect.left);
      const y = Math.round(event.clientY - rect.top);

      // Add the particle to particles data
      particles.addParticles([
        {
          x,
          y,
          vx: 0,
          vy: 0,
          m: 1,
          r: Math.round(Math.random() * 19 + 1),
          color: {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
            a: 255,
          },
        },
      ]);

      // Update total particles state
      setTotalParticles((prev) => (prev ? prev + 1 : 1 + initialParticleCount));
    }
  };

  // Initialize canvas
  useEffect(() => {
    // Set canvas context ref
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      setCanvasInitialized(true);
      console.log("Canvas intialized.");
    }
  }, []);

  // Initialize particle data
  useEffect(() => {
    if (canvasInitialized && !particlesInitialized && canvasRef.current) {
      // Randomize particle data
      particles.randomize(canvasRef.current.width, canvasRef.current.height);
      setParticlesInitialized(true);
    }
  }, [canvasInitialized, particles, particlesInitialized]);

  // Define animation loop
  const animationLoop = useCallback(() => {
    if (!canvasRef.current || !contextRef.current) return;

    animate({
      particles,
      canvasWidth: canvasRef.current.width,
      canvasHeight: canvasRef.current.height,
      ctx: contextRef.current,
      drawQuadtree,
    });

    animationFrameRef.current = requestAnimationFrame(() => {
      animationLoop();
    });
  }, [drawQuadtree, particles]);

  // Start the animation if canvas is initialized
  useEffect(() => {
    if (canvasInitialized && particlesInitialized) {
      // Start animation loop with requestAnimationFrame
      animationLoop();
      console.log("Animation started.");
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationLoop, canvasInitialized, particlesInitialized]);

  return (
    <div className="relative">
      <canvas
        onClick={handleClick}
        height={windowSize.height}
        width={windowSize.width}
        className="bg-black"
        ref={canvasRef}
      ></canvas>
      <HeadsUpDisplay
        totalParticles={totalParticles}
        setDrawQuadtree={setDrawQuadtree}
      />
    </div>
  );
};

export default SimCanvas;
