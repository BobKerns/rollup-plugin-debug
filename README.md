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
* Updates and optional features can be flexibliy merged in via git merges.
  * Regular update scripts break when you make customizations.
  * Git merges, at worst, give merge conflicts.
  * Merge conflicts lay out what change was being attempted and why there was a conflict.
  * Because you have the context for why your change conflicts, it's easier to resolve.
  * The usual fallback for script-based template configuration is to manually figure out and make the changes.
 * [Continuous Integration Integration](#continuous-integration-integration)

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

## Continuous Integration Integration
Three free Continuous Integration workflows are configured out of the box.  Remove any you
you do not need, or disable them in the relevant service.

You probably do not need multiple builds on multiple services, but this will let you see each and make a choice. For simple things at least, the features are very similar. It is very useful to be able to build and test on multiple environments in parallel, something each of the services provides.

* [Circle CI](https://circleci.com)
* [Travis CI](https://travis-ci.com)
* [GitHub Workflows (CI)](https://github.com)

## /lib/

This holds the built Javascript files. By default, three versions are built, for compatibility with various module systems. Ultimately, the world is moving toward the ECMAScript module format, but in the meantime,
### /lib/esm
This holds files in the ECMAScript module format.

### /lib/cjs
This uses the CommonJS used traditionally by node.

### /lib/umd
This holds files in the UMD format, a flat file loadable by web browsers.

## [/assets](/assets/README.md)
Data files to be used in documentation or runtime in the application.

## [/config](/config/README.md)
This holds files used to globally configure the project. These are often redirected from the project root, to place them in one place, and to enable the use of typescript rather than javascript.

## [/devtools](/devtools/README.md)
This holds code used to to build the main project. It is built before the main project is configured.

It is initially empty.

## /docs
A generated directory with documentation. Some content may be installed from [/assets](/assets/README.md)

### /docs/api
The generated API documentation via [typedoc](https://typedoc.org)

## /node_modules
This directory is created and managed by [npm](https://npmjs.com), via the `npm install` command.

## [/src](/src/README.md)
This hierarchy contains the project's source code and related tests.

# Top level files
* .editorconfig
* .gitignore
* .npmignore — hides build infrastructure, sources, etc. from the final npm package.
* travis.yml -- configuration for building automatically on [Travis](https://travis-ci.com/)
* .circle-ci/ -- configuration for building automatically on [Circle CI](https://circleci.com)
*  .github/workflows -- configuration for building automatically on GitHub Workflows
* rollup.config.js -- redirects to [/config/rollup.config.ts](/config/rollup.config.ts)
*

[Continuous Integration Integration]: #continuous-integration-integration

