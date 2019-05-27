import hello from "../index";

describe("Dummy test", () => {
    test("Hello", () => {
        expect(hello()).toBe("Hello, World!");
    })
});
