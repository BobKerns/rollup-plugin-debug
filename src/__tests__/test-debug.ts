import {plugins} from '../rollup-plugin-debug';
describe("Plugin tests", () => {
    expect(plugins()).toHaveLength(0);
    test("Describe", () =>
        expect(plugins().describe).toBeInstanceOf(Function));
    test("Debug", () =>
        expect(plugins().debug).toBeInstanceOf(Function));
});
