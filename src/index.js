class Bulkee {
  constructor(callback, { size }) {
    this._bulk = []
    this.callback = callback
    this.size = size
  }
  get bulk() {
    return this._bulk
  }
  reset() {
    this._bulk.length = 0
  }
  async process() {
    const bulk = this._bulk.slice()
    if (!bulk.length) return

    this.reset()
    await this.callback(bulk)
  }
  add(item) {
    this._bulk.push(item)
    const maxBulkSize = Bulkee.overwrittenSize || this.size
    if (this._bulk.length === maxBulkSize) {
      this.process()
    }
  }
}

Bulkee.overwrittenSize = null

module.exports = Bulkee
