const Bulkee = require('.')
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const addToQueue = jest.fn()
describe('Bulkee', () => {
  const size = 10
  const batch = { someImportantData: 'sky is blue' }
  let bulkee
  beforeEach(() => {
    bulkee = new Bulkee(addToQueue, { size })
  })

  describe('Tests concerning adding to bulkee', () => {
    it('Sends events and clears bulkee once limit is reached', () => {
      Array(size)
        .fill({ user_attributes: {} })
        .forEach(() => bulkee.add(batch))
      expect(bulkee.bulk.length).toBe(0)
    })
    it('Does not clear bulkee before limit is reached', () => {
      Array(size - 1)
        .fill({ user_attributes: {} })
        .forEach(() => bulkee.add(batch))
      expect(bulkee.bulk.length).toBe(size - 1)
    })
    it('Process the batch if the processTimeout is reached (multiple times)', async () => {
      const timedBulkee = new Bulkee(addToQueue, { size, processInterval: 1 })
      timedBulkee.add(batch)
      expect(timedBulkee.bulk.length).toBe(1)
      await wait(10)
      expect(timedBulkee.bulk.length).toBe(0)

      timedBulkee.add(batch)
      expect(timedBulkee.bulk.length).toBe(1)
      await wait(10)
      expect(timedBulkee.bulk.length).toBe(0)
    })
  })
})
