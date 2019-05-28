// Copyright  by Bob Kerns. Licensed under MIT license

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

const pkg = require('./package.json');

export default {
    input: ['src/index.ts'],
    output: [
        {
            file: `lib/${pkg.name}.umd.js`,
            sourcemapFile: `lib/${pkg.name}.umd.map`,
            name: 'mixme',
            format: 'umd',
            sourcemap: true
        },
        {
            file: `lib/${pkg.name}.cjs.js`,
            sourcemapFile: `lib/${pkg.name}.umd.map`,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: `lib/${pkg.name}.esm.mjs`,
            sourcemapFile: `lib/${pkg.name}.umd.map`,
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        resolve(),
        typescript({
            objectHashIgnoreUnknownHack: true
        }),
        commonjs({
            extensions: [".js", ".ts"]
        }),

        terser({
            module: true
        }),
        {
            name: 'visualizer',
            ...visualizer({
                filename: "build/build-stats.html",
                title: "Build Stats"
            })
        }
    ]
}
