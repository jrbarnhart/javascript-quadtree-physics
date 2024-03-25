import { test, expect } from "vitest";
import useParticles from "../CanvasSim/useParticles";

test("Randomize properly randomizes all particle properties", () => {
  const testBoundary = { width: 100, height: 100 };
  const testParticles = useParticles(1);
  testParticles.randomize(testBoundary.width, testBoundary.height);

  // Check for proper x and y values
  expect(testParticles.data.getFloat32(0)).toBeGreaterThanOrEqual(0);
  expect(testParticles.data.getFloat32(0)).toBeLessThanOrEqual(
    testBoundary.width
  );
});
