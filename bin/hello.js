#!/usr/bin/env node
/**
 * Sample executable script. Will be linked into [node_modules/.bin](node_modules/.bin)
 */
/**
 * Just a simple demo function.
 * @type {{readonly default: () => string}}
 */
const hello = require('../lib/cjs/index.js');
process.stdout.write(hello() + "\n");
process.stderr.write("FOO\n");
