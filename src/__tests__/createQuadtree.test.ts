import { describe, expect, test } from "vitest";
import createQuadtree, {
  computeMass,
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
      treeForce: () => undefined,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
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
      treeForce: () => undefined,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testTree: Quadtree = {
      particles: [],
      children: [testChildNW, testChildNE, testChildSE, testChildSW],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
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
      treeForce: () => undefined,
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
      treeForce: () => undefined,
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
      treeForce: () => undefined,
    };
    const testChildNW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
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
      treeForce: () => undefined,
    };
    const testGrandchild: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
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
      treeForce: () => undefined,
    };
    const testChildNE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSE: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChildSW: Quadtree = {
      particles: [],
      children: [testGrandchild],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
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
      treeForce: () => undefined,
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
      treeForce: () => undefined,
    };
    const testChild2: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild3: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild4: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testGrandchild1: Quadtree = {
      particles: [testParticle],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testGrandchild2: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testGrandchild3: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testGrandchild4: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
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
      treeForce: () => undefined,
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
      treeForce: () => undefined,
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
      treeForce: () => undefined,
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

describe("computeMass", () => {
  test("Node with only one particle has mass and massC = particle", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
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
    const testTree: Quadtree = {
      particles: [testParticle],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };

    const { mass, massCenter } = computeMass(testTree);
    testTree.mass = mass;
    testTree.massCenter = massCenter;

    expect(testTree.mass).toBe(1);
    expect(testTree.massCenter).toStrictEqual({ x: 25, y: 25 });
  });

  test("Node mass and massTotal is total/weighted total of children's", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
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
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle3: ParticleInterface = {
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle4: ParticleInterface = {
      x: 25,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild1: Quadtree = {
      particles: [testParticle1],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild2: Quadtree = {
      particles: [testParticle2],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild3: Quadtree = {
      particles: [testParticle3],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild4: Quadtree = {
      particles: [testParticle4],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    testTree.children = [testChild1, testChild2, testChild3, testChild4];

    const { mass, massCenter } = computeMass(testTree);
    testTree.mass = mass;
    testTree.massCenter = massCenter;

    expect(testTree.mass).toBe(4);
    expect(testTree.massCenter).toStrictEqual({ x: 50, y: 50 });
  });

  test("Mass and massCenter calculated properly for root and all children", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
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
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle3: ParticleInterface = {
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle4: ParticleInterface = {
      x: 25,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle5: ParticleInterface = {
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testTree: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: undefined,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild1: Quadtree = {
      particles: [],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild2: Quadtree = {
      particles: [testParticle2],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild3: Quadtree = {
      particles: [testParticle3],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testChild4: Quadtree = {
      particles: [testParticle4],
      children: [],
      boundary: testRect,
      parent: testTree,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testGrandchild1: Quadtree = {
      particles: [testParticle1],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    const testGrandchild2: Quadtree = {
      particles: [testParticle5],
      children: [],
      boundary: testRect,
      parent: testChild1,
      mass: 0,
      massCenter: { x: null, y: null },
      treeForce: () => undefined,
    };
    testTree.children = [testChild1, testChild2, testChild3, testChild4];
    testChild1.children = [testGrandchild1, testGrandchild2];

    const { mass, massCenter } = computeMass(testTree);
    testTree.mass = mass;
    testTree.massCenter = massCenter;

    expect(testTree.mass).toBe(5);
    expect(testTree.massCenter).toStrictEqual({ x: 50, y: 50 });
    expect(testChild1.mass).toBe(2);
    expect(testChild1.massCenter).toStrictEqual({ x: 37.5, y: 37.5 });
    expect(testChild2.mass).toBe(1);
    expect(testChild2.massCenter).toStrictEqual({ x: 75, y: 25 });
    expect(testChild3.mass).toBe(1);
    expect(testChild3.massCenter).toStrictEqual({ x: 75, y: 75 });
    expect(testChild4.mass).toBe(1);
    expect(testChild4.massCenter).toStrictEqual({ x: 25, y: 75 });
    expect(testGrandchild1.mass).toBe(1);
    expect(testGrandchild1.massCenter).toStrictEqual({ x: 25, y: 25 });
    expect(testGrandchild2.mass).toBe(1);
    expect(testGrandchild2.massCenter).toStrictEqual({ x: 50, y: 50 });
  });
});

describe("createQuadtree", () => {
  test("Returns an object with correct properties", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };

    const testTree = createQuadtree({ boundary: testRect });

    expect(testTree).toHaveProperty("particles");
    expect(testTree).toHaveProperty("children");
    expect(testTree).toHaveProperty("boundary");
    expect(testTree).toHaveProperty("parent");
    expect(testTree).toHaveProperty("mass");
    expect(testTree).toHaveProperty("massCenter");
    expect(testTree).toHaveProperty("treeForce");
  });

  test("Quadtree points inserted in correct nodes and tree is pruned", () => {
    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
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
      y: 25,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle3: ParticleInterface = {
      x: 75,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle4: ParticleInterface = {
      x: 25,
      y: 75,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle5: ParticleInterface = {
      x: 50,
      y: 50,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const particles = [
      testParticle1,
      testParticle2,
      testParticle3,
      testParticle4,
      testParticle5,
    ];

    const testTree = createQuadtree({ boundary: testRect, particles });

    expect(testTree.children[0].children[0].particles[0]).toStrictEqual(
      testParticle1
    );
    expect(testTree.children[0].children[1].particles[0]).toStrictEqual(
      testParticle5
    );
    expect(testTree.children[1].particles[0]).toStrictEqual(testParticle2);
    expect(testTree.children[2].particles[0]).toStrictEqual(testParticle3);
    expect(testTree.children[3].particles[0]).toStrictEqual(testParticle4);
  });

  test("treeForce properly updates particles positions", () => {
    const x1 = 25;
    const y1 = 25;
    const x2 = 75;
    const y2 = 25;
    const x3 = 75;
    const y3 = 75;
    const x4 = 25;
    const y4 = 75;
    const x5 = 50;
    const y5 = 50;

    const testRect: QuadtreeBoundary = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    };
    const testParticle1: ParticleInterface = {
      x: x1,
      y: y1,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle2: ParticleInterface = {
      x: x2,
      y: y2,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle3: ParticleInterface = {
      x: x3,
      y: y3,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle4: ParticleInterface = {
      x: x4,
      y: y4,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const testParticle5: ParticleInterface = {
      x: x5,
      y: y5,
      vx: 0,
      vy: 0,
      mass: 1,
      radius: 1,
      color: "yellow",
    };
    const particles = [
      testParticle1,
      testParticle2,
      testParticle3,
      testParticle4,
      testParticle5,
    ];

    const testTree = createQuadtree({ boundary: testRect, particles });
    testTree.treeForce(particles);

    expect(testParticle1.x).toBeGreaterThan(x1);
    expect(testParticle1.y).toBeGreaterThan(y1);
    expect(testParticle2.x).toBeLessThan(x2);
    expect(testParticle2.y).toBeGreaterThan(y2);
    expect(testParticle3.x).toBeLessThan(x3);
    expect(testParticle3.y).toBeLessThan(y3);
    expect(testParticle4.x).toBeGreaterThan(x4);
    expect(testParticle4.y).toBeLessThan(y4);
    expect(testParticle5.x).toBe(x5);
    expect(testParticle5.y).toBe(y5);
  });
});
