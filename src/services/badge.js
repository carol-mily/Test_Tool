//��ͬ�¼��µ�ͼ��仯��δ�ɹ�
const DEFAULT_COLOR = '#45C8F1'
const RECORDING_COLOR = '#ec4f4f'

const DEFAULT_LOGO = './images/wait_light.png'
const RECORDING_LOGO = './images/wait_light.png'

export default {
  stop(text) {
    //����ͼ��
    chrome.browserAction.setIcon({ path: DEFAULT_LOGO })
    //���ñ�����ɫ
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
