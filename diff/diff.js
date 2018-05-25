// import * as Util from './util'

function diff(oldDomTree, newDomTree) {
  let pathchs = {}
  dfs(oldDomTree, newDomTree, 0, pathchs)
  return pathchs
}

function dfs(oldNode, newNode, index, patches) {
  // 1. node and key is not same, replace oldNode
  // 2. node is same, but text is not same, replace text
  // 3. node is same, but props is not same, diff props
  // 4. node is same and node has children, list diff children
  // 5. newNode is null, nothing to do
  let curPatches = []
  if (isString(oldNode) && isString(newNode) && oldNode !== newNode) {
    curPatches.push({ type: StateEnums.ChangeText, node: newNode })
  } else if (oldNode.children) {
    diffChildren(oldNode.children, newNode.children, index, patches)
  }
  if (curPatches.length) patches[index] = curPatches
}

function diffChildren(oldChild, newChild, index, patches) {
  oldChild.forEach((e, index) => {
    dfs(e, newChild[index], index, patches)
  })
}

// export default diff
