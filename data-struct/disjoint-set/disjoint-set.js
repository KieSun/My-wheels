class DisjointSet {
  // 初始化样本
  constructor(count) {
    // 初始化时，每个节点的父节点都是自己
    this.parent = new Array(count)
    // 用于记录树的深度，优化搜索复杂度
    this.rank = new Array(count)
    for (let i = 0; i < count; i++) {
      this.parent[i] = i
      this.rank[i] = 1
    }
  }
  find(p) {
    // 寻找当前节点的父节点是否为自己，不是的话表示还没找到
    // 开始进行路径压缩优化
    // 假设当前节点父节点为 A
    // 将当前节点挂载到 A 节点的父节点上，达到压缩深度的目的
    while (p != this.parent[p]) {
      this.parent[p] = this.parent[this.parent[p]]
      p = this.parent[p]
    }
    return p
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  // 合并
  union(p, q) {
    // 找到两个数字的父节点
    let i = this.find(p)
    let j = this.find(q)
    if (i === j) return
    // 判断两棵树的深度，深度小的加到深度大的树下面
    // 如果两棵树深度相等，那就无所谓怎么加
    if (this.rank[i] < this.rank[j]) {
      this.parent[i] = j
    } else if (this.rank[i] > this.rank[j]) {
      this.parent[j] = i
    } else {
      this.parent[i] = j
      this.rank[j] += 1
    }
  }
}

let d = new DisjointSet(10)
d.union(1, 2)
d.union(3, 4)
d.union(4, 5)
d.union(1, 7)
console.log(d.find(5))
console.log(d.isConnected(1, 7))
