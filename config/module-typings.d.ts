/*
 * @module physics-math
 * Copyright 2020 by Bob Kerns. Licensed under MIT license.
 *
 * Github: https://github.com/BobKerns/physics-math
 */

// We supply the missing type information for the terser plugin.


declare module "rollup-plugin-terser" {
    import {Plugin} from "rollup";
    import {MinifyOptions} from "terser";
    interface TerserPluginOptions extends MinifyOptions {
        sourcemap: boolean;
        numWorkers: number;
    }
    export function terser(options?: Partial<TerserPluginOptions>): Plugin;

}

// We supply missing type information for the visualizer plugin.

type NamelessPlugin = Omit<Plugin, "name">;

declare module "rollup-plugin-visualizer" {
    export interface OpenOptions {
        app: string | string[];
        wait: boolean;
    }
    export interface VisualizerOptions {
        filename: string;
        title: string;
        sourcemap: boolean;
        open: boolean;
        openOptions: OpenOptions;
    }

    // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
    export default function visualizer(options?: Partial<VisualizerOptions>): NamelessPlugin;
}

declare module 'rollup-plugin-external-globals' {
    // noinspection JSUnusedGlobalSymbols,JSDuplicatedDeclaration
    export default function externalGlobals(globals: any): Plugin;
}

interface ServeOptions {
    // Launch in browser (default: false)
    open?: boolean; // true

    // Page to navigate to when opening the browser.
    // Will not do anything if open=false.
    // Remember to start with a slash.
    openPage?: string;

    // Show server address in console (default: true)
    verbose?: boolean; // false

    // Folder to serve files from
    contentBase: string|string[]; // ''

    // Set to true to return index.html (200) instead of error page (404)
    historyApiFallback?: boolean|string; // false

    // Options used in setting up server
    host?: string; // 'localhost',
    port?: number; // 10001,

    // By default server will be served over HTTP (https: false). It can optionally be served over HTTPS
    https?: {
        key: string; // fs.readFileSync('/path/to/server.key'),
        cert: string; // fs.readFileSync('/path/to/server.crt'),
        ca: string; // fs.readFileSync('/path/to/ca.pem')
    };

    //set headers
    headers?: { [k: string]: string; }; // 'Access-Control-Allow-Origin': '*'
}

declare module 'rollup-plugin-serve' {
    // noinspection JSDuplicatedDeclaration,JSUnusedGlobalSymbols
    export default function serve(options?: ServeOptions): Plugin;
}

declare module '@observablehq/stdlib' {
    export namespace Generator {
        export function observe<T>(f: (notify: (n: T) => void) => void): AsyncIterableIterator<T>;
    }
}

declare module 'acorn-optional-chaining' {
    export default function <T>(p: T): T;
}
