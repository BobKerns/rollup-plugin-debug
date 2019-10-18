# Project Template npm-typescript-rollup-template

This lays out a common project structure, and is hello-world buildable out of the box.
It focuses on providing an easy-to-understand starting point for integrating
with typescript and the [rollup](https://www.rollupjs.org) packager.

Rather than trying to set up to handle every possible variation, the intent of this
template is to be opinionated about how a project should be organized—and then do that well.

I think the narrow focus serves the user better. Even if you chose a different path,
it makes it easier to understand and to know how you wish to deviate.

# Features
* Simple starting point.
* Full typescript integration
  * Generated Javascript files and source are placed in lib/ for easy cleanup and less clutter.
  * Javascript configuration files redirect to typescript ones in [./config](config/README.md) .
  * Typescript build tools are fully supported in-project.
* Great experience out-of-the-box.
  * Extensive descriptions of project structure
  * Descriptions of plugins and options.
  * A buildable, testable environment out-of-the-box
  * Clear path to adding additional features




# Content

## Primary organization

The important files are the outputs included in the published module, and the sources that
produce them. The rest are supporting mechanisms.

## package.json

This describes the package, it's role in the world,

You should edit package.json, with special attention to these fields:
* `name:`
* `version:`
* `description:`
* `repository.url:`
* `keywords:`
* `license:`
* `bugs.url:`
* `homepage:`

## /lib/

This holds the built Javascript files. By default, three versions are built, for compatibility with various module systems. Ultimately, the world is moving toward the ECMAScript module format, but in the meantime,
### /lib/esm
This holds files in the ECMAScript module format.

### /lib/cjs
This uses the CommonJS used traditionally by node.

### /lib/umd
This holds files in the UMD format, a flat file loadable by web browsers.
