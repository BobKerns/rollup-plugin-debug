/*
 * Copyright © 2019. Licensed under MIT license.
 */

// noinspection JSUnusedGlobalSymbols
export default {
    preset: 'ts-jest',
    testMatch: [
        "<rootDir>/**/__tests__/**.{ts,tsx,js,jsx,mjs}",
        "!**/*.d.ts?(x)",
        "!**/suite-*.ts",
        "!**/index*.*",
        // <rootDir> is not substituted unless at beginning, e.g. not in negated patterns!
        // This doesn't matter for terminal patterns, but for intermediate directories, we
        // need to use /src/ to ensure we only match below a /src/ directory (presumably ours).
        "!/src/**/{node_modules,lib,build,docs,tmp}/**"
    ],
    rootDir: "src",
    "maxConcurrency": 10
};
