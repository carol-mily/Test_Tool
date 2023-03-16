export default {
  //chrome.storage.local�����ݴ洢�ڵ�ǰ��¼���豸����
  get(keys) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available')
    }
    //�Ӵ洢�����м���һ��������Ŀ
    return new Promise(resolve => chrome.storage.local.get(keys, props => resolve(props)))
  },

  set(props) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available')
    }
    //�ڴ洢���洢һ��������Ŀ���������Ŀ�Ѵ��ڣ�����ֵ�������¡�
    //������һ��ֵʱ����storage.onChanged�¼���������
    return new Promise(resolve => chrome.storage.local.set(props, res => resolve(res)))
  },

  remove(keys) {
    if (!chrome.storage || !chrome.storage.local) {
      return Promise.reject('Browser storage not available')
    }
    //�Ӵ洢�������Ƴ�һ��������Ŀ��
    return new Promise(resolve => chrome.storage.local.remove(keys, res => resolve(res)))
  },
}
