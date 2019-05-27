import hello from "../src/index";

describe("Dummy test", () => {
    test("Hello", () => {
        expect(hello()).toBe("Hello, World!");
    })
});
