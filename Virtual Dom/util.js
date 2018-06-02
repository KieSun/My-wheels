export let StateEnums = {
  ChangeText: 0,
  ChangeProps: 1,
  Insert: 2,
  Move: 3,
  Remove: 4,
  Replace: 5
}

export function isString(str) {
  return typeof str === 'string'
}

export function move(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length
  }
  while (new_index < 0) {
    new_index += arr.length
  }
  if (new_index >= arr.length) {
    let k = new_index - arr.length
    while (k-- + 1) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}
