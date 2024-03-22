// This is a factory function that will return a quadtree built using a provided
// particles array and boundary rectangle.

// Implementation based on: https://people.eecs.berkeley.edu/~demmel/cs267/lecture26/lecture26.html

import { ParticleInterface, Quadtree, QuadtreeBoundary } from "./defs";

export const pruneEmptyNodes = (quadtree: Quadtree) => {
  const queue = new Set<Quadtree>([quadtree]);

  // Shift out the next queue item and process it until queue empty
  while (queue.size > 0) {
    const iteratorResult = queue.entries().next();
    if (!iteratorResult.value) continue;

    const [, node] = iteratorResult.value as [unknown, Quadtree];
    queue.delete(node);

    // Delete node from parent if it is empty
    if (node.children.length === 0 && node.particles.length === 0) {
      const index = node.parent?.children.indexOf(node);
      if (index !== undefined && index !== -1) {
        node.parent?.children.splice(index, 1);
      }
    }

    // Add node's unqueued children to queue
    for (const child of node.children) {
      if (!queue.has(child)) {
        queue.add(child);
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
  if (particle.x <= centerX) {
    if (particle.y <= centerY) {
      return node.children[0];
    } else {
      return node.children[3];
    }
  } else {
    if (particle.y <= centerY) {
      return node.children[1];
    } else {
      return node.children[2];
    }
  }
};

export const insertParticle = (
  newParticle: ParticleInterface,
  node: Quadtree
) => {
  // If quadtree contains more than 1 particle insert to proper child
  if (node.particles.length > 1) {
    const targetChild = getChildForParticle(newParticle, node);
    insertParticle(newParticle, targetChild);
  }
  // Else if it contains just one particle it is a leaf
  else if (node.particles.length === 1) {
    // Add node's four children
    subdivideNode(node);

    // Move particle already here to proper child
    const existingParticle = node.particles[0];
    const existingPChild = getChildForParticle(existingParticle, node);
    insertParticle(existingParticle, existingPChild);
    node.particles = [];

    // insert new particle into proper child
    const newPChild = getChildForParticle(newParticle, node);
    insertParticle(newParticle, newPChild);
  }
  // It is an empty leaf
  else if (node.particles.length === 0) {
    // Store the particle in this node
    node.particles.push(newParticle);
  }
};

export const computeMass = (node: Quadtree) => {
  // Node only has one particle
  if (node.particles.length === 1) {
    // Mass and cMass are the same as the particle
    const mass = node.particles[0].mass;
    const massCenter = { x: node.particles[0].x, y: node.particles[0].y };
    return { mass, massCenter };
  } else {
    // Else it is an internal node b/c empty nodes should have been removed before computing mass
    for (const child of node.children) {
      const { mass, massCenter } = computeMass(child);
      child.mass = mass;
      child.massCenter = massCenter;
    }

    const totalMass = node.children.reduce((sum, child) => sum + child.mass, 0);
    const totalMassCenter = {
      x: node.children.reduce(
        (sum, child) =>
          sum + (child.mass * (child.massCenter.x ?? 0)) / totalMass,
        0
      ),
      y: node.children.reduce(
        (sum, child) =>
          sum + (child.mass * (child.massCenter.y ?? 0)) / totalMass,
        0
      ),
    };

    return { mass: totalMass, massCenter: totalMassCenter };
  }
};

const computeDistance = (particle: ParticleInterface, node: Quadtree) => {
  if (node.massCenter.x !== null && node.massCenter.y !== null) {
    const dx = node.massCenter.x - particle.x;
    const dy = node.massCenter.y - particle.y;
    const rSquared = dx * dx + dy * dy;
    const r = Math.sqrt(rSquared);
    return { dx, dy, rSquared, r };
  }
  return { dx: 0, dy: 0, rSquared: 0, r: 0 };
};

const computeForce = (
  particle: ParticleInterface,
  node: Quadtree,
  dx: number,
  dy: number,
  rSquared: number,
  r: number
) => {
  const G = 0.6;
  const force = { x: 0, y: 0 };

  if (r !== 0) {
    const forceMagnitude = (G * particle.mass * node.mass) / rSquared;
    force.x = forceMagnitude * (dx / r);
    force.y = forceMagnitude * (dy / r);
  }

  return force;
};

/*
      ... For each particle, traverse the tree 
      ... to compute the force on it.
      For i = 1 to n
          f(i) = TreeForce(i,root)   
      end for

      function f = TreeForce(i,n)
          ... Compute gravitational force on particle i 
          ... due to all particles in the box at n
          f = 0
          if n contains one particle
              f = force computed using formula (*) above
          else 
              r = distance from particle i to 
                     center of mass of particles in n
              D = size of box n
              if D/r < theta
                  compute f using formula (*) above
              else
                  for all children c of n
                      f = f + TreeForce(i,c)
                  end for
              end if
          end if
*/
const treeForceInternal = (particle: ParticleInterface, node: Quadtree) => {
  const THETA = 0.5;
  let force = { x: 0, y: 0 };
  if (node.particles.length === 1) {
    const { dx, dy, rSquared, r } = computeDistance(particle, node);
    force = computeForce(particle, node, dx, dy, rSquared, r);
  } else {
    const { dx, dy, rSquared, r } = computeDistance(particle, node);
    const D = (node.boundary.width + node.boundary.height) / 2;
    if (D / r < THETA) {
      force = computeForce(particle, node, dx, dy, rSquared, r);
    } else {
      for (const child of node.children) {
        const childForce = treeForceInternal(particle, child);
        force.x += childForce.x;
        force.y += childForce.y;
      }
    }
  }
  return force;
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
  // Method for computing force using Barnes-Hut algorithm
  const treeForce = (particles: ParticleInterface[]) => {
    for (const particle of particles) {
      treeForceInternal(particle, quadtree);
    }
  };

  const quadtree: Quadtree = {
    particles: [],
    children: [],
    boundary,
    parent,
    mass: 0,
    massCenter: { x: null, y: null },
    treeForce,
  };

  // Build the tree and compute mass properties
  if (particles) {
    buildTree(particles, quadtree);
    const { mass, massCenter } = computeMass(quadtree);
    quadtree.mass = mass;
    quadtree.massCenter = massCenter;
  }

  return quadtree;
};

export default createQuadtree;
