import { meetsMaxChar } from './meetsMaxChar'

describe('FormService - string - utils - meetsMaxChar(value: string)', () => {
  const max: number = 5
  let value: string
  let actual: boolean

  describe('Below Max', () => {
    beforeEach(() => {
      value = 'RACE'
    })

    it('should return true when length less than max', () => {
      actual = meetsMaxChar(value, max)

      expect(actual).toEqual(true)
    })
  })

  describe('Match Max', () => {
    beforeEach(() => {
      value = 'RACER'
    })

    it('should return true when length equal to max', () => {
      actual = meetsMaxChar(value, max)

      expect(actual).toEqual(true)
    })
  })

  describe('Above Max', () => {
    beforeEach(() => {
      value = 'RACECAR'
    })

    it('should return false when length greater than max', () => {
      actual = meetsMaxChar(value, max)

      expect(actual).toEqual(false)
    })
  })
})
