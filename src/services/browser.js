const CONTENT_SCRIPT_PATH = 'js/content-script.js'

export default {
  //���ҳ���URL
  getActiveTab() {
    //��װ�뺯��
    return new Promise(function(resolve) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => resolve(tab))
    })
  },

  //����ʹ��await�ؼ��֣�����������ʽ����promise
  async sendTabMessage({ action, value, clean } = {}) {
    //�첽��������ͣ�����ڸ����ϣ�ֱ�� promise ��ɣ�Ȼ�󷵻ؽ��ֵ
    const tab = await this.getActiveTab()
     //��չ����ҳ�淢��������Ϣ��content scripts
    chrome.tabs.sendMessage(tab.id, { action, value, clean })
  },

  //ע�����ݽű�
  injectContentScript() {
    return new Promise(function(resolve) {
      //��JavaScript ����ע��ҳ��
      chrome.tabs.executeScript({ file: CONTENT_SCRIPT_PATH, allFrames: false }, res =>
        resolve(res)
      )
    })
  },

  //��content scripts��Chrome��չ����ҳ��֮�佨��ͨ�������Դ�������Ϣ��
    //��ͨ�������˷ֱ�ӵ��һ��chrome.runtime.Port���������շ���Ϣ��
  getBackgroundBus() {
    return chrome.extension.connect({ name: 'recordControls' })
  },
}
