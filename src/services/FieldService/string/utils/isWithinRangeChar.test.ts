import { isWithinRangeChar } from './isWithinRangeChar'

describe('FormService - string - utils - isWithinRangeChar(value: string)', () => {
  const min: number = 5
  const max: number = 10
  let value: string
  let actual: boolean

  describe('Below Min', () => {
    beforeEach(() => {
      value = 'RACE'
    })

    it('should return true when length less than min', () => {
      actual = isWithinRangeChar(value, min, max)

      expect(actual).toEqual(false)
    })
  })

  describe('Match Min', () => {
    beforeEach(() => {
      value = 'RACER'
    })

    it('should return true when length equal to min', () => {
      actual = isWithinRangeChar(value, min, max)

      expect(actual).toEqual(true)
    })
  })

  describe('Inside Range', () => {
    beforeEach(() => {
      value = 'RACECAR'
    })

    it('should return false when length inside range', () => {
      actual = isWithinRangeChar(value, min, max)

      expect(actual).toEqual(true)
    })
  })

  describe('Match Max', () => {
    beforeEach(() => {
      value = 'RACER FIVE'
    })

    it('should return true when length equal to max', () => {
      actual = isWithinRangeChar(value, min, max)

      expect(actual).toEqual(true)
    })
  })

  describe('Above Max', () => {
    beforeEach(() => {
      value = 'RACER SEVEN'
    })

    it('should return false when length greater than max', () => {
      actual = isWithinRangeChar(value, min, max)

      expect(actual).toEqual(false)
    })
  })
})
