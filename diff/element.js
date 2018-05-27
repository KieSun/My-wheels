// import diff from './diff'

class Element {
  /**
   * @param {String} tag 'div'
   * @param {Object} props { class: 'item' }
   * @param {Array} children [ Element1, 'text']
   * @param {String} key option
   */
  constructor(tag, props, children, key) {
    this.tag = tag
    this.props = props
    if (Array.isArray(children)) {
      this.children = children
    } else {
      this.children = null
      this.key = children
    }
  }
  // 渲染
  render() {
    let root = this.createElement(this.tag, this.props, this.children)
    document.body.appendChild(root)
  }
  // 创建节点
  createElement(tag, props, child) {
    // 通过 tag 创建节点
    let el = document.createElement(tag)
    // 设置节点属性
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const value = props[key]
        el.setAttribute(key, value)
      }
    }
    // 递归添加子节点
    if (child) {
      child.forEach(element => {
        let child
        if (element instanceof Element) {
          child = this.createElement(
            element.tag,
            element.props,
            element.children
          )
        } else {
          child = document.createTextNode(element)
        }
        el.appendChild(child)
      })
    }
    return el
  }
}

let root = new Element('div', { class: 'my-div' }, ['root'])

let root1 = new Element('div', { class: 'my-div' }, ['root1'])

root.render()
