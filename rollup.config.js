// Real definition in './config/rollup.config.ts'
// Uncomment to debug require-from in context.
// process.env.DEBUG_REQUIRE_FROM = "true";
// noinspection JSUnresolvedVariable
const requireFrom = require("./build/config/require-from").requireFrom;

const requireConfig = requireFrom(module, "./config", "./build/config");

// noinspection JSUnusedGlobalSymbols
export default requireConfig('./config/rollup.config').default;
