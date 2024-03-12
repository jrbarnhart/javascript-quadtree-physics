import {
  ParticleInterface,
  PositiveInteger,
  QuadTree,
  Rectangle,
} from "./defs";

const QuadTree = (boundary: Rectangle, capacity: PositiveInteger) => {
  // Fn for creating rectangles
  const createRectangle = (
    x: number,
    y: number,
    height: number,
    width: number
  ) => {
    const rectangle: Rectangle = {
      x,
      y,
      height,
      width,
      top: y - height / 2,
      bottom: y + height / 2,
      left: x - width / 2,
      right: x + width / 2,
    };

    return rectangle;
  };

  // Fn for checking if rectangle contains a point
  const contains = (rectangle: Rectangle, point: ParticleInterface) => {
    return (
      rectangle.left <= point.x &&
      point.x <= rectangle.right &&
      rectangle.top <= point.y &&
      point.y <= rectangle.bottom
    );
  };

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
    quadTree.northwest = QuadTree(nw, capacity);
    quadTree.northeast = QuadTree(ne, capacity);
    quadTree.southeast = QuadTree(se, capacity);
    quadTree.southwest = QuadTree(sw, capacity);
  };

  // Method for inserting into tree
  const points: ParticleInterface[] = [];
  const insert = (point: ParticleInterface) => {
    // Return if the point is not within boundary
    if (!contains(boundary, point)) return;

    // Add point if there is room, else subdivide
    if (points.length < capacity) {
      points.push(point);
    } else {
      subdivide();
    }
  };

  // Initialize quadtree
  const quadTree: QuadTree = { boundary, capacity, points, insert };
  return quadTree;
};

export default QuadTree;
