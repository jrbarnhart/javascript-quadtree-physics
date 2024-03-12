import {
  ParticleInterface,
  PositiveInteger,
  Rectangle,
  QuadTree,
} from "./defs";
import createRectangle from "./createRectangle";

// Fn for checking if rectangle contains a point
const rectContains = (rectangle: Rectangle, point: ParticleInterface) => {
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
      boundary.x - boundary.width / 4,
      boundary.y - boundary.height / 4,
      boundary.height / 2,
      boundary.width / 2
    );

    const ne: Rectangle = createRectangle(
      boundary.x + boundary.width / 4,
      boundary.y - boundary.height / 4,
      boundary.height / 2,
      boundary.width / 2
    );

    const se: Rectangle = createRectangle(
      boundary.x + boundary.width / 4,
      boundary.y + boundary.height / 4,
      boundary.height / 2,
      boundary.width / 2
    );

    const sw: Rectangle = createRectangle(
      boundary.x - boundary.width / 4,
      boundary.y + boundary.height / 4,
      boundary.height / 2,
      boundary.width / 2
    );

    // Create the child nodes
    quadTree.northwest = createQuadTree(nw, capacity);
    quadTree.northeast = createQuadTree(ne, capacity);
    quadTree.southeast = createQuadTree(se, capacity);
    quadTree.southwest = createQuadTree(sw, capacity);

    quadTree.divided = true;
  };

  // Method for inserting into tree
  const insert = (point: ParticleInterface) => {
    // Return if the point is not within boundary
    if (!rectContains(boundary, point)) return;

    // Add point if there is room and the node is not divided, else subdivide recursively
    if (quadTree.points.length < capacity && !quadTree.divided) {
      quadTree.points.push(point);
    } else {
      if (!quadTree.divided) {
        subdivide();
        // Recursively add the divided nodes points to new child nodes
        quadTree.points.forEach((point) => {
          quadTree.northwest?.insert(point);
          quadTree.northeast?.insert(point);
          quadTree.southeast?.insert(point);
          quadTree.southwest?.insert(point);
          // Clear points from parent node
          quadTree.points = [];
        });
      }
      quadTree.northwest?.insert(point);
      quadTree.northeast?.insert(point);
      quadTree.southeast?.insert(point);
      quadTree.southwest?.insert(point);
    }
  };

  // Create and return quadtree object
  const quadTree: QuadTree = {
    boundary,
    capacity,
    points: [],
    divided: false,
    insert,
  };
  return quadTree;
};

export default createQuadTree;
