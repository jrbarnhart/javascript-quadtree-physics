import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleInterface } from "./defs";
import createParticle from "./createParticle";
import animate from "./animate";
import useWindowSize from "./useWindowSize";
import HeadsUpDisplay from "./HUD";
import _ from "lodash";

const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  const particles = useRef<ParticleInterface[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const windowSize = useWindowSize();

  // State for HUD stats
  const [mousePosX, setMousePosX] = useState<number | null>(null);
  const [mousePosY, setMousePosY] = useState<number | null>(null);
  const [totalParticles, setTotalParticles] = useState<number | null>(null);

  const throttleRef = useRef(
    _.throttle((event: React.MouseEvent) => {
      setMousePosX(event.clientX);
      setMousePosY(event.clientY);
    }, 200)
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    throttleRef.current(event);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePosX(null);
    setMousePosY(null);
  }, []);

  // Define animation loop
  const animationLoop = useCallback((particles: ParticleInterface[]) => {
    if (!canvasRef.current || !contextRef.current) return;

    animate({
      particles,
      canvasWidth: canvasRef.current.width,
      canvasHeight: canvasRef.current.height,
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
      // Update total particles state
      setTotalParticles((prev) => (prev ? prev + 1 : 1));
    }
  };

  // Initialize canvas by setting context ref
  useEffect(() => {
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      setCanvasInitialized(true);
      console.log("Canvas intialized.");
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
    <div className="relative">
      <canvas
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        height={windowSize.height}
        width={windowSize.width}
        className="bg-black"
        ref={canvasRef}
      ></canvas>
      <HeadsUpDisplay
        mousePosX={mousePosX}
        mousePosY={mousePosY}
        totalParticles={totalParticles}
      />
    </div>
  );
};

export default SimCanvas;
