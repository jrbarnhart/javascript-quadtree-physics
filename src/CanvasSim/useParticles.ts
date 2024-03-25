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

  const particleDataBytes = 24;
  const particleColorBytes = 4;

  const particleData = useRef<Float32Array>(
    new Float32Array(particleCount * particleDataBytes)
  );
  const particleColorData = useRef<Uint8Array>(
    new Uint8Array(particleCount * particleColorBytes)
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
      const dataIndex = i * particleDataBytes;
      const colorIndex = i * particleColorBytes;

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
  const addParticles = (particles: Particle[]) => {
    // Create typed arrays and set old data
    const newParticleData = new Float32Array(
      particleData.current.length + particles.length * particleDataBytes
    );
    newParticleData.set(particleData.current, 0);
    const newParticleColorData = new Uint8Array(
      particleColorData.current.length + particles.length * particleColorBytes
    );
    newParticleColorData.set(particleColorData.current, 0);

    // Add new data
    for (let i = 0; i < particles.length; i++) {
      // Set indexes for typed arrays
      const dataIndex = i * particleDataBytes + particleData.current.length;
      const colorIndex = i * particleColorBytes + particleData.current.length;

      newParticleData[dataIndex + xI] = particles[i].x;
      newParticleData[dataIndex + yI] = particles[i].y;
      newParticleData[dataIndex + vxI] = particles[i].vx;
      newParticleData[dataIndex + vyI] = particles[i].vy;
      newParticleData[dataIndex + mI] = particles[i].m;
      newParticleData[dataIndex + rI] = particles[i].r;

      newParticleColorData[colorIndex] = particles[i].color.r;
      newParticleColorData[colorIndex + 1] = particles[i].color.g;
      newParticleColorData[colorIndex + 2] = particles[i].color.b;
      newParticleColorData[colorIndex + 3] = particles[i].color.a;
    }

    // Update the refs
    particleData.current = newParticleData;
    particleColorData.current = newParticleColorData;
  };

  const particles = {
    data: particleData.current,
    colors: particleColorData.current,
    addParticles,
    randomize,
  };
  return particles;
};

export default useParticles;
