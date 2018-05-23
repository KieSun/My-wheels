class EventEmitter {
  constructor() {
    if (typeof EventEmitter.instance === 'object') {
      return EventEmitter.instance
    }
    EventEmitter.instance = this
    this._events = new Map()
  }
  addListener(type, fn) {
    if (typeof fn !== 'function') {
      throw Error('fn 不是函数类型')
    }
    let events = this._events
    let handle = events.get(type)
    if (!handle) {
      events.set(type, fn)
    } else if (typeof handle === 'function') {
      events.set(type, [handle, fn])
    } else if (Array.isArray(handle)) {
      events.set(type, handle.concat(fn))
    }

    if (events.has('newListener') && type !== 'newListener') {
      this.emit('newListener', type, fn)
    }

    return fn
  }
  emit(type, ...arg) {
    if (type === 'error') {
      let error
      if (arg) {
        error = arg[0]
      }
      if (error instanceof Error) {
        throw error
      } else {
        let err = new Error(`Unhandled "error" event. ${error}`)
        throw err
      }
      return false
    }

    let events = this._events
    let handle = events.get(type)
    if (!handle) return
    let isFn = typeof handle === 'function'

    if (arg.length < 4) {
      if (isFn) {
        handle.call(this, ...arg)
      } else {
        handle.forEach(v => {
          v.call(this, ...arg)
        })
      }
    } else {
      if (isFn) {
        handle.apply(this, arg)
      } else {
        handle.forEach(v => {
          v.apply(this, arg)
        })
      }
    }
    return true
  }
  removeListener(type, fn) {
    if (typeof fn !== 'function') {
      throw Error('fn 不是函数类型')
    }
    let events = this._events
    let handle = events.get(type)
    if (!handle) return false
    let isFn = typeof handle === 'function'
    if (isFn) {
      events.delete(type)
    } else {
      for (let i = 0; i < handle.length; i++) {
        let v = handle[i]
        if (v === fn) {
          handle.splice(i, 1)
          break
        }
      }
    }
    if (events.has('removeListener')) {
      this.emit('removeListener', type, fn)
    }
    console.log(events)
    return true
  }

  removeAllListener() {
    let events = this._events
    let keys = events.keys()
    if (!keys) return false

    let next = keys.next().value
    while (next) {
      events.delete(next)
      next = keys.next().value
    }
    return true
  }
}

let b = new EventEmitter()
let fn = b.addListener('type', function(v) {
  console.log('type2-----', v)
})
let fn1 = b.addListener('type', function(v) {
  console.log('type1----', v)
})
let fn3 = b.addListener('type', v => {
  console.log('object------', v)
})
b.emit('type', 'v222')
