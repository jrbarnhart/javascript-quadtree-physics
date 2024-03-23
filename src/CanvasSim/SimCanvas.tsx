import { useCallback, useEffect, useRef, useState } from "react";
import createParticle from "./createParticle";
import animate from "./animate";
import useWindowSize from "./useWindowSize";
import HeadsUpDisplay from "./HUD";
import _ from "lodash";

const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const windowSize = useWindowSize();

  // Array buffer for particle data
  // x, y, vx, vy, m, r are float32 and colorRGB is four int8 for a total of 28 bytes / particle
  const initialParticleCount = 100;
  const particleData = useRef<ArrayBuffer>(
    new ArrayBuffer(initialParticleCount * 28)
  );

  // State for HUD stats
  const [mousePosX, setMousePosX] = useState<number | null>(null);
  const [mousePosY, setMousePosY] = useState<number | null>(null);
  const [totalParticles, setTotalParticles] = useState<number | null>(null);

  // State for toggling rect draws
  const [drawQuadtree, setDrawQuadtree] = useState<boolean>(false);

  const throttleRef = useRef(
    _.throttle((event: React.MouseEvent) => {
      setMousePosX(event.clientX);
      setMousePosY(event.clientY);
    }, 200)
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    throttleRef.current(event);
  }, []);

  // Define animation loop
  const animationLoop = useCallback(
    (particleData: ArrayBuffer) => {
      if (!canvasRef.current || !contextRef.current) return;

      animate({
        particleData,
        canvasWidth: canvasRef.current.width,
        canvasHeight: canvasRef.current.height,
        ctx: contextRef.current,
        drawQuadtree,
      });

      animationFrameRef.current = requestAnimationFrame(() => {
        animationLoop(particleData);
      });
    },
    [drawQuadtree]
  );

  // Handle clicks by creating a particle with random properties
  const handleClick = (event: React.MouseEvent) => {
    if (canvasRef.current) {
      // Get mouse position on canvas
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (let i = 0; i <= 10; i++) {
        // Create random particle with x and y
        const newParticle = createParticle({
          x: x + Math.random() * 100 - 50,
          y: y + Math.random() * 100 - 50,
          vx: 0,
          vy: 0,
          mass: 100,
          radius: 2,
          color: "yellow",
        });

        // Add it to particles arraye
      }

      // Update total particles state
      setTotalParticles((prev) => (prev ? prev + 10 : 10));
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
      animationLoop(particleData.current);
      console.log("Animation started.");
    }
  }, [animationLoop, canvasInitialized]);

  return (
    <div className="relative">
      <canvas
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        height={windowSize.height}
        width={windowSize.width}
        className="bg-black"
        ref={canvasRef}
      ></canvas>
      <HeadsUpDisplay
        mousePosX={mousePosX}
        mousePosY={mousePosY}
        totalParticles={totalParticles}
        setDrawQuadtree={setDrawQuadtree}
      />
    </div>
  );
};

export default SimCanvas;
