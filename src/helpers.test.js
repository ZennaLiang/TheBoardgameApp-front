import Helpers from "./helpers";

test("capitalize letters", () => {
  expect(Helpers.capitalize("john smith")).toBe("John Smith");
});
