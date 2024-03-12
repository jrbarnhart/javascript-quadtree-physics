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
    if (!rectContains(boundary, point)) return false;

    // Add point if there is room and the node is not divided, else subdivide recursively
    if (quadTree.points.length < capacity && !quadTree.divided) {
      quadTree.points.push(point);
      return true;
    } else {
      if (!quadTree.divided) {
        subdivide();
        // Recursively add the divided nodes points to new child nodes
        quadTree.points.forEach((point) => {
          if (quadTree.northwest?.insert(point)) return true;
          if (quadTree.northeast?.insert(point)) return true;
          if (quadTree.southeast?.insert(point)) return true;
          if (quadTree.southwest?.insert(point)) return true;
        });
      }

      // Clear points from parent node
      quadTree.points = [];

      // Add the point to the children nodes
      if (quadTree.northwest?.insert(point)) return true;
      if (quadTree.northeast?.insert(point)) return true;
      if (quadTree.southeast?.insert(point)) return true;
      if (quadTree.southwest?.insert(point)) return true;
    }
    console.log("Default false return. Point not inserted. Duplicate points?");
    return false;
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
