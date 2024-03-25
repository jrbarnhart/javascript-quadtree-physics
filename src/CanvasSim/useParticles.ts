import { useRef } from "react";

const useParticles = (
  canvasWidth: number,
  canvasHeight: number,
  particleCount: number
) => {
  // Array buffer for particle data
  // x, y, vx, vy, m, r are float32 and colorRGB is four int8 for a total of 28 bytes / particle
  const particleBuffer = useRef<ArrayBuffer>(
    new ArrayBuffer(particleCount * 28)
  );

  // Data view for interacting with buffer
  const particleData = useRef<DataView>(new DataView(particleBuffer.current));

  // Method for randomizing particle data
  const randomize = () => {
    // Randomize particle data
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
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
      particleData.current.setFloat32(index + 4, y);
      particleData.current.setFloat32(index + 8, vx);
      particleData.current.setFloat32(index + 12, vy);
      particleData.current.setFloat32(index + 16, m);
      particleData.current.setFloat32(index + 20, r);
      particleData.current.setUint8(index + 24, colorR);
      particleData.current.setUint8(index + 26, colorB);
      particleData.current.setUint8(index + 25, colorG);
      particleData.current.setUint8(index + 27, colorA);
    }
  };

  const particles = { data: particleData, randomize };
  return particles;
};

export default useParticles;
