import { test, expect } from "vitest";
import useParticles from "../CanvasSim/useParticles";
import { renderHook } from "@testing-library/react";

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

test("Randomize properly randomizes all particle properties", () => {
  const testWidth = 100;
  const testHeight = 100;

  // Render the hook
  const { result } = renderHook(() => useParticles(1));
  const testParticles = result.current;
  testParticles.randomize(testWidth, testHeight);

  // x, y
  expect(testParticles.data.getFloat32(xI)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getFloat32(xI)).toBeLessThanOrEqual(testWidth);
  expect(testParticles.data.getFloat32(yI)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getFloat32(yI)).toBeLessThanOrEqual(testHeight);
  // vx, vy
  expect(testParticles.data.getFloat32(vxI)).toBeLessThanOrEqual(1);
  expect(testParticles.data.getFloat32(vxI)).toBeGreaterThanOrEqual(-1);
  expect(testParticles.data.getFloat32(vyI)).toBeLessThanOrEqual(1);
  expect(testParticles.data.getFloat32(vyI)).toBeGreaterThanOrEqual(-1);
  // m
  expect(testParticles.data.getFloat32(mI)).toBeGreaterThanOrEqual(1);
  expect(testParticles.data.getFloat32(mI)).toBeLessThanOrEqual(100);
  // r
  expect(testParticles.data.getFloat32(rI)).toBeGreaterThanOrEqual(1);
  expect(testParticles.data.getFloat32(rI)).toBeLessThanOrEqual(20);
  // colorRGBA
  expect(testParticles.data.getUint8(colorRI)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getUint8(colorRI)).toBeLessThanOrEqual(255);
  expect(testParticles.data.getUint8(colorGI)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getUint8(colorGI)).toBeLessThanOrEqual(255);
  expect(testParticles.data.getUint8(colorBI)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getUint8(colorBI)).toBeLessThanOrEqual(255);
  expect(testParticles.data.getUint8(colorAI)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getUint8(colorAI)).toBeLessThanOrEqual(255);
});
