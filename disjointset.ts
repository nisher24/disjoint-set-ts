import { argv, setgroups } from 'process';
import lineByLine = require('n-readlines');

class DisjointSet {
	private _numToNode: Map<number, TreeNode>;
	private _rootSet: Set<TreeNode>;

	constructor() {
		this._numToNode = new Map<number, TreeNode>();
		this._rootSet = new Set<TreeNode>();
	}

	public makeset(x: number) : void {
		/*
		Makes a new set by creating a new element.
		Arg:
			x: value of the new element to be created
		Returns:
			no returns
		*/
		if (this._numToNode.has(x)) {
			return;
		}

		var newNode = new TreeNode(x);
		this._numToNode.set(x, newNode);
		this._rootSet.add(newNode);
	}

	public find(x: number) : number|null {
		/*
		Finds the root of the tree that contains x
		Arg:
			x: value of the element
		Returns:
			the value of the root found
			or null if x is a non-member element
		*/
		if (!this._numToNode.has(x)) {
			return null;
		}

		var node = this._numToNode.get(x);
		var root = node;

		// find the root node
		while (root.parent !== root) {
			root = root.parent;
		}

		// path compression
		while (node.parent !== root) {
			var temp = node.parent;
			node.parent = root;
			temp.children.delete(node);
			root.children.add(node);
			node = temp;
		}

		return root.val;
	}

	public union(x:number, y:number) : void {
		/*
		Combines the two sets that x and y belong to
		if x and y are not in the same set
		Args:
			x: value of the element 1
			y: value of the element 2
		Returns:
			no returns
		*/
		if (!this._numToNode.has(x) || !this._numToNode.has(y)) {
			return;
		}

		var valX = this.find(x);
		var valY = this.find(y);
		var rootX = this._numToNode.get(valX);
		var rootY = this._numToNode.get(valY);

		// if x and y belong to the same set
		if (rootX === rootY) {
			return;
		}

		// merge smaller tree into larger tree
		if (rootX.size < rootY.size) {
			rootX.parent = rootY;
			rootY.size += rootX.size;
			this._rootSet.delete(rootX);
			rootY.children.add(rootX);

			if (rootX.min < rootY.min) {
				rootY.min = rootX.min;
			}
		} else {
			rootY.parent = rootX;
			rootX.size += rootY.size;
			this._rootSet.delete(rootY);
			rootX.children.add(rootY);

			if (rootY.min < rootX.min) {
				rootX.min = rootY.min;
			}
		}
	}

	/*
	Analysis of time complexity of the delete operation
	  * Deleting a leaf node is in constant time (O(1))
	  * Deleting a non-leaf node is more complicated:
		* Finding the root of the node - O(log n) worst case time,
		  where n is the number of nodes in the set containing 
		  the node to be deleted
		* Finding an arbitrary leaf in the subtree of the node and swap them
		  - O(log n) worst case time
		* Overall, the time complexity is O(log n)
	  * Deleting the minimum member of a set:
		Following the above operations, We need to traverse the tree
		and find the new minimum member of the set 
		- O(n) time, where n is the size of the set
	*/
	public delete(x: number) : void {
		/*
		Deletes x from the set it belongs to
		if x is a member of the collection
		Args:
			x: value of an element
		Returns:
			no returns
		*/
		// if x is not a member
		if (!this._numToNode.has(x)) {
			return;
		}

		var node: TreeNode = this._numToNode.get(x); // node to be deleted
		var rootVal: number = this.find(node.val);
		var root: TreeNode = this._numToNode.get(rootVal);
		this._numToNode.delete(x);
		root.size -= 1;
		
		// if it is a node in a singleton set
		if (node.parent === node && node.children.size == 0) {
			this._rootSet.delete(node);
			node.parent = null;
			return;
		}

		// if it is a leaf node
		if (node.children.size == 0) {
			var parentNode: TreeNode = node.parent;
			parentNode.children.delete(node);
		} else { // if it is a non-leaf node
			// find an arbitary leaf
			var leaf: TreeNode = node;

			while (leaf.children.size != 0) {
				var iterator = leaf.children.values();
				leaf = iterator.next().value;
			}

			// swap the values of the node and leaf
			var leafVal: number = leaf.val;
			this.swap(node, leaf);
			this._numToNode.set(leafVal, node);
 
			// remove the leaf from its parent's children set
			var leafParent: TreeNode = leaf.parent;
			leafParent.children.delete(leaf);
			leaf.parent = null;
		}
		
		// if the minimum member of the set was deleted, find a new one
		if (x == root.min) {
			root.min = this.findMin(root);
		}
	}

	private swap(node1: TreeNode, node2: TreeNode) : void {
		/*
		Swaps the values of two nodes
		Args:
			node1: the first tree node
			node2: the second tree node
		Returns:
			no returns
		*/
		const temp: number = node1.val;
		node1.val = node2.val;
		node2.val = temp;
	}

	private findMin(root: TreeNode) : number {
		/*
		Finds the value of the minimum member of the tree 
		rooted at the node root using Divide & Conquer
		Arg:
			root: the root node of a tree
		Returns:
			the value of the minimum member
		*/
		if (root.children.size == 0) {
			return root.val;
		}

		var min: number = root.val;

		root.children.forEach((value) => {
			var childMin = this.findMin(value);

			if (childMin < min) {
				min = childMin;
			}
		});

		return min;
	}

	// Getters
	public get numToNode() : Map<number, TreeNode> {
		return this._numToNode;
	}

	public get rootSet() : Set<TreeNode> {
		return this._rootSet;
	}
}

class TreeNode {
	private _val: number;
	private _parent: TreeNode;
	private _size: number; // number of nodes in the tree rooted at the node
	private _min: number; // the minimum member of the tree rooted at the node
	private _children: Set<TreeNode>;

	constructor(val: number) {
		this._val = val;
		this._parent = this;
		this._size = 1;
		this._min = val;
		this._children = new Set<TreeNode>();
	}

	// Getters and setters
	public get val() : number {
		return this._val;
	}

	public set val(val: number) {
		this._val = val;
	}

	public get parent() : TreeNode {
		return this._parent;
	}

	public set parent(parent: TreeNode) {
		this._parent = parent;
	}

	public get size() : number {
		return this._size;
	} 

	public set size(size: number) {
		this._size = size;
	}

	public get min() : number {
		return this._min;
	}

	public set min(min: number) {
		this._min = min;
	}

	public get children() : Set<TreeNode> {
		return this._children;
	}
}

class FileReader {
	private _filePath: string;
	private _sets: DisjointSet;

	constructor(filePath: string, sets: DisjointSet) {
		this._filePath = filePath;
		this._sets = sets;
	}

	public readFile() : void {
		/*
		Reads an input file line by line and make a disjoint set
		using union pairs in each line.
		Args:
			no args
		Returns:
			no returns
		*/
		let line: Buffer;

		try {
			const liner = new lineByLine(this._filePath);
		
			while (line = liner.next()) {
				const arr = line.toString().split(' ');
				var nums = [];

				// delete operations
				if (arr.length > 1 && arr[0].toLowerCase() === "delete") {
					for (let i = 1; i < arr.length; i++) {
						let num = parseInt(arr[i]);

						if (!isNaN(num)) {
							nums.push(num);
						}
					}

					for (let num of nums) {
						this._sets.delete(num);
					}

					continue;
				}
		
				// makeset and union operations
				for (let str of arr) {
					let num = parseInt(str);
		
					if (!isNaN(num)) {
						nums.push(num);
					}
				}
		
				for (let num of nums) {
					this._sets.makeset(num);
				}
		
				for (let i = 0; i < nums.length - 1; i++) {
					this._sets.union(nums[i], nums[i + 1]);
				}
		
				// console.log(nums);
			}
		} catch (err) {
			throw err;
		}
	}
}

class SetLog {
	private _sets: DisjointSet;

	constructor(sets: DisjointSet) {
		this._sets = sets;
	}

	public logSet() : void {
		/*
		Output the number of sets, the minimum member and 
		size of each set in a disjoint set
		Args:
			no args
		Returns:
			no returns
		*/
		var roots = this._sets.rootSet;
		console.log(`The number of sets is ${ roots.size }.`);
		console.log('The minimum member and the size of each set are:');
		console.log('Min  Size');
		console.log('*********');

		roots.forEach((value) => {
			console.log(`${ value.min }  ${ value.size }`);
		});
	}
}