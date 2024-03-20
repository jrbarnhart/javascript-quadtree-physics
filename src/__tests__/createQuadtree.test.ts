import { describe, expect, test } from "vitest";
import { getChildForParticle } from "../CanvasSim/createQuadtree";
import { ParticleInterface, Quadtree, Rectangle } from "../CanvasSim/defs";

describe("getChildForParticle", () => {
  // Children are counted in this order: NW, NE, SE, SW
  // 0 1
  // 3 2
  test("Returns proper child corresponding to the quadrant of parent the point is in", () => {
    // testRect is also used for child bounaries as they are irrelevant to test
    const testRect: Rectangle = {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
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
