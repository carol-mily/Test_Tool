import PuppeteerCodeGenerator from '@/modules/code-generator/puppeteer'

export default class CodeGenerator {
  constructor(options = {}) {
    this.puppeteerGenerator = new PuppeteerCodeGenerator(options)
  }

  generate(recording) {
    return {
      puppeteer: this.puppeteerGenerator.generate(recording),
    }
  }
}
