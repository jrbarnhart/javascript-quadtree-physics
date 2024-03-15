import {
  ParticleInterface,
  PositiveInteger,
  Rectangle,
  QuadTree,
} from "./defs";
import createRectangle from "./createRectangle";

// Fn for checking if rectangle contains a point
export const rectContains = (
  rectangle: Rectangle,
  point: ParticleInterface
) => {
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

    // If center of mass is not null and therefore node has particle(s)
    if (quadTree.massCenterX !== null && quadTree.massCenterY !== null) {
      // Update center of mass
      quadTree.massCenterX =
        (quadTree.massCenterX * quadTree.massTotal + point.x * point.mass) /
        (quadTree.massTotal + point.mass);
      quadTree.massCenterY =
        (quadTree.massCenterY * quadTree.massTotal + point.y * point.mass) /
        (quadTree.massTotal + point.mass);
    } else {
      quadTree.massCenterX = point.x;
      quadTree.massCenterY = point.y;
    }
    // Update total mass
    quadTree.massTotal += point.mass;

    // Add point if there is room and the node is not divided
    if (quadTree.points.length < quadTree.capacity && !quadTree.divided) {
      quadTree.points.push(point);
      // Update nodes total and center of mass
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

  // Method for finding first edge node
  const findFirstLeaf = () => {
    // If this node a leaf node with points in it
    if (!quadTree.divided && quadTree.points.length > 0) {
      return quadTree;
      // Else if it is an internal node with a northwest child
    } else if (quadTree.divided) {
      let foundNode = quadTree.northwest?.findFirstLeaf();
      if (foundNode) return foundNode;
      foundNode = quadTree.northeast?.findFirstLeaf();
      if (foundNode) return foundNode;
      foundNode = quadTree.southeast?.findFirstLeaf();
      if (foundNode) return foundNode;
      foundNode = quadTree.southwest?.findFirstLeaf();
      if (foundNode) return foundNode;
    }
    // Otherwise no leaf node with a point in it was fonund
    return null;
  };

  // Method for updating particles position based on gravitational attraction
  const gravity = () => {
    // 1. Find first leaf with helper fn
    // 2. Process the query node
    /*
      if (query node has multiple points) {
        brute force gravity calcs and updates for these points
      }

      Apply gravity using Barnes-Hut approach
      for each (particle in query node) {
        start at root of quad tree
        if (node is an internal node) {
          check distance between particle and nodes center of mass
          if (distance > threshold) {
            calc and update force between particle and center of mass
            apply opposite force to all particles in the node
          } else if (distance <= threshold) {
            recursively check child nodes
          }
        } else if (node is a leaf node) {
          calc and update force between particle and particles in leaf node
        }
      }
    */
    // 3. After processed, delete the node (or maybe delete it after it is found by saving points variable? Higher memory cost for that?)
    // 4. Find next query node and repeat process
  };
  // Create and return quadtree object
  const quadTree: QuadTree = {
    boundary,
    capacity,
    points: [],
    massTotal: 0,
    massCenterX: null,
    massCenterY: null,
    divided: false,
    depth: depth ?? 0,
    maxDepth: 8,
    insert,
    findFirstLeaf,
    gravity,
  };
  return quadTree;
};

export default createQuadTree;
