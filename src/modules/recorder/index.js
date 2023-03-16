import getSelector from '@/services/selector'
import { recordingControls } from '@/services/constants'
import { overlaySelectors } from '@/modules/overlay/constants'
import { eventsToRecord } from '@/modules/code-generator/constants'

export default class Recorder {
  //构造函数
  constructor({ store }) {
    this._eventLog = []
    this._previousEvent = null

    this._isTopFrame = window.location === window.parent.location //区分当前界面为网页界面还是插件界面
    this._isRecordingClicks = true

    this.store = store
  }

  init(cb) {
    const events = Object.values(eventsToRecord)

    if (!window.pptRecorderAddedControlListeners) {
      this._addAllListeners(events)
      cb && cb()
      window.pptRecorderAddedControlListeners = true
    }

    if (!window.document.pptRecorderAddedControlListeners && chrome.runtime?.onMessage) {
      window.document.pptRecorderAddedControlListeners = true
    }

    //如果是网页界面
    if (this._isTopFrame) {
      //得到recorder_started的信息，即是否已开始录制
      this._sendMessage({ control: recordingControls.EVENT_RECORDER_STARTED })
      //得到当前tab的URL
      this._sendMessage({ control: recordingControls.GET_CURRENT_URL, href: window.location.href })
      //得到当前页面的尺寸
      this._sendMessage({
        control: recordingControls.GET_VIEWPORT_SIZE,
        coordinates: { width: window.innerWidth, height: window.innerHeight },
      })
    }
  }

  //添加监听
  _addAllListeners(events) {
    const boundedRecordEvent = this._recordEvent.bind(this)
    events.forEach(type => window.addEventListener(type, boundedRecordEvent, true))
  }

  //发信息
  _sendMessage(msg) {
    //未处于录制期间不发送信息
    if ((msg.action === 'click'||msg.action === 'keydown') && !this._isRecordingClicks) {
      return
    }
    //发信息
    try {
      //Chrome的消息传递，可以在Web（通过content script）和扩展之间进行，任意一方都可发送或接收消息。
      chrome.runtime && chrome?.runtime?.onMessage
        ? chrome.runtime.sendMessage(msg)
        : this._eventLog.push(msg)
    } catch (err) {
      console.debug('caught error', err)
    }
  }

  //录制事件
  _recordEvent(e) {
    if (this._previousEvent && this._previousEvent.timeStamp === e.timeStamp) {
      return
    }
    this._previousEvent = e
    try {
      const selector = getSelector(e, { dataAttribute: this.store.state.dataAttribute })
      if (selector.includes('#' + overlaySelectors.OVERLAY_ID)) {
        return
      }
      this.store.commit('showRecorded')
      if (e.type==='keydown'&&e.keyCode !== 9) {
        return
      }
      this._sendMessage({
        selector,
        value: e.target.value,
        tagName: e.target.tagName,
        action: e.type,
        keyCode: e.keyCode ? e.keyCode : null,
        href: e.target.href ? e.target.href : null,
        coordinates: Recorder._getCoordinates(e),
      })
    } catch (err) {
      console.error(err)
    }
  }

  _getEventLog() {
    return this._eventLog
  }

  _clearEventLog() {
    this._eventLog = []
  }

  disableClickRecording() {
    this._isRecordingClicks = false
  }

  enableClickRecording() {
    this._isRecordingClicks = true
  }

  //获得坐标
  static _getCoordinates(evt) {
    const eventsWithCoordinates = {
      mouseup: true,
      mousedown: true,
      mousemove: true,
      mouseover: true,
    }

    return eventsWithCoordinates[evt.type] ? { x: evt.clientX, y: evt.clientY } : null
  }
}
