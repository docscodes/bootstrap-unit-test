const { square,mockSaure } = require("./math");

describe("square function", () => {
  test("can square two", () => {
    const result = square(2);
    expect(result).toBe(4);
  });

  test("mock square two", () => {
    const mockMultiply = (n1, n2) => {
      expect(n1).toBe(2);
      expect(n2).toBe(2);
      return 4;
    };

    const result = square(2, mockMultiply);
    expect(result).toBe(4);
  });

  test("can square zero", () => {
    const result = square(0);
    expect(result).toBe(0);
  });
});
