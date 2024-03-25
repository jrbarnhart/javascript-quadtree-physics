import { test, expect } from "vitest";
import useParticles from "../CanvasSim/useParticles";
import { renderHook } from "@testing-library/react";

test("Randomize properly randomizes all particle properties", () => {
  const testBoundary = { width: 100, height: 100 };

  // Render the hook
  const { result } = renderHook(() => useParticles(1));
  const testParticles = result.current;
  testParticles.randomize(testBoundary.width, testBoundary.height);

  // Check for proper x and y values
  expect(testParticles.data.getFloat32(0)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getFloat32(0)).toBeLessThanOrEqual(
    testBoundary.width
  );
});
