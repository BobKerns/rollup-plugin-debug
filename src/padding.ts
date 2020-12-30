import {keysIn} from 'ramda';

export const toJSON = (o: any) => o === undefined
    ? 'undefined'
    : o === null
        ? 'null'
        : typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean'
        ? JSON.stringify(o)
            :typeof o === 'object'
                ? o.constructor === Object
                    ? JSON.stringify(o)
                    : `${o.constructor.name}:${o}`
                : `${typeof o}:${JSON.stringify(o)}`;

export function formatTime(n: number) {
    const s = String(n);
    const m = /^(\d+)(?:\.(\d+))?$/.exec(s);
    if (!m) {
        throw new Error(`Bad number: ${s}`);
    }
    const [, i, d] = m;
    return `${i}.${d.substr(0, 3)}`;
}

function defaultFormatter(o: any, fmt: FieldFormat): string {
    if (o === undefined) {
        return 'undefined';
    } else if (o instanceof Date) {
        return o.toISOString();
    } else if (o instanceof RegExp) {
        return String(o);
    } else if (o instanceof Error) {
        return `Error: ${o.message || '[No message]'}`;
    } else if (Array.isArray(o)) {
        return o.map(toJSON).join((fmt && fmt.seperator) || ', ');
    } else if (o instanceof Object) {
        return keysIn(o).map(k => toJSON(o[k])).join((fmt && fmt.seperator) || ', ');
    }
    return String(o);
}

type Side = 'left' | 'right' | 'center' | 'none';
type Flag<T> = T | boolean | null | undefined;

interface FieldFormat {
    min?: number;
    pad?: Side;
    trim?: Side;
    max?: number;
    ellipsis?: string;
    padchar?: string;
    seperator?: string;
    subfields?: FieldFormat[] | { [k: string]: FieldFormat };
    weight?: number;
    formatter?: (obj: any, fmt: Readonly<FieldFormat>) => string;
}

const MAX_WIDTH = 99999909999;

export interface FieldFormats {
    target: FieldFormat;
    plugin: FieldFormat;
    hook: FieldFormat;
    time: FieldFormat;
    data: FieldFormat;
    args: FieldFormat;
    out: FieldFormat;
};

function flagOrType<R, T extends R>(val: R, param: Flag<T>, tval: T, fval: R): R {
    switch (param) {
        case true:
            return tval;
        case false:
            return fval;
        case null:
        case undefined:
            return val;
        default:
            return param;
    }
}

export function pad(str: string, format: Readonly<FieldFormat>): string;
export function pad(str: string, width: number | Readonly<FieldFormat> = MAX_WIDTH,
                    padSide: Side = 'right', trimSide: Side = 'right', max: number = MAX_WIDTH,
                    ellipsis: Flag<string> = '…',
                    padchar: string = ' '): string {
    let widthNum: number = typeof width === 'number' ? width : (width.min || 8);
    let ellipsisStr: string = flagOrType<string, string>('…', ellipsis, '…', '');
    if (typeof width === 'object') {
        const format = width;
        ellipsisStr = flagOrType<string, string>('…', format.ellipsis, '…', '');
        padSide = flagOrType(padSide, format.pad, 'right', 'none');
        trimSide = flagOrType(trimSide, format.trim, 'right', 'none');
        max = flagOrType(max, format.max, MAX_WIDTH, 0);
    }
    widthNum = Math.ceil(widthNum);
    const add = widthNum - str.length;
    const sub = str.length - max;
    if (add > 0) {
        switch (padSide) {
            case 'none':
                break;
            case 'right':
                str = str + padchar.repeat(Math.ceil(add / padchar.length)).substring(0, Math.ceil(add));
                break;
            case 'left':
                str = padchar.repeat(add / padchar.length).substring(0, add) + str;
                break;
            case 'center':
                const half = add / (2 * padchar.length);
                const rep = padchar.repeat(Math.ceil(half));
                str = rep.substring(0, Math.ceil(half)) + str + rep.repeat(Math.floor(half));
                break;
        }
    }
    if (sub > 0) {
        if (ellipsis) {
            switch (trimSide) {
                case 'none':
                    break;
                case 'right':
                    return str.substr(0, max - ellipsisStr.length) + ellipsisStr;
                case 'left':
                    return ellipsisStr + str.substr(sub + ellipsisStr.length);
                case 'center':
                    switch (sub) {
                        case 0:
                            return str;
                        case 1:
                            return str.substr(0, max - ellipsisStr.length) + ellipsisStr;
                        default:
                            return ellipsis + str.substr(Math.floor((sub + 1) / 2), max - ellipsisStr.length) + ellipsis;
                    }
            }
        } else {
            switch (trimSide) {
                case 'none':
                    break;
                case 'right':
                    return str.substr(0, widthNum);
                case 'left':
                    return str.substr(sub);
                case 'center':
                    return str.substr(Math.floor(sub / 2), max);
            }
        }
    }
    return str;
}
