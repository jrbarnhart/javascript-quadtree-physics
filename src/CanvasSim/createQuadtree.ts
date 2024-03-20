// This is a factory function that will return a quadtree built using a provided
// particles array and boundary rectangle.

// Implementation based on: https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html

import { ParticleInterface, Quadtree, QuadtreeBoundary } from "./defs";

export const pruneEmptyNodes = (quadtree: Quadtree) => {
  // Prune the empty nodes with breadth first search
  const queue: Quadtree[] = [quadtree];

  // Shift out the next queue item and process it until queue empty
  while (queue.length > 0) {
    const node = queue.shift();
    if (!node) continue;

    // Delete node from parent if it is empty
    if (node.children.length === 0 && node.particles.length === 0) {
      // Delete node
    }

    // Add nodes unqueued children to queue
    for (const child of node.children) {
      if (!queue.includes(child)) {
        queue.push(child);
      }
    }
  }
};

const buildTree = (particles: ParticleInterface[], quadtree: Quadtree) => {
  for (const particle of particles) {
    insertParticle(particle, quadtree);
  }
  pruneEmptyNodes(quadtree);
};

export const subdivideNode = (node: Quadtree) => {
  if (node.children.length > 0) return;

  const { x, y, width, height } = node.boundary;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const nwBoundary: QuadtreeBoundary = {
    x,
    y,
    width: halfWidth,
    height: halfHeight,
  };
  const neBoundary: QuadtreeBoundary = {
    x: x + halfWidth,
    y,
    width: halfWidth,
    height: halfHeight,
  };
  const seBoundary: QuadtreeBoundary = {
    x: x + halfWidth,
    y: y + halfHeight,
    width: halfWidth,
    height: halfHeight,
  };
  const swBoundary: QuadtreeBoundary = {
    x,
    y: y + halfHeight,
    width: halfWidth,
    height: halfHeight,
  };

  node.children[0] = createQuadtree({ boundary: nwBoundary, parent: node });
  node.children[1] = createQuadtree({ boundary: neBoundary, parent: node });
  node.children[2] = createQuadtree({ boundary: seBoundary, parent: node });
  node.children[3] = createQuadtree({ boundary: swBoundary, parent: node });
};

export const getChildForParticle = (
  particle: ParticleInterface,
  node: Quadtree
) => {
  const centerX = node.boundary.x + node.boundary.width / 2;
  const centerY = node.boundary.y + node.boundary.height / 2;

  // Children are counted in this order: NW, NE, SE, SW
  // Left half
  if (particle.x <= centerX) {
    // Top left
    if (particle.y <= centerY) {
      return node.children[0];
    }
    // Bottom left
    else {
      return node.children[3];
    }
    // Right half
  } else {
    // Top right
    if (particle.y <= centerY) {
      return node.children[1];
    }
    // Bottom right
    else {
      return node.children[2];
    }
  }
};

const insertParticle = (particle: ParticleInterface, node: Quadtree) => {
  // If quadtree contains more than 1 particle insert to proper child
  if (node.particles.length > 1) {
    const targetChild = getChildForParticle(particle, node);
    insertParticle(particle, targetChild);
  }
  // Else if it contains just one particle it is a leaf
  else if (node.particles.length === 1) {
    // Add node's four children
    // subdivide(node)
    // Move particle already here to proper child
    // const existingP = node.particles[0]
    // const existingPChild = determineChild?(node, existingP)
    // insertParticle(existingP, existingPChild)
    // insert new particle into proper child
    // const newPChild = determineChild?(node, newPChild)
    // insertParticle(particle, newPChild)
  }
  // It is an empty leaf
  else if (node.particles.length === 0) {
    // Store the particle in this node
    node.particles.push(particle);
  }
};

const createQuadtree = ({
  boundary,
  particles,
  parent,
}: {
  boundary: QuadtreeBoundary;
  particles?: ParticleInterface[];
  parent?: Quadtree;
}) => {
  const quadtree: Quadtree = { particles: [], children: [], boundary, parent };
  if (particles) {
    buildTree(particles, quadtree);
  }

  return quadtree;
};

export default createQuadtree;
