// Copyright  by Bob Kerns. Licensed under MIT license

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import {basename} from 'path';
import {OutputOptions} from "rollup";
import {chain as flatMap} from 'ramda';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

// const undBase = basename(pkg.browser || pkg.name);

interface Package {
    name: string;
    main?: string;
    module?: string;
    browser?: string;
    [K: string]: any;
}
const pkg: Package  = require('../package.json');

export const outputs = (p: Package) => flatMap((e: OutputOptions) => (e.file ? [e] : []),
    [
        {
            file: p.browser,
            sourcemapFile: `${basename(p.browser || '')}.map`,
            name: p.name,
            format: 'umd',
            sourcemap: true
        },
        {
            file: p.main,
            sourcemapFile: `${basename(p.main || '')}.map`,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: p.module,
            sourcemapFile: `${basename(p.modulex || '')}.map`,
            format: 'esm',
            sourcemap: true
        }
    ]);

const dbg: any = {name: 'dbg'};
['resolveId', 'load', 'transform', 'generateBundle'].forEach(
    f => dbg[f] = function (...args: any[]) {
        this.warn(`${f}: ${args.map((a: any) => JSON.stringify(a, null, 2)).join(', ')}`);
        return null;}
);

export default {
    input: ['src/index.ts'],
    output: outputs(pkg),

    plugins: [
        // dbg,
        resolve(),
        typescript({
            include: "src/*.ts",
            objectHashIgnoreUnknownHack: true,
            verbosity: 1
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
