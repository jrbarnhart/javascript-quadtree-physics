# Physics Simulation with Barnes-Hut Algorithm and Quadtree

This project is a simulation of physics involving multiple bodies implemented using Vite, React, TypeScript, and Tailwind CSS. Its goal was to simulate physics between particles using a quadtree data structure. For now I am abandoning this project for reasons listed below. It's current implementation is simply particles with data stored in typed arrays that bounce around the screen.

## Overview

The Barnes-Hut algorithm is a method for approximating the forces between multiple bodies. It achieves significant speedup over a direct summation of forces by grouping distant bodies into clusters and treating these clusters as single bodies. This approach drastically reduces the number of pairwise force calculations needed in large-scale simulations.

The quadtree data structure is used to partition the space containing the particles into hierarchical subdivisions. Each subdivision (or quad) can contain either a single particle or be further subdivided into four quads. This hierarchical structure allows for efficient spatial queries, enabling the Barnes-Hut algorithm to identify clusters of particles at different levels of granularity.

## Major Issues With This Approach

Ultimately I have decided to abandon this project for the following reasons. While I probably could come up with solutions I feel it is best to redirect my efforts elsewhere.

### Memory Usage

The "common sense" approach of storing references to elements in an array on the node leads to memory issues. Firstly due to how objects are stored in memory I am relatively certain that my quadtree approach here would lead to a very high number of cache misses every frame, reducing performance. Furthermore, the actual amount of memory used for each node is unacceptably high.

While this is partially due to how I used Quadtree objects themselves to represent nodes, my reading on this issue led me to believe that objects are simply not a good solution to storing a quadtree that represents large amounts of dynamic data. There is a lot of memory overhead with objects that you wouldn't have if you just store data representing nodes into a typed array.

A solution would be to use typed arrays to store more compressed quadtree nodes, however I ran into issues when trying to reason about how to build the tree. Typed arrays in Javascript are static in their length. This means that while constructing the tree you can't just push data into the array if there is no room. The dynamic nature of quadtree insertion/construction makes this a difficult problem to solve.

### Quadtree Gravity and Collision

My initial thought process was to construct a quadtree and use it to determine both collisions and gravitational force between particles. This was a bad idea as quadtrees for determining collison typically need to have more than one element per leaf node, however determining gravitational force is much easier when your quadtree only has one element in each leaf node.

A solution I considered was to just build a collision tree and a gravity tree every frame. This would add a performance cost but would both separate concerns of computing collisions and gravity while also making the code much clearer and easier to understand.

## References

- [N-body Simulation](https://en.wikipedia.org/wiki/N-body_simulation)
- [Barnes-Hut Simulation](https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation)
- [Quadtrees](https://en.wikipedia.org/wiki/Quadtree)
- [This Helpful Article](http://arborjs.org/docs/barnes-hut)
- [Top answer in this stackoverflow topic](https://stackoverflow.com/questions/41946007/efficient-and-well-explained-implementation-of-a-quadtree-for-2d-collision-det)
