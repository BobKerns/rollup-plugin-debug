# The config/ directory

The **config/** directory primarily holds typescript source versions of javascript configuration files.
These are compiled automatically by 'pre' scripts in **package.json**, and placed in the `/build/config` subdirectory.

The `/build` subdirectory is created when ``npm run config`` is run as part of the build process, and deleted when ``npm run clean`` is run, either manually or as preparation for publishing (to ensure a clean build).


## rollup-config.ts
This is the typescript source for the rollup configuration. If you need to change the configuration, this is the file to change.

## top-jest.config.ts
Configuration file for the [jest](https://www.youtube.com/watch?v=F3YMlzK8d0o) unit testing tool. This is normally written in Javascript, but here we support TypeScript, which is then imported and used at top level

## tsconfig.json
This tsconfig.json file is specific to this directory. It is in json5 format, so we can include comments.
```json5
{
    // Inherit project-wide defaults.
  "extends": "../tsconfig",

   // Project layout. Changes not recommended.
  "include": ["*.ts", "**/*.ts"],
  "exclude": ["build", "lib"],

  "compilerOptions": {
    // Module and Node interoperability section. Do not change.
    "module": "commonjs",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "moduleResolution": "node",

    // Project layout. Changes not recommended.
    "outDir":"lib",
    "rootDir": ".",

     // Generation of .d.ts files. and debugging source maps.
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "inlineSourceMap": false,

     // Speed up compilation. Not important at this scale.
    "incremental": true,
    "tsBuildInfoFile": "./build/.tsbuild-info"
  }
}
```

Nothing we do here requires a particular ECMAScript version, but because ES2018 includes
This is the typescript configuration for the files in the `/config` directory.

## module-typings.d.ts
This file holds type declarations for two rollup plugins that do not come with type definitions. This file should only be used for modules that are used in this directory. Similar files can be placed in [../devtools](../devtools/README.md) or . [./src](../src/README.md) as needed.
