let test6 = new Element('div', { class: 'my-div' }, ['test6'], 'test6')

let test7 = new Element('div', { class: 'my-div' }, [test6, 'test7'], 'test7')
let test77 = new Element('div', { class: 'my-div' }, ['test77'], 'test7')
import Element from './element'
import diff from './diff'
import patch from './patch'

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

let test4 = new Element('div', { class: 'my-div' }, ['test4'])
let test5 = new Element('ul', { class: 'my-div' }, ['test5'])

let test1 = new Element('div', { class: 'my-div' }, [test4])

let test2 = new Element('div', { id: '11' }, [test5, test4])

let root = test1.render()

let pathchs = diff(test1, test2)
console.log(pathchs)

setTimeout(() => {
  console.log('开始更新')
  patch(root, pathchs)
  console.log('结束更新')
}, 1000)
