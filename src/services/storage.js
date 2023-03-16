export default {
  //chrome.storage.local将数据存储在当前登录的设备本地
  get(keys) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available')
    }
    //从存储区域中检索一个或多个项目
    return new Promise(resolve => chrome.storage.local.get(keys, props => resolve(props)))
  },

  set(props) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available')
    }
    //在存储区存储一个或多个项目。如果该项目已存在，则其值将被更新。
    //当设置一个值时，该storage.onChanged事件将触发。
    return new Promise(resolve => chrome.storage.local.set(props, res => resolve(res)))
  },

  remove(keys) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available')
    }
    //从存储区域中移除一个或多个项目。
    return new Promise(resolve => chrome.storage.local.remove(keys, res => resolve(res)))
  },
}
