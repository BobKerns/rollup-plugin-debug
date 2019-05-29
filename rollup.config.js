// Real definition in './config/rollup.config.ts'
// Uncomment to debug require-from in context.
// process.env.DEBUG_REQUIRE_FROM = "true";
const requireFrom = require("./config/lib/require-from").requireFrom;

const requireConfig = requireFrom(module, "./config", "./config/lib");

export default requireConfig('./config/rollup.config').default;
