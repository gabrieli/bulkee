class Bulkee {
  constructor(callback, { size, processInterval }) {
    this._bulk = []
    this.callback = callback
    this.size = size
    this.processInterval = processInterval

    this.startTimer()
  }
  get bulk() {
    return this._bulk
  }
  reset() {
    this._bulk.length = 0
  }
  async process() {
    const bulk = this._bulk.slice()
    this.startTimer()
    if (!bulk.length) return

    this.reset()
    await this.callback(bulk)
  }
  startTimer() {
    if (!this.processInterval) return
    clearTimeout(this.timeout)
    this.timeout = setTimeout(this.process.bind(this), this.processInterval)
  }
  endTimer() {
    clearTimeout(this.timeout)
    this.processInterval = 0
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
