// Copyright  by Bob Kerns. Licensed under MIT license

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import path, {dirname, basename, extname, join, relative} from 'path';
import {OutputOptions, PluginContext} from "rollup";
import {chain as flatMap} from 'ramda';
import {execFileSync} from "child_process";
import copyDeclarations from './rollup-plugin-copy-dts';

execFileSync("tsc", ["--build", "--verbose", "tsconfig-rollup.json"])

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
            name: p.name,
            format: 'umd',
            sourcemap: true,
            globals: {
                "ramda": "ramda"
            }
        },
        {
            file: p.main,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: p.module,
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
    input:'./build/src/index.js',
    output: outputs(pkg),
    external: (id: string, from: string, resolved: boolean) => (resolved ? /node_modules/.test(id) : !/^\./.test(id)),
    plugins: [
        // dbg,
        //resolve(),
        copyDeclarations({
            root: 'build/src',
            target: "lib/types"
        }),
        // typescript({
        //     tsconfig: './tsconfig-rollup.json',
        //     include: "src/*.ts",
        //     objectHashIgnoreUnknownHack: true,
        //     verbosity: 1,
        //     cacheRoot: "../build/.rts2-cache"
        // }),
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
