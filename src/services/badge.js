//不同事件下的图标变化，未成功
const DEFAULT_COLOR = '#45C8F1'
const RECORDING_COLOR = '#ec4f4f'

const DEFAULT_LOGO = './images/wait_light.png'
const RECORDING_LOGO = './images/wait_light.png'

export default {
  stop(text) {
    //设置图标
    chrome.browserAction.setIcon({ path: DEFAULT_LOGO })
    //设置背景颜色
    chrome.browserAction.setBadgeBackgroundColor({ color: DEFAULT_COLOR })
    this.setText(text)
  },

  reset() {
    this.setText('')
  },

  setText(text) {
    chrome.browserAction.setBadgeText({ text })
  },

  start() {
    chrome.browserAction.setIcon({ path: RECORDING_LOGO })
  },

  wait() {
    chrome.browserAction.setBadgeBackgroundColor({ color: RECORDING_COLOR })
    this.setText('Load')
  },
}
