/*
 * Copyright © 2019. Licensed under MIT license.
 */

/**
 * Require from one location as if it were from nother.
 */

const fs = require('fs');
const path = require('path');
const vm  = require('vm');

import Module from "module";

const EXTS = ["", ".js", ".mjs", ".json"];

const DBG =( process.env.DEBUG_REQUIRE_FROM) ? (...args: any[]) => console.log(...args) : () => undefined;

export function requireFrom(parent: Module, srcDir: string, implDir: string) {
    const pdir = path.dirname(path.resolve(parent ? parent.filename || '.' : '.'));
    srcDir = path.resolve(pdir, srcDir);
    implDir = path.resolve(pdir, implDir);
    return (oid: string) => {
        oid = oid.replace(/(?:\.js)?$/, '.js');
        oid = path.relative(srcDir, oid);
        const id = path.resolve(srcDir, oid);
        const codeFile = path.resolve(implDir, oid);
        const childModule = new Module(id, parent);
        childModule.paths = [implDir, srcDir, ...(parent ? parent.paths : [])];
        DBG("RES", oid, id, codeFile, srcDir, implDir);

        const nrequire = (p: string) => {
            if (!p.startsWith('.')) {
                DBG("Ordinary require:", p);
                return parent.require(p);
            }
            const apath = path.resolve(srcDir, p);
            const relpath = path.relative(__dirname, apath);
            const result = EXTS.reduce((prev: any | Error | null, ext: string) => {
                if (prev === null || prev instanceof Error) {
                    try {
                        const rpath = require.resolve(`./${relpath}${ext}`);
                        DBG("RPATH", p, ext, apath, __dirname, relpath, rpath);
                        return parent.require(rpath);
                    } catch (e) {
                        DBG("FAIL", p, ext, apath, __dirname, relpath);
                        return prev instanceof Error ? prev : e;
                    }
                }
                return prev;
            }, null);
            if (result instanceof Error) {
                throw result;
            }
            DBG("LOADED", childModule.filename, p);
            childModule.loaded = true;
            return result;
        };
        childModule.require = nrequire;
        nrequire.resolve = (p: string) => require.resolve(path.relative(srcDir, path.resolve(implDir, p)));

        const childGlobal = vm.createContext({
            ...global,
            process: process,
            exports: childModule.exports = {},
            module: childModule,
            __dirname: srcDir,
            __filename: codeFile,
            require: nrequire
        });
        childGlobal.global = childGlobal;
        const code = fs.readFileSync(codeFile, "utf-8");
        // VM Options. Allow (ugh) eval and WebAssembly for consistency
        const opts = {
            filename: codeFile,
            contextCodeGeneration: {strings: true, wasm: true}
        };
        vm.runInNewContext(code, childGlobal, opts);
        DBG("EXPORTS", oid, childModule.exports);
        return childModule.exports;
    };
}
