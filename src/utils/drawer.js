let drawerInstanceStack = []

export function pushDrawerStack(instance) {
  drawerInstanceStack.push(instance)
}

export function popDrawerStack() {
  return drawerInstanceStack.pop()
}

export function getTopInstance() {
  let len = drawerInstanceStack.length
  return len > 0 ? drawerInstanceStack[len - 1] : null
}
export function getInstanceStackLength() {
  return drawerInstanceStack.length
}

export function destroyedInstance(instance) {
  let index = drawerInstanceStack.indexOf(instance)
  if (index !== -1) {
    drawerInstanceStack.splice(index, 1)
  }
}
