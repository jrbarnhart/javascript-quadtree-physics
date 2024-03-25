import { useRef } from "react";

const useParticles = (particleCount: number) => {
  // x, y, vx, vy, m, r are float32 and colorRGB is four int8 for a total of 28 bytes / particle
  const xI = 0;
  const yI = 4;
  const vxI = 8;
  const vyI = 12;
  const mI = 16;
  const rI = 20;
  const colorRI = 24;
  const colorGI = 25;
  const colorBI = 26;
  const colorAI = 27;

  const particleBuffer = useRef<ArrayBuffer>(
    new ArrayBuffer(particleCount * 28)
  );

  // Data view for interacting with buffer
  const particleData = useRef<DataView>(new DataView(particleBuffer.current));

  // Method for randomizing particle data
  const randomize = (canvasWidth: number, canvasHeight: number) => {
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

      particleData.current.setFloat32(index + xI, x);
      particleData.current.setFloat32(index + yI, y);
      particleData.current.setFloat32(index + vxI, vx);
      particleData.current.setFloat32(index + vyI, vy);
      particleData.current.setFloat32(index + mI, m);
      particleData.current.setFloat32(index + rI, r);
      particleData.current.setUint8(index + colorRI, colorR);
      particleData.current.setUint8(index + colorGI, colorB);
      particleData.current.setUint8(index + colorBI, colorG);
      particleData.current.setUint8(index + colorAI, colorA);
    }
  };

  const particles = { data: particleData.current, randomize };
  return particles;
};

export default useParticles;
