// function diff(oldDomTree, newDomTree) {
//   let pathchs = {}
//   dfs(oldDomTree, newDomTree, 0, pathchs)
//   return pathchs
// }

function dfs(oldNode, newNode, index, patches) {
  // 1. tagName and key is not same, replace oldNode
  // 2. node is same, but text is not same, replace text
  // 3. node is same, but props is not same, diff props
  // 4. node is same and has children, list diff children
  // 5. newNode is null, nothing to do
  let curPatches = []
  if (isString(oldNode) && isString(newNode) && oldNode !== newNode) {
    curPatches.push({ type: StateEnums.ChangeText, node: newNode })
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    let props = diffProps(oldNode, newNode)
    if (r) {
      curPatches.push({ type: StateEnums.ChangeProps, props })
    }
    let changes = listDiff(oldNode.children, newNode.children)
  } else if (!newNode) {
  } else {
    curPatches.push({ type: StateEnums.Replace, node: newNode })
  }

  if (curPatches.length) patches[index] = curPatches
}

function diffChildren(oldChild, newChild, index, patches) {
  oldChild.forEach((e, index) => {
    dfs(e, newChild[index], index, patches)
  })
}

function diffProps(oldProps, newProps) {
  // 判断 Props 分以下三步骤
  // 先遍历 oldProps 查看是否存在删除的属性
  // 然后遍历 newProps 查看是否有属性值被修改
  // 最后查看是否有属性新增
  let change = []
  for (const key in oldProps) {
    if (oldProps.hasOwnProperty(key) && !newProps[key]) {
      change.push({
        type: StateEnums.RemoveProps,
        prop: key
      })
    }
  }
  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const prop = newProps[key]
      if (oldProps[key] && oldProps[key] !== newProps[key]) {
        change.push({
          type: StateEnums.ChangeProps,
          prop: key,
          value: newProps[key]
        })
      } else {
        change.push({
          type: StateEnums.AddProps,
          prop: key,
          value: newProps[key]
        })
      }
    }
  }
  return change
}

function listDiff(oldList, newList) {
  let oldKeys = getKeys(oldList).keys
  let newKeys = getKeys(newList).keys
  console.log(newKeys)
  let changes = []
  let node = null
  // 用于减少不必要的移动
  // 可以考虑以下情况
  // oldKeys: 1, 2, 3, 4
  // newkeys: 5, 1, 2, 3, 4
  // 对于以上情况，5 插入到首位以后，后面的元素相对于
  // newkeys 中的位置是不变的，所以不需要移动
  // 如果只是单纯的去判断元素在新旧中的位置是否相同
  // 而决定是否移动的话，其实是不必要的
  let lastIndex = 0

  newKeys.forEach(key => {
    // 寻找旧的 children 中是否含有当前节点
    let index = oldKeys.indexOf(key)
    // 没找到代表新节点，需要插入
    if (index === -1) {
      changes.push({
        type: StateEnums.Insert,
        node: key,
        after: node
      })
    } else {
      // 找到了，需要判断是否需要移动
      if (index < lastIndex) {
        changes.push({
          type: StateEnums.Move,
          node: key,
          after: node
        })
      }
      lastIndex = Math.max(lastIndex, index)
    }
    node = key
  })

  oldKeys.forEach(key => {
    // 寻找新的 children 中是否含有当前节点
    // 没有的话需要删除
    let index = newKeys.indexOf(key)
    if (index === -1) {
      changes.push({
        type: StateEnums.Remove,
        node: key
      })
    }
  })

  return changes
}

function getKeys(list) {
  let keys = []
  let text = []
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    if (item instanceof Element) {
      keys.push(item.key)
    } else {
      text.push(item)
    }
  }
  return { keys, text }
}

let test1 = new Element('div', { class: 'my-div' }, 'test1')

let test2 = new Element('div', { class: 'my-div' }, 'test2')
let test3 = new Element('div', { class: 'my-div' }, 'test3')

let a1 = [test1, test2, '1111']
let a2 = [test1, test3, '11112']
// console.log(listDiff(a1, a2))

console.log(diffProps({ class: 'my-div' }, { class: 'my-di', id: 111 }))

// export default diff
