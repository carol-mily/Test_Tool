export const recordingControls = {
  EVENT_RECORDER_STARTED: 'EVENT_RECORDER_STARTED',
  GET_VIEWPORT_SIZE: 'GET_VIEWPORT_SIZE',
  GET_CURRENT_URL: 'GET_CURRENT_URL',
}

export const popupActions = {
  START: 'START',
  STOP: 'STOP',
  CLEAN_UP: 'CLEAN_UP',
}

//carol_remove:no
//直接关联：鼠标、键盘的信息捕获问题
export const isDarkMode = () =>
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

