function diff(oldDomTree, newDomTree) {
  let pathchs = {}
  dfs(oldDomTree, newDomTree, 0, pathchs)
  return pathchs
}

function dfs(oldNode, newNode, index, patches) {
  // 1. tagName and key is not same, replace oldNode
  // 2. node is same, but text is not same, replace text
  // 3. node is same, but props is not same, diff props
  // 4. node is same and has children, list diff children
  // 5. newNode is null, nothing to do
  let curPatches = []
  if (!newNode) {
  } else if (newNode.tag === oldNode.tag && newNode.key === oldNode.key) {
    let props = diffProps(oldNode.props, newNode.props)
    if (props.length) curPatches.push({ type: StateEnums.ChangeProps, props })
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    curPatches.push({ type: StateEnums.Replace, node: newNode })
  }

  if (curPatches.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(curPatches)
    } else {
      patches[index] = curPatches
    }
  }
}

function diffChildren(oldChild, newChild, index, patches) {
  let { changes, map } = listDiff(oldChild, newChild, index, patches)
  if (changes.length) {
    if (patches[index]) {
      patches[index] = patches[index].concat(changes)
    } else {
      patches[index] = changes
    }
  }
  let last = null
  oldChild &&
    oldChild.forEach((item, i) => {
      let child = item && item.children
      if (child) {
        index =
          last && last.children ? index + last.children.length + 1 : index + 1
        let keyIndex = Object.keys(map).length ? map[item.key] : -1
        let node = newChild[keyIndex]
        if (node) {
          dfs(item, node, index, patches)
        }
      } else index += 1
      last = item
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
        prop: key
      })
    }
  }
  for (const key in newProps) {
    if (newProps.hasOwnProperty(key)) {
      const prop = newProps[key]
      if (oldProps[key] && oldProps[key] !== newProps[key]) {
        change.push({
          prop: key,
          value: newProps[key]
        })
      } else if (!oldProps[key]) {
        change.push({
          prop: key,
          value: newProps[key]
        })
      }
    }
  }
  return change
}

function listDiff(oldList, newList, index, patches) {
  let oldKeys = getKeys(oldList)
  let newKeys = getKeys(newList)
  let changes = []
  let map = {}
  let node = null

  oldList &&
    oldList.forEach((item, i) => {
      let key = item.key
      if (isString(item)) {
        key = item
      }
      // 寻找新的 children 中是否含有当前节点
      // 没有的话需要删除
      let index = newKeys.indexOf(key)
      if (index === -1) {
        changes.push({
          type: StateEnums.Remove,
          node: item,
          index: i
        })
      }
    })
  newList &&
    newList.forEach((item, i) => {
      let key = item.key
      if (isString(item)) {
        key = item
      }
      // 寻找旧的 children 中是否含有当前节点
      let index = oldKeys.indexOf(key)
      // 没找到代表新节点，需要插入
      if (index === -1) {
        changes.push({
          type: StateEnums.Insert,
          node: item,
          index: i
        })
      } else {
        // 找到了，需要判断是否需要移动
        let index = newKeys.indexOf(key)
        if (index !== i) {
          changes.push({
            type: StateEnums.Move,
            from: index,
            to: i
          })
        }
        map[key] = index
      }
      node = key
    })

  return { changes, map }
}

function getKeys(list) {
  let keys = []
  let text
  list &&
    list.forEach(item => {
      let key
      if (isString(item)) {
        key = [item]
      } else if (item instanceof Element) {
        key = item.key
      }
      keys.push(key)
    })
  return keys
}

let test6 = new Element('div', { class: 'my-div' }, ['test6'], 'test6')

let test7 = new Element('div', { class: 'my-div' }, [test6, 'test7'], 'test7')
let test77 = new Element('div', { class: 'my-div' }, ['test77'], 'test7')

let test8 = new Element('div', { class: 'my-div' }, ['test8'], 'test8')

let test3 = new Element(
  'div',
  { class: 'my-div' },
  [test6, test7, 'test3'],
  'test3'
)
let test33 = new Element(
  'div',
  { class: 'my-div' },
  [test77, 'text33', test8],
  'test3'
)

let test4 = new Element('div', { class: 'my-div' }, ['test4'], 'test4')
let test5 = new Element('div', { class: 'my-div' }, ['test5'], 'test5')

let test1 = new Element('div', { class: 'my-div' }, ['test1', test3])

let test2 = new Element('div', { id: '11' }, ['test2', test4, test5, test33])

let root = test1.render()
// export default diff

function patch(node, oldTree, index, patchs) {
  let changes = patchs[index]

  let childNodes = node && node.childNodes
  let oldTreeChild = oldTree && oldTree.children

  let last = null
  childNodes &&
    childNodes.forEach((item, i) => {
      let child = item && item.childNodes
      console.log(index)
      if (child) {
        index =
          last && last.children ? index + last.children.length + 1 : index + 1
        patch(item, oldTreeChild[i], index, patchs)
      } else index++
      last = item
    })
  if (changes && changes.length) changeDom(node, oldTreeChild, changes)
}

function changeDom(node, tree, changes) {
  changes &&
    changes.forEach(change => {
      let { type } = change
      switch (type) {
        case StateEnums.ChangeText:
          // node.textContent = change.text
          let child = node.childNodes
          if (child) {
            child.forEach((item, i) => {
              if (item.nodeType === 3) {
                child[i].textContent = change.text
              }
            })
          } else node.appendChild(document.createTextNode(change.text))
          break
        case StateEnums.ChangeProps:
          let { props } = change
          props.forEach(item => {
            if (item.value) {
              node.setAttribute(item.prop, item.value)
            } else {
              node.removeAttribute(item.prop)
            }
          })
          break
        case StateEnums.Remove:
          console.log(change, 111)
          break
        case StateEnums.Insert:
          node.insertBefore(change.node.create(), node.childNodes[change.index])
          break
      }
    })
}

let pathchs = diff(test1, test2)
console.log(pathchs)

// setTimeout(() => {
//   console.log('开始更新')
patch(root, test1, 0, pathchs)
//   console.log('结束更新')
// })
