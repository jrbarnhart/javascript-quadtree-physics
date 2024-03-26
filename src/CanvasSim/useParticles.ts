import { useRef } from "react";
import { Particle } from "./defs";

const useParticles = (particleCount: number) => {
  // x, y, vx, vy, m, r are float32 for a total of 24 bytes / particle
  // colorRGB is four Uint8s for a total of 4 bytes / particle

  const particleDataElements = 6;
  const particleColorElements = 4;

  const particleData = useRef<Float32Array>(
    new Float32Array(particleCount * particleDataElements)
  );
  const particleColorData = useRef<Uint8Array>(
    new Uint8Array(particleCount * particleColorElements)
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
      const dataIndex = i * particleDataElements;
      const colorIndex = i * particleColorElements;

      particleData.current[dataIndex] = x;
      particleData.current[dataIndex + 1] = y;
      particleData.current[dataIndex + 2] = vx;
      particleData.current[dataIndex + 3] = vy;
      particleData.current[dataIndex + 4] = m;
      particleData.current[dataIndex + 5] = r;

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
      particleData.current.length + particles.length * particleDataElements
    );
    newParticleData.set(particleData.current, 0);
    const newParticleColorData = new Uint8Array(
      particleColorData.current.length +
        particles.length * particleColorElements
    );
    newParticleColorData.set(particleColorData.current, 0);

    // Add new data
    for (let i = 0; i < particles.length; i++) {
      // Set indexes for typed arrays
      const dataIndex = i * particleDataElements + particleData.current.length;
      const colorIndex =
        i * particleColorElements + particleColorData.current.length;

      newParticleData[dataIndex] = particles[i].x;
      newParticleData[dataIndex + 1] = particles[i].y;
      newParticleData[dataIndex + 2] = particles[i].vx;
      newParticleData[dataIndex + 3] = particles[i].vy;
      newParticleData[dataIndex + 4] = particles[i].m;
      newParticleData[dataIndex + 5] = particles[i].r;

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
    dataElements: particleDataElements,
    colorElements: particleColorElements,
    addParticles,
    randomize,
  };
  return particles;
};

export default useParticles;
