import { isCvc } from './isCvc'

describe('FormService - creditCard - utils - isCvc({ cvc, creditCardType })', () => {
  let actual: boolean
  let cvc: string

  describe('No creditCardType', () => {
    describe('Unhappy Path', () => {
      it('should be false when alphanumeric', () => {
        cvc = 'ab1'
        actual = isCvc({ cvc })
        expect(actual).toEqual(false)
      })

      it('should be false when 2 digits', () => {
        cvc = '27'
        actual = isCvc({ cvc })
        expect(actual).toEqual(false)
      })

      it('should be false when 5 digits', () => {
        cvc = '12345'
        actual = isCvc({ cvc })
        expect(actual).toEqual(false)
      })
    })

    describe('Happy Path', () => {
      it('should be false when 3 digits', () => {
        cvc = '273'
        actual = isCvc({ cvc })
        expect(actual).toEqual(true)
      })

      it('should be false when 4 digits', () => {
        cvc = '1234'
        actual = isCvc({ cvc })
        expect(actual).toEqual(true)
      })
    })
  })
})
