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
          handle.call(this, ...arg)
        })
      }
    } else {
      if (isFn) {
        handle.apply(this, arg)
      } else {
        handle.forEach(v => {
          handle.apply(this, arg)
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
      delete events.get(type)
    } else {
      handle.forEach((v, index) => {
        if (v === fn) handle.splice(index, 1)
        break
      });
    }
    if (events.has('removeListener')) {
      this.emit('removeListener', type, fn)
    }
    return true
  }
}

let b = new EventEmitter()
b.addListener('newListener', function() {
  console.log(arguments)
})
b.addListener('type', () => {
  console.log('object')
})
