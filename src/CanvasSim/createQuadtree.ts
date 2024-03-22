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
  /*
   function ( mass, cm ) = Compute_Mass(n)    
       ... Compute the mass and center of mass (cm) of 
       ... all the particles in the subtree rooted at n
       if n contains 1 particle
            ... the mass and cm of n are identical to 
            ... the particle's mass and position
            store ( mass, cm ) at n
            return ( mass, cm )
       else
            for all four children c(i) of n (i=1,2,3,4)
                ( mass(i), cm(i) ) = Compute_Mass(c(i))
            end for
            mass = mass(1) + mass(2) + mass(3) + mass(4) 
                 ... the mass of a node is the sum of 
                 ... the masses of the children
            cm = (  mass(1)*cm(1) + mass(2)*cm(2) 
                  + mass(3)*cm(3) + mass(4)*cm(4)) / mass
                 ... the cm of a node is a weighted sum of 
                 ... the cm's of the children
            store ( mass, cm ) at n
            return ( mass, cm )
       end

  */
  if (node.particles.length === 1) {
    // Mass and cMass are the same as the particle
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
  const quadtree: Quadtree = {
    particles: [],
    children: [],
    boundary,
    parent,
    mass: 0,
    massCenter: null,
  };
  if (particles) {
    buildTree(particles, quadtree);
  }

  return quadtree;
};

export default createQuadtree;
