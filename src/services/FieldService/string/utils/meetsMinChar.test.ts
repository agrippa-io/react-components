import { meetsMinChar } from './meetsMinChar'

describe('FormService - string - utils - meetsMinChar(value: string)', () => {
  const min: number = 5
  let value: string
  let actual: boolean

  describe('Below Min', () => {
    beforeEach(() => {
      value = 'RACE'
    })

    it('should return false when length less than min', () => {
      actual = meetsMinChar(value, min)

      expect(actual).toEqual(false)
    })
  })

  describe('Match Min', () => {
    beforeEach(() => {
      value = 'RACER'
    })

    it('should return true when length equal to min', () => {
      actual = meetsMinChar(value, min)

      expect(actual).toEqual(true)
    })
  })

  describe('Above Min', () => {
    beforeEach(() => {
      value = 'RACECAR'
    })

    it('should return true when length greater than min', () => {
      actual = meetsMinChar(value, min)

      expect(actual).toEqual(true)
    })
  })
})
