// This is a factory function that will return a quadtree built using a provided
// particles array and boundary rectangle.

// Implementation based on: https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html

import { ParticleInterface, Quadtree, Rectangle } from "./defs";

const pruneEmptyNodes = (quadtree: Quadtree) => {
  // ##TODO##
  // Prune the empty nodes with breadth first search
};

const buildTree = (particles: ParticleInterface[], quadtree: Quadtree) => {
  for (const particle of particles) {
    insertParticle(particle, quadtree);
  }
  pruneEmptyNodes(quadtree);
};

const getChildForParticle = (particle: ParticleInterface, node: Quadtree) => {
  const centerX = node.boundary.x + node.boundary.width / 2;
  const centerY = node.boundary.y + node.boundary.height / 2;

  // Children are counted in this order: NW, NE, SE, SW
  // 1 2
  // 4 3

  // Left half
  if (particle.x <= centerX) {
    // Top left
    if (particle.y <= centerY) {
      return node.children[0];
    }
    // Bottom left
    else {
      return node.children[4];
    }
    // Right half
  } else {
    // Top right
    if (particle.y <= centerY) {
      return node.children[2];
    }
    // Bottom right
    else {
      return node.children[3];
    }
  }
};

const insertParticle = (particle: ParticleInterface, node: Quadtree) => {
  // If quadtree contains more than 1 particle
  if (node.particles.length > 1) {
    // Determine which child of node to insert to
    // const child = determineChild?(node, particle)
    // Insert to that node
    // insertParticle(particle, child)
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

const createQuadtree = (
  particles: ParticleInterface[],
  boundary: Rectangle
) => {
  const quadtree: Quadtree = { particles: [], children: [], boundary };
  buildTree(particles, quadtree);

  return quadtree;
};

export default createQuadtree;
