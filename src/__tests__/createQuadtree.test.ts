import { describe, expect, test } from "vitest";
import {
  getChildForParticle,
  insertParticle,
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
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
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildNW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    testTree.children = [testChildNW, testChildNE, testChildSE, testChildSW];

    pruneEmptyNodes(testTree);

    expect(testTree.children.length).toBe(0);
  });

  test("Does not remove nodes with particles or children", () => {
    // testRect is also used for child bounaries as they are irrelevant to test
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    // Mock quadtree and children
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testGrandchild: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testParticle: ParticleInterface = {
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testChildNW: Quadtree = {
      particles: [testParticle],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [testGrandchild],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    testTree.children = [testChildNW, testChildNE, testChildSE, testChildSW];

    pruneEmptyNodes(testTree);

    expect(testTree.children.length).toBe(2);
  });

  test("Removes all empty descendants", () => {
    // testRect is also used for child bounaries as they are irrelevant to test
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    // Mock quadtree and children
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testParticle: ParticleInterface = {
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testChild1: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChild2: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChild3: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testChild4: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testGrandchild1: Quadtree = {
      particles: [testParticle],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testGrandchild2: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testGrandchild3: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testGrandchild4: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    testTree.children = [testChild1, testChild2, testChild3, testChild4];
    testChild1.children = [
      testGrandchild1,
      testGrandchild2,
      testGrandchild3,
      testGrandchild4,
    ];

    pruneEmptyNodes(testTree);

    expect(testTree.children.length).toBe(1);
    expect(testTree.children[0].children.length).toBe(1);
  });
});

describe("insertParticle", () => {
  test("Inserting particle to root correctly places particle in root", () => {
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testParticle: ParticleInterface = {
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };

    insertParticle(testParticle, testTree);

    expect(testTree.particles.length).toBe(1);
  });

  test("Inserting 2 particles to root correctly places particles in children", () => {
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testParticle1: ParticleInterface = {
      x: 25,
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle2: ParticleInterface = {
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };

    insertParticle(testParticle1, testTree);
    insertParticle(testParticle2, testTree);

    expect(testTree.children[0].particles.length).toBe(1);
    expect(testTree.children[2].particles.length).toBe(1);
  });

  test("Inserting particles to root correctly places particles in children and grandchildren", () => {
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
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
    };
    const testParticle1: ParticleInterface = {
      x: 3,
      y: 3,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle2: ParticleInterface = {
      x: 9,
      y: 3,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle3: ParticleInterface = {
      x: 9,
      y: 9,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle4: ParticleInterface = {
      x: 3,
      y: 9,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };

    insertParticle(testParticle1, testTree);
    insertParticle(testParticle2, testTree);
    insertParticle(testParticle3, testTree);
    insertParticle(testParticle4, testTree);

    expect(
      testTree.children[0].children[0].children[0].children[0].particles.length
    ).toBe(1);
    expect(
      testTree.children[0].children[0].children[0].children[1].particles.length
    ).toBe(1);
    expect(
      testTree.children[0].children[0].children[0].children[2].particles.length
    ).toBe(1);
    expect(
      testTree.children[0].children[0].children[0].children[3].particles.length
    ).toBe(1);
  });
});
