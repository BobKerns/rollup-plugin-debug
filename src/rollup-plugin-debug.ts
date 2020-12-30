import {Plugin, PluginContext} from 'rollup';

import present from 'present';
import {contains, keysIn as keysInR, T} from 'ramda';
import {FieldFormats, formatTime, pad, toJSON} from './padding';

/**
 * Any suitable logger, including `console`.
 */
export interface Logger {
    log(...args: any[]): void;
    error(...args: any[]): void;
}

const keysIn = <T>(obj: T): Array<keyof T> => keysInR(obj) as Array<keyof T>;

/**
 * How wide the main text is by default if *brief: true* is specified.
 */
const DEFAULT_BRIEF_WIDTH = 100;

// type HookName<K extends keyof Plugin = keyof Plugin> = Plugin[K] extends () => any ? K : never;
type HookName = Exclude<keyof Plugin, 'name' | 'cacheKey'>;
type HookFn<K extends HookName> = Plugin[K];
type AsyncHookFn<K extends AsyncHookName> = Plugin[K];

type FilterFn = (this: PluginContext, plugin: Plugin, hookName: HookName,  ...args: any[]) => boolean;
type CompositeFilterFn = (this: PluginContext, plugin: Plugin, hookName: HookName,  ...args: any[]) => boolean;

type Enableds<T extends string> = T[] | boolean;
export type Enable<T extends string> = T | T[] | boolean | null | undefined;

export interface PluginDebugConfig {
    target?: string;
    filter: FilterFn;
    enabledHooks?: Enable<HookName>;
    enabledPlugins?: Enable<string>;
    logger?: Logger;
    brief?: boolean | number;
}

export interface DebuggablePlugins extends Array<Plugin> {
    debug(config: PluginDebugConfig): this;
    describe(): this;
}
/*
enum HookType {
    SYNC = 'SYNC', ASYNC = 'ASYNC'
}
*/

// const [SYNC, ASYNC]: [HookType.SYNC, HookType.ASYNC] = [HookType.SYNC, HookType.ASYNC];
const [SYNC, ASYNC]: ['SYNC', 'ASYNC'] = ['SYNC', 'ASYNC'];

const hooktypesTmp = {
    options: SYNC,
    outputOptions: SYNC,
    buildStart: ASYNC,
    banner: ASYNC,
    intro: ASYNC,
    resolveId: ASYNC,
    resolveAssetUrl: SYNC,
    resolveDynamicImport: SYNC,
    resolveImportMeta: SYNC,
    load: ASYNC,
    watchChange: SYNC,
    transform: ASYNC,
    transformBundle: ASYNC,
    transformChunk: ASYNC,
    generateBundle: ASYNC,
    ongenerate: ASYNC,
    renderStart: ASYNC,
    renderChunk: ASYNC,
    renderError: ASYNC,
    writeBundle: ASYNC,
    onwrite: ASYNC,
    outro: ASYNC,
    footer: ASYNC,
    buildEnd: ASYNC
};

type HOOKS_DEF = keyof typeof hooktypesTmp;
type HOOK<i extends HOOKS_DEF | string> = i extends HOOKS_DEF ? (typeof hooktypesTmp)[i] : undefined;
type HOOKS = {
    [k in HOOKS_DEF]: HOOK<k>;
} & {
    [k in Exclude<string,HOOKS_DEF>]: any;
};

const HOOKTYPES: HOOKS = hooktypesTmp;

// type AsyncHookName<K extends HookName = HookName> = 'ASYNC' extends HookMap[K]  ? K : never;
// type SyncHookName<K extends HookName = HookName> = HookMap[K] extends 'SYNC' ? K : never;

type SyncHookName = 'options' | 'outputOptions' | 'resolveAssetUrl' | 'resolveDynamicImport' | 'resolveImportMeta' | 'watchChange';
type AsyncHookName = Exclude<HookName, SyncHookName>;

function isAsyncHook(name: string): name is AsyncHookName {
    return HOOKTYPES[name] === ASYNC;
}
function isSyncHook(name: string): name is SyncHookName {
    return HOOKTYPES[name] === ASYNC;
}

const HOOKS = keysIn(hooktypesTmp) as Array<HookName & keyof Plugin>;
const ASYNC_HOOKS: AsyncHookName[] = HOOKS.filter(isAsyncHook) as AsyncHookName[];
const SYNC_HOOKS: SyncHookName[] = HOOKS.filter(isSyncHook) as SyncHookName[];

const FIELDS: Readonly<FieldFormats> & Omit<any, keyof FieldFormats> = {
    target: {min: 8, max: 8},
    plugin: {min: 12, max: 12},
    hook: {min: 20, max: 20},
    time: {min: 8, pad: 'left', trim: 'right', max: 12},
    args: {
        max: 120,
        min: 100,
        pad: 'right',
        trim: 'right',
        weight: 2
    },
    data: {pad: 'none', min: 0, max: 150},
    out: {
        max: 120,
        pad: 'none',
        trim: 'right'
    }
};

let targetNum = 0;

/**
 * Takes the sequence of plugins and wraps them to report on progress and errors.
 * Call .debug(PluginDebugConfig) on the result to configure debugging.
 * @param pluginArray
 * @return DebuggablePlugins
 */
export function plugins(...pluginArray: Array<Readonly<Plugin>>): Readonly<DebuggablePlugins> {
    let logger: Logger = console;
    let brief: false | number = false;
    let filter: CompositeFilterFn = () => true;
    let enabledPlugins: Enableds<string>;
    let enabledHooks: Enableds<HookName> = false;
    let target = `TARGET-${targetNum++}`;

    // Make a briefer form of the string for logging.
    function makeBrief(str: string, limit: number | false = brief) {
        if (limit && str) {
            return str
                .trim()
                .substr(0, limit)
                .replace(/\s*\n\s*/g, '\\n');
        }
        return str;
    }
    function wrap(s: Plugin, position: number): Plugin | undefined {
        const newPlugin: Plugin = { ...s};
        function report(this: PluginContext, name: HookName, elapsed: number, args: any[], out: string) {
            if (filter.call(this,  s,  name,  ...args)) {
                let argsStr = `ARGS=${args
                    .map(toJSON)
                    .join(', ')}`;
                let outStr = `OUT=${out}`;

                const dataMax = FIELDS.data.max || 120;
                const dataSize = argsStr.length + outStr.length + 5 + 2 + 4;
                if (dataSize > dataMax) {
                    const argsSize = Math.min(argsStr.length, Math.ceil(dataMax / 2));
                    const outSize = dataMax - argsSize;
                    argsStr = pad(argsStr, {...FIELDS.data, max: argsSize});
                    outStr = pad(outStr, {...FIELDS.data, max: outSize});
                }
                const fmtArgs: {
                    target: typeof target;
                    plugin: string;
                    hook: HookName;
                    time: ReturnType<typeof formatTime>;
                    args: string;
                    out: string;
                } & {
                    [k: string]: string;
                } = {
                    target,
                    plugin: newPlugin.name,
                    hook: name,
                    time: formatTime(elapsed),
                    args: argsStr,
                    out: outStr
                };
                const formatted = keysIn(fmtArgs).map(k => pad(fmtArgs[k], FIELDS[k]));

                logger.log.apply(null, formatted);
            }
            return out;
        }
        function err(name: HookName, args: any[], e: Error) {
            logger.error('ERROR', target, newPlugin.name,  name,  makeBrief(JSON.stringify({error: e.message, args, stack: e.stack})));
            return e;
        }
        const outThin = (outv: any) => (outv?.code && `CODE:${outv?.code}`)
            || (outv?.moduleSideEffects !== undefined && `sideFX:${JSON.stringify(outv?.moduleSideEffects)}`)
            || outv;
        function asynhook<N extends AsyncHookName>(name: N): AsyncHookFn<N> {
            const f: any | (() => any) = s[name];
            return async function hook(this: PluginContext, ...args: any[]) {
                const start = present();
                try {
                    const out = await f.call(this,  ...args);
                    out && console.log(out.constructor, name);
                    const elapsed = present() - start;
                    return report.call(this,  name, elapsed, args, outThin(out));
                } catch (e) {
                    throw err(name, args, e);
                }
            };
        }
        function synhook<N extends HookName>(name: N): HookFn<typeof name> {
            const f: any | (() => any) = s[name];
            return  function(this: PluginContext, ...args: any[]) {
                const start = present();
                try {
                    const out = f.call(this,  ...args);
                    const elapsed = present() - start;
                    Promise.resolve(out).then(outv => report.call(this,  name, elapsed, args, outThin(outv)));
                    return out;
                } catch (e) {
                    throw err(name, args, e);
                }
            };
        }
        newPlugin.name = newPlugin.name || `plugin-${position}`;
        const n1 = ASYNC_HOOKS.flatMap(k => {
            const h = s[k];
            if (h && typeof h === 'function') {
                newPlugin[k] = asynhook(k);
                return [k];
            }
            return [];
        });
        const n2 = SYNC_HOOKS.flatMap((k: HookName) => {
            const h = s[k];
            if (h && typeof h === 'function') {
                newPlugin[k] = synhook(k);
                return [k];
            }
            return [];
        });
        const names = [...n1, ...n2]
            .sort((l: HookName, r: HookName) => l.localeCompare(r));
        if (names.length === 0) {
            // Drop any hooks with no hooks!
            return undefined;
        }
        return newPlugin;
    }
    const debuggable = <DebuggablePlugins> pluginArray
        .map((p, i) => wrap(p, i))
        .filter(k => k);

    // Give a static description of this processing chain setup.
    const describe = () => {
        logger.log(`=== Processing chain for ${target} by plugin ===`);
        debuggable.forEach(p => {
            const names = HOOKS.filter(h => p[h]);
            logger.log(`${target} plugin ${p.name}: ${names.join(', ')}`);
        });
        logger.log(`=== Processing chain for ${target} by phase ===`);
        HOOKS.forEach(h => {
            const chain = debuggable
                .filter(p => p[h])
                .map(p => p.name);
            if (chain.length) {
                logger.log(`${target} hook ${h}: ${chain.join(', ')}`);
            }
        });
        logger.log(`=== End ${target} ===`);
        return debuggable;
    };

    function debug(config: PluginDebugConfig) {
        logger = config.logger || logger;

        brief = config.brief === true ? DEFAULT_BRIEF_WIDTH : config.brief || false;
        target = config.target || target;
        const mergeEnables = <T extends string>(existing: Enableds<T>, enables: Enable<T>) => {
            switch (enables) {
                case true:
                case false:
                    return enables;
                case null:
                case undefined:
                    // null operation
                    return existing;
                default:
                    const prior = Array.isArray(existing) ? existing : [];
                    if (Array.isArray(enables)) {
                        return [...prior, ...enables];
                    } else {
                       return[...prior, enables];
                    }
            }
        };
        const isEnabled = <T extends string>(enableds: Enableds<T>, name: T) => {
            return ((enableds === true) || enableds && contains(name, enableds));
        };
        enabledPlugins = mergeEnables(enabledPlugins, config.enabledPlugins);
        enabledHooks = mergeEnables(enabledHooks, config.enabledHooks);
        const isPluginEnabled = (name: string) => isEnabled(enabledPlugins, name);
        const isHookEnabled = (name: HookName) => isEnabled(enabledHooks, name);
        const f4 = config.filter || (() => true);
        filter = function(this: PluginContext, plugin: Plugin, hookName: HookName, ...args: any[]): boolean {
            return (isPluginEnabled(plugin.name) || isHookEnabled(hookName)) &&  f4.call(this,  plugin,  hookName, ...args);
        };
        return debuggable;
    }
    (debuggable as any).debug = debug;
    (debuggable as any).describe = describe;
    return debuggable as DebuggablePlugins;
}

type TracePluginOptions = {
    [K in HookName & keyof Plugin]: {
        test: string | RegExp | boolean | ((...args: any) => boolean);
    }
};

export interface PluginTraceConfig {
    name: string;
    options: Partial<TracePluginOptions>;
    logger?: Logger;
}

function isString(obj: any): obj is string {
    return typeof obj === 'string';
}

export interface TracePlugin extends Plugin {
    hookOptions?: Partial<TracePluginOptions>;
    setOptions(hookOptions: TracePluginOptions): this;
}

function testify(opt?: string | RegExp | boolean | (() => boolean)): (...v: any[]) => boolean {
    const re = isString(opt) && new RegExp(opt);
    return (
        (typeof opt === 'function' && opt)
        || (opt instanceof RegExp && ((v: any) => (isString(v) && opt.test(v))))
        || (re && ((v: any) => (isString(v) && re.test(v))))
        || (typeof opt === 'boolean' && (() => opt))
        || (() => false)
    );
}

type ArrayElement<T extends Array<unknown>> = T extends Array<infer R> ? R : unknown;

/**
 * Trace rollup processing through the plugins.
 * @param name
 * @param logger
 * @param options
 */
export function trace({name, logger, options}: PluginTraceConfig): TracePlugin {
    const log = logger || console;
    options = options || {};
    function makeHook (p: Partial<Plugin>, k: keyof typeof options): Partial<Plugin> {
        const opt = (options && options[k]);
        const optTest = opt && opt.test;
        const test = testify(optTest);
        const fn = (...args: any[]): Plugin[typeof k] => {
            if (test(...args)) {
                log.log('TRACE', k, ...args);
            }
            return undefined as unknown as Plugin[typeof k];
        };
        return {
            ...p,
            [k]: fn
        };
    }
    const hooks = HOOKS.reduce(makeHook, <Partial<Plugin>>{});
    return {
        name,
        hookOptions: options,
        ...hooks,
        setOptions(opts: TracePluginOptions): TracePlugin {
            options = opts;
            return this as TracePlugin;
        }
    };
}
