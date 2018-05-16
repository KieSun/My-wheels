// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// 创建对象
var objectCreate = Object.create || objectCreatePolyfill
// 获取对象所有的 key
var objectKeys = Object.keys || objectKeysPolyfill
// bind 方法
var bind = Function.prototype.bind || functionBindPolyfill

// 构造函数
function EventEmitter() {
  // 判断 _events 是否有值
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null)
    this._eventsCount = 0
  }

  this._maxListeners = this._maxListeners || undefined
}
// module.exports = EventEmitter

// Backwards-compat with node 0.10.x
// 向后兼容
EventEmitter.EventEmitter = EventEmitter

EventEmitter.prototype._events = undefined
EventEmitter.prototype._maxListeners = undefined

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
// 默认最大监听者数量，如果大于这个数量会报警告。这个可以用来帮助寻找内存泄露
var defaultMaxListeners = 10

// 判断环境是否可以使用 Object.defineProperty
var hasDefineProperty
try {
  var o = {}
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 })
  hasDefineProperty = o.x === 0
} catch (err) {
  hasDefineProperty = false
}
// 设置 defaultMaxListeners 这个属性
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function () {
      return defaultMaxListeners
    },
    set: function (arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number')
      defaultMaxListeners = arg
    }
  })
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
// 设置最大监听者，为零时不限制
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  // 判断参数类型
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number')
  this._maxListeners = n
  return this
}

// 获取最大监听者个数
function $getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners
  return that._maxListeners
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this)
}

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.

// 三个 arg 使用 apply 调用，否则使用 call
function emitNone(handler, isFn, self) {
  if (isFn) handler.call(self)
  else {
    var len = handler.length
    var listeners = arrayClone(handler, len)
    for (var i = 0; i < len; ++i) listeners[i].call(self)
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn) handler.call(self, arg1)
  else {
    var len = handler.length
    var listeners = arrayClone(handler, len)
    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1)
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn) handler.call(self, arg1, arg2)
  else {
    var len = handler.length
    var listeners = arrayClone(handler, len)
    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2)
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn) handler.call(self, arg1, arg2, arg3)
  else {
    var len = handler.length
    var listeners = arrayClone(handler, len)
    for (var i = 0; i < len; ++i) listeners[i].call(self, arg1, arg2, arg3)
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn) handler.apply(self, args)
  else {
    var len = handler.length
    var listeners = arrayClone(handler, len)
    for (var i = 0; i < len; ++i) listeners[i].apply(self, args)
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events
  var doError = type === 'error'

  events = this._events
  if (events) doError = doError && events.error == null
  else if (!doError) return false

  // If there is no 'error' event listener then throw.
  if (doError) {
    // 这样调用 emit('error', '出错了') 会触发
    if (arguments.length > 1) er = arguments[1]
    if (er instanceof Error) {
      throw er // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')')
      err.context = er
      throw err
    }
    return false
  }

  // 把这个事件的监听者取出来
  handler = events[type]
  if (!handler) return false
  // 判断 handler 类型
  var isFn = typeof handler === 'function'
  // 判断函数中的参数长度
  len = arguments.length
  switch (len) {
    // fast cases
    case 1:
      emitNone(handler, isFn, this)
      break
    case 2:
      emitOne(handler, isFn, this, arguments[1])
      break
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2])
      break
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3])
      break
    // slower
    // 参数大于三个运行起来就会相对慢
    default:
      args = new Array(len - 1)
      for (i = 1; i < len; i++) args[i - 1] = arguments[i]
      emitMany(handler, isFn, this, args)
  }

  return true
}

/**
 * @param {any} this
 * @param {any} 事件名
 * @param {any} 必须函数类型
 * @param {any} 如果为 true，就把 listener 放到 listeners 数组首位
 * @returns
 */
function _addListener(target, type, listener, prepend) {
  var m
  var events
  var existing
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function')

  events = target._events
  if (!events) {
    events = target._events = objectCreate(null)
    target._eventsCount = 0
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit(
        'newListener',
        type,
        listener.listener ? listener.listener : listener
      )

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events
    }
    existing = events[type]
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    // 不存在这个事件，就把函数赋值过去
    existing = events[type] = listener
    ++target._eventsCount
  } else {
    // 判断 existing 是数组还是函数
    // 根据 prepend 将当前 listener 插入
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend
        ? [listener, existing]
        : [existing, listener]
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener)
      } else {
        existing.push(listener)
      }
    }

    // Check for listener leak
    // 判断 listener 是否过多
    if (!existing.warned) {
      // 如果当前监听者个数大于最大上线，报警告
      m = $getMaxListeners(target)
      if (m && m > 0 && existing.length > m) {
        existing.warned = true
        var w = new Error(
          'Possible EventEmitter memory leak detected. ' +
          existing.length +
          ' "' +
          String(type) +
          '" listeners ' +
          'added. Use emitter.setMaxListeners() to ' +
          'increase limit.'
        )
        w.name = 'MaxListenersExceededWarning'
        w.emitter = target
        w.type = type
        w.count = existing.length
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message)
        }
      }
    }
  }

  return target
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false)
}

EventEmitter.prototype.on = EventEmitter.prototype.addListener

EventEmitter.prototype.prependListener = function prependListener(
  type,
  listener
) {
  return _addListener(this, type, listener, true)
}

// 包装后的 listener
function onceWrapper() {
  if (!this.fired) {
    // 没执行过就进来，先删除当前 listener，然后执行 listener
    this.target.removeListener(this.type, this.wrapFn)
    this.fired = true
    // 以下调用和 emit 中一样
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target)
      case 1:
        return this.listener.call(this.target, arguments[0])
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1])
      case 3:
        return this.listener.call(
          this.target,
          arguments[0],
          arguments[1],
          arguments[2]
        )
      default:
        var args = new Array(arguments.length)
        for (var i = 0; i < args.length; ++i) args[i] = arguments[i]
        this.listener.apply(this.target, args)
    }
  }
}

// 包装 listener
function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  }
  var wrapped = bind.call(onceWrapper, state)
  wrapped.listener = listener
  state.wrapFn = wrapped
  return wrapped
}

// 监听只执行一次
EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function')
  this.on(type, _onceWrap(this, type, listener))
  return this
}

EventEmitter.prototype.prependOnceListener = function prependOnceListener(
  type,
  listener
) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function')
  this.prependListener(type, _onceWrap(this, type, listener))
  return this
}

// Emits a 'removeListener' event if and only if the listener was removed.
// 如果用户监听了这个事件，删除监听者会发送 removeListener 事件
EventEmitter.prototype.removeListener = function removeListener(
  type,
  listener
) {
  var list, events, position, i, originalListener

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function')

  events = this._events
  if (!events) return this

  list = events[type]
  if (!list) return this
  // 以上都是在判断边界

  // 开始删除当前 listener
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = objectCreate(null)
    else {
      delete events[type]
      if (events.removeListener)
        this.emit('removeListener', type, list.listener || listener)
    }
  } else if (typeof list !== 'function') {
    position = -1
    // 从后往前删
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener
        position = i
        break
      }
    }
    // 找不到当前 listener
    if (position < 0) return this

    // 根据索引删除对应 listener
    if (position === 0) list.shift()
    else spliceOne(list, position)

    // 如果数组只有一个了，就把 events[type] 赋值为函数
    if (list.length === 1) events[type] = list[0]

    if (events.removeListener)
      this.emit('removeListener', type, originalListener || listener)
  }

  return this
}

// 移除该事件所有监听者
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i

  events = this._events
  console.log(events.removeListener)
  if (!events) return this
  // 以上边界判断

  // not listening for removeListener, no need to emit
  if (!events.removeListener) {
    if (arguments.length === 0) {
      this._events = objectCreate(null)
      this._eventsCount = 0
    } else if (events[type]) {
      if (--this._eventsCount === 0) this._events = objectCreate(null)
      else delete events[type]
    }
    return this
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = objectKeys(events)
    var key
    for (i = 0; i < keys.length; ++i) {
      key = keys[i]
      if (key === 'removeListener') continue
      this.removeAllListeners(key)
    }
    this.removeAllListeners('removeListener')
    this._events = objectCreate(null)
    this._eventsCount = 0
    return this
  }

  listeners = events[type]

  // 开始删除
  if (typeof listeners === 'function') {
    this.removeListener(type, listeners)
  } else if (listeners) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i])
    }
  }

  return this
}

// 获取当前事件的所有 listeners
function _listeners(target, type, unwrap) {
  var events = target._events

  if (!events) return []

  var evlistener = events[type]
  if (!evlistener) return []

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener]

  return unwrap
    ? unwrapListeners(evlistener)
    : arrayClone(evlistener, evlistener.length)
}

// 获得没有包装过得 listeners 数组
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true)
}
// 获得包装过得 listeners 数组
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false)
}

EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type)
  } else {
    return listenerCount.call(emitter, type)
  }
}

// 获取所有监听者的数量
EventEmitter.prototype.listenerCount = listenerCount
function listenerCount(type) {
  var events = this._events

  if (events) {
    var evlistener = events[type]

    if (typeof evlistener === 'function') {
      return 1
    } else if (evlistener) {
      return evlistener.length
    }
  }

  return 0
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : []
}

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k]
  list.pop()
}
// 克隆数组
function arrayClone(arr, n) {
  var copy = new Array(n)
  for (var i = 0; i < n; ++i) copy[i] = arr[i]
  return copy
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length)
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i]
  }
  return ret
}

function objectCreatePolyfill(proto) {
  var F = function () { }
  F.prototype = proto
  return new F()
}
function objectKeysPolyfill(obj) {
  var keys = []
  for (var k in obj)
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      keys.push(k)
    }
  return k
}
function functionBindPolyfill(context) {
  var fn = this
  return function () {
    return fn.apply(context, arguments)
  }
}
