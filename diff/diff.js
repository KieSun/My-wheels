// function diff(oldDomTree, newDomTree) {
//   let pathchs = {}
//   dfs(oldDomTree, newDomTree, 0, pathchs)
//   return pathchs
// }

// function dfs(oldNode, newNode, index, patches) {
//   // 1. tagName and key is not same, replace oldNode
//   // 2. node is same, but text is not same, replace text
//   // 3. node is same, but props is not same, diff props
//   // 4. node is same and has children, list diff children
//   // 5. newNode is null, nothing to do
//   let curPatches = []
//   if (isString(oldNode) && isString(newNode) && oldNode !== newNode) {
//     curPatches.push({ type: StateEnums.ChangeText, node: newNode })
//   } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
//     let props = diffProps(oldNode, newNode)
//     if (r) {
//       curPatches.push({ type: StateEnums.ChangeProps, props })
//     }
//   } else if (!newNode) {
//   } else {
//   }

//   if (curPatches.length) patches[index] = curPatches
// }

// function diffChildren(oldChild, newChild, index, patches) {
//   oldChild.forEach((e, index) => {
//     dfs(e, newChild[index], index, patches)
//   })
// }

// function diffProps(oldChild, newChild) {}

function listDiff(oldList, newList) {
  let oldKeys = getKeys(oldList)
  let newKeys = getKeys(newList)
}

function getKeys(list) {
  let keys = {}
  let text = []
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    if (item instanceof Element) {
      keys[item.key] = i
    } else {
      text.push(item)
    }
  }
  return { keys, text }
}

let test1 = new Element('div', { class: 'my-div' }, 'test1')

let test2 = new Element('div', { class: 'my-div' }, 'test2')

let a1 = [test1, test2, '1111']
let a2 = [test1, test2, '11112']
listDiff(a1, a2)

// export default diff
