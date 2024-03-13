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

const createQuadTree = (
  boundary: Rectangle,
  capacity: PositiveInteger,
  depth?: number | undefined
) => {
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
    const quads: ["northwest", "northeast", "southeast", "southwest"] = [
      "northwest",
      "northeast",
      "southeast",
      "southwest",
    ];
    quads.forEach((quad) => {
      quadTree[quad] = createQuadTree(
        // Assign correct rectangle
        quad === "northwest"
          ? nw
          : quad === "northeast"
          ? ne
          : quad === "southeast"
          ? se
          : sw,
        quadTree.capacity,
        quadTree.depth + 1
      );
    });

    quadTree.divided = true;
  };

  // Method for inserting into tree
  const insert = (point: ParticleInterface) => {
    // Return if the point is not within boundary
    if (!rectContains(boundary, point)) return false;

    // Add point if there is room and the node is not divided
    if (quadTree.points.length < quadTree.capacity && !quadTree.divided) {
      quadTree.points.push(point);
      // Update nodes center of and total mass
      return true;
    } else {
      // If there isn't room, the quad tree is not divided, and max depth is not yet reached
      if (!quadTree.divided && quadTree.depth < quadTree.maxDepth) {
        // Subdivide the quadtree, adding child quadtrees
        subdivide();

        // Recursively add the parent node's points to new child nodes
        quadTree.points.forEach((point) => {
          if (quadTree.northwest?.insert(point)) return true;
          if (quadTree.northeast?.insert(point)) return true;
          if (quadTree.southeast?.insert(point)) return true;
          if (quadTree.southwest?.insert(point)) return true;
        });
      }

      // If max depth has been reached
      if (quadTree.depth >= quadTree.maxDepth) {
        // Add the point to this quadtree and return true
        quadTree.points.push(point);
        return true;
      }

      // Clear points from parent node as it is now a divided node
      quadTree.points = [];

      // Add the point to the children nodes
      if (quadTree.northwest?.insert(point)) return true;
      if (quadTree.northeast?.insert(point)) return true;
      if (quadTree.southeast?.insert(point)) return true;
      if (quadTree.southwest?.insert(point)) return true;
    }
    throw new Error(
      "Default false return should never happen. Point not inserted. Duplicate points?"
    );
    return false;
  };

  // Create and return quadtree object
  const quadTree: QuadTree = {
    boundary,
    capacity,
    points: [],
    massTotal: 0,
    massCenterX: boundary.x,
    massCenterY: boundary.y,
    divided: false,
    depth: depth ?? 0,
    maxDepth: 8,
    insert,
  };
  return quadTree;
};

export default createQuadTree;
