# npm-template

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

This describes the package, it's role in the world

## /lib/

This holds the built Javascript files
