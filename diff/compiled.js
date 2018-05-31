define(['./element', './diff', './patch'], function (_element, _diff, _patch) {
  'use strict';

  var _element2 = _interopRequireDefault(_element);

  var _diff2 = _interopRequireDefault(_diff);

  var _patch2 = _interopRequireDefault(_patch);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var test6 = new _element2.default('div', { class: 'my-div' }, ['test6'], 'test6');

  var test7 = new _element2.default('div', { class: 'my-div' }, [test6, 'test7'], 'test7');
  var test77 = new _element2.default('div', { class: 'my-div' }, ['test77'], 'test7');


  var test8 = new _element2.default('div', { class: 'my-div' }, ['test8'], 'test8');

  var test3 = new _element2.default('div', { class: 'my-div' }, [test6, test7, 'test3'], 'test3');
  var test33 = new _element2.default('div', { class: 'my-div' }, [test77, 'text33', test8], 'test3');

  var test4 = new _element2.default('div', { class: 'my-div' }, ['test4'], 'test4');
  var test5 = new _element2.default('div', { class: 'my-div' }, ['test5'], 'test5');

  var test1 = new _element2.default('div', { class: 'my-div' }, ['test1']);

  var test2 = new _element2.default('ul', { id: '11' }, ['test2']);

  var root = test1.render();
  // export default diff

  var pathchs = (0, _diff2.default)(test1, test2);
  console.log(pathchs);

  setTimeout(function () {
    console.log('开始更新');
    (0, _patch2.default)(root, pathchs);
    console.log('结束更新');
  }, 1000);
});
