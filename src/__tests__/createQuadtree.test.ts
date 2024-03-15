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

  test("returns northwest child of root when tree has depth of 1", () => {
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

  test("returns fist node on maximum depth tree", () => {
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

  test("returns fist node on maximum depth tree when node located in SE part of space", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticleA = createParticle({
      x: 1021,
      y: 1021,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticleB = createParticle({
      x: 1023,
      y: 1023,
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
