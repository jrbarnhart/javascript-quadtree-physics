import { describe, test, expect } from "vitest";
import useParticles from "../CanvasSim/useParticles";
import { renderHook } from "@testing-library/react";
import { Particle } from "../CanvasSim/defs";

const dataElements = 6;
const colorElements = 4;

describe("randomize", () => {
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
    expect(testParticles.data[0]).toBeGreaterThanOrEqual(0);
    expect(testParticles.data[0]).toBeLessThanOrEqual(testWidth);
    expect(testParticles.data[1]).toBeGreaterThanOrEqual(0);
    expect(testParticles.data[1]).toBeLessThanOrEqual(testHeight);
    // vx, vy
    expect(testParticles.data[2]).toBeLessThanOrEqual(1);
    expect(testParticles.data[2]).toBeGreaterThanOrEqual(-1);
    expect(testParticles.data[3]).toBeLessThanOrEqual(1);
    expect(testParticles.data[3]).toBeGreaterThanOrEqual(-1);
    // m
    expect(testParticles.data[4]).toBeGreaterThanOrEqual(1);
    expect(testParticles.data[4]).toBeLessThanOrEqual(100);
    // r
    expect(testParticles.data[5]).toBeGreaterThanOrEqual(1);
    expect(testParticles.data[5]).toBeLessThanOrEqual(20);
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
    expect(testParticles.data[dataElements * 50]).toBeGreaterThanOrEqual(0);
    expect(testParticles.data[dataElements * 50]).toBeLessThanOrEqual(
      testWidth
    );
    expect(testParticles.data[1 + dataElements * 50]).toBeGreaterThanOrEqual(0);
    expect(testParticles.data[1 + dataElements * 50]).toBeLessThanOrEqual(
      testHeight
    );
    // vx, vy
    expect(testParticles.data[2 + dataElements * 50]).toBeLessThanOrEqual(1);
    expect(testParticles.data[2 + dataElements * 50]).toBeGreaterThanOrEqual(
      -1
    );
    expect(testParticles.data[3 + dataElements * 50]).toBeLessThanOrEqual(1);
    expect(testParticles.data[3 + dataElements * 50]).toBeGreaterThanOrEqual(
      -1
    );
    // m
    expect(testParticles.data[4 + dataElements * 50]).toBeGreaterThanOrEqual(1);
    expect(testParticles.data[4 + dataElements * 50]).toBeLessThanOrEqual(100);
    // r
    expect(testParticles.data[5 + dataElements * 50]).toBeGreaterThanOrEqual(1);
    expect(testParticles.data[5 + dataElements * 50]).toBeLessThanOrEqual(20);

    // colorRGBA
    expect(testParticles.colors[0 + colorElements * 50]).toBeGreaterThanOrEqual(
      0
    );
    expect(testParticles.colors[0 + colorElements * 50]).toBeLessThanOrEqual(
      255
    );
    expect(testParticles.colors[1 + colorElements * 50]).toBeGreaterThanOrEqual(
      0
    );
    expect(testParticles.colors[1 + colorElements * 50]).toBeLessThanOrEqual(
      255
    );
    expect(testParticles.colors[2 + colorElements * 50]).toBeGreaterThanOrEqual(
      0
    );
    expect(testParticles.colors[2 + colorElements * 50]).toBeLessThanOrEqual(
      255
    );
    expect(testParticles.colors[3 + colorElements * 50]).toBeGreaterThanOrEqual(
      0
    );
    expect(testParticles.colors[3 + colorElements * 50]).toBeLessThanOrEqual(
      255
    );
  });
});

describe("addParticles", () => {
  test("New typed arrays are proper length", () => {
    // Render the hook
    const { result, rerender } = renderHook(() => useParticles(0));

    const testParticle: Particle = {
      x: 10,
      y: 10,
      vx: 1,
      vy: 1,
      m: 50,
      r: 10,
      color: { r: 255, g: 0, b: 0, a: 255 },
    };

    result.current.addParticles([testParticle]);
    rerender();

    expect(result.current.data.length).toBe(dataElements);
    expect(result.current.colors.length).toBe(colorElements);
  });

  test("New typed arrays are proper length after multiple additions", () => {
    // Render the hook
    const { result, rerender } = renderHook(() => useParticles(0));

    const testParticle: Particle = {
      x: 10,
      y: 10,
      vx: 1,
      vy: 1,
      m: 50,
      r: 10,
      color: { r: 255, g: 0, b: 0, a: 255 },
    };

    result.current.addParticles([testParticle]);
    rerender();
    result.current.addParticles([testParticle]);
    rerender();
    result.current.addParticles([testParticle]);
    rerender();

    expect(result.current.data.length).toBe(dataElements * 3);
    expect(result.current.colors.length).toBe(colorElements * 3);
  });

  test("New typed arrays are proper length with existing data", () => {
    // Render the hook
    const { result, rerender } = renderHook(() => useParticles(10));

    const testParticle: Particle = {
      x: 10,
      y: 10,
      vx: 1,
      vy: 1,
      m: 50,
      r: 10,
      color: { r: 255, g: 0, b: 0, a: 255 },
    };

    result.current.addParticles([testParticle]);
    rerender();

    expect(result.current.data.length).toBe(dataElements * 11);
    expect(result.current.colors.length).toBe(colorElements * 11);
  });

  test("New typed arrays have proper data", () => {
    // Render the hook
    const { result, rerender } = renderHook(() => useParticles(0));

    const testParticle: Particle = {
      x: 10,
      y: 15,
      vx: 1,
      vy: -1,
      m: 50,
      r: 5,
      color: { r: 255, g: 155, b: 0, a: 75 },
    };

    result.current.addParticles([testParticle]);
    rerender();

    expect(result.current.data[0]).toBe(10);
    expect(result.current.data[1]).toBe(15);
    expect(result.current.data[2]).toBe(1);
    expect(result.current.data[3]).toBe(-1);
    expect(result.current.data[4]).toBe(50);
    expect(result.current.data[5]).toBe(5);

    expect(result.current.colors[0]).toBe(255);
    expect(result.current.colors[1]).toBe(155);
    expect(result.current.colors[2]).toBe(0);
    expect(result.current.colors[3]).toBe(75);
  });

  test("New typed arrays have proper data with old data preserved", () => {
    // Render the hook
    const { result, rerender } = renderHook(() => useParticles(10));

    const testParticle: Particle = {
      x: 10,
      y: 15,
      vx: 1,
      vy: -1,
      m: 50,
      r: 5,
      color: { r: 255, g: 155, b: 0, a: 75 },
    };

    result.current.addParticles([testParticle]);
    rerender();
    result.current.addParticles([testParticle]);
    rerender();

    // 10th particle
    expect(result.current.data[0 + 9 * dataElements]).toBe(0);
    expect(result.current.data[1 + 9 * dataElements]).toBe(0);
    expect(result.current.data[2 + 9 * dataElements]).toBe(0);
    expect(result.current.data[3 + 9 * dataElements]).toBe(0);
    expect(result.current.data[4 + 9 * dataElements]).toBe(0);
    expect(result.current.data[5 + 9 * dataElements]).toBe(0);
    expect(result.current.colors[0 + 9 * colorElements]).toBe(0);
    expect(result.current.colors[1 + 9 * colorElements]).toBe(0);
    expect(result.current.colors[2 + 9 * colorElements]).toBe(0);
    expect(result.current.colors[3 + 9 * colorElements]).toBe(0);
    // 11th particle
    expect(result.current.data[0 + 10 * dataElements]).toBe(10);
    expect(result.current.data[1 + 10 * dataElements]).toBe(15);
    expect(result.current.data[2 + 10 * dataElements]).toBe(1);
    expect(result.current.data[3 + 10 * dataElements]).toBe(-1);
    expect(result.current.data[4 + 10 * dataElements]).toBe(50);
    expect(result.current.data[5 + 10 * dataElements]).toBe(5);
    expect(result.current.colors[0 + 10 * colorElements]).toBe(255);
    expect(result.current.colors[1 + 10 * colorElements]).toBe(155);
    expect(result.current.colors[2 + 10 * colorElements]).toBe(0);
    expect(result.current.colors[3 + 10 * colorElements]).toBe(75);
    // 12th particle
    expect(result.current.data[0 + 11 * dataElements]).toBe(10);
    expect(result.current.data[1 + 11 * dataElements]).toBe(15);
    expect(result.current.data[2 + 11 * dataElements]).toBe(1);
    expect(result.current.data[3 + 11 * dataElements]).toBe(-1);
    expect(result.current.data[4 + 11 * dataElements]).toBe(50);
    expect(result.current.data[5 + 11 * dataElements]).toBe(5);
    expect(result.current.colors[0 + 11 * colorElements]).toBe(255);
    expect(result.current.colors[1 + 11 * colorElements]).toBe(155);
    expect(result.current.colors[2 + 11 * colorElements]).toBe(0);
    expect(result.current.colors[3 + 11 * colorElements]).toBe(75);
  });

  test("Multiple particles are added properly", () => {
    // Render the hook
    const { result, rerender } = renderHook(() => useParticles(0));

    const testParticle: Particle = {
      x: 10,
      y: 15,
      vx: 1,
      vy: -1,
      m: 50,
      r: 5,
      color: { r: 255, g: 155, b: 0, a: 75 },
    };

    result.current.addParticles([testParticle, testParticle, testParticle]);
    rerender();

    // 1st particle
    expect(result.current.data[0]).toBe(10);
    expect(result.current.data[1]).toBe(15);
    expect(result.current.data[2]).toBe(1);
    expect(result.current.data[3]).toBe(-1);
    expect(result.current.data[4]).toBe(50);
    expect(result.current.data[5]).toBe(5);
    expect(result.current.colors[0]).toBe(255);
    expect(result.current.colors[1]).toBe(155);
    expect(result.current.colors[2]).toBe(0);
    expect(result.current.colors[3]).toBe(75);
    // 2nd particle
    expect(result.current.data[0 + 1 * dataElements]).toBe(10);
    expect(result.current.data[1 + 1 * dataElements]).toBe(15);
    expect(result.current.data[2 + 1 * dataElements]).toBe(1);
    expect(result.current.data[3 + 1 * dataElements]).toBe(-1);
    expect(result.current.data[4 + 1 * dataElements]).toBe(50);
    expect(result.current.data[5 + 1 * dataElements]).toBe(5);
    expect(result.current.colors[0 + 1 * colorElements]).toBe(255);
    expect(result.current.colors[1 + 1 * colorElements]).toBe(155);
    expect(result.current.colors[2 + 1 * colorElements]).toBe(0);
    expect(result.current.colors[3 + 1 * colorElements]).toBe(75);
    // 3rd particle
    expect(result.current.data[0 + 2 * dataElements]).toBe(10);
    expect(result.current.data[1 + 2 * dataElements]).toBe(15);
    expect(result.current.data[2 + 2 * dataElements]).toBe(1);
    expect(result.current.data[3 + 2 * dataElements]).toBe(-1);
    expect(result.current.data[4 + 2 * dataElements]).toBe(50);
    expect(result.current.data[5 + 2 * dataElements]).toBe(5);
    expect(result.current.colors[0 + 2 * colorElements]).toBe(255);
    expect(result.current.colors[1 + 2 * colorElements]).toBe(155);
    expect(result.current.colors[2 + 2 * colorElements]).toBe(0);
    expect(result.current.colors[3 + 2 * colorElements]).toBe(75);
  });
});
