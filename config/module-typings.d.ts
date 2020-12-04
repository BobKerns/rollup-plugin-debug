// Copyright  by Bob Kerns. Licensed under MIT license

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

type VisualizerPartialPlugin = Omit<Plugin, "name">;

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
    export default function visualizer(options?: Partial<VisualizerOptions>): VisualizerPartialPlugin;
}
