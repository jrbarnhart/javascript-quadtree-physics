import { expect, test } from "vitest";
import createQuadtree from "../CanvasSim/createQuadtree";
import createRectangle from "../CanvasSim/createRectangle";
import createParticle from "../CanvasSim/createParticle";

// findFirstLeaf helper fn
test("returns root quadTree if there are no nodes", () => {
  // Mocking a tree
  const initialBoundary = createRectangle(50, 50, 100, 100);
  const testTree = createQuadtree(initialBoundary, 1);
  const testParticleA = createParticle({
    x: 25,
    y: 25,
    vx: 0,
    vy: 0,
    mass: 10,
    radius: 2,
    color: "yellow",
  });
  testTree.insert(testParticleA);

  expect(testTree.findFirstLeaf()).toBe(testTree);
});
