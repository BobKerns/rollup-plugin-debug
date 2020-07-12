/**
 * @module NpmTemplate
 * Copyright 2020 by Bob Kerns. Licensed under MIT license.
 */

/**
 * A largely self-configuring rollup configuration.
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import visualizerNoName, {VisualizerOptions} from 'rollup-plugin-visualizer';
import {OutputOptions, RollupOptions} from "rollup";
import {chain as flatMap} from 'ramda';
import externalGlobals from "rollup-plugin-external-globals";
import serve from "rollup-plugin-serve";

/**
 * The visualizer plugin fails to set the plugin name. We wrap it to remedy that.
 * @param opts
 */
const visualizer = (opts?: Partial<VisualizerOptions>) => {
    const noname: Partial<Plugin> = visualizerNoName(opts);
    return {
        name: "Visualizer",
        ...noname
    };
}

const mode = process.env.NODE_ENV;
// noinspection JSUnusedLocalSymbols
const dev = mode === 'development';
const serve_mode = process.env.SERVE && dev;
const serve_doc = process.env.SERVE_DOC && serve_mode;

/**
 * Avoid non-support of ?. optional chaining.
 */
const DISABLE_TERSER = true;

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
                katex: "katex",
                d3: "d3",
                "@observablehq/stdlib": "observablehq"
                // "ramda": "ramda",
                // "gl-matrix": "glMatrix"
            }
        },
        {
            format: 'cjs',
            file: p.main,
            sourcemap: true
        },
        {
            format: 'esm',
            file: p.module,
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
const checkExternal = (id: string, from?: string, resolved?: boolean): boolean =>
    !/gl-matrix|glMatrix/i.test(id) && (resolved
        ? /node_modules/.test(id)
        : !/^\./.test(id));

const options: RollupOptions = {
    input:'./src/index.ts',
    output: outputs(pkg),
    external: checkExternal,
    plugins: [
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
        externalGlobals({
            // 'gl-matrix': "glMatrix",
            //'katex': 'katex',
            'ramda': 'ramda'
        }),
        ...(!dev && !DISABLE_TERSER) ? [
            terser({
            module: true
        })
        ] : [],
        visualizer({
            filename: "build/build-stats.html",
            title: "Build Stats"
        }),
        ...serve_mode ? [
            serve({
                open: !!serve_doc,
                verbose: true,
                port: 5000,
                contentBase: '',
                openPage: '/docs/api/index.html'
            })
        ] : []
    ]
};

// noinspection JSUnusedGlobalSymbols
export default options;
