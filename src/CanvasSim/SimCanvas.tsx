import { useEffect, useRef, useState } from "react";
import { ParticleInterface } from "./defs";
import createParticle from "./createParticle";

const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  const particles = useRef<ParticleInterface[]>([]);

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
        vx: 1,
        vy: 1,
        mass: 1,
        radius: 2,
        color: "yellow",
      });

      // Add it to particles array
      particles.current.push(newParticle);
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
      console.log("Animation started.");
    }
  }, [canvasInitialized]);

  return (
    <canvas
      onClick={handleClick}
      className="bg-black h-full w-full"
      ref={canvasRef}
    ></canvas>
  );
};

export default SimCanvas;
