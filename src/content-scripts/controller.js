//Content Scripts是运行在Web页面的上下文的JavaScript文件
import { popupActions } from '@/services/constants'

import storage from '@/services/storage'

export default class HeadlessController {
  constructor({ overlay, recorder, store }) {
    this.backgroundListener = null

    this.store = store
    this.shooter = null
    this.overlay = overlay
    this.recorder = recorder
  }

  async init() {
    //关键
    const { options } = await storage.get(['options'])

    const { dataAttribute } = options ? options.code : {}

    this.store.commit('setDataAttribute', dataAttribute)

    this.recorder.init(() => this.listenBackgroundMessages())
  }

 //没有它会变成两个
  listenBackgroundMessages() {
    this.backgroundListener = this.backgroundListener || this.handleBackgroundMessages.bind(this)
    chrome.runtime.onMessage.addListener(this.backgroundListener)
  }

 
  async handleBackgroundMessages(msg) {
    if (!msg?.action) {
      return
    }

    switch (msg.action) {
      case popupActions.STOP:
        this.store.commit('close')
        break
    }
  }
}
