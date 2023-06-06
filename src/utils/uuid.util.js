const { v4: uuidv4 } = require('uuid')
export function guid() {
  // 将原来的32位uuid改为24位
  // function S4() {
  //   return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  // }
  // return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
  return uuidv4()
    .substring(8)
    .replace(/-/g, '')
}
