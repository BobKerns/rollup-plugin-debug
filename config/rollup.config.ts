/**
 * @module NpmTemplate
 * Copyright  by Bob Kerns. Licensed under MIT license
 */

/**
 * A largely self-configuring rollup configuration.
 */

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import {OutputOptions, PluginContext, RollupOptions} from "rollup";
import {chain as flatMap} from 'ramda';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

/**
 * A rough description of the contents of [[package.json]].
 */
interface Package {
    name: string;
    main?: string;
    module?: string;
    browser?: string;
    [K: string]: any;
}
const pkg: Package  = require('../package.json');

/**
 * Compute the list of outputs from [[package.json]]'s fields
 * @param p the [[package.json]] declaration
 */
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
    ]) as OutputOptions;

/**
 * Compute the set of main entrypoints from [[package.json]].
 * @param p The contents of [[package.json]]
 * @param entries A array of keys to check for entry points in [[package.json]].
 */
const mainFields = (p: Package, entries: string[]) =>
    flatMap((f: string) => (pkg[f] ? [f] : []) as ReadonlyArray<string>,
        entries);

/**
 * A useful little plugin to trace some of the behavior of rollup.
 */
const dbg: any = {name: 'dbg'};
['resolveId', 'load', 'transform', 'generateBundle', 'writeBundle'].forEach(
    f => dbg[f] = function (...args: any[]) {
        this.warn(`${f}: ${args.map((a: any) => JSON.stringify(a, null, 2)).join(', ')}`);
        return null;}
);

/**
 * Check for modules that should be considered external and not bundled directly.
 * By default, we consider those from node_modules to be external,
 * @param id
 * @param from
 * @param resolved
 */
const checkExternal = (id: string, from: string, resolved: boolean) =>
    (resolved
        ? /node_modules/.test(id)
        : !/^\./.test(id));

const options: RollupOptions = {
    input:'./src/index.ts',
    output: outputs(pkg),
    external: checkExternal,
    plugins: [
        // dbg,
        resolve({
            // Check for these in package.json
            mainFields: mainFields(pkg, ['module', 'main', 'browser'])
        }),
         typescript({
             tsconfig: 'src/tsconfig.json',
             include: "src/*.ts",
             objectHashIgnoreUnknownHack: true,
             verbosity: 1,
             cacheRoot: "./build/rts2-cache",
             // false = Put the declaration files into the regular output in lib/
             useTsconfigDeclarationDir: false
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
};

export default options;

