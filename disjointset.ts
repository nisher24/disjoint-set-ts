class DisjointSet {
	constructor() {
		// fill in code here
	}

	makeset(x:number) : void {
		// fill in code here
	}

	find(x:number) : number|null {
		// fill in code here
	}

	union(x:number, y:number) : void {
		// fill in code here
	}

	// delete(x:number) : void {
	// 		optional implementation if it helps you answer the
	// 		question in README.md
	// }
}

class TreeNode {
	private val: number;
	private parent: TreeNode;
	private size: number; // number of nodes in the tree rooted at the node
	private min: number; // the minimum member of the tree rooted at the node

	constructor(val: number) {
		this.val = val;
		this.parent = this;
		this.size = 1;
		this.min = val;
	}

	// Getters and setters
	public get getVal() : number {
		return this.val;
	}

	public set setVal(val: number) {
		this.val = val;
	}

	public get getParent() : TreeNode {
		return this.parent;
	}

	public set setParent(parent: TreeNode) {
		this.parent = parent;
	}

	public get getSize() : number {
		return this.size;
	} 

	public set setSize(size: number) {
		this.size = size;
	}

	public get getMin() : number {
		return this.min;
	}

	public set setMin(min: number) {
		this.min = min;
	}
}