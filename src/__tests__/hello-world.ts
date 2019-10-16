import {hello} from '../../lib/types/index';

import {dirname, resolve, join} from 'path';

const root = resolve(__dirname, '../../lib/esm');
 //throw new Error(`root=${root}, __dirname=${__dirname}`);
const hello: Promise<hello> = import(join(root, 'index.js'));



describe("Dummy test", () => {
    test("Hello", async () => {
        expect((await hello)()).toBe("HELL WRLD!");
    })
});
