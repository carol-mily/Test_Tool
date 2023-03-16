export default class Overlay {
  constructor({ store }) {
    this.overlayApp = null
    this.selectorApp = null

    this.overlayContainer = null
    this.selectorContainer = null
    
    this.store = store
  }
}
