import { describe, expect, test } from "vitest";
import createQuadtree from "../CanvasSim/createQuadtree";
import createRectangle from "../CanvasSim/createRectangle";
import createParticle from "../CanvasSim/createParticle";

describe("findFirstLeaf", () => {
  test("returns null if no points or child nodes", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);

    expect(testTree.findFirstLeaf()).toBe(null);
  });

  test("returns root quadTree if no nodes but does have points", () => {
    // Mocking a tree for 100x100 space
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

  test("returns first leaf when tree has depth of 1", () => {
    // Mocking a tree for 100x100 space
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
    const testParticleB = createParticle({
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticleA);
    testTree.insert(testParticleB);

    expect(testTree.findFirstLeaf()).toBe(testTree.northwest);
  });

  test("returns first leaf when tree has points in multiple quadrants", () => {
    // Mocking a tree for 100x100 space
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
    const testParticleB = createParticle({
      x: 75,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticleC = createParticle({
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticleD = createParticle({
      x: 25,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticleA);
    testTree.insert(testParticleB);
    testTree.insert(testParticleC);
    testTree.insert(testParticleD);

    expect(testTree.findFirstLeaf()).toBe(testTree.northwest);
  });

  test("returns first leaf on maximum depth tree", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticleA = createParticle({
      x: 1,
      y: 1,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticleB = createParticle({
      x: 3,
      y: 3,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticleA);
    testTree.insert(testParticleB);

    expect(testTree.findFirstLeaf()).toBe(
      testTree.northwest?.northwest?.northwest?.northwest?.northwest?.northwest
        ?.northwest?.northwest
    );
  });

  test("returns first leaf on maximum depth tree when node located in SE", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticleA = createParticle({
      x: 1019,
      y: 1019,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticleB = createParticle({
      x: 1020,
      y: 1020,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticleA);
    testTree.insert(testParticleB);

    expect(testTree.findFirstLeaf()).toBe(
      testTree.southeast?.southeast?.southeast?.southeast?.southeast?.southeast
        ?.southeast?.northwest
    );
  });
});

describe("gravity", () => {
  test("returns when no leaf nodes remain unprocessed", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);

    expect(testTree.gravity).toHaveReturned;
  });
});
