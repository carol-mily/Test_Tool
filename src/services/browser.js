const CONTENT_SCRIPT_PATH = 'js/content-script.js'

export default {
  //获得页面的URL
  getActiveTab() {
    //封装入函数
    return new Promise(function(resolve) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => resolve(tab))
    })
  },

  //允许使用await关键字，无需刻意地链式调用promise
  async sendTabMessage({ action, value, clean } = {}) {
    //异步，它会暂停代码在该行上，直到 promise 完成，然后返回结果值
    const tab = await this.getActiveTab()
     //扩展程序页面发送请求消息给content scripts
    chrome.tabs.sendMessage(tab.id, { action, value, clean })
  },

  //注入内容脚本
  injectContentScript() {
    return new Promise(function(resolve) {
      //将JavaScript 代码注入页面
      chrome.tabs.executeScript({ file: CONTENT_SCRIPT_PATH, allFrames: false }, res =>
        resolve(res)
      )
    })
  },

  //在content scripts与Chrome扩展程序页面之间建立通道，可以处理多个消息。
    //在通道的两端分别拥有一个chrome.runtime.Port对象，用以收发消息。
  getBackgroundBus() {
    return chrome.extension.connect({ name: 'recordControls' })
  },
}
