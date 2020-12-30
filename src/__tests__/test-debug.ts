import {plugins} from '../rollup-plugin-debug';
describe("Dummy test", () => {
    test("Hello", async () => {
        expect((await plugins)()).toBe("HELL WRLD!");
    })
});
