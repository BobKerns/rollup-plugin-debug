"use strict";
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        "**/__tests__/*.{ts,tsx,js,jsx,mjs}",
        "!**/*.d.ts?(x)",
        "!**/suite-*.*"
    ]
};
//# sourceMappingURL=top-jest.config.js.map