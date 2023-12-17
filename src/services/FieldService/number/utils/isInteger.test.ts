import { isInteger } from "./isInteger";

describe("FieldService - validators - number - utils - isInteger(str: string)", () => {
  let value: string;
  let actual;

  describe("Happy Path", () => {
    describe("Integer", () => {
      beforeEach(() => {
        value = "0";
      });

      it("should be true when the string value represents an integer", () => {
        actual = isInteger(value);

        expect(actual).toEqual(true);
      });
    });

    describe("Float", () => {
      beforeEach(() => {
        value = "0.01";
      });

      it("should be false when the string value is represents a float", () => {
        actual = isInteger(value);

        expect(actual).toEqual(false);
      });
    });

    describe("Alphanumberic", () => {
      beforeEach(() => {
        value = "0x00000001";
      });

      it("should be false when the string value is alphanumeric", () => {
        actual = isInteger(value);

        expect(actual).toEqual(false);
      });
    });

    describe("Text", () => {
      beforeEach(() => {
        value = "This is text.";
      });

      it("should be false when the string value is text", () => {
        actual = isInteger(value);

        expect(actual).toEqual(false);
      });
    });

    describe("Empty String", () => {
      beforeEach(() => {
        value = "";
      });

      it("should be false when the string value is an empty string", () => {
        actual = isInteger(value);

        expect(actual).toEqual(false);
      });
    });
  });
});
