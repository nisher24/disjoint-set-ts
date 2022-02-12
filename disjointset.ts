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

	// delete(x:number) : void {
	// 		optional implementation if it helps you answer the
	// 		question in README.md
	// }

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