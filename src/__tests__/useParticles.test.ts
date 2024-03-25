import { test, expect } from "vitest";
import useParticles from "../CanvasSim/useParticles";
import { renderHook } from "@testing-library/react";

// x, y, vx, vy, m, r are float32 for a total of 24 bytes / particle
// colorRGB is four Uint8s for a total of 4 bytes / particle
const xI = 0;
const yI = 4;
const vxI = 8;
const vyI = 12;
const mI = 16;
const rI = 20;

test("Randomize properly randomizes particle properties", () => {
  const testWidth = 100;
  const testHeight = 100;

  // Render the hook
  const { result } = renderHook(() => useParticles(1));
  const testParticles = result.current;

  // Randomize twice to test for purity
  testParticles.randomize(testWidth, testHeight);
  testParticles.randomize(testWidth, testHeight);

  // x, y
  expect(testParticles.data[xI]).toBeGreaterThanOrEqual(0);
  expect(testParticles.data[xI]).toBeLessThanOrEqual(testWidth);
  expect(testParticles.data[yI]).toBeGreaterThanOrEqual(0);
  expect(testParticles.data[yI]).toBeLessThanOrEqual(testHeight);
  // vx, vy
  expect(testParticles.data[vxI]).toBeLessThanOrEqual(1);
  expect(testParticles.data[vxI]).toBeGreaterThanOrEqual(-1);
  expect(testParticles.data[vyI]).toBeLessThanOrEqual(1);
  expect(testParticles.data[vyI]).toBeGreaterThanOrEqual(-1);
  // m
  expect(testParticles.data[mI]).toBeGreaterThanOrEqual(1);
  expect(testParticles.data[mI]).toBeLessThanOrEqual(100);
  // r
  expect(testParticles.data[rI]).toBeGreaterThanOrEqual(1);
  expect(testParticles.data[rI]).toBeLessThanOrEqual(20);
  // colorRGBA
  expect(testParticles.colors[0]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[0]).toBeLessThanOrEqual(255);
  expect(testParticles.colors[1]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[1]).toBeLessThanOrEqual(255);
  expect(testParticles.colors[2]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[2]).toBeLessThanOrEqual(255);
  expect(testParticles.colors[3]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[3]).toBeLessThanOrEqual(255);
});

test("Randomize properly randomizes multiple particle properties", () => {
  const testWidth = 100;
  const testHeight = 100;

  // Render the hook
  const { result } = renderHook(() => useParticles(100));
  const testParticles = result.current;

  // Randomize twice to test for purity
  testParticles.randomize(testWidth, testHeight);
  testParticles.randomize(testWidth, testHeight);

  // 50th particle
  // x, y
  expect(testParticles.data[xI + 24 * 50]).toBeGreaterThanOrEqual(0);
  expect(testParticles.data[xI + 24 * 50]).toBeLessThanOrEqual(testWidth);
  expect(testParticles.data[yI + 24 * 50]).toBeGreaterThanOrEqual(0);
  expect(testParticles.data[yI + 24 * 50]).toBeLessThanOrEqual(testHeight);
  // vx, vy
  expect(testParticles.data[vxI + 24 * 50]).toBeLessThanOrEqual(1);
  expect(testParticles.data[vxI + 24 * 50]).toBeGreaterThanOrEqual(-1);
  expect(testParticles.data[vyI + 24 * 50]).toBeLessThanOrEqual(1);
  expect(testParticles.data[vyI + 24 * 50]).toBeGreaterThanOrEqual(-1);
  // m
  expect(testParticles.data[mI + 24 * 50]).toBeGreaterThanOrEqual(1);
  expect(testParticles.data[mI + 24 * 50]).toBeLessThanOrEqual(100);
  // r
  expect(testParticles.data[rI + 24 * 50]).toBeGreaterThanOrEqual(1);
  expect(testParticles.data[rI + 24 * 50]).toBeLessThanOrEqual(20);

  // colorRGBA
  expect(testParticles.colors[0 + 4 * 50]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[0 + 4 * 50]).toBeLessThanOrEqual(255);
  expect(testParticles.colors[1 + 4 * 50]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[1 + 4 * 50]).toBeLessThanOrEqual(255);
  expect(testParticles.colors[2 + 4 * 50]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[2 + 4 * 50]).toBeLessThanOrEqual(255);
  expect(testParticles.colors[3 + 4 * 50]).toBeGreaterThanOrEqual(0);
  expect(testParticles.colors[3 + 4 * 50]).toBeLessThanOrEqual(255);
});
