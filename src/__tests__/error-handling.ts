/*
 * @NpmRollupTemplate
 * Copyright 2020 by Bob Kerns. Licensed under MIT license.
 *
 * Github: https://github.com/BobKerns/npm-rollup-typescript-template
 */

// Test of whether source maps make it through to jest.

describe("Verify handling stack traces correctly.", () => {
   test("Test stack mapping", () => {
       try {
           // The following throw must be on line 18.
           //
           //
           //
           // noinspection ExceptionCaughtLocallyJS
           throw new Error("E"); // This must be line 18.
       } catch (e) {
           expect(e.message).toBe("E");
           expect(e.stack).toMatch(/[/\\]error-handling.ts[^a-zA-Z0-9]+18/m);
       }
   })
});
