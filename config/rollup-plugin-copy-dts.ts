/*
 * Copyright © 2019. Licensed under MIT license.
 */

import {PluginContext} from "rollup";
import path, {basename, dirname, extname, join, relative} from "path";
import {constants, promises as fsPromises} from "fs";
const {access, copyFile, mkdir} = fsPromises;
import {createFilter} from 'rollup-pluginutils';

export interface CopyDeclarationsOptions {
    root: string;
    target: string;
    include?: string | string[];
    exclude?: string | string[];
}

export default function copyDeclarations(opts: CopyDeclarationsOptions) {
    const seen: {[k: string]: boolean} = {};
    const filter  = createFilter(opts.include, opts.exclude, {resolve: path.resolve(".")});
    const target = path.resolve(opts.target);
    const root = path.resolve(opts.root);
    async function emitDecls (this: PluginContext, id: string): Promise<any> {
        const absolute = path.resolve(id);
        if (!seen[absolute] && extname(id) === '.js' && filter(absolute)) {
            seen[absolute] = true;
            const base = join(dirname(id), basename(id, extname(id)));
            const rel = opts.root ? relative(opts.root, base) : base;
            const dts = `${base}.d.ts`;
            const dtsmap = `${dts}.map`;
            const exists = async (f: string) => access(f, constants.R_OK).then(() => true, () =>false);
            const dest = (f: string) => path.resolve(target, relative(root, f));
            const copy = async (f: string, t: string) =>
                await exists(f)
                && await(mkdir(dirname(t), {recursive: true})).then(() => true)
                && copyFile(f, t);
            await Promise.all([copy(dts, dest(dts)), copy(dtsmap, dest(dtsmap))]);
        }
        return undefined;
    };
    return {
        name: 'copy-dts',
        resolveId: emitDecls,
        load: emitDecls     // Backup check, in case ordering issues prevent us from seeing it.
    };
}
