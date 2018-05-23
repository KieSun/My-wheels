class Element {
  /**
   * @param {string} tag 'div'
   * @param {object} props { class: 'item' }
   * @param {Array} children [ Element1, 'text']
   */
  constructor(tag, props, children) {
    this.tag = tag
    this.props = props
    this.children = children
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

let span = new Element('span', { src: 'my-span' }, ['span'])
let div = new Element('p', { class: 'my-p1' }, ['div', span])
let div1 = new Element('p', { class: 'my-p2' }, ['div1'])
let root = new Element('div', { class: 'my-div' }, [div, div1])

root.render()
