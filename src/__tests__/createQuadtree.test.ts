import { describe, expect, test } from "vitest";
import {
  getChildForParticle,
  pruneEmptyNodes,
  subdivideNode,
} from "../CanvasSim/createQuadtree";
import {
  ParticleInterface,
  Quadtree,
  QuadtreeBoundary,
} from "../CanvasSim/defs";

describe("getChildForParticle", () => {
  // Children are counted in this order: NW, NE, SE, SW
  // 0 1
  // 3 2
  test("Returns proper child corresponding to the quadrant of parent the point is in", () => {
    // testRect is also used for child bounaries as they are irrelevant to test
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    // Mock quadtree and children
    const testChildNW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
    };
    // Mock particle
    const testParticleNW: ParticleInterface = {
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticleNE: ParticleInterface = {
      x: 75,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticleSE: ParticleInterface = {
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticleSW: ParticleInterface = {
      x: 25,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };

    const childNW = getChildForParticle(testParticleNW, testTree);
    const childNE = getChildForParticle(testParticleNE, testTree);
    const childSE = getChildForParticle(testParticleSE, testTree);
    const childSW = getChildForParticle(testParticleSW, testTree);

    expect(childNW).toStrictEqual(testChildNW);
    expect(childNE).toStrictEqual(testChildNE);
    expect(childSE).toStrictEqual(testChildSE);
    expect(childSW).toStrictEqual(testChildSW);
  });
});

describe("subdivideNode", () => {
  test("Node with children will not be subdivided", () => {
    // testRect is also used for child bounaries as they are irrelevant to test
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    // Mock quadtree and children
    const testChildNW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
    };

    subdivideNode(testTree);

    expect(testTree.children[0]).toStrictEqual(testChildNW);
    expect(testTree.children[1]).toStrictEqual(testChildNE);
    expect(testTree.children[2]).toStrictEqual(testChildSE);
    expect(testTree.children[3]).toStrictEqual(testChildSW);
  });

  test("Node with no children will have four child trees added to it", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };

    subdivideNode(testTree);

    expect(testTree.children.length).toBe(4);
    expect(testTree.children[0]).toHaveProperty("particles", []);
    expect(testTree.children[1]).toHaveProperty("particles", []);
    expect(testTree.children[2]).toHaveProperty("particles", []);
    expect(testTree.children[3]).toHaveProperty("particles", []);
  });

  test("Node's new children have correct boundaries", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 200,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };

    subdivideNode(testTree);

    expect(testTree.children[0].boundary).toStrictEqual({
      x: 0,
      y: 0,
      width: 50,
      height: 100,
    });
    expect(testTree.children[1].boundary).toStrictEqual({
      x: 50,
      y: 0,
      width: 50,
      height: 100,
    });
    expect(testTree.children[2].boundary).toStrictEqual({
      x: 50,
      y: 100,
      width: 50,
      height: 100,
    });
    expect(testTree.children[3].boundary).toStrictEqual({
      x: 0,
      y: 100,
      width: 50,
      height: 100,
    });
  });
});

describe("pruneEmptyNodes", () => {
  test("Removes empty direct children of node", () => {
    // testRect is also used for child bounaries as they are irrelevant to test
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    // Mock quadtree and children
    const testChildNW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
    };

    pruneEmptyNodes(testTree);

    expect(testTree.children.length).toBe(0);
  });
});
