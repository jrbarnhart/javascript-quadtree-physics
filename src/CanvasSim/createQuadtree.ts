import { ParticleInterface } from "./defs";

const createQuadtree = (particles: ParticleInterface[]) => {
  const quadtree = {};
  /*
   procedure QuadtreeBuild
     Quadtree = {empty}
       For i = 1 to n          ... loop over all particles
         QuadInsert(i, root)   ... insert particle i in quadtree
       end for
       ... at this point, the quadtree may have some empty 
       ... leaves, whose siblings are not empty
       Traverse the tree (via, say, breadth first search), 
         eliminating empty leaves
    */
  /*
   procedure QuadInsert(i,n)   
     ... Try to insert particle i at node n in quadtree
     ... By construction, each leaf will contain either 
     ... 1 or 0 particles
     if the subtree rooted at n contains more than 1 particle
        determine which child c of node n particle i lies in
          QuadInsert(i,c)
     else if the subtree rooted at n contains one particle 
        ... n is a leaf
        add n's four children to the Quadtree
        move the particle already in n into the child 
           in which it lies
        let c be child in which particle i lies
        QuadInsert(i,c)
     else if the subtree rooted at n is empty        
        ... n is a leaf 
        store particle i in node n
     endif
   */
  return quadtree;
};

export default createQuadtree;
