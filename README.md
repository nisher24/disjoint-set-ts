Disjoint Set Implementation
===========================

The first task is to implement the disjoint set (also known as union-find) data structure in Typescript. In our work with labeled 3d images, we sometimes use disjoint sets to represent agglomerations of smaller labels as larger more meaningful objects such as neurons. A disjoint set allows us to efficiently represent sets of objects that have no overlap between them. That is, if label A and label C belong to different sets, label B may be joined to either label A or label B but not both. If label B is joined to label A and then joined to label C, the sets will merge into a single ABC set with the original isolated A and C sets ceasing to exist.

You can read more about disjoint sets on [Wikipedia](https://en.wikipedia.org/wiki/Disjoint-set_data_structure). 

## Programming Challenge

To complete the assignment, you’ll fill in the missing code for a single Typescript file, disjointset.ts, that contains the class definition for a DisjointSet and its operations makeset, union, and find. We will compile the file into a javascript file using the tsc command as and run the program like so:

```bash
tsc --lib es2021 --target es5 disjointset.ts
node disjointset.js input.txt
```

Which should output the number of sets, their set representatives (which should be the minimum member of each set), and the size of each set. Running `find` on a non-member element should return null.

In the text input, the format is two signed integers on each line separated by a space that represent a union pair.

Your code must compile and produce correct output. We will run some tests on our side to make sure edge cases are covered.

## Comceptual discussion of the implementation and disjoing sets

Please compile written answers between a sentence to a paragraph for the following questions:

* What are some notable differences that this disjoint set data structure has compared to a typical set implementation?

  A typical set is a collection that contains no duplicate elements, providing contains, add and delete operations. A disjoint set, on the other hand, maintains a collection of disjoint sets under makeset, union and find operations. 
  The add operation in a typical set takes a new element and adds it to a set if it doesn't already exist in the set. The makeset operation in a disjoint set, although adding a new element to a collection as well, will create a singleton set containing the new element.
  In the disjoint set, the find operation takes an element and returns an identifier of the set containing it. The union operation takes two elements, combines the two sets containing them and destroys the two original sets. Those operations are not provided by a typical set implementation.

* Is it possible to add a `delete` operation to the disjoint set? If so, what is the time complexity?

  Yes, it is possible to add a `delete` operation to the disjoint set. Please find my implementation of `delete` operation and analysis of its time complexity in disjointset.ts.
  To test the `delete` operation, add a new line to input.txt as `delete 10 20 30` to delete 10, 20 and 30 in the disjoint set if they exist.

* If we restricted the size of the inputs to 16-bit unsigned integers, how might you improve the run time of the implementation?

  16-bit unsigned integers store 2^16 distinct values from 0 to 65535. Instead of using a node object to represent each element, we can have a static integer array representing the forest of a disjoint set. Each entry in the array contains its parent in the tree. The operations for primitive types are faster than those for objects.

* Under what circumstances would you choose half-path vs full-path compression?

  Half-path compression requires only half as many pointer updates per find as full-path. When we have a large amount of nodes along the find path, we would better choose half-path rather than recursive full-path compression.
