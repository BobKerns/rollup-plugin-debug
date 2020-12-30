import { hello } from '../index';

describe("Dummy test", () => {
    test("Hello", async () => {
        expect((await hello)()).toBe("HELL WRLD!");
    })
});
