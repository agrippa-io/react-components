import { isFloat } from "./isFloat";

describe("FieldService - validators - number - utils - isFloat(str: string)", () => {
  let value: string;
  let actual;

  describe("Happy Path", () => {
    describe("Float", () => {
      beforeEach(() => {
        value = "0.01";
      });

      it("should be false when the string value is represents a float", () => {
        actual = isFloat(value);

        expect(actual).toEqual(true);
      });
    });

    describe("Integer", () => {
      beforeEach(() => {
        value = "0";
      });

      it("should be true when the string value represents an integer", () => {
        actual = isFloat(value);

        expect(actual).toEqual(false);
      });
    });

    describe("Alphanumberic", () => {
      beforeEach(() => {
        value = "0x00000001";
      });

      it("should be false when the string value is alphanumeric", () => {
        actual = isFloat(value);

        expect(actual).toEqual(false);
      });
    });

    describe("Text", () => {
      beforeEach(() => {
        value = "This is text.";
      });

      it("should be false when the string value is text", () => {
        actual = isFloat(value);

        expect(actual).toEqual(false);
      });
    });

    describe("Empty String", () => {
      beforeEach(() => {
        value = "";
      });

      it("should be false when the string value is an empty string", () => {
        actual = isFloat(value);

        expect(actual).toEqual(false);
      });
    });
  });
});
