/*
 * Copyright © 2019. Licensed under MIT license.
 */

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    "**/__tests__/*.{ts,tsx,js,jsx,mjs}",
      "!**/*.d.ts?(x)",
      "!**/suite-*.*"
  ]
};
