import { describe, expect, test, vi } from "vitest";
import createQuadtree from "../CanvasSim/createQuadtree";
import createRectangle from "../CanvasSim/createRectangle";
import createParticle from "../CanvasSim/createParticle";

describe("findFirstLeafPoints", () => {
  test("returns null if no points or child nodes", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);

    expect(testTree.findFirstLeafPoints()).toBe(null);
  });

  test("returns root particles if no nodes but does have points", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticle1 = createParticle({
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    testTree.insert(testParticle1);

    expect(testTree.findFirstLeafPoints()).toStrictEqual([testParticle1]);
  });

  test("returns first leaf particles when tree has depth of 1", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticle1 = createParticle({
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);

    expect(testTree.findFirstLeafPoints()).toStrictEqual([testParticle1]);
  });

  test("returns first leaf particles when tree has points in multiple quadrants", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticle1 = createParticle({
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: 75,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle3 = createParticle({
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle4 = createParticle({
      x: 25,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);
    testTree.insert(testParticle3);
    testTree.insert(testParticle4);

    expect(testTree.findFirstLeafPoints()).toStrictEqual([testParticle1]);
  });

  test("returns first leaf particles on maximum depth tree", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticle1 = createParticle({
      x: 1,
      y: 1,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: 3,
      y: 3,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);

    expect(testTree.findFirstLeafPoints()).toStrictEqual([
      testParticle1,
      testParticle2,
    ]);
  });

  test("returns first leaf particles on maximum depth tree when node located in SE", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    const testParticle1 = createParticle({
      x: 1019,
      y: 1019,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: 1020,
      y: 1020,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    // Put particles in NW and SE quadrants to cause one subdivision
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);

    expect(testTree.findFirstLeafPoints()).toStrictEqual([
      testParticle1,
      testParticle2,
    ]);
  });
});

describe("gravity", () => {
  test("returns when quadtree is empty", () => {
    // Mocking a tree for 100x100 space
    const initialBoundary = createRectangle(50, 50, 100, 100);
    const testTree = createQuadtree(initialBoundary, 1);
    const gravitySpy = vi.spyOn(testTree, "gravity");
    testTree.gravity();
    expect(gravitySpy).toHaveReturnedTimes(1);
    gravitySpy.mockRestore();
  });

  test("applies gravity between queryNode's own particles in the right direction", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    // Create and insert particles that will be placed in same smallest subdivision
    const p1x = 1;
    const p1y = 1;
    const p2x = 3;
    const p2y = 3;
    const testParticle1 = createParticle({
      x: p1x,
      y: p1y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: p2x,
      y: p2y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);

    // Apply gravity to quad tree particles
    testTree.gravity();

    // Expect particles to have moved closer together
    expect(testParticle1.x).toBeGreaterThan(p1x);
    expect(testParticle1.y).toBeGreaterThan(p1y);
    expect(testParticle2.x).toBeLessThan(p2x);
    expect(testParticle2.y).toBeLessThan(p2y);
  });

  test("applies gravity between particles in two far nodes", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    // Create and insert particles that will be placed in same smallest subdivision
    const p1x = 1;
    const p1y = 1;
    const p2x = 1023;
    const p2y = 1023;
    const testParticle1 = createParticle({
      x: p1x,
      y: p1y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: p2x,
      y: p2y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);

    // Apply gravity to quad tree particles
    testTree.gravity();

    // Expect particles to have moved closer together
    expect(testParticle1.x).toBeGreaterThan(p1x);
    expect(testParticle1.y).toBeGreaterThan(p1y);
    expect(testParticle2.x).toBeLessThan(p2x);
    expect(testParticle2.y).toBeLessThan(p2y);
  });

  test("applies gravity between particles in two close nodes", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    // Create and insert particles that will be placed in same smallest subdivision
    const p1x = 1;
    const p1y = 1;
    const p2x = 5;
    const p2y = 5;
    const testParticle1 = createParticle({
      x: p1x,
      y: p1y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: p2x,
      y: p2y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);

    // Apply gravity to quad tree particles
    testTree.gravity();

    // Expect particles to have moved closer together
    expect(testParticle1.x).toBeGreaterThan(p1x);
    expect(testParticle1.y).toBeGreaterThan(p1y);
    expect(testParticle2.x).toBeLessThan(p2x);
    expect(testParticle2.y).toBeLessThan(p2y);
  });

  test("applies gravity between particles in four close nodes", () => {
    // Mocking a tree for 1024x1024 space for even subdivision size with smallest size being 4x4
    const initialBoundary = createRectangle(512, 512, 1024, 1024);
    const testTree = createQuadtree(initialBoundary, 1);
    // Create and insert particles that will be placed in same smallest subdivision
    const p1x = 1;
    const p1y = 1;
    const p2x = 1023;
    const p2y = 1;
    const p3x = 1023;
    const p3y = 1023;
    const p4y = 1023;
    const p4x = 1;
    const testParticle1 = createParticle({
      x: p1x,
      y: p1y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle2 = createParticle({
      x: p2x,
      y: p2y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle3 = createParticle({
      x: p3x,
      y: p3y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    const testParticle4 = createParticle({
      x: p4x,
      y: p4y,
      vx: 0,
      vy: 0,
      mass: 10,
      radius: 2,
      color: "yellow",
    });
    testTree.insert(testParticle1);
    testTree.insert(testParticle2);
    testTree.insert(testParticle3);
    testTree.insert(testParticle4);

    // Apply gravity to quad tree particles
    testTree.gravity();

    // Expect particles to have moved closer together
    expect(testParticle1.x).toBeGreaterThan(p1x);
    expect(testParticle1.y).toBeGreaterThan(p1y);
    expect(testParticle2.x).toBeLessThan(p2x);
    expect(testParticle2.y).toBeLessThan(p2y);
  });
});
