# Physics Simulation with Barnes-Hut Algorithm and Quadtree

This project is a simulation of physics involving multiple bodies implemented in a Vite React TypeScript environment. It utilizes the Barnes-Hut algorithm coupled with a quadtree data structure to efficiently handle calculations for gravitational and collision interactions between the bodies.

## Overview

The Barnes-Hut algorithm is a method for approximating the forces between multiple bodies. It achieves significant speedup over a direct summation of forces by grouping distant bodies into clusters and treating these clusters as single bodies. This approach drastically reduces the number of pairwise force calculations needed in large-scale simulations.

The quadtree data structure is used to partition the space containing the particles into hierarchical subdivisions. Each subdivision (or quad) can contain either a single particle or be further subdivided into four quads. This hierarchical structure allows for efficient spatial queries, enabling the Barnes-Hut algorithm to identify clusters of particles at different levels of granularity.

## References

- [N-body Simulation](https://en.wikipedia.org/wiki/N-body_simulation)
- [Barnes-Hut Simulation](https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation)
- [Quadtrees](https://en.wikipedia.org/wiki/Quadtree)

## Usage

Check out a live demo(NYI) or

1. Clone the repository:

   ```bash
   git clone https://github.com/jrbarnhart/quadtree-physics.git
   ```

2. Navigate to project directory:

   ```bash
   cd /path/to/project
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the URL provided in your terminal.
