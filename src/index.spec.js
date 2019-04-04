const Bulkee = require('.')

const addToQueue = jest.fn()
describe('In a suite of tests concerning mParticle bulk management', () => {
  const size = 10
  let bulkee
  const batch = { someImportantData: 'sky is blue' }

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
  })
})
