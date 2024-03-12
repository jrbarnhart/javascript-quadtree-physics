import {
  ParticleInterface,
  PositiveInteger,
  QuadTree as createQuadTree,
  Rectangle,
} from "./defs";
import createRectangle from "./createRectangle";

// Fn for checking if rectangle contains a point
const contains = (rectangle: Rectangle, point: ParticleInterface) => {
  return (
    rectangle.left <= point.x &&
    point.x <= rectangle.right &&
    rectangle.top <= point.y &&
    point.y <= rectangle.bottom
  );
};

const createQuadTree = (boundary: Rectangle, capacity: PositiveInteger) => {
  // Fn for subdividing
  const subdivide = () => {
    // Define new boundaries
    const nw: Rectangle = createRectangle(
      boundary.x - boundary.width / 2,
      boundary.y - boundary.height / 2,
      boundary.height / 2,
      boundary.width / 2
    );

    const ne: Rectangle = createRectangle(
      boundary.x + boundary.width / 2,
      boundary.y - boundary.height / 2,
      boundary.height / 2,
      boundary.width / 2
    );

    const se: Rectangle = createRectangle(
      boundary.x + boundary.width / 2,
      boundary.y + boundary.height / 2,
      boundary.height / 2,
      boundary.width / 2
    );

    const sw: Rectangle = createRectangle(
      boundary.x - boundary.width / 2,
      boundary.y + boundary.height / 2,
      boundary.height / 2,
      boundary.width / 2
    );

    // Create the child nodes
    quadTree.northwest = createQuadTree(nw, capacity);
    quadTree.northeast = createQuadTree(ne, capacity);
    quadTree.southeast = createQuadTree(se, capacity);
    quadTree.southwest = createQuadTree(sw, capacity);
  };

  // Method for inserting into tree
  const points: ParticleInterface[] = [];
  const insert = (point: ParticleInterface) => {
    // Return if the point is not within boundary
    if (!contains(boundary, point)) return;

    // Add point if there is room, else subdivide recursively
    if (points.length < capacity) {
      points.push(point);
    } else {
      subdivide();
    }
  };

  // Create and return quadtree object
  const quadTree: createQuadTree = { boundary, capacity, points, insert };
  return quadTree;
};

export default createQuadTree;
