export const headlessActions = {
  GOTO: 'GOTO', //跳转
  VIEWPORT: 'VIEWPORT', //页面尺寸
  WAITFORSELECTOR: 'WAITFORSELECTOR', //等待选择器
  NAVIGATION: 'NAVIGATION', //页面加载
  NAVIGATION_PROMISE: 'NAVIGATION_PROMISE',
  FRAME_SET: 'FRAME_SET', //页面
}

//录制事件
export const eventsToRecord = {
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  CHANGE: 'change',
  KEYDOWN: 'keydown',
  SELECT: 'select',
  SUBMIT: 'submit',
  LOAD: 'load',
  UNLOAD: 'unload',
}

export const headlessTypes = {
  PUPPETEER: 'puppeteer',
}
