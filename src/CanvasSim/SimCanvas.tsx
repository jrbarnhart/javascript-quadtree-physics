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
  const initialParticleCount = 10;
  const particleBuffer = useRef<ArrayBuffer>(
    new ArrayBuffer(initialParticleCount * 28)
  );
  // Data view for interacting with buffer
  const particleData = useRef<DataView>(new DataView(particleBuffer.current));

  // State for HUD
  const [mousePosX, setMousePosX] = useState<number | null>(null);
  const [mousePosY, setMousePosY] = useState<number | null>(null);
  const [totalParticles, setTotalParticles] = useState<number | null>(null);

  // State for toggling rect draws
  const [drawQuadtree, setDrawQuadtree] = useState<boolean>(false);

  // Handle mouse move by updating overlay with mouse position
  const throttleRef = useRef(
    _.throttle((event: React.MouseEvent) => {
      setMousePosX(event.clientX);
      setMousePosY(event.clientY);
    }, 200)
  );

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    throttleRef.current(event);
  }, []);

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

  // Initialize canvas
  useEffect(() => {
    // Set canvas context ref
    if (canvasRef.current) {
      contextRef.current = canvasRef.current.getContext("2d");
      setCanvasInitialized(true);

      // Randomize particle data
      for (let i = 0; i < initialParticleCount; i++) {
        const x = Math.random() * canvasRef.current.width;
        const y = Math.random() * canvasRef.current.height;
        const vx = Math.random() * 2 - 1;
        const vy = Math.random() * 2 - 1;
        const m = 1;
        const r = Math.random() * 20 + 1;
        const colorR = Math.random() * 255;
        const colorG = Math.random() * 255;
        const colorB = Math.random() * 255;
        const colorA = 255;

        // Each particle has 7 properties
        const index = i * 7;

        particleData.current.setFloat32(index, x);
        particleData.current.setFloat32(index + 1, y);
        particleData.current.setFloat32(index + 2, vx);
        particleData.current.setFloat32(index + 3, vy);
        particleData.current.setFloat32(index + 4, m);
        particleData.current.setFloat32(index + 5, r);
        particleData.current.setInt8(index + 6, colorR);
        particleData.current.setInt8(index + 7, colorG);
        particleData.current.setInt8(index + 8, colorB);
        particleData.current.setInt8(index + 9, colorA);
      }
      console.log("Canvas intialized.");
    }
  }, []);

  // Define animation loop
  const animationLoop = useCallback(() => {
    if (!canvasRef.current || !contextRef.current) return;

    animate({
      particleData: particleData.current,
      canvasWidth: canvasRef.current.width,
      canvasHeight: canvasRef.current.height,
      ctx: contextRef.current,
      drawQuadtree,
    });

    animationFrameRef.current = requestAnimationFrame(() => {
      animationLoop();
    });
  }, [drawQuadtree]);

  // Start the animation if canvas is initialized
  useEffect(() => {
    if (canvasInitialized) {
      // Start animation loop with requestAnimationFrame
      animationLoop();
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
