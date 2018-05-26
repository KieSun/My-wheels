// import Queue from '../queue/queue'

class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
    this.size = 1
  }
}

class BST {
  constructor() {
    this.root = null
  }
  _getSize(node) {
    return node ? node.size : 0
  }
  isEmpty() {
    return this.root != null
  }
  addNode(v) {
    this.root = this._addChild(this.root, v)
  }
  // 添加节点时，需要比较添加的节点值和当前
  // 节点值的大小
  _addChild(node, v) {
    if (!node) {
      return new Node(v)
    }
    if (node.value > v) {
      node.size++
      node.left = this._addChild(node.left, v)
    } else if (node.value < v) {
      node.size++
      node.right = this._addChild(node.right, v)
    }
    return node
  }
  // 先序遍历可用于打印树的结构
  // 先序遍历先访问根节点，然后访问左节点，最后访问右节点。
  preTraversal() {
    this._pre(this.root)
  }
  _pre(node) {
    if (node) {
      console.log(node.value)
      this._pre(node.left)
      this._pre(node.right)
    }
  }
  // 中序遍历可用于排序
  // 对于 BST 来说，中序遍历可以实现一次遍历就
  // 得到有序的值
  // 中序遍历表示先访问左节点，然后访问根节点，最后访问右节点。
  midTraversal() {
    this._mid(this.root)
  }
  _mid(node) {
    if (node) {
      this._mid(node.left)
      console.log(node.value)
      this._mid(node.right)
    }
  }
  // 后序遍历可用于先操作子节点
  // 再操作父节点的场景
  // 后序遍历表示先访问左节点，然后访问右节点，最后访问根节点。
  backTraversal() {
    this._back(this.root)
  }
  _back(node) {
    if (node) {
      this._back(node.left)
      this._back(node.right)
      console.log(node.value)
    }
  }
  breadthTraversal() {
    if (!this.root) return null
    let q = new Queue()
    // 将根节点入队
    q.enQueue(this.root)
    // 循环判断队列是否为空，为空
    // 代表树遍历完毕
    while (!q.isEmpty()) {
      // 将队首出队，判断是否有左右子树
      // 有的话，就先左后右入队
      let n = q.deQueue()
      console.log(n.value)
      if (n.left) q.enQueue(n.left)
      if (n.right) q.enQueue(n.right)
    }
  }
  getMin() {
    return this._getMin(this.root).value
  }
  _getMin(node) {
    if (!node.left) return node
    return this._getMin(node.left)
  }
  getMax() {
    return this._getMax(this.root).value
  }
  _getMax(node) {
    if (!node.right) return node
    return this._getMin(node.right)
  }
  floor(v) {
    let node = this._floor(this.root, v)
    return node ? node.value : null
  }
  _floor(node, v) {
    if (!node) return null
    if (node.value === v) return v
    // 如果当前节点值还比需要的值大，就继续递归
    if (node.value > v) {
      return this._floor(node.left, v)
    }
    // 判断当前节点是否拥有右子树
    let right = this._floor(node.right, v)
    if (right) return right
    return node
  }
  ceil(v) {
    let node = this._ceil(this.root, v)
    return node ? node.value : null
  }
  _ceil(node, v) {
    if (!node) return null
    if (node.value === v) return v
    // 如果当前节点值还比需要的值小，就继续递归
    if (node.value < v) {
      return this._ceil(node.right, v)
    }
    // 判断当前节点是否拥有左子树
    let left = this._ceil(node.left, v)
    if (left) return left
    return node
  }
  select(k) {
    let node = this._select(this.root, k)
    return node ? node.value : null
  }
  _select(node, k) {
    if (!node) return null
    // 先获取左子树下有几个节点
    let size = this._getSize(node.left)
    // 判断 size 是否大于 k
    // 如果大于 k，代表所需要的节点在左节点
    if (size > k) return this._select(node.left, k)
    // 如果小于 k，代表所需要的节点在右节点
    // 注意这里需要重新计算 k，减去根节点除了右子树的节点数量
    if (size < k) return this._select(node.right, k - size - 1)
    return node
  }
  delectMin() {
    this.root = this._delectMin(this.root)
    console.log(this.root)
  }
  _delectMin(node) {
    // 一直递归左子树
    // 如果左子树为空，就判断节点是否拥有右子树
    // 有右子树的话就把需要删除的节点替换为右子树
    if ((node != null) & !node.left) return node.right
    node.left = this._delectMin(node.left)
    // 最后需要重新维护下节点的 `size`
    node.size = this._getSize(node.left) + this._getSize(node.right) + 1
    return node
  }
  delectMax() {
    this.root = this._delectMax(this.root)
    console.log(this.root)
  }
  _delectMax(node) {
    // 一直递归右子树
    // 如果右子树为空，就判断节点是否拥有左子树
    // 有左子树的话就把需要删除的节点替换为左子树
    if ((node != null) & !node.right) return node.left
    node.right = this._delectMax(node.right)
    // 最后需要重新维护下节点的 `size`
    node.size = this._getSize(node.left) + this._getSize(node.right) + 1
    return node
  }
  delect(v) {
    this.root = this._delect(this.root, v)
  }
  _delect(node, v) {
    if (!node) return null
    // 寻找的节点比当前节点小，去左子树找
    if (node.value < v) {
      node.right = this._delect(node.right, v)
    } else if (node.value > v) {
      // 寻找的节点比当前节点大，去右子树找
      node.left = this._delect(node.left, v)
    } else {
      // 进入这个条件说明已经找到节点
      // 先判断节点是否拥有拥有左右子树中的一个
      // 是的话，将子树返回出去，这里和 `_delectMin` 的操作一样
      if (!node.left) return node.right
      if (!node.right) return node.left
      // 进入这里，代表节点拥有左右子树
      // 先取出当前节点的后继结点，也就是取当前节点右子树的最小值
      let min = this._getMin(node.right)
      // 取出最小值后，删除最小值
      // 然后把删除节点后的子树赋值给最小值节点
      min.right = this._delectMin(node.right)
      // 左子树不动
      min.left = node.left
      node = min
    }
    // 维护 size
    node.size = this._getSize(node.left) + this._getSize(node.right) + 1
    return node
  }
}

let t = new BST()
t.addNode(7)
t.addNode(11)
t.addNode(10)
t.addNode(4)
t.addNode(1)
t.addNode(18)
t.delect(11)
