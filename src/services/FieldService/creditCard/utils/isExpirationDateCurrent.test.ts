import { isExpirationDateCurrent } from './isExpirationDateCurrent'

describe('FormService - creditCard - utils - isExpirationDateCurrent({ value: string })', () => {
  let value: string
  let actual: boolean

  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2025-05-15T00:00:00.000Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('Default Behavior', () => {
    describe('Expired', () => {
      describe('Format - Two Year', () => {
        it('should return false when same month and year as current date', () => {
          value = '05/25'
          actual = isExpirationDateCurrent({ value })

          expect(actual).toEqual(false)
        })
      })

      describe('Format - Four Year', () => {
        it('should return false when same month and year as current date', () => {
          value = '05/2025'
          actual = isExpirationDateCurrent({ value })

          expect(actual).toEqual(false)
        })
      })
    })

    describe('Valid', () => {
      describe('Format - Two Year', () => {
        it('should return true when next month and year as current date', () => {
          value = '06/25'
          actual = isExpirationDateCurrent({ value })

          expect(actual).toEqual(true)
        })
      })

      describe('Format - Four Year', () => {
        it('should return true when next month and year as current date', () => {
          value = '06/2025'
          actual = isExpirationDateCurrent({ value })

          expect(actual).toEqual(true)
        })
      })
    })
  })
})
