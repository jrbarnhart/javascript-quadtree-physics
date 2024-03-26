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
});
