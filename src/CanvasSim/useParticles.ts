import { useRef } from "react";
import { Particle } from "./defs";

const useParticles = (particleCount: number) => {
  // x, y, vx, vy, m, r are float32 for a total of 24 bytes / particle
  // colorRGB is four Uint8s for a total of 4 bytes / particle
  const xI = 0;
  const yI = 4;
  const vxI = 8;
  const vyI = 12;
  const mI = 16;
  const rI = 20;

  const particleData = useRef<Float32Array>(
    new Float32Array(particleCount * 24)
  );
  const particleColorData = useRef<Uint8Array>(
    new Uint8Array(particleCount * 4)
  );

  // Method for randomizing particle data
  const randomize = (canvasWidth: number, canvasHeight: number) => {
    // Randomize particle data
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      const vx = Math.random() * 2 - 1;
      const vy = Math.random() * 2 - 1;
      const m = Math.random() * 99 + 1;
      const r = Math.random() * 19 + 1;
      const colorR = Math.random() * 255;
      const colorG = Math.random() * 255;
      const colorB = Math.random() * 255;
      const colorA = 255;

      // Set indexes for typed arrays
      const dataIndex = i * 24;
      const colorIndex = i * 4;

      particleData.current[dataIndex + xI] = x;
      particleData.current[dataIndex + yI] = y;
      particleData.current[dataIndex + vxI] = vx;
      particleData.current[dataIndex + vyI] = vy;
      particleData.current[dataIndex + mI] = m;
      particleData.current[dataIndex + rI] = r;

      particleColorData.current[colorIndex] = colorR;
      particleColorData.current[colorIndex + 1] = colorG;
      particleColorData.current[colorIndex + 2] = colorB;
      particleColorData.current[colorIndex + 3] = colorA;
    }
  };

  // Method for pushing new particle or particles
  const push = (particles: Particle | Particle[]) => {
    // Create new buffer based on old one plus extended data
    // Create new data view based on new buffer
    // Update the refs
  };

  const particles = {
    data: particleData.current,
    colors: particleColorData.current,
    randomize,
  };
  return particles;
};

export default useParticles;
