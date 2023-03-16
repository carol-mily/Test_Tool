//脚本
export default class Block {
  constructor(frameId, line) {
    this._lines = []
    this._frameId = frameId

    if (line) {
      line.frameId = this._frameId
      this._lines.push(line)
    }
  }

  //顶部添加一行
  addLineToTop(line) {
    line.frameId = this._frameId
    this._lines.unshift(line)
  }

  //添加一行
  addLine(line) {
    line.frameId = this._frameId
    this._lines.push(line)
  }

  //获得所有行
  getLines() {
    return this._lines
  }
}
