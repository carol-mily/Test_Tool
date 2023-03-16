import { createStore } from 'vuex'

import { overlayActions } from '@/modules/overlay/constants'

function clearState(state) {
  state.isClosed = false
  state.isStopped = false

  state.recording = []
}

const store = createStore({
  state() {
    return {
      isClosed: false,
      isStopped: false,
      hasRecorded: false,

      dataAttribute: '',

      recording: [],
    }
  },

  mutations: {  //更改state中状态的逻辑
    showRecorded(state) {
      state.hasRecorded = true
      setTimeout(() => (state.hasRecorded = false), 250)
    },

    setDataAttribute(state, dataAttribute) {
      state.dataAttribute = dataAttribute
    },

    setRecording(state, recording) {
      state.recording = recording
    },

    close(state) {
      state.isClosed = true
      chrome.runtime.sendMessage({ control: overlayActions.CLOSE })
    },

    clear(state) {
      clearState(state)
    },
    
    stop(state) {
      state.isStopped = true
      chrome.runtime.sendMessage({ control: overlayActions.STOP })
    },
  },
})

// TODO: load state from local storage
//将扩展中需要保存的数据写入本地磁盘
  chrome.storage.onChanged.addListener(({recording = null }) => {

  if (recording) {
    store.commit('setRecording', recording.newValue)
  }
})

export default store
