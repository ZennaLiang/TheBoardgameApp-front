import Helpers from "./helpers";

describe("Capitalization Helper", () => {
  it("should return string", () => {
    expect(Helpers.capitalize("john smith")).toBe("John Smith");
  });
  it("int should return empty string", () => {
    expect(Helpers.capitalize(123)).toBe("");
  });
  it("number strings should remain the same", () => {
    expect(Helpers.capitalize("123")).toBe("123");
  });
  it("symbol strings should remain the same", () => {
    expect(Helpers.capitalize("@@@")).toBe("@@@");
  });
  it("empty string should return empty string", () => {
    expect(Helpers.capitalize("")).toBe("");
  });
  it("empty string should return empty string", () => {
    expect(Helpers.capitalize()).toBe("");
  });
});
