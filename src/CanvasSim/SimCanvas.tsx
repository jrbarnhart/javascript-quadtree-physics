import { useEffect, useRef, useState } from "react";

const SimCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasInitialized, setCanvasInitialized] = useState<boolean>(false);

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

  return <canvas className="bg-black h-full w-full" ref={canvasRef}></canvas>;
};

export default SimCanvas;
