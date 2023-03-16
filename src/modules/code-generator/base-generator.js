//���ɽű�
import Block from '@/modules/code-generator/block'
import { headlessActions, eventsToRecord } from '@/modules/code-generator/constants'

export const defaults = {
  wrapAsync: false,
  headless: true,
  waitForNavigation: true,
  waitForSelectorOnClick: true,
  blankLinesBetweenBlocks: true,
  dataAttribute: '',
  keyCode: 9,
}

export default class BaseGenerator {
  constructor(options) {
    this._options = Object.assign(defaults, options)
    this._blocks = []
    this._frame = 'page'
    this._frameId = 0
    this._allFrames = {}

    this._hasNavigation = false
  }

  generate() {
    //�׳�����û��ִ��
    throw new Error('Not implemented.')
  }

  //�õ�ͷ
  _getHeader() {
    return  this._wrappedHeader;
  }

  //�õ�β
  _getFooter() {
    return this._wrappedFooter;
  }

  _parseEvents(events) {
    let result = ''

    if (!events) return result

    for (let i = 0; i < events.length; i++) {
      const { action, selector, value, href, keyCode, tagName, frameId, frameUrl } = events[i]
      const escapedSelector = selector ? selector?.replace(/\\/g, '\\\\') : selector

      // we need to keep a handle on what frames events originate from
      //������Ҫ����event����Դ
      this._setFrames(frameId, frameUrl)

      switch (action) {
        //�ɿ�����
        case 'keydown':
          this._blocks.push(this._handleKeyDown(escapedSelector, value, keyCode))
          break
        //���
        case 'click':
          this._blocks.push(this._handleClick(escapedSelector, events))
          break
        //�仯
        case 'change':
          if (tagName === 'SELECT') {
            this._blocks.push(this._handleChange(escapedSelector, value))
          }
          break
        //��ת
        case headlessActions.GOTO:
          this._blocks.push(this._handleGoto(href, frameId))
          break
        //ҳ���С
        case headlessActions.VIEWPORT:
          this._blocks.push(this._handleViewport(value.width, value.height))
          break
        //ҳ�����
        case headlessActions.NAVIGATION:
          this._blocks.push(this._handleWaitForNavigation())
          this._hasNavigation = true
          break
      }
    }

    if (this._hasNavigation && this._options.waitForNavigation) {
      //�ȴ�ҳ�����
      const block = new Block(this._frameId, {
        type: headlessActions.NAVIGATION_PROMISE,
        value: '  const navigationPromise = page.waitForNavigation()',
      })
      this._blocks.unshift(block)
    }

    this._postProcess()

    const indent = this._options.wrapAsync ? '  ' : ''
    const newLine = `\n`

    for (let block of this._blocks) {
      const lines = block.getLines()
      for (let line of lines) {
        result += indent + line.value + newLine
      }
    }

    return result
  }

  //�洢��ҳ
  _setFrames(frameId, frameUrl) {
    if (frameId && frameId !== 0) {
      this._frameId = frameId
      this._frame = `frame_${frameId}`
      this._allFrames[frameId] = frameUrl
    } else {
      this._frameId = 0
      this._frame = 'page'
    }
  }

  _postProcess() {
    // when events are recorded from different frames, we want to add a frame setter near the code that uses that frame
    //���Ӳ�ͬ��֡��¼�¼�ʱ������ϣ����ʹ�ø�֡�Ĵ��븽�����һ��֡������
    if (Object.keys(this._allFrames).length > 0) {
      this._postProcessSetFrames()
    }

    if (this._options.blankLinesBetweenBlocks && this._blocks.length > 0) {
      this._postProcessAddBlankLines()
    }
  }

  //�ɼ���
  _handleKeyDown(selector, value) {
    const block = new Block(this._frameId)
    block.addLine({
      type: eventsToRecord.KEYDOWN,
      value: `  await ${this._frame}.type('${selector}', '${this._escapeUserInput(value)}')
  await page.waitFor(3000)`,
    })
    return block
  }

  //���
  _handleClick(selector) {
    const block = new Block(this._frameId)
    if (this._options.waitForSelectorOnClick) {
      block.addLine({
        type: eventsToRecord.CLICK,
        value: `  await ${this._frame}.waitForSelector('${selector}')`,
      })
    }
    block.addLine({
      type: eventsToRecord.CLICK,
      value: `  await ${this._frame}.click('${selector}')
  await page.waitFor(3000)`,
    })
    return block
  }

  //�ı�
  _handleChange(selector, value) {
    return new Block(this._frameId, {
      type: eventsToRecord.CHANGE,
      value: `  await ${this._frame}.select('${selector}', '${value}')
  await page.waitFor(3000)`,
    })
  }

  //��ת
  _handleGoto(href) {
    return new Block(this._frameId, {
      type: headlessActions.GOTO,
      value: `  await ${this._frame}.goto('${href}')`,
    })
  }

 //����ҳ���С
  _handleViewport() {
    throw new Error('Not implemented.')
  }

  //����ҳ��
  _handleWaitForNavigation() {
    const block = new Block(this._frameId)
    if (this._options.waitForNavigation) {
      block.addLine({
        type: headlessActions.NAVIGATION,
        value: `  await navigationPromise`,
      })
    }
    return block
  }

  //���ҳ�����ű�ͷ��
  _postProcessSetFrames() {
    for (let [i, block] of this._blocks.entries()) {
      const lines = block.getLines()
      for (let line of lines) {
        if (line.frameId && Object.keys(this._allFrames).includes(line.frameId.toString())) {
          const declaration = ` const frame_${line.frameId} = frames.find(f => f.url() === '${
            this._allFrames[line.frameId]
          }')`
          this._blocks[i].addLineToTop({
            type: headlessActions.FRAME_SET,
            value: declaration,
          })
          this._blocks[i].addLineToTop({
            type: headlessActions.FRAME_SET,
            value: '  let frames = await page.frames()',
          })
          delete this._allFrames[line.frameId]
          break
        }
      }
    }
  }

  //��ӿհ���
  _postProcessAddBlankLines() {
    let i = 0
    while (i <= this._blocks.length) {
      const blankLine = new Block()
      blankLine.addLine({ type: null, value: '' })
      this._blocks.splice(i, 0, blankLine)
      i += 2
    }
  }

  _escapeUserInput(value) {
    return value?.replace(/\\/g, '\\\\')?.replace(/'/g, "\\'")
  }
}
