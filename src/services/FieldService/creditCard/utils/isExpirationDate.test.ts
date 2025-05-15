import { isExpirationDate } from './isExpirationDate'

describe('FormService - creditCard - utils - isExpiration(value: string)', () => {
  let value: string
  let actual: boolean

  describe('Default Behavior', () => {
    describe('Invalid Format', () => {
      it('should return false when not enough characters', () => {
        value = '5/27'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when missing forward slash', () => {
        value = '0527'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when above month range', () => {
        value = '13/27'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when below month range', () => {
        value = '00/27'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when above 4 digit year range', () => {
        value = '01/10000'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when 3 digit year range', () => {
        value = '01/999'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when below 2 digit year range', () => {
        value = '01/9'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })

      it('should return false when alphanumeric', () => {
        value = 'M3/YY'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(false)
      })
    })

    describe('Valid Format', () => {
      it('should return true when within min 2 year range', () => {
        value = '01/00'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(true)
      })

      it('should return when within max 2 year range', () => {
        value = '01/99'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(true)
      })

      it('should return true when within min 4 year range', () => {
        value = '01/0000'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(true)
      })

      it('should return when within max 4 year range', () => {
        value = '01/9999'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(true)
      })

      it('should return true when empty format', () => {
        value = '__/__'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(true)
      })

      it('should return true when empty format', () => {
        value = 'MM/YY'
        actual = isExpirationDate({ value })

        expect(actual).toEqual(true)
      })
    })
  })
})
