class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BST {
  constructor() {
    this.root = null
    this.size = 0
  }
  getSize() {
    return this.size
  }
  isEmpty() {
    return this.size === 0
  }
  addNode(v) {
    this.root = this.addChild(this.root, v)
  }
  addChild(node, v) {
    if (node.value > v) {
      node.left = this.addChild(node.left, v)
    } else if (node.value < 0) {
      node.right = this.addChild(node.right, v)
    }
    return node
  }
  preTraversal() {
    pre(this.root)
  }
  pre(node) {
    if (this.root) {
      console.log(this.root.value)
      pre(this.root.left)
      pre(this.root.right)
    }
  }
  midTraversal() {
    pre(this.root)
  }
  mid(node) {
    if (this.root) {
      mid(this.root.left)
      console.log(this.root.value)
      mid(this.root.right)
    }
  }
  backTraversal() {
    pre(this.root)
  }
  back(node) {
    if (this.root) {
      back(this.root.left)
      back(this.root.right)
      console.log(this.root.value)
    }
  }
}
